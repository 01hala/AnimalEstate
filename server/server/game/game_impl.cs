using abelkhan;
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Threading.Tasks;

namespace game
{
    public partial class game_impl
    {
        private readonly Dictionary<playground, int> playground_lenght = new() {
            { playground.lakeside, 64 },
            { playground.grassland, 100 },
            { playground.hill, 100 },
            { playground.snow, 100 },
            { playground.desert, 100 },
        };
        private readonly playground _playground;
        public int PlayergroundLenght 
        {
            get
            {
                return playground_lenght[_playground];
            }
        }
        public playground Playground
        {
            get
            {
                return _playground;
            }
        }

        private readonly List<client_proxy> _client_proxys = new ();
        public List<client_proxy> ClientProxys
        {
            get
            {
                return _client_proxys;
            }
        }
        public List<string> ClientUUIDS
        {
            get
            {
                var uuids = new List<string>();
                foreach (var _client in _client_proxys)
                {
                    uuids.Add(_client.uuid);
                }
                return uuids;
            }
        }
        public List<player_game_info> PlayerGameInfo
        {
            get
            {
                var player_game_info_list = new List<player_game_info>();
                foreach (var _client in _client_proxys)
                {
                    player_game_info_list.Add(_client.PlayerGameInfo);
                }
                return player_game_info_list;
            }
        }
        public int ActivePlayerCount
        {
            get
            {
                int count = 0;
                foreach (var _client in _client_proxys)
                {
                    if (!_client.IsDonePlay)
                    {
                        count++;
                    }
                }
                return count;
            }
        }
        public int _current_client_index = 0;

        private long wait_ready_time = service.timerservice.Tick + constant.wait_ready_time;
        public long Countdown
        {
            get
            {
                return (wait_ready_time - service.timerservice.Tick) / 1000;
            }
        }

        private bool is_all_ready = false;
        public bool IsAllReady
        {
            get
            {
                return is_all_ready;
            }
        }

        private bool is_done_play = false;
        public bool IsDonePlay
        {
            get
            {
                return is_done_play;
            }
        }
        public client_proxy DonePlayClient = null;

        public List<effect_info> effect_list = new ();
        public List<prop_info> prop_list = new();

        private bool turn_next_player = false;
        private int round_active_players = 0;
        private int game_rounds = 0;
        private bool already_turn_player_round = false;

        private bool wait_dice = false;
        public bool WaitDice
        {
            set
            {
                wait_dice = value;
            }
            get
            {
                return wait_dice;
            }
        }

        private bool wait_prop = false;
        public bool WaitProp
        {
            set
            {
                wait_prop = value;
            }
            get
            {
                return wait_prop;
            }
        }

        private bool wait_skill = false;
        public bool WaitSkill
        {
            set
            {
                wait_skill = value;
            }
            get
            {
                return wait_skill;
            }
        }

        private readonly game_client_caller _game_client_caller;
        public game_client_caller GameClientCaller
        {
            get
            {
                return _game_client_caller;
            }
        }

        private playground random_playground()
        {
            log.log.trace("random_playground begin!");

            var random_list = new List<playground>();
            foreach (var _client in _client_proxys)
            {
                foreach (var _playground in _client.PlayerPlaygrounds)
                {
                    if (!random_list.Contains(_playground))
                    {
                        random_list.Add(_playground);
                    }
                }
            }
            return random_list[(int)hub.hub.randmon_uint((uint)random_list.Count)];
        }

