using abelkhan;
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Threading.Tasks;

namespace game
{
    public class game_mng
    {
        private readonly Dictionary<string, client_proxy> uuid_clients = new ();
        private readonly Dictionary<long, client_proxy> guid_clients = new();
        private readonly List<game_impl> games = new ();
        public int Count
        {
            get
            {
                return guid_clients.Count;
            }
        }

        private readonly game_client_caller _game_client_caller = new ();

        public game_mng()
        {
        }

        public client_proxy get_player(string uuid)
        {
            uuid_clients.TryGetValue(uuid, out client_proxy _client);
            return _client;
        }

        public void create_game(playground _playground, List<player_inline_info> room_player_list)
        {
            try
            {
                var _game = new game_impl(_game_client_caller, _playground, room_player_list);
                games.Add(_game);

                foreach (var _client in _game.ClientProxys)
                {
                    if (_client.uuid == "robot" && _client.PlayerGameInfo.guid == -1)
                    {
                        continue;
                    }

                    uuid_clients[_client.uuid] = _client;
                    guid_clients[_client.PlayerGameInfo.guid] = _client;
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        public void player_into_game(long guid, string uuid)
        {
            try
            {
                if (guid_clients.TryGetValue(guid, out client_proxy _client))
                {
                    uuid_clients.Remove(_client.uuid);
                    _client.uuid = uuid;
                    uuid_clients.Add(_client.uuid, _client);

                    _client.IsOffline = false;

                    if (_client.GameImpl.IsAllReady)
                    {
                        var _round_player = _client.GameImpl.ClientProxys[_client.GameImpl._current_client_index];
                        _game_client_caller.get_multicast(new List<string> { _client.uuid }).game_info(_client.GameImpl.Playground, _client.GameImpl.PlayerGameInfo, _round_player.PlayerGameInfo.guid);
                        _game_client_caller.get_multicast(new List<string> { _client.uuid }).ntf_effect_info(_client.GameImpl.effect_list);
                        _game_client_caller.get_multicast(new List<string> { _client.uuid }).ntf_prop_info(_client.GameImpl.prop_list);
                        _game_client_caller.get_client(uuid).ntf_player_prop_list(_client.props_list);
                        if (_client.IsAutoActive)
                        {
                            _game_client_caller.get_client(_client.uuid).ntf_player_auto();
                        }
                    }
                    else
                    {
                        _game_client_caller.get_multicast(new List<string> { _client.uuid }).game_wait_start_info((int)_client.GameImpl.Countdown, _client.GameImpl.Playground, _client.GameImpl.PlayerGameInfo, _client.PlayerInlineInfo);
                    }
                }
                else
                {
                    log.log.warn($"player_into_game error player not in game guid:{guid}");
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        public client_proxy get_client_uuid(string uuid)
        {
            uuid_clients.TryGetValue(uuid, out client_proxy _client);
            return _client;
        }

        public void player_use_skill(string uuid, long target_client_guid, short target_animal_index)
        {
            try
            {
                if (uuid_clients.TryGetValue(uuid, out client_proxy _client))
                {
                    _client.GameImpl.player_use_skill(_client, target_client_guid, target_animal_index);
                }
                else
                {
                    log.log.warn($"client not inline uuid:{uuid}");
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        public void player_use_props(string uuid, props _props_id, long target_client_guid, short target_animal_index)
        {
            try
            {
                if (uuid_clients.TryGetValue(uuid, out client_proxy _client))
                {
                    _client.GameImpl.player_use_props(_client, _props_id, target_client_guid, target_animal_index);
                }
                else
                {
                    log.log.warn($"client not inline uuid:{uuid}");
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        public void player_throw_dice(string uuid)
        {
            try
            {
                if (uuid_clients.TryGetValue(uuid, out client_proxy _client))
                {
                    _client.GameImpl.player_throw_dice(_client);
                }
                else
                {
                    log.log.warn($"client not inline uuid:{uuid}");
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        public void done_game(game_impl _game)
        {
            try
            {
                games.Remove(_game);

                foreach (var _client in _game.ClientProxys)
                {
                    uuid_clients.Remove(_client.uuid);
                    guid_clients.Remove(_client.PlayerGameInfo.guid);
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }
    }
}
