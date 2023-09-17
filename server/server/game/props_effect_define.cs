using abelkhan;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Security.Principal;
using System.Threading.Tasks;

namespace game
{
    partial class game_impl
    {
        public List<props> props_define = new() {
            props.horn,
            props.bomb,
            props.help_vellus,
            props.thunder,
            props.clown_gift_box,
            props.excited_petals,
            props.clip,
            props.landmine,
            props.spring,
            props.turtle_shell,
            props.banana,
            props.watermelon_rind,
            props.red_mushroom,
            props.gacha,
            props.fake_dice
        };

        private List<effect> step_lotus_effect_define = new() {
            effect.clip,
            effect.landmine,
            effect.spring
        };

        private bool already_has_prop_grid(short pos)
        {
            try
            {
                foreach (var _prop_info in prop_list)
                {
                    if (_prop_info.grid == pos)
                    {
                        return true;
                    }
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
            return false;
        }

        private async Task check_randmon_prop()
        {
            try
            {
                if (game_rounds < 3)
                {
                    return;
                }

                var r = hub.hub.randmon_uint(5);
                if (r < 1)
                {
                    var _prop = props_define[(int)hub.hub.randmon_uint((uint)effects_define.Count)];

                    var _prop_info = new prop_info();
                    _prop_info.prop_id = _prop;

                    var range = (uint)(farthest_animal_pos() - least_animal_pos());
                    for (var i = 0; i < range; ++i)
                    {
                        var pos = hub.hub.randmon_uint(range) + least_animal_pos() + 3;
                        if (pos == 0)
                        {
                            pos = 1;
                        }
                        pos = pos >= 63 ? 62 : pos;

                        if (!already_has_effect_grid((short)pos) && !already_has_prop_grid((short)pos))
                        {
                            _prop_info.grid = (short)pos;
                            _prop_info.continued_rounds = 5;
                            prop_list.Add(_prop_info);

                            _game_client_caller.get_multicast(ClientUUIDS).ntf_new_prop_info(_prop_info);
                            await Task.Delay(2800);
                            break;
                        }
                    }

                    foreach (var player in ClientProxys)
                    {
                        foreach (var _animal in player.PlayerGameInfo.animal_info)
                        {
                            if (check_grid_prop(player, _animal))
                            {
                                await Task.Delay(constant.stepped_effect_delay);
                                return;
                            }
                        }
                    }
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        private bool check_grid_prop(client_proxy _client, animal_game_info _animal)
        {
            var check = false;
            try
            {
                var remove_prop_list = new List<prop_info>();
                foreach (var _prop_info in prop_list)
                {
                    if (_prop_info.grid == _animal.current_pos)
                    {
                        _client.props_list.Add(_prop_info.prop_id);
                        if (_animal.animal_id == animal.tiger)
                        {
                            _client.props_list.Add(_prop_info.prop_id);
                        }

                        remove_prop_list.Add(_prop_info);

                        GameClientCaller.get_multicast(ClientUUIDS).ntf_player_stepped_prop(_client.PlayerGameInfo.guid, _prop_info.prop_id);
                        GameClientCaller.get_multicast(ClientUUIDS).remove_prop(_prop_info.grid);

                        GameClientCaller.get_client(_client.uuid).ntf_player_prop_list(_client.props_list);

                        check = true;
                    }
                }

                foreach (var _prop_info in remove_prop_list)
                {
                    prop_list.Remove(_prop_info);
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }

            return check;
        }

        public void check_randmon_step_lotus_props(short pos)
        {
            try
            {
                pos = (short)(pos > 63 ? 63 : pos);

                if (already_has_effect_grid(pos))
                {
                    return;
                }

                var r = hub.hub.randmon_uint(3);
                if (r < 1)
                {
                    var effect_id = step_lotus_effect_define[(int)hub.hub.randmon_uint((uint)step_lotus_effect_define.Count)];

                    var _props_info = new effect_info();
                    _props_info.effect_id = effect_id;
                    _props_info.grids = new()
                {
                    pos
                };
                    effect_list.Add(_props_info);

                    _game_client_caller.get_multicast(ClientUUIDS).ntf_new_effect_info(_props_info);
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }
    }

    partial class client_proxy
    {
        private client_proxy random_props_target()
        {
            try
            {
                var targetClientList = new List<client_proxy>();
                foreach (var _client in _impl.ClientProxys)
                {
                    if (_client != this)
                    {
                        targetClientList.Add(_client);
                    }
                }

                return targetClientList[(int)hub.hub.randmon_uint((uint)targetClientList.Count)];
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
            return null;
        }

        private client_proxy randmon_reverse_props_target(client_proxy target)
        {
            try
            {
                var targetClientList = new List<client_proxy>();
                foreach (var _client in _impl.ClientProxys)
                {
                    if (_client != this && _client != target)
                    {
                        targetClientList.Add(_client);
                    }
                }

                return targetClientList[(int)hub.hub.randmon_uint((uint)targetClientList.Count)];
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
            return null;
        }

        private async Task horn_props(long target_client_guid, short target_animal_index)
        {
            try
            {
                var delay_time = 1600;

                do
                {
                    var target_client = random_props_target();
                    if (target_client.reverse_props())
                    {
                        target_client = randmon_reverse_props_target(target_client);
                        _impl.ntf_reverse_props(_game_info.guid, target_client_guid, target_animal_index, props.horn, target_client.PlayerGameInfo.guid, target_client.PlayerGameInfo.current_animal_index);

                        delay_time += 400;
                    }
                    else if (target_client.immunity_props())
                    {
                        _impl.ntf_immunity_props(_game_info.guid, props.horn, target_client_guid, target_animal_index);
                        break;
                    }
                    else
                    {
                        _impl.ntf_player_use_props(props.horn, _game_info.guid, _game_info.current_animal_index, target_client_guid, target_animal_index);
                    }

                    target_client.skill_Effects.Add(new()
                    {
                        skill_state = enum_skill_state.em_move_halved,
                        continued_rounds = 2,
                    });
                } while (false);

                await Task.Delay(delay_time);
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        private async Task bomb_props(long target_client_guid, short target_animal_index)
        {
            try
            {
                var delay_time = 1600;

                do
                {
                    var target_client = random_props_target();
                    var target_animal = target_client.PlayerGameInfo.animal_info[target_animal_index];

                    if (target_client.reverse_props())
                    {
                        target_client = randmon_reverse_props_target(target_client);
                        target_animal = target_client.PlayerGameInfo.animal_info[target_client.PlayerGameInfo.current_animal_index];
                        _impl.ntf_reverse_props(_game_info.guid, target_client_guid, target_animal_index, props.horn, target_client.PlayerGameInfo.guid, target_client.PlayerGameInfo.current_animal_index);

                        delay_time += 400;
                    }
                    else if (target_client.immunity_props())
                    {
                        _impl.ntf_immunity_props(_game_info.guid, props.bomb, target_client_guid, target_animal_index);
                        break;
                    }
                    else
                    {
                        _impl.ntf_player_use_props(props.bomb, _game_info.guid, _game_info.current_animal_index, target_client_guid, target_animal_index);
                    }

                    target_animal.could_move = false;
                    target_animal.unmovable_rounds = 2;

                } while (false);

                await Task.Delay(delay_time);
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        private async Task help_vellus_props(long target_client_guid, short target_animal_index)
        {
            try
            {
                skill_Effects.Add(new()
                {
                    skill_state = enum_skill_state.em_immunity,
                    continued_rounds = 3,
                });

                _impl.ntf_player_use_props(props.help_vellus, _game_info.guid, _game_info.current_animal_index, PlayerGameInfo.guid, PlayerGameInfo.current_animal_index);

                await Task.Delay(1000);
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        private async Task thunder_props(long target_client_guid, short target_animal_index)
        {
            try
            {
                _impl.ntf_player_use_props(props.thunder, _game_info.guid, _game_info.current_animal_index, target_client_guid, target_animal_index);

                var targetClientList = new List<client_proxy>();
                foreach (var _client in _impl.ClientProxys)
                {
                    if (_client != this)
                    {
                        targetClientList.Add(_client);
                    }
                }

                var tasks = new List<Task>();
                foreach (var target in targetClientList)
                {
                    for (short i = 0; i < target.PlayerGameInfo.animal_info.Count; i++)
                    {
                        var _target = target;
                        var _animal = target.PlayerGameInfo.animal_info[i];
                        var index = i;

                        if (_animal.current_pos > 0 && _animal.current_pos < (_impl.PlayergroundLenght - 1))
                        {
                            if (_target.immunity_props())
                            {
                                _impl.ntf_immunity_props(_game_info.guid, props.clown_gift_box, _target.PlayerGameInfo.guid, _target.PlayerGameInfo.current_animal_index);
                                continue;
                            }

                            var from = _animal.current_pos;
                            _animal.current_pos -= 3;
                            _animal.current_pos = (short)(_animal.current_pos < 0 ? 0 : _animal.current_pos);
                            var to = _animal.current_pos;
                            _impl.ntf_effect_move(effect.thunder, _target.PlayerGameInfo.guid, index, from, to);

                            tasks.Add(_impl.check_pick_up(this, _animal, _game_info.current_animal_index, from, _animal.current_pos));
                        }
                    }
                }

                Task.WaitAll(tasks.ToArray());
                await Task.Delay(1600);
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        private async Task clown_gift_box_props(long target_client_guid, short target_animal_index)
        {
            try
            {
                var delay_time = 1600;

                do
                {
                    var _target = random_props_target();

                    if (_target.reverse_props())
                    {
                        var _reverse = randmon_reverse_props_target(_target);
                        _impl.ntf_reverse_props(_game_info.guid, _target.PlayerGameInfo.guid, _target.PlayerGameInfo.current_animal_index, props.clown_gift_box, _reverse.PlayerGameInfo.guid, _reverse.PlayerGameInfo.current_animal_index);
                        _target = _reverse;

                        delay_time += 400;
                    }
                    else if (_target.immunity_props())
                    {
                        _impl.ntf_immunity_props(_game_info.guid, props.clown_gift_box, _target.PlayerGameInfo.guid, _target.PlayerGameInfo.current_animal_index);
                        break;
                    }
                    else
                    {
                        _impl.ntf_player_use_props(props.clown_gift_box, _game_info.guid, _game_info.current_animal_index, _target.PlayerGameInfo.guid, _target.PlayerGameInfo.current_animal_index);
                    }

                    _target.skill_Effects.Add(new()
                    {
                        skill_state = enum_skill_state.em_unable_use_props,
                        continued_rounds = 3,
                    });

                } while (false);

                await Task.Delay(delay_time);
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        private async Task excited_petals_props(long target_client_guid, short target_animal_index)
        {
            try
            {
                skill_Effects.Add(new()
                {
                    skill_state = enum_skill_state.em_action_three,
                    continued_rounds = 1,
                });

                _impl.ntf_player_use_props(props.excited_petals, _game_info.guid, _game_info.current_animal_index, PlayerGameInfo.guid, PlayerGameInfo.current_animal_index);

                await Task.Delay(1000);
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        private async Task clip_props(long target_client_guid, short target_animal_index)
        {
            try
            {
                var _animal = PlayerGameInfo.animal_info[PlayerGameInfo.current_animal_index];
                var pos = (short)(_animal.current_pos > 63 ? 63 : _animal.current_pos);

                var _effect_info = new effect_info
                {
                    guid = PlayerGameInfo.guid,
                    effect_id = effect.clip,
                    grids = new List<short>
                {
                    pos
                }
                };

                _impl.effect_list.Add(_effect_info);
                _impl.GameClientCaller.get_multicast(_impl.ClientUUIDS).ntf_new_effect_info(_effect_info);

                _impl.ntf_player_use_props(props.clip, _game_info.guid, _game_info.current_animal_index, PlayerGameInfo.guid, PlayerGameInfo.current_animal_index);

                await Task.Delay(1000);
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        private async Task landmine_props(long target_client_guid, short target_animal_index)
        {
            try
            {
                var _animal = PlayerGameInfo.animal_info[PlayerGameInfo.current_animal_index];
                var pos = (short)(_animal.current_pos > 63 ? 63 : _animal.current_pos);

                var _effect_info = new effect_info
                {
                    guid = PlayerGameInfo.guid,
                    effect_id = effect.landmine,
                    grids = new List<short>
                {
                    pos
                }
                };

                _impl.effect_list.Add(_effect_info);
                _impl.GameClientCaller.get_multicast(_impl.ClientUUIDS).ntf_new_effect_info(_effect_info);

                _impl.ntf_player_use_props(props.landmine, _game_info.guid, _game_info.current_animal_index, PlayerGameInfo.guid, PlayerGameInfo.current_animal_index);

                await Task.Delay(1000);
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        private async Task spring_props(long target_client_guid, short target_animal_index)
        {
            try
            {
                var _animal = PlayerGameInfo.animal_info[PlayerGameInfo.current_animal_index];
                var pos = (short)(_animal.current_pos > 63 ? 63 : _animal.current_pos);

                var _effect_info = new effect_info
                {
                    guid = PlayerGameInfo.guid,
                    effect_id = effect.spring,
                    grids = new List<short>
                {
                    pos
                }
                };

                _impl.effect_list.Add(_effect_info);
                _impl.GameClientCaller.get_multicast(_impl.ClientUUIDS).ntf_new_effect_info(_effect_info);

                _impl.ntf_player_use_props(props.landmine, _game_info.guid, _game_info.current_animal_index, PlayerGameInfo.guid, PlayerGameInfo.current_animal_index);

                await Task.Delay(1000);
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        private async Task banana_props(long target_client_guid, short target_animal_index)
        {
            try
            {
                var delay_time = 1600;

                do
                {
                    var _target = random_props_target();

                    if (_target.reverse_props())
                    {
                        var _reverse = randmon_reverse_props_target(_target);
                        _impl.ntf_reverse_props(_game_info.guid, _target.PlayerGameInfo.guid, _target.PlayerGameInfo.current_animal_index, props.clown_gift_box, _reverse.PlayerGameInfo.guid, _reverse.PlayerGameInfo.current_animal_index);
                        _target = _reverse;

                        delay_time += 400;
                    }
                    else if (_target.immunity_props())
                    {
                        _impl.ntf_immunity_props(_game_info.guid, props.clown_gift_box, _target.PlayerGameInfo.guid, _target.PlayerGameInfo.current_animal_index);
                        break;
                    }
                    else
                    {
                        _impl.ntf_player_use_props(props.clown_gift_box, _game_info.guid, _game_info.current_animal_index, _target.PlayerGameInfo.guid, _target.PlayerGameInfo.current_animal_index);
                    }

                    _target.skill_Effects.Add(new()
                    {
                        skill_state = enum_skill_state.em_banana,
                        continued_rounds = 1,
                    });

                } while (false);

                await Task.Delay(delay_time);
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        private async Task watermelon_rind_props(long target_client_guid, short target_animal_index)
        {
            try
            {
                var _animal = PlayerGameInfo.animal_info[PlayerGameInfo.current_animal_index];
                var pos = (short)(_animal.current_pos > 63 ? 63 : _animal.current_pos);

                var _effect_info = new effect_info
                {
                    guid = PlayerGameInfo.guid,
                    effect_id = effect.watermelon_rind,
                    grids = new List<short>()
                {
                    pos
                }
                };

                _impl.effect_list.Add(_effect_info);

                _impl.ntf_player_use_props(props.watermelon_rind, _game_info.guid, _game_info.current_animal_index, PlayerGameInfo.guid, PlayerGameInfo.current_animal_index);

                await Task.Delay(1000);
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        private async Task red_mushroom_props(long target_client_guid, short target_animal_index)
        {
            try
            {
                var _animal = PlayerGameInfo.animal_info[PlayerGameInfo.current_animal_index];
                if (_animal.current_pos < (_impl.PlayergroundLenght - 1))
                {
                    var from = _animal.current_pos;
                    _animal.current_pos += 4;
                    if (_animal.current_pos >= (_impl.PlayergroundLenght - 1))
                    {
                        _animal.current_pos = (short)_impl.PlayergroundLenght;
                        if (check_done_play())
                        {
                            is_done_play = true;
                            _impl.DonePlayClient = this;

                            _impl.check_done_play();
                        }
                    }
                    _impl.ntf_player_use_props(props.red_mushroom, _game_info.guid, _game_info.current_animal_index, PlayerGameInfo.guid, PlayerGameInfo.current_animal_index);
                    _impl.ntf_effect_move(effect.red_mushroom, PlayerGameInfo.guid, PlayerGameInfo.current_animal_index, from, _animal.current_pos);
                    await Task.Delay(1500 + (int)(4 * 64 / constant.speed));

                    await _impl.check_pick_up(this, _animal, _game_info.current_animal_index, from, _animal.current_pos);
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        private async Task gacha_props(long target_client_guid, short target_animal_index)
        {
            try
            {
                var add = _impl.props_define[(int)hub.hub.randmon_uint((uint)_impl.props_define.Count)];
                props_list.Add(add);

                _impl.ntf_player_use_props(props.gacha, _game_info.guid, _game_info.current_animal_index, PlayerGameInfo.guid, PlayerGameInfo.current_animal_index);
                _impl.ntf_add_props(enum_add_props_type.gacha_add, _game_info.guid, add);

                await Task.Delay(500);
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        private async Task fake_dice_props(long target_client_guid, short target_animal_index)
        {
            try
            {
                var delay_time = 1600;

                do
                {
                    var _target = _impl.get_client_proxy(target_client_guid);

                    if (_target.reverse_props())
                    {
                        var _reverse = randmon_reverse_props_target(_target);
                        _impl.ntf_reverse_props(_game_info.guid, _target.PlayerGameInfo.guid, target_animal_index, props.clown_gift_box, _reverse.PlayerGameInfo.guid, _reverse.PlayerGameInfo.current_animal_index);
                        _target = _reverse;

                        delay_time += 400;
                    }
                    else if (_target.immunity_props())
                    {
                        _impl.ntf_immunity_props(_game_info.guid, props.clown_gift_box, _target.PlayerGameInfo.guid, _target.PlayerGameInfo.current_animal_index);
                        break;
                    }
                    else
                    {
                        _impl.ntf_player_use_props(props.clown_gift_box, _game_info.guid, _game_info.current_animal_index, _target.PlayerGameInfo.guid, _target.PlayerGameInfo.current_animal_index);
                    }

                    _target.skill_Effects.Add(new()
                    {
                        skill_state = enum_skill_state.em_fake_dice,
                        continued_rounds = 1,
                    });

                } while (false);

                await Task.Delay(delay_time);
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }
    }
}
