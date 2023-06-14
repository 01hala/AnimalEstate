﻿using abelkhan;
using hub;
using log;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MsgPack;
using MsgPack.Serialization;
using service;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using static System.Formats.Asn1.AsnWriter;

namespace player
{
    public class LoginException : System.Exception
    {
        public string ErrorInfo;
        public LoginException(string err) : base(err)
        {
            ErrorInfo = err;
        }
    }

    public class GetPlayerException : System.Exception
    {
        public string ErrorInfo;
        public GetPlayerException(string err) : base(err)
        {
            ErrorInfo = err;
        }
    }

    public class GetGuidFromDBError : System.Exception
    {
        public string error;

        public GetGuidFromDBError(string err) : base(err)
        {
            error = err;
        }
    }

    public class client_proxy
    {
        private readonly string _sdk_uuid;
        public string SDK_UUID
        {
            get
            {
                return _sdk_uuid;
            }
        }

        private long last_active_time = timerservice.Tick;
        public long LastActiveTime
        {
            set
            {
                last_active_time = value;
            }
            get
            {
                return last_active_time;
            }
        }

        private string _uuid;
        public string uuid
        {
            set
            {
                _uuid = value;
            }
            get
            {
                return _uuid;
            }
        }

        private player_info _info = null;
        public player_info PlayerInfo
        {
            get
            {
                return _info;
            }
        }

        public player_inline_info PlayerInlineInfo
        {
            get
            {
                var info = new player_inline_info();
                info.uuid = _uuid;
                info.name = _info.name;
                info.avatar = _info.avatar;
                info.guid = _info.guid;
                info.score = _info.score;
                info.hero_list = _info.hero_list;
                info.skin_list = _info.skin_list;
                info.skill_list = _info.skill_list;
                info.playground_list = _info.playground_list;
                return info;
            }
        }

        private string room_id;
        public string RoomID
        {
            set
            {
                room_id = value;
            }
            get
            {
                return room_id;
            }
        }

        private dbproxyproxy.Collection GuidCollection
        {
            get { return hub.hub.get_random_dbproxyproxy().getCollection(constant.constant.player_db_name, constant.constant.player_db_guid_collection); }
        }

        private string bind_db_proxy_name = null;
        public dbproxyproxy.Collection PlayerCollection
        {
            get
            {
                dbproxyproxy bind_db_proxy;
                do
                {
                    if (string.IsNullOrEmpty(bind_db_proxy_name))
                    {
                        bind_db_proxy = hub.hub.get_random_dbproxyproxy();
                        bind_db_proxy_name = bind_db_proxy.db_name;
                        break;
                    }

                    bind_db_proxy = hub.hub.get_dbproxy(bind_db_proxy_name);
                    if (bind_db_proxy == null)
                    {
                        bind_db_proxy = hub.hub.get_random_dbproxyproxy();
                        bind_db_proxy_name = bind_db_proxy.db_name;
                    }

                } while (false);

                return bind_db_proxy.getCollection(constant.constant.player_db_name, constant.constant.player_db_collection);
            }
        }

        private Task<long> get_guid()
        {
            var task = new TaskCompletionSource<long>();

            GuidCollection.getGuid(player.guid_key, (_ret, guid) =>
            {
                if (_ret != dbproxyproxy.EM_DB_RESULT.EM_DB_SUCESSED)
                {
                    var err = string.Format("getGuid error:{0}!", _ret);
                    log.log.err(err);
                    task.SetException(new GetGuidFromDBError(err));
                }
                else
                {
                    task.SetResult(guid);
                }
            });

            return task.Task;
        }

        public client_proxy(string sdk_uuid, player_info info = null)
        {
            _sdk_uuid = sdk_uuid;
            _info = info;
        }

        private List<animal> random_animal()
        {
            var animal_list = new List<animal>(){
                animal.monkey, animal.rabbit, animal.duck, animal.mouse, animal.bear, animal.tiger, animal.lion
            };

            for (var i = 0; i < 3; ++i)
            {
                animal_list.RemoveAt(RandomHelper.RandomInt(animal_list.Count));
            }

            return animal_list;
        }

        private List<skill> random_skill()
        {
            var skill_list = new List<skill>(){
                skill.phantom_dice, skill.soul_moving_method, skill.thief_reborn, skill.step_lotus, skill.preemptiv_strike, skill.swap_places, skill.altec_lightwave
            };

            for (var i = 0; i < 3; ++i)
            {
                skill_list.RemoveAt(RandomHelper.RandomInt(skill_list.Count));
            }

            return skill_list;
        }

