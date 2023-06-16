using abelkhan;
using hub;
using Microsoft.AspNetCore.DataProtection;
using MongoDB.Bson;
using service;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Rank
{
    public class Rank
    {
        internal string name;
        internal int capacity;
        internal SortedVector<long, rank_item> rankList = new();
        internal SortedDictionary<long, int> guidRank = new ();

        public Rank(int _capacity)
        {
            capacity = _capacity;
        }

        public BsonDocument ToBsonDocument()
        {
            var doc = new BsonDocument();

            doc.Add("name", name);
            doc.Add("capacity", capacity);

            var docRankList = new BsonDocument();
            foreach (var it in rankList.Datas)
            {
                var docItem = new BsonDocument
                {
                    { "guid", it.Value.guid },
                    { "score", it.Value.score },
                    { "rank", it.Value.rank },
                    { "item", it.Value.item }
                };
                docRankList.Add(it.Key.ToString(), docItem);
            }
            doc.Add("rankList", docRankList);

            var docGuidRank = new BsonDocument();
            foreach(var it in guidRank)
            {
                docGuidRank.Add(it.Key.ToString(), it.Value);
            }
            doc.Add("guidRank", docGuidRank);

            return doc;
        }

        public int UpdateRankItem(rank_item item)
        {
            if (guidRank.TryGetValue(item.guid, out var old))
            {
                rankList.RemoveAt(old - 1);
            }

            var score = item.score << 32 | item.guid;
            rankList.Add(score, item);
            item.rank = rankList.IndexOfKey(score) + 1;
            guidRank[item.guid] = item.rank;

            if (rankList.Count() > (capacity + 200)) {
                var remove = new List<long>();
                for (var i = capacity; i < rankList.Count(); ++i)
                {
                    remove.Add(rankList.GetKeyByIndex(i));
                }
                foreach (var key in remove)
                {
                    rankList.Remove(key);
                }
            }

            log.log.trace("UpdateRankItem, rank:{0}", item.rank);

            return item.rank;
        }

        public int GetRankGuid(long guid)
        {
            if (!guidRank.TryGetValue(guid, out var rank))
            {
                rank = -1;
            }
            return rank;
        }

        public List<rank_item> GetRankRange(int start, int end)
        {
            var rank = new List<rank_item>();

            for (var i = start; i < end && i < rankList.Count(); ++i)
            {
                rank.Add(rankList.GetValueByIndex(i));
            }
            log.log.trace("GetRankRange rank:{0}", Newtonsoft.Json.JsonConvert.SerializeObject(rank));

            return rank;
        }
    }

    public static class RankModule
    {
        private static string dbName;
        private static string dbCollection;

        private static Dictionary<string, Rank> rankDict = new();

        private static rank_cli_service_module rank_Cli_Service_Module = new();
        private static rank_svr_service_module rank_svr_Service_Module = new();

        public static Task Init(string _dbName, string _dbCollection, List<Tuple<string, int> > ranks)
        {
            var task = new TaskCompletionSource();

            dbName = _dbName;
            dbCollection = _dbCollection;

            var query = new DBQueryHelper();
            hub.hub.get_random_dbproxyproxy().getCollection(dbName, dbCollection).getObjectInfo(query.query(), (array) =>
            {
                foreach(var rankDoc in array)
                {
                    var rank = new Rank(rankDoc["capacity"].AsInt32);
                    rank.name = rankDoc["name"].AsString;

                    foreach (var it in rankDoc["rankList"].AsBsonDocument)
                    {
                        var item = new rank_item();
                        item.guid = it.Value["guid"].AsInt64;
                        item.score = it.Value["score"].AsInt64;
                        item.rank = it.Value["rank"].AsInt32;
                        item.item = it.Value["item"].AsBsonBinaryData.Bytes;
                        rank.rankList.Add(long.Parse(it.Name), item);
                    }

                    foreach(var it in rankDoc["guidRank"].AsBsonDocument)
                    {
                        rank.guidRank.Add(long.Parse(it.Name), it.Value.AsInt32);
                    }

                    rankDict.Add(rank.name, rank);
                }

            }, () =>
            {
                foreach (var rankInfo in ranks)
                {
                    if (!rankDict.TryGetValue(rankInfo.Item1, out var r))
                    {
                        r = new Rank(rankInfo.Item2);
                        r.name = rankInfo.Item1;
                        rankDict.Add(r.name, r);
                    }
                }
                task.SetResult();
            });

            hub.hub._timer.addticktime(30 * 60 * 1000, tick_save_rank);

            return task.Task;
        }

        private static void save_rank()
        {
            try
            {
                foreach (var rank in rankDict.Values)
                {
                    var query = new DBQueryHelper();
                    query.condition("name", rank.name);
                    var doc = rank.ToBsonDocument();
                    var update = new UpdateDataHelper();
                    update.set(doc);
                    hub.hub.get_random_dbproxyproxy().getCollection(dbName, dbCollection).updataPersistedObject(query.query(), update.data(), true, (result) => {
                        if (result != dbproxyproxy.EM_DB_RESULT.EM_DB_SUCESSED)
                        {
                            log.log.err($"tick_save_rank {rank.name} faild:{result}!");
                        }
                    });
                }
            }
            catch (System.Exception ex)
            {
                log.log.err($"tick_save_rank ex:{ex}!");
            }
        }

        private static void tick_save_rank(long tick)
        {
            save_rank();
            hub.hub._timer.addticktime(30 * 60 * 1000, tick_save_rank);
        }

        private static void Rank_svr_Service_Module_on_update_rank_item(string rankNmae, rank_item item)
        {
            var rsp = rank_svr_Service_Module.rsp as rank_svr_service_update_rank_item_rsp;

            if (rankDict.TryGetValue(rankNmae, out var rankIns))
            {
                var rank = rankIns.UpdateRankItem(item);
                rsp.rsp(rank);
            }
            else
            {
                rsp.err();
            }
        }

        private static void Rank_svr_Service_Module_on_get_rank_guid(string rankNmae, long guid)
        {
            var rsp = rank_svr_Service_Module.rsp as rank_svr_service_get_rank_guid_rsp;

            if (rankDict.TryGetValue(rankNmae, out var rankIns))
            {
                var rank = rankIns.GetRankGuid(guid);
                rsp.rsp(rank);
            }
            else
            {
                rsp.err();
            }
        }

        private static void Rank_Cli_Service_Module_on_get_rank_range(string rankNmae, int start, int end)
        {
            var rsp = rank_Cli_Service_Module.rsp as rank_cli_service_get_rank_range_rsp;

            if (rankDict.TryGetValue(rankNmae, out var rankIns))
            {
                var rank = rankIns.GetRankRange(start, end);
                rsp.rsp(rank);
            }
            else
            {
                rsp.err();
            }
        }

        private static void Rank_Cli_Service_Module_on_get_rank_guid(string rankNmae, long guid)
        {
            var rsp = rank_Cli_Service_Module.rsp as rank_cli_service_get_rank_guid_rsp;

            if (rankDict.TryGetValue(rankNmae, out var rankIns))
            {
                var rank = rankIns.GetRankGuid(guid);
                rsp.rsp(rank);
            }
            else
            {
                rsp.err();
            }
        }

        public static void Main(string[] args)
        {
            var _hub = new hub.hub(args[0], args[1], "rank");

            var _rank_config = hub.hub._config.get_value_list("rank");
            var _rank_info = new List<Tuple<string, int>>();
            for(int i = 0; i < _rank_config.get_list_size(); i++)
            {
                var info = _rank_config.get_list_dict(i);
                _rank_info.Add(Tuple.Create(info.get_value_string("name"), info.get_value_int("capacity")));
            }

            rank_Cli_Service_Module.on_get_rank_guid += Rank_Cli_Service_Module_on_get_rank_guid;
            rank_Cli_Service_Module.on_get_rank_range += Rank_Cli_Service_Module_on_get_rank_range;

            rank_svr_Service_Module.on_get_rank_guid += Rank_svr_Service_Module_on_get_rank_guid;
            rank_svr_Service_Module.on_update_rank_item += Rank_svr_Service_Module_on_update_rank_item;

            _hub.onCloseServer += () => {
                save_rank();
                _hub.closeSvr();
            };

            _hub.onDBProxyInit += async () =>
            {
                await Init(constant.constant.player_db_name, constant.constant.player_db_rank_collection, _rank_info);
            };

            log.log.trace("player start ok");

            _hub.run();
        }
    }
}