        public game_impl(game_client_caller _caller, playground playground, List<player_inline_info> room_player_list)
        {
            _game_client_caller = _caller;
            _playground = playground;
            
            foreach (var _player in room_player_list)
            {
                var _client = new client_proxy(_player, this);
                _client_proxys.Add(_client);
            }

            var guid = -1;
            for (var i = room_player_list.Count; i < 4; i++)
            {
                var _player_robot = new player_inline_info();
                _player_robot.uuid = "robot";
                _player_robot.name = NameHelper.GetNameHelper.GetName();
                _player_robot.guid = guid--;
                _player_robot.hero_list = new List<animal> { animal.chicken, animal.monkey, animal.rabbit, animal.duck, animal.mouse, animal.bear, animal.tiger, animal.lion };
                _player_robot.skin_list = new List<skin> { skin.chicken, skin.monkey, skin.rabbit, skin.duck, skin.mouse, skin.bear, skin.tiger, skin.lion };
                _player_robot.skill_list = new List<skill> { 
                    skill.phantom_dice,
                    skill.soul_moving_method,
                    skill.thief_reborn,
                    skill.step_lotus,
                    skill.preemptiv_strike,
                    skill.swap_places,
                    skill.altec_lightwave
                };
                _player_robot.playground_list = new List<playground> { playground.lakeside/*, playground.grassland, playground.hill, playground.snow, playground.desert*/ };
                var _client = new client_proxy(_player_robot, this);
                _client_proxys.Add(_client);
                _client.set_ready();
                _client.set_auto_active(true);
                _client.IsOffline = true;
            }

            if (_playground == playground.random)
            {
                _playground = random_playground();
            }

            _current_client_index = 0;

            hub.hub._timer.addticktime(1500, tick);
        }

        public void ntf_game_wait_start_info()
        {
            foreach(var _client in _client_proxys)
            {
                _game_client_caller.get_multicast(new List<string>() { _client.uuid }).game_wait_start_info((int)Countdown, Playground, PlayerGameInfo, _client.PlayerInlineInfo);
            }
        }

        public void ntf_animal_order(long guid)
        {
            var _player = get_client_proxy(guid);
            _game_client_caller.get_multicast(ClientUUIDS).animal_order(guid, _player.PlayerGameInfo.animal_info, _player.PlayerGameInfo.skill_id);
        }

        public async Task check_pick_up(client_proxy _client, animal_game_info _animal, short animal_index, int _from, int _to)
        {
            if (check_grid_effect(_client, animal_index, _from, _to))
            {
                await Task.Delay(constant.stepped_effect_delay);
            }
            if (check_grid_prop(_client, _animal))
            {
                await Task.Delay(constant.stepped_effect_delay);
            }
        }

        private bool check_all_ready()
        {
            log.log.trace("check_all_ready begin!");

            foreach (var _client_Proxy in _client_proxys)
            {
                if (!_client_Proxy.IsReady)
                {
                    return false;
                }
            }
            return true;
        }

        public async Task del_player_game_cache(client_proxy _client_Proxy)
        {
            var token = $"lock_{_client_Proxy.PlayerGameInfo.guid}";
            var lock_key = redis_help.BuildPlayerGameCacheLockKey(_client_Proxy.PlayerGameInfo.guid);
            try
            {
                await game._redis_handle.Lock(lock_key, token, 1000);

                var player_game_key = redis_help.BuildPlayerGameCacheKey(_client_Proxy.PlayerGameInfo.guid);
                var game_hub_name = await game._redis_handle.GetStrData(player_game_key);
                if (game_hub_name == hub.hub.name)
                {
                    game._redis_handle.DelData(player_game_key);
                }
            }
            finally
            {
                await game._redis_handle.UnLock(lock_key, token);
            }
        }