        public async Task create_player(string name, string nick_name, string avatar_url)
        {
            _info = new player_info
            {
                sdk_uuid = _sdk_uuid,
                name = nick_name,
                avatar = avatar_url,
                guid = await get_guid(),
                score = 0,
                friend_list = new List<player_friend_info>(),
                invite_list = new List<player_friend_info>(),
                be_invited_list = new List<player_friend_info>(),
                hero_list = random_animal(),
                skin_list = new List<skin>() { 
                    skin.chicken, skin.monkey, skin.rabbit, skin.duck, skin.mouse, skin.bear, skin.tiger, skin.lion
                },
                skill_list = random_skill(),
                playground_list = new List<playground>() { 
                    playground.lakeside/*, playground.grassland, playground.hill, playground.snow, playground.desert*/
                }
            };

            var player_svr_key = redis_help.BuildPlayerGuidCacheKey(_info.guid);
            await player._redis_handle.SetStrData(player_svr_key, hub.hub.name);

            PlayerCollection.createPersistedObject(_info.ToBsonDocument(), (ret) => {
                if (ret != dbproxyproxy.EM_DB_RESULT.EM_DB_SUCESSED)
                {
                    log.log.err($"createPersistedObject error, player sdk_uuid:{_sdk_uuid}, name:{nick_name}, err:{ret}");
                }
            });
        }

        public void save_role_db_info()
        {
            var _query = new DBQueryHelper();
            _query.condition("guid", _info.guid);
            var data = new UpdateDataHelper();
            data.set(_info);

            PlayerCollection.updataPersistedObject(_query.query(), data.data(), true, (_result) => {
                if (_result != hub.dbproxyproxy.EM_DB_RESULT.EM_DB_SUCESSED)
                {
                    log.log.err($"save_role_db_info error, player guid:{_info.guid}, err:{_result}");
                }
            });
        }

        public bool check_repeated(player_friend_info target, List<player_friend_info> list)
        {
            foreach (var role in list)
            {
                if (target.guid == role.guid)
                {
                    return true;
                }
            }
            return false;
        }

        public void be_invite(player_friend_info invite_role)
        {
            if (!check_repeated(invite_role, _info.invite_list) && !check_repeated(invite_role, _info.friend_list))
            {
                _info.invite_list.Add(invite_role);
                save_role_db_info();
            }
        }

        public void invite(player_friend_info target_role)
        {
            if (!check_repeated(target_role, _info.be_invited_list) && !check_repeated(target_role, _info.friend_list))
            {
                _info.be_invited_list.Add(target_role);
                save_role_db_info();
            }
        }

        public void agree_invite_friend(long guid, bool be_agree)
        {
            foreach (var invite_role in _info.invite_list)
            {
                if (invite_role.guid == guid)
                {
                    _info.invite_list.Remove(invite_role);
                    if (be_agree)
                    {
                        if (!check_repeated(invite_role, _info.friend_list))
                        {
                            _info.friend_list.Add(invite_role);
                        }
                    }
                    break;
                }
            }
            save_role_db_info();
        }

        public player_friend_info confirm_agree_invite_friend(long guid)
        {
            player_friend_info target_role = null;
            foreach (var tmp_target_role in _info.be_invited_list)
            {
                if (tmp_target_role.guid == guid)
                {
                    if (!check_repeated(tmp_target_role, _info.friend_list))
                    {
                        _info.friend_list.Add(tmp_target_role);
                    }

                    _info.invite_list.Remove(tmp_target_role);
                    target_role = tmp_target_role;
                    break;
                }
            }
            save_role_db_info();
            return target_role;
        }

        public void settle(game_settle_info _settle_info)
        {
            foreach (var info in _settle_info.settle_info)
            {
                if (_info.guid == info.guid && info.rank == 1)
                {
                    _info.score++;
                    save_role_db_info();

                    var _player_rank_info = new player_rank_info()
                    {
                        guid = _info.guid,
                        sdk_uuid = _info.sdk_uuid,
                        name = _info.name,
                        avatar = _info.avatar,
                        score = _info.score,
                    };
                    using var st = constant.constant.rcStMgr.GetStream();
                    var _serializer = MessagePackSerializer.Get<MessagePackObjectDictionary>();
                    _serializer.Pack(st, player_rank_info.player_rank_info_to_protcol(_player_rank_info));
                    var rank_item = new rank_item()
                    {
                        guid = _info.guid,
                        score = _info.score,
                        item = st.ToArray()
                    };
                    player.rank_Proxy.update_rank_item("rank", rank_item);

                    return;
                }
            }

            log.log.err($"wrong settle info guid:{_info.guid}");
        }
    }

