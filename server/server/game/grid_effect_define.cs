using abelkhan;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Security.Cryptography;
using System.Security.Principal;
using System.Threading.Tasks;

namespace game
{
    partial class game_impl
    {
        private List<effect> effects_define = new () { effect.muddy, effect.golden_apple, effect.rice_ear, effect.golden_apple, effect.rice_ear, effect.golden_apple, effect.rice_ear, effect.monkey_wine };

        private bool already_has_effect_grid(short pos)
        {
            foreach (var _effect_info in effect_list)
            {
                if (_effect_info.grids.Contains(pos))
                {
                    return true;
                }
            }
            return false;
        }

        public async Task check_randmon_effect()
        {
            if (game_rounds < 3)
            {
                return;
            }

            var r = hub.hub.randmon_uint(5);
            if (r < 1)
            {
                var _effect = effects_define[(int)hub.hub.randmon_uint((uint)effects_define.Count)];

                var _effect_info = new effect_info();
                _effect_info.effect_id = _effect;
                _effect_info.grids = new List<short>();

                var range = (uint)(farthest_animal_pos() - least_animal_pos());
                for (var i = 0; i< range; ++i)
                {
                    var pos = hub.hub.randmon_uint(range) + least_animal_pos() + 3;
                    if (pos == 0)
                    {
                        pos = 1;
                    }
                    pos = pos >= 63 ? 62 : pos;

                    if (!already_has_effect_grid((short)pos) && !already_has_prop_grid((short)pos))
                    {
                        if (_effect == effect.muddy)
                        {
                            var len = hub.hub.randmon_uint(3) + 3;
                            for (int j = 0; j < len; ++j)
                            {
                                var grid_pos = pos + j;
                                if (grid_pos >= (PlayergroundLenght - 1))
                                {
                                    break;
                                }
                                _effect_info.grids.Add((short)grid_pos);
                            }
                            _effect_info.continued_rounds = 3;
                        }
                        else
                        {
                            _effect_info.grids.Add((short)pos);
                            _effect_info.continued_rounds = 5;
                        }
                        effect_list.Add(_effect_info);

                        _game_client_caller.get_multicast(ClientUUIDS).ntf_new_effect_info(_effect_info);
                        await Task.Delay(2800);
                        break;
                    }
                }

                foreach (var player in ClientProxys)
                {
                    for (short index = 0; index < player.PlayerGameInfo.animal_info.Count; ++index)
                    {
                        var _animal = player.PlayerGameInfo.animal_info[index];
                        var from = _animal.current_pos;
                        if (check_grid_effect(player, index, from, _animal.current_pos))
                        {
                            await Task.Delay(constant.stepped_effect_delay);
                            return;
                        }
                    }
                }
            }
        }

        private bool check_grid_effect(client_proxy _client, short animal_index, int _from, int _to)
        {
            var check = false;
            var remove_effect_list = new List<effect_info>();
            var callback = new List<Action>();
            foreach (var _effect_info in effect_list)
            {
                var _animal = _client.PlayerGameInfo.animal_info[animal_index];
                if (_effect_info.grids.Contains(_animal.current_pos))
                {
                    if (_effect_info.guid == _client.PlayerGameInfo.guid)
                    {
                        continue;
                    }

                    bool is_remove = _effect_info.effect_id != effect.muddy;
                    GameClientCaller.get_multicast(ClientUUIDS).ntf_player_stepped_effect(_client.PlayerGameInfo.guid, _effect_info.effect_id, _animal.current_pos, is_remove);
                   
                    switch (_effect_info.effect_id)
                    {
                        case effect.muddy:
                            {
                                var _effect = new client_proxy.special_grid_effect();
                                _effect.animal_index = animal_index;
                                _effect.move_coefficient = 0.67f;
                                _effect.continued_rounds = 1;
                                _client.add_special_grid_effect(_effect);
                            }
                            break;

                        case effect.golden_apple:
                            {
                                var _effect = new client_proxy.special_grid_effect();
                                _effect.mutil_rounds = 2;
                                _effect.continued_rounds = 3;
                                _effect.stop_rounds = 1;
                                _client.add_special_grid_effect(_effect);

                                remove_effect_list.Add(_effect_info);
                            }
                            break;

                        case effect.rice_ear:
                            {
                                var _effect = new client_proxy.special_grid_effect();
                                _effect.move_coefficient = 2;
                                _effect.continued_rounds = 3;
                                _client.add_special_grid_effect(_effect);

                                remove_effect_list.Add(_effect_info);
                            }
                            break;

                        case effect.monkey_wine:
                            {
                                var _effect = new client_proxy.special_grid_effect();
                                _effect.stop_rounds = 1;
                                _client.add_special_grid_effect(_effect);

                                remove_effect_list.Add(_effect_info);
                            }
                            break;

                        case effect.clip:
                            {
                                _animal.could_move = false;
                                _animal.unmovable_rounds = 1;

                                remove_effect_list.Add(_effect_info);
                            }
                            break;

                        case effect.landmine:
                            {
                                int from = _animal.current_pos;
                                int to = from - 4;
                                if (to < 0)
                                {
                                    to = 0;
                                }
                                _animal.current_pos = (short)to;
                                ntf_effect_move(effect.landmine, _client.PlayerGameInfo.guid, _client.PlayerGameInfo.current_animal_index, from, to);

                                callback.Add(() =>
                                {
                                    check_grid_effect(_client, _client.PlayerGameInfo.current_animal_index, from, _animal.current_pos);
                                    check_grid_prop(_client, _animal);
                                });

                                remove_effect_list.Add(_effect_info);
                            }
                            break;

                        case effect.spring:
                            {
                                if (_from >= 0 && _to >= 0)
                                {
                                    int from = _to;
                                    int to = _from;
                                    _animal.current_pos = (short)to;
                                    ntf_effect_move(effect.spring, _client.PlayerGameInfo.guid, _client.PlayerGameInfo.current_animal_index, from, to);

                                    callback.Add(() =>
                                    {
                                        check_grid_effect(_client, _client.PlayerGameInfo.current_animal_index, from, _animal.current_pos);
                                        check_grid_prop(_client, _animal);
                                    });

                                    remove_effect_list.Add(_effect_info);
                                }
                            }
                            break;

                        case effect.watermelon_rind:
                            {
                                int from = _animal.current_pos;
                                int to;
                                if (hub.hub.randmon_uint(2) < 1)
                                {
                                    to = from + 3;
                                    if (to <= (PlayergroundLenght - 1))
                                    {
                                        to = (short)PlayergroundLenght;
                                        if (_client.check_done_play())
                                        {
                                            _client.IsDonePlay = true;
                                            
                                            DonePlayClient = _client;
                                            check_done_play();
                                        }
                                    }
                                }
                                else
                                {
                                    to = from - 3;
                                    if (to < 0)
                                    {
                                        to = 0;
                                    }
                                }
                                _animal.current_pos = (short)to;
                                ntf_effect_move(effect.watermelon_rind, _client.PlayerGameInfo.guid, _client.PlayerGameInfo.current_animal_index, from, to);

                                callback.Add(() =>
                                {
                                    check_grid_effect(_client, _client.PlayerGameInfo.current_animal_index, from, _animal.current_pos);
                                    check_grid_prop(_client, _animal);
                                });

                                remove_effect_list.Add(_effect_info);
                            }
                            break;

                        default:
                            break;
                    }

                    check = true;
                }
            }

            foreach(var _effect_info in remove_effect_list)
            {
                effect_list.Remove(_effect_info);
            }
            foreach(var cb in callback)
            {
                cb.Invoke();
            }

            return check;
        }
    }
}