        public async void check_done_play()
        {
            log.log.trace("check_done_play begin!");

            if (DonePlayClient != null)
            {
                is_done_play = true;
                game._game_mng.done_game(this);

                var info = new game_settle_info();
                info.settle_info = new List<game_player_settle_info>();

                var player_hub_list = new List<string>();
                foreach (var _client_Proxy in _client_proxys)
                {
                    var player_settle_info = new game_player_settle_info();
                    player_settle_info.guid = _client_Proxy.PlayerGameInfo.guid;
                    player_settle_info.name = _client_Proxy.PlayerGameInfo.name;
                    player_settle_info.rank = 1;
                    foreach (var _client_rank in _client_proxys)
                    {
                        if (_client_Proxy.PlayScore < _client_rank.PlayScore)
                        {
                            player_settle_info.rank++;
                        }
                    }
                    player_settle_info.award_coin = 100 / player_settle_info.rank;
                    player_settle_info.award_score = 50 / player_settle_info.rank;
                    info.settle_info.Add(player_settle_info);

                    if (_client_Proxy.PlayerGameInfo.guid < 0)
                    {
                        continue;
                    }

                    var player_svr_key = redis_help.BuildPlayerGuidCacheKey(_client_Proxy.PlayerGameInfo.guid);
                    string player_hub_name = await game._redis_handle.GetStrData(player_svr_key);
                    if (!player_hub_list.Contains(player_hub_name))
                    {
                        player_hub_list.Add(player_hub_name);
                    }

                    await del_player_game_cache(_client_Proxy);
                }

                foreach (var palyer_hub_name in player_hub_list)
                {
                    game._player_proxy_mng.get_player(palyer_hub_name).settle(info);
                }
            }
        }

        public void ntf_player_use_skill(long guid, short animal_index, long target_client_guid, short target_animal_index)
        {
            _game_client_caller.get_multicast(ClientUUIDS).use_skill(guid, animal_index, target_client_guid, target_animal_index);
        }

        public void ntf_player_use_props(props props_id, long guid, short animal_index, long target_client_guid, short target_animal_index)
        {
            _game_client_caller.get_multicast(ClientUUIDS).use_props(props_id, guid, animal_index, target_client_guid, target_animal_index);
        }

        public void ntf_add_props(enum_add_props_type add_type, long guid, props props_id)
        {
            _game_client_caller.get_multicast(ClientUUIDS).add_props(add_type, guid, props_id);
        }

        public void ntf_reverse_props(long src_guid, long guid, short animal_index, props props_id, long target_guid, short target_animal_index)
        {
            _game_client_caller.get_multicast(ClientUUIDS).reverse_props(src_guid, guid, animal_index, props_id, target_guid, target_animal_index);
        }

        public void ntf_immunity_props(long guid, props props_id, long target_client_guid, short target_animal_index)
        {
            _game_client_caller.get_multicast(ClientUUIDS).immunity_props(guid, props_id, target_client_guid, target_animal_index);
        }

        public void ntf_effect_move(effect effect_id, long guid, Int16 target_animal_index, Int32 from, Int32 to)
        {
            _game_client_caller.get_multicast(ClientUUIDS).effect_move(effect_id, guid, target_animal_index, from, to);
        }

        private int least_animal_pos()
        {
            log.log.trace("least_animal_pos begin!");

            var pos = PlayergroundLenght - 1;
            foreach (var client_proxy in _client_proxys)
            {
                foreach(var animal in client_proxy.PlayerGameInfo.animal_info)
                {
                    if (animal.current_pos > 0)
                    {
                        pos = pos > animal.current_pos ? animal.current_pos : pos;
                    }
                }
            }
            return pos;
        }

        private int farthest_animal_pos()
        {
            log.log.trace("farthest_animal_pos begin!");

            var pos = 0;
            foreach (var client_proxy in _client_proxys)
            {
                foreach (var animal in client_proxy.PlayerGameInfo.animal_info)
                {
                    pos = pos < animal.current_pos ? animal.current_pos : pos;
                }
            }
            return pos;
        }

        public client_proxy get_client_proxy(long guid)
        {
            log.log.trace("get_client_proxy begin!");

            foreach (var client_proxy in _client_proxys)
            {
                if (client_proxy.PlayerGameInfo.guid == guid)
                {
                    return client_proxy;
                }
            }
            return null;
        }