    public class client_mng
    {
        private readonly Dictionary<string, client_proxy> client_token_dict = new ();
        private readonly Dictionary<string, client_proxy> client_uuid_dict = new ();
        private readonly Dictionary<string, client_proxy> client_sdk_uuid_dict = new();
        private readonly Dictionary<long, client_proxy> client_guid_dict = new ();

        public static dbproxyproxy.Collection GetPlayerCollection
        {
            get { return hub.hub.get_random_dbproxyproxy().getCollection(constant.constant.player_db_name, constant.constant.player_db_collection); }
        }

        private static readonly player_client_caller player_Client_Caller = new();
        public static player_client_caller PlayerClientCaller
        {
            get
            {
                return player_Client_Caller;
            }
        }

        private static readonly player_game_client_caller player_Game_Client_Caller = new ();
        public static player_game_client_caller PlayerGameClientCaller
        {
            get
            {
                return player_Game_Client_Caller;
            }
        }

        private static readonly player_room_client_caller player_Room_Client_Caller = new ();
        public static player_room_client_caller PlayerRoomClientCaller
        {
            get
            {
                return player_Room_Client_Caller;
            }
        }

        private static readonly player_friend_client_caller player_Friend_Client_Caller = new ();
        public static player_friend_client_caller PlayerFriend_CliendCaller
        {
            get
            {
                return player_Friend_Client_Caller;
            }
        }

        public int Count
        {
            get
            {
                return client_guid_dict.Count;
            }
        }

        public static async void forward_offline_msg(offline_msg.offline_msg _offline_msg)
        {
            if (await player.offline_Msg_Mng.send_offline_msg(_offline_msg))
            {
                var player_guid = long.Parse(_offline_msg.player_guid);
                var player_svr_key = redis_help.BuildPlayerGuidCacheKey(player_guid);
                string player_hub_name = await player._redis_handle.GetStrData(player_svr_key);
                if (string.IsNullOrEmpty(player_hub_name))
                {
                    return;
                }
                if (player_hub_name != hub.hub.name)
                {
                    var player_proxy = player.player_Proxy_Mng.get_player_proxy(player_hub_name);
                    player_proxy.player_have_offline_msg(player_guid);
                }
                else
                {
                    var target_role = player.client_Mng.guid_get_client_proxy(player_guid);
                    if (target_role != null)
                    {
                        await player.offline_Msg_Mng.process_offline_msg(_offline_msg.player_guid);
                    }
                }
            }
        }

        public client_mng()
        {
            hub.hub._timer.addticktime(5 * 60 * 1000, tick_clear_timeout_player);
        }

        private void tick_clear_timeout_player(long tick_time)
        {
            List<client_proxy> timeout_players = new();
            foreach (var it in client_sdk_uuid_dict)
            {
                if ((it.Value.LastActiveTime + 30 * 60 * 1000) < timerservice.Tick)
                {
                    timeout_players.Add(it.Value);
                }
            }
            foreach (var _proxy in timeout_players)
            {
                client_uuid_dict.Remove(_proxy.uuid);
                client_sdk_uuid_dict.Remove(_proxy.PlayerInfo.sdk_uuid);
                client_guid_dict.Remove(_proxy.PlayerInfo.guid);

                var uuid_key = redis_help.BuildPlayerSDKUUIDCacheKey(_proxy.uuid);
                player._redis_handle.DelData(uuid_key);

                var player_key = redis_help.BuildPlayerSvrCacheKey(_proxy.PlayerInfo.sdk_uuid);
                player._redis_handle.DelData(player_key);

                var player_guid_key = redis_help.BuildPlayerGuidCacheKey(_proxy.PlayerInfo.guid);
                player._redis_handle.DelData(player_guid_key);

                var gate_key = redis_help.BuildPlayerGateCacheKey(_proxy.PlayerInfo.sdk_uuid);
                player._redis_handle.DelData(gate_key);
            }

            List<string> token_list = new();
            foreach (var it in client_token_dict)
            {
                if ((it.Value.LastActiveTime + 30 * 60 * 1000) < timerservice.Tick)
                {
                    token_list.Add(it.Key);
                }
            }
            foreach (var _token in token_list)
            {
                client_token_dict.Remove(_token);
            }

            hub.hub._timer.addticktime(5 * 60 * 1000, tick_clear_timeout_player);
        }

        public Task<client_proxy> load_client(string sdk_uuid)
        {
            var ret = new TaskCompletionSource<client_proxy>();

            DBQueryHelper query = new();
            query.condition("sdk_uuid", sdk_uuid);
            GetPlayerCollection.getObjectInfo(query.query(), async (player_info_list) =>
            {
                if (player_info_list.Count > 1)
                {
                    log.log.err($"duplicate sdk_uuid:{sdk_uuid}");
                    ret.SetException(new LoginException($"duplicate sdk_uuid:{sdk_uuid}"));
                }
                else
                {
                    client_proxy _proxy = null;

                    if (player_info_list.Count == 0)
                    {
                        _proxy = new client_proxy(sdk_uuid);
                    }
                    else if (player_info_list.Count == 1)
                    {
                        var info = player_info_list[0];
                        var _player_info_db = BsonSerializer.Deserialize<player_info>(info as BsonDocument);
                        _proxy = new client_proxy(sdk_uuid, _player_info_db);
                        
                        client_guid_dict[_proxy.PlayerInfo.guid] = _proxy;

                        var player_svr_key = redis_help.BuildPlayerGuidCacheKey(_proxy.PlayerInfo.guid);
                        await player._redis_handle.SetStrData(player_svr_key, hub.hub.name);
                    }
                    client_sdk_uuid_dict[sdk_uuid] = _proxy;

                    ret.SetResult(_proxy);
                }
            }, () => { });

            return ret.Task;
        }

        public async Task<string> token_player_login(string sdk_uuid)
        {
            var token = Guid.NewGuid().ToString();

            if (client_sdk_uuid_dict.TryGetValue(sdk_uuid, out client_proxy _proxy))
            {
                if (!string.IsNullOrEmpty(_proxy.uuid))
                {
                    PlayerClientCaller.get_client(_proxy.uuid).be_displacement();
                    client_uuid_dict.Remove(_proxy.uuid);
                    client_token_dict[token] = _proxy;
                }
            }
            else
            {
                var _client = await load_client(sdk_uuid);
                client_token_dict[token] = _client;
            }

            return token;
        }

        public client_proxy token_get_client_proxy(string uuid, string token)
        {
            if (!client_token_dict.Remove(token, out client_proxy _proxy))
            {
                throw new LoginException($"invaild token:{token}");
            }
            _proxy.uuid = uuid;
            client_uuid_dict[uuid] = _proxy;

            var uuid_key = redis_help.BuildPlayerSDKUUIDCacheKey(uuid);
            player._redis_handle.SetStrData(uuid_key, _proxy.SDK_UUID);

            return _proxy;
        }

        public async Task<client_proxy> create_player(string uuid, string name, string nick_name, string avatar_url)
        {
            if (!client_uuid_dict.TryGetValue(uuid, out client_proxy _proxy))
            {
                throw new LoginException($"invaild uuid:{uuid}");
            }

            await _proxy.create_player(name, nick_name, avatar_url);
            client_guid_dict.Add(_proxy.PlayerInfo.guid, _proxy);

            return _proxy;
        }

        public async Task<client_proxy> uuid_get_client_proxy(string uuid)
        {
            if (!client_uuid_dict.TryGetValue(uuid, out client_proxy _proxy))
            {
                var uuid_key = redis_help.BuildPlayerSDKUUIDCacheKey(uuid);
                var sdk_uuid = await player._redis_handle.GetStrData(uuid_key);

                var gate_key = redis_help.BuildPlayerGateCacheKey(sdk_uuid);
                var gate_name = await player._redis_handle.GetStrData(gate_key);

                _proxy = await load_client(sdk_uuid);
                client_uuid_dict[uuid] = _proxy;

                hub.hub._gates.client_seep(uuid, gate_name);
            }
            return _proxy;
        }

        public async Task<client_proxy> sdk_uuid_get_client_proxy(string sdk_uuid)
        {
            if (!client_sdk_uuid_dict.TryGetValue(sdk_uuid, out client_proxy _proxy))
            {
                _proxy = await load_client(sdk_uuid);

                var gate_key = redis_help.BuildPlayerGateCacheKey(sdk_uuid);
                var gate_name = await player._redis_handle.GetStrData(gate_key);

                hub.hub._gates.client_seep(_proxy.uuid, gate_name);
            }
            return _proxy;
        }

        public client_proxy guid_get_client_proxy(long guid)
        {
            if (!client_guid_dict.TryGetValue(guid, out client_proxy _proxy))
            {
                throw new GetPlayerException($"invaild guid:{guid}");
            }
            return _proxy;
        }
    }
}