        private async Task  turn_player_round(client_proxy _client)
        {
            log.log.trace("turn_player_round begin!");

            if (!already_turn_player_round)
            {
                _game_client_caller.get_multicast(ClientUUIDS).turn_player_round(_client.PlayerGameInfo.guid, _client.ActiveState, _client.PlayerGameInfo.current_animal_index, game_rounds);
                already_turn_player_round = true;
                await Task.Delay(constant.wait_relay_animal);
            }
        }

        private async Task next_player()
        {
            log.log.trace("next_player begin!");

            if (IsDonePlay)
            {
                return;
            }

            turn_next_player = false;
            for (int count = 0; count < 5; ++count)
            {
                ++_current_client_index;
                if (_current_client_index >= 4)
                {
                    _current_client_index = 0;
                }

                var _round_client = _client_proxys[_current_client_index];
                if (!_round_client.IsDonePlay)
                {
                    _round_client.WaitActiveTime = service.timerservice.Tick;
                    _round_client.summary_skill_effect();
                    _round_client.iterater_skill_effect();
                    
                    if (_round_client.CouldMove)
                    {
                        if (_round_client.PlayerGameInfo.current_animal_index >= 0)
                        {
                            GameClientCaller.get_multicast(ClientUUIDS).relay(_round_client.PlayerGameInfo.guid, _round_client.PlayerGameInfo.current_animal_index, true);
                        }

                        already_turn_player_round = false;
                        await turn_player_round(_round_client);
                        break;
                    }
                    else
                    {
                        _round_client.check_end_round();
                        _game_client_caller.get_multicast(ClientUUIDS).can_not_active_this_round(_round_client.PlayerGameInfo.guid);
                    }
                }
            }
        }

        private void wait_next_player()
        {
            turn_next_player = true;
        }

        public async void player_use_skill(client_proxy _client, long target_client_guid, short target_animal_index)
        {
            log.log.trace("player_use_skill begin!");

            var _current_client = _client_proxys[_current_client_index];
            if (_client.PlayerGameInfo.guid == _current_client.PlayerGameInfo.guid)
            {
                if (wait_skill)
                {
                    return;
                }

                await _client.use_skill(target_client_guid, target_animal_index);
                if (_client.check_end_round())
                {
                    wait_next_player();
                }
                else
                {
                    _client.WaitActiveTime = service.timerservice.Tick;
                    already_turn_player_round = false;
                }
            }
            else
            {
                log.log.warn($"use_skill not client:{_client.PlayerGameInfo.guid} round active!");
            }
        }

        public async void player_use_props(client_proxy _client, props _props_id, long target_client_guid, short target_animal_index)
        {
            log.log.trace("player_use_props begin!");

            var _current_client = _client_proxys[_current_client_index];
            if (_client.PlayerGameInfo.guid == _current_client.PlayerGameInfo.guid)
            {
                if (wait_prop)
                {
                    return;
                }

                await _client.use_props(_props_id, target_client_guid, target_animal_index);
                if (_client.check_end_round())
                {
                    wait_next_player();
                }
                else
                {
                    _client.WaitActiveTime = service.timerservice.Tick;
                    already_turn_player_round = false;
                }
            }
            else
            {
                log.log.warn($"use_props not client:{_client.PlayerGameInfo.guid} round active!");
            }
        }

        public async void player_throw_dice(client_proxy _client)
        {
            log.log.trace("player_throw_dice begin!");

            var _current_client = _client_proxys[_current_client_index];
            if (_client.PlayerGameInfo.guid == _current_client.PlayerGameInfo.guid)
            {
                if (wait_dice)
                {
                    return;
                }

                await _client.throw_dice();
                if (_client.check_end_round())
                {
                    wait_next_player();
                }
                else
                {
                    _client.WaitActiveTime = service.timerservice.Tick;
                    already_turn_player_round = false;
                }
            }
            else
            {
                log.log.warn($"throw_dice not client:{_client.PlayerGameInfo.guid} round active!");
            }
        }

        private void check_effect_due()
        {
            log.log.trace("check_effect_due begin!");

            var _due_effect_list = new List<effect_info>();
            foreach (var _effect in effect_list)
            {
                _effect.continued_rounds--;
                if (_effect.continued_rounds <= 0)
                {
                    _due_effect_list.Add(_effect);
                }
            }
            foreach (var _due_effect in _due_effect_list)
            {
                effect_list.Remove(_due_effect);
                if (_due_effect.effect_id == effect.muddy)
                {
                    GameClientCaller.get_multicast(ClientUUIDS).remove_muddy(_due_effect.grids);
                }
                else
                {
                    GameClientCaller.get_multicast(ClientUUIDS).remove_effect(_due_effect.grids[0]);
                }
            }
        }

        private void check_prop_due()
        {
            log.log.trace("check_prop_due begin!");

            var _due_propt_list = new List<prop_info>();
            foreach (var _propt in prop_list)
            {
                _propt.continued_rounds--;
                if (_propt.continued_rounds <= 0)
                {
                    _due_propt_list.Add(_propt);
                }
            }
            foreach (var _due_propt in _due_propt_list)
            {
                prop_list.Remove(_due_propt);
                GameClientCaller.get_multicast(ClientUUIDS).remove_prop(_due_propt.grid);
            }
        }

        private async Task<bool> check_ready_play()
        {
            if (!is_all_ready)
            {
                if (check_all_ready())
                {
                    is_all_ready = true;
                }
                else
                {
                    if (wait_ready_time < service.timerservice.Tick)
                    {
                        foreach (var _client_Proxy in _client_proxys)
                        {
                            if (!_client_Proxy.IsReady)
                            {
                                _client_Proxy.set_ready();
                                _client_Proxy.set_auto_active(true);
                            }
                        }
                        is_all_ready = true;
                    }
                    else
                    {
                        return false;
                    }
                }

                if (is_all_ready)
                {
                    var _round_client = _client_proxys[_current_client_index];
                    _round_client.summary_skill_effect();
                    _round_client.iterater_skill_effect();
                    await turn_player_round(_round_client);
                }
            }

            return is_all_ready;
        }

        public async void tick(long tick_time)
        {
            if (is_done_play)
            {
                return;
            }

            try
            {
                if (! await check_ready_play())
                {
                    return;
                }

                if (wait_dice || wait_prop || wait_skill)
                {
                    return;
                }

                if (turn_next_player)
                {
                    log.log.trace("turn_next_player");

                    await check_randmon_effect();
                    await check_randmon_prop();

                    if (++round_active_players >= ActivePlayerCount)
                    {
                        round_active_players = 0;
                        game_rounds++;

                        check_effect_due();
                        check_prop_due();
                    }

                    await next_player();
                }
                else
                {
                    await turn_player_round(_client_proxys[_current_client_index]);
                }

                var _client = _client_proxys[_current_client_index];
                if (!_client.IsAutoActive && (_client.WaitActiveTime + constant.wait_auto_time) < service.timerservice.Tick)
                {
                    log.log.trace($"guid:{_client.PlayerGameInfo.guid}, WaitActiveTime:{_client.WaitActiveTime}, tick:{service.timerservice.Tick}");
                    _client.set_auto_active(true);
                }
                if (_client.IsAutoActive)
                {
                    log.log.trace("auto_active");
                    if (_client.CouldMove)
                    {
                        await _client.auto_active();
                        if (_client.check_end_round())
                        {
                            log.log.trace("wait_next_player");
                            wait_next_player();
                        }
                        else
                        {
                            _client.WaitActiveTime = service.timerservice.Tick;
                            await turn_player_round(_client);
                        }
                    }
                }
            }
            catch(System.Exception ex)
            {
                log.log.err("tick error:{0}", ex);
            }
            finally
            {
                hub.hub._timer.addticktime(2000, tick);
            }
        }
    }
}
