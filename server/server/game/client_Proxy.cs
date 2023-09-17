using abelkhan;
using System;
using System.Collections.Generic;
using System.Numerics;
using System.Reflection;
using System.Threading.Tasks;

namespace game
{
    public class SetAnimalOrderError : System.Exception
    {
        public SetAnimalOrderError(string err) : base(err)
        {
        }
    }

    public partial class client_proxy
    {
        private readonly player_inline_info _info;
        internal player_inline_info PlayerInlineInfo
        {
            get
            {
                return _info;
            }
        }
        public List<playground> PlayerPlaygrounds {
            get
            {
                return _info.playground_list;
            }
        }

        private player_game_info _game_info;
        public player_game_info PlayerGameInfo
        {
            get
            {
                return _game_info;
            }
        }

        public string uuid
        {
            set
            {
                _info.uuid = value;
            }
            get
            {
                return _info.uuid;
            }
        }

        private bool is_ready = false;
        public bool IsReady
        {
            get
            {
                return is_ready;
            }
        }

        private long wait_active_time = service.timerservice.Tick;
        public long WaitActiveTime
        {
            set
            {
                wait_active_time = value;
            }
            get
            {
                return wait_active_time;
            }
        }

        private bool is_auto_active = false;
        public bool IsAutoActive
        {
            get
            {
                return is_auto_active;
            }
        }

        private bool is_offline = false;
        public bool IsOffline
        {
            set
            {
                is_offline = value;
            }
            get
            {
                return is_offline;
            }
        }

        private readonly game_impl _impl;
        public game_impl GameImpl
        {
            get
            {
                return _impl;
            }
        }

        private int rounds = 0;

        public class special_grid_effect
        {
            public short animal_index = -1;
            public float move_coefficient = 1.0f;
            public int mutil_rounds = 0;

            public int continued_rounds = 0;
            public int stop_rounds = 0;
        }
        private List<special_grid_effect> special_grid_effects = new();

        class skill_effect
        {
            public enum_skill_state skill_state;
            public int continued_rounds = 0;

            public animal active_animal;
        }
        private List<skill_effect> skill_Effects = new();

        private bool skill_is_used = false;
        private bool preemptive_strike_is_active = false;
        private play_active_state active_State = new();
        public play_active_state ActiveState
        {
            get
            {
                return active_State;
            }
        }
        public bool CouldMove
        {
            get
            {
                try
                {
                    if (active_State.could_use_skill)
                    {
                        log.log.trace("could_use_skill");
                        return true;
                    }

                    if (active_State.animal_play_active_states == null)
                    {
                        return false;
                    }

                    foreach (var animal_state in active_State.animal_play_active_states)
                    {
                        if (animal_state.could_use_props || animal_state.could_throw_dice)
                        {
                            log.log.trace("could_use_props || animal_state.could_throw_dice");
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
        }

        private bool CouldProp
        {
            get
            {
                try
                {
                    if (active_State.animal_play_active_states == null)
                    {
                        return false;
                    }

                    foreach (var animal_state in active_State.animal_play_active_states)
                    {
                        if (animal_state.could_use_props)
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
        }

        private bool CouldDice
        {
            get
            {
                try
                {
                    if (active_State.animal_play_active_states == null)
                    {
                        return false;
                    }

                    foreach (var animal_state in active_State.animal_play_active_states)
                    {
                        if (animal_state.could_throw_dice)
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
        }

        private bool is_done_play = false;
        public bool IsDonePlay
        {
            get
            {
                return is_done_play;
            }
            set
            {
                is_done_play = value;
            }
        }

        public int PlayScore
        {
            get
            {
                try
                {
                    int score = 0;
                    foreach (var _animal in PlayerGameInfo.animal_info)
                    {
                        score += _animal.current_pos;
                    }
                    if (this == _impl.DonePlayClient)
                    {
                        score += 300;
                    }
                    return score;
                }
                catch (System.Exception e)
                {
                    log.log.err(e.Message);
                }

                return 0;
            }
        }

        public List<props> props_list = new();

        private readonly Dictionary<skill, Func<long, short, Task>> skill_list = new();
        private readonly Dictionary<props, Func<long, short, Task>> props_callback_list = new();

        private error_code_ntf_caller _error_code_ntf_caller = new();

        private void init_skill_list()
        {
            skill_list.Add(skill.phantom_dice, phantom_dice_skill);
            skill_list.Add(skill.soul_moving_method, soul_moving_method);
            skill_list.Add(skill.thief_reborn, thief_reborn);
            skill_list.Add(skill.step_lotus, step_lotus);
            skill_list.Add(skill.preemptiv_strike, preemptive_strike);
            skill_list.Add(skill.swap_places, swap_places);
            skill_list.Add(skill.altec_lightwave, altec_lightwave);
        }

        private void init_props_callback_list()
        {
            props_callback_list.Add(props.horn, horn_props);
            props_callback_list.Add(props.bomb, bomb_props);
            props_callback_list.Add(props.help_vellus, help_vellus_props);
            props_callback_list.Add(props.thunder, thunder_props);
            props_callback_list.Add(props.clown_gift_box, clown_gift_box_props);
            props_callback_list.Add(props.excited_petals, excited_petals_props);
            props_callback_list.Add(props.clip, clip_props);
            props_callback_list.Add(props.landmine, landmine_props);
            props_callback_list.Add(props.spring, spring_props);
            props_callback_list.Add(props.banana, banana_props);
            props_callback_list.Add(props.watermelon_rind, watermelon_rind_props);
            props_callback_list.Add(props.red_mushroom, red_mushroom_props);
            props_callback_list.Add(props.gacha, gacha_props);
            props_callback_list.Add(props.fake_dice, fake_dice_props);
        }

        public client_proxy(player_inline_info info, game_impl impl)
        {
            try
            {
                init_skill_list();
                init_props_callback_list();

                _info = info;
                _impl = impl;

                _game_info = new()
                {
                    uuid = _info.uuid,
                    guid = _info.guid,
                    name = _info.name,
                    skill_id = 0,
                    skill_is_used = false,
                    current_animal_index = 0,
                    animal_info = new()
                };

                if (_info.skill_list.Count > 0)
                {
                    _game_info.skill_id = _info.skill_list[(int)hub.hub.randmon_uint((uint)_info.skill_list.Count)];
                }

                var animal_list = new List<animal>(_info.hero_list);
                for (var i = 0; i < 3; i++)
                {
                    var _animal_id = animal_list[(int)hub.hub.randmon_uint((uint)animal_list.Count)];
                    var _skin_id = (skin)((int)_animal_id * 100 + 1);
                    _game_info.animal_info.Add(new animal_game_info() { animal_id = _animal_id, skin_id = _skin_id, current_pos = -1 });
                    animal_list.Remove(_animal_id);
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        public void ntf_error_code(error err_code)
        {
            _error_code_ntf_caller.get_client(uuid).error_code(err_code);
        }

        private bool reverse_props()
        {
            try
            {
                foreach (var _props in props_list)
                {
                    if (_props == props.turtle_shell)
                    {
                        props_list.Remove(_props);
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

        private bool immunity_props()
        {
            try
            {
                foreach (var effect in skill_Effects)
                {
                    if (effect.skill_state == enum_skill_state.em_immunity)
                    {
                        skill_Effects.Remove(effect);
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

        private bool phantom_dice()
        {
            try
            {
                foreach (var effect in skill_Effects)
                {
                    if (effect.skill_state == enum_skill_state.em_phantom_dice)
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

        private bool fake_dice()
        {
            try
            {
                foreach (var effect in skill_Effects)
                {
                    if (effect.skill_state == enum_skill_state.em_fake_dice)
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

        public void set_animal_order(List<animal_game_info> animal_info)
        {
            try
            {
                if (animal_info.Count != 3)
                {
                    throw new SetAnimalOrderError($"animal_info count != 3, player.guid:{_game_info.guid}");
                }
                _game_info.animal_info = animal_info;

                foreach (var _animal in animal_info)
                {
                    if (_animal.animal_id == animal.mouse)
                    {
                        props_list.Add(props.clip);
                        props_list.Add(props.landmine);
                        props_list.Add(props.spring);
                        _impl.GameClientCaller.get_client(uuid).ntf_player_prop_list(props_list);
                    }
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        public void set_skill(skill skill_id)
        {
            try
            {
                _game_info.skill_id = skill_id;
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        public void add_special_grid_effect(special_grid_effect _effect)
        {
            try
            {
                special_grid_effects.Add(_effect);
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        private bool check_skill_state_can_use_props()
        {
            try
            {
                foreach (var skill in skill_Effects)
                {
                    if (skill.skill_state == enum_skill_state.em_unable_use_props)
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

        private bool check_skill_state_can_move()
        {
            try
            {
                foreach (var skill in skill_Effects)
                {
                    if (skill.skill_state == enum_skill_state.em_can_not_move)
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

        private void check_skill_state()
        {
            try
            {
                foreach (var skill in skill_Effects)
                {
                    if (skill.skill_state == enum_skill_state.em_phantom_dice)
                    {
                        active_State.phantom_dice = true;
                    }
                    else if (skill.skill_state == enum_skill_state.em_move_halved)
                    {
                        active_State.move_coefficient *= 0.5f;
                    }
                    else if (skill.skill_state == enum_skill_state.em_action_three)
                    {
                        active_State.round_active_num = 3;
                    }
                    else if (skill.skill_state == enum_skill_state.em_preemptive_strike)
                    {
                        active_State.preemptive_strike = true;
                    }
                    else if (skill.skill_state == enum_skill_state.em_fake_dice)
                    {
                        active_State.fake_dice = true;
                    }
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        private void reset_animal_play_active_states()
        {
            try
            {
                if (active_State.animal_play_active_states == null)
                {
                    active_State.animal_play_active_states = new();
                }
                else
                {
                    active_State.animal_play_active_states.Clear();
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        private animal_play_active_state check_animal_play_active_state(short animal_index, bool can_not_use_props, bool can_not_move)
        {
            var animal_active_state = new animal_play_active_state();
            try
            {
                animal_active_state.animal_index = animal_index;
                animal_active_state.move_coefficient = active_State.move_coefficient;

                var _animal = PlayerGameInfo.animal_info[animal_index];

                if (can_not_use_props || props_list.Count <= 0)
                {
                    animal_active_state.could_use_props = false;
                }
                else
                {
                    animal_active_state.could_use_props = true;
                    animal_active_state.use_props_count = 1;
                }

                foreach (var grid_effect in special_grid_effects)
                {
                    if (grid_effect.continued_rounds > 0)
                    {
                        if (grid_effect.animal_index >= 0)
                        {
                            animal_active_state.move_coefficient *= grid_effect.move_coefficient;
                        }
                    }
                }

                if (can_not_move || !_animal.could_move || _animal.current_pos >= (_impl.PlayergroundLenght - 1))
                {
                    log.log.trace($"{PlayerGameInfo.uuid} can not move!");
                    animal_active_state.could_throw_dice = false;
                }
                else
                {
                    animal_active_state.could_throw_dice = true;

                    foreach (var skill in skill_Effects)
                    {
                        if (skill.skill_state == enum_skill_state.em_step_lotus)
                        {
                            if (_animal.animal_id == skill.active_animal)
                            {
                                animal_active_state.is_step_lotus = true;
                            }
                        }
                    }

                    if (_animal.animal_id == animal.duck)
                    {
                        log.log.trace($"uuid:{PlayerGameInfo.uuid}, current_animal_index:{animal_index}, animal_id:{_animal.animal_id}");
                        animal_active_state.throw_dice_count = 2;
                    }
                    else
                    {
                        animal_active_state.throw_dice_count = 1;
                    }
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }

            return animal_active_state;
        }

        public void summary_skill_effect()
        {
            try
            {
                bool can_not_use_skill = false;
                bool can_not_use_props, can_not_move;

                preemptive_strike_is_active = false;
                active_State.move_coefficient = 1.5f;
                active_State.round_active_num = 1;

                foreach (var grid_effect in special_grid_effects)
                {
                    if (grid_effect.continued_rounds > 0)
                    {
                        if (grid_effect.animal_index < 0)
                        {
                            active_State.move_coefficient *= grid_effect.move_coefficient;
                        }
                        if (active_State.round_active_num < grid_effect.mutil_rounds)
                        {
                            active_State.round_active_num = (short)grid_effect.mutil_rounds;
                        }
                    }
                    else if (grid_effect.stop_rounds > 0)
                    {
                        can_not_use_skill = true;
                        can_not_use_props = true;
                        can_not_move = true;
                    }
                }
                can_not_use_props = check_skill_state_can_use_props();
                can_not_move = check_skill_state_can_move();
                check_skill_state();

                if (!can_not_use_skill && check_could_use_skill() && PlayerGameInfo.skill_id != 0)
                {
                    active_State.could_use_skill = true;
                }

                reset_animal_play_active_states();
                for (short i = 0; i < PlayerGameInfo.animal_info.Count; i++)
                {
                    var animal_active_state = check_animal_play_active_state(i, can_not_use_props, can_not_move);

                    if (!animal_active_state.could_use_props && !animal_active_state.could_throw_dice)
                    {
                        if (PlayerGameInfo.current_animal_index == i)
                        {
                            PlayerGameInfo.current_animal_index = -1;
                        }
                    }
                    else
                    {
                        if (PlayerGameInfo.current_animal_index == -1)
                        {
                            PlayerGameInfo.current_animal_index = i;
                        }
                    }

                    active_State.animal_play_active_states.Add(animal_active_state);
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        public void iterater_skill_effect()
        {
            try
            {
                var _due_skill_effect = new List<skill_effect>();
                foreach (var _skill_effect in skill_Effects)
                {
                    _skill_effect.continued_rounds--;
                    if (_skill_effect.continued_rounds <= 0)
                    {
                        _due_skill_effect.Add(_skill_effect);
                    }
                }
                foreach (var _skill_effect in _due_skill_effect)
                {
                    skill_Effects.Remove(_skill_effect);
                }

                var _due_special_grid_effect = new List<special_grid_effect>();
                foreach (var grid_effect in special_grid_effects)
                {
                    if (grid_effect.continued_rounds > 0)
                    {
                        grid_effect.continued_rounds--;
                    }
                    else if (grid_effect.stop_rounds > 0)
                    {
                        grid_effect.stop_rounds--;
                        if (grid_effect.stop_rounds <= 0)
                        {
                            _due_special_grid_effect.Add(grid_effect);
                        }
                    }
                    else
                    {
                        _due_special_grid_effect.Add(grid_effect);
                    }
                }
                foreach (var _grid_effect in _due_special_grid_effect)
                {
                    special_grid_effects.Remove(_grid_effect);
                }

                foreach (var _animal in PlayerGameInfo.animal_info)
                {
                    if (!_animal.could_move)
                    {
                        _animal.unmovable_rounds--;
                        if (_animal.unmovable_rounds <= 0)
                        {
                            _animal.could_move = true;
                            _animal.unmovable_rounds = 0;
                        }
                    }
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        public async Task use_skill(long target_client_guid, short target_animal_index)
        {
            try
            {
                if (_impl.IsDonePlay)
                {
                    return;
                }

                if (active_State.could_use_skill)
                {
                    if (skill_list.TryGetValue(PlayerGameInfo.skill_id, out Func<long, short, Task> skill_func))
                    {
                        skill_is_used = true;
                        _game_info.skill_is_used = true;
                        _impl.WaitSkill = true;
                        await skill_func.Invoke(target_client_guid, target_animal_index);
                    }
                    else
                    {
                        log.log.err($"invaild skill id:{PlayerGameInfo.skill_id}, player.name:{_game_info.name}, player.guid:{_game_info.guid}");
                    }
                }
            }
            catch (System.Exception ex)
            {
                log.log.err("use_props err:{0}", ex);
            }
            finally
            {
                check_set_skill_active_state_unactive();
                check_set_props_active_state_unactive();

                _impl.WaitSkill = false;
            }
        }

        private animal_play_active_state get_animal_play_active_state(short index)
        {
            try
            {
                foreach (var state in active_State.animal_play_active_states)
                {
                    if (state.animal_index == index)
                    {
                        return state;
                    }
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
            return null;
        }

        public async Task use_props(props _props_id, long target_client_guid, short target_animal_index)
        {
            try
            {
                if (_impl.IsDonePlay)
                {
                    return;
                }

                var animal_state = get_animal_play_active_state(PlayerGameInfo.current_animal_index);
                if (animal_state == null)
                {
                    return;
                }

                if (animal_state.could_use_props)
                {
                    if (props_list.Remove(_props_id))
                    {
                        _impl.WaitProp = true;

                        animal_state.use_props_count--;
                        if (animal_state.use_props_count > 0 && props_list.Count > 0)
                        {
                            animal_state.could_use_props = true;
                        }

                        if (props_callback_list.TryGetValue(_props_id, out Func<long, short, Task> props_func))
                        {
                            await props_func.Invoke(target_client_guid, target_animal_index);
                        }
                        else
                        {
                            log.log.err($"invaild props id:{_props_id}, player.name:{_game_info.name}, player.guid:{_game_info.guid}");
                        }
                    }
                    else
                    {
                        log.log.err($"not own props id:{_props_id}, player.name:{_game_info.name}, player.guid:{_game_info.guid}");
                    }
                }
                else
                {
                    log.log.err($"could not use props, player.name:{_game_info.name}, player.guid:{_game_info.guid}");
                }
            }
            catch (System.Exception ex)
            {
                log.log.err("use_props err:{0}", ex);
            }
            finally
            {
                check_set_skill_active_state_unactive();
                check_set_props_active_state_unactive();

                _impl.WaitProp = false;
            }
        }

        private Task<int> choose_dice(List<int> dice_list)
        {
            var retTask = new TaskCompletionSource<int>();

            try
            {
                if (IsAutoActive)
                {
                    var dice = dice_list[0] > dice_list[1] ? dice_list[0] : dice_list[1];
                    _impl.GameClientCaller.get_multicast(_impl.ClientUUIDS).rabbit_choose_dice(dice);
                    retTask.SetResult(dice);
                }
                else
                {
                    _impl.GameClientCaller.get_client(uuid).choose_dice().callBack((index) =>
                    {
                        try
                        {
                            var dice = dice_list[index];
                            _impl.GameClientCaller.get_multicast(_impl.ClientUUIDS).rabbit_choose_dice(dice);
                            retTask.SetResult(dice);
                        }
                        catch (System.Exception e)
                        {
                            log.log.err(e.Message);
                        }

                    }, () =>
                    {
                        try
                        {
                            var dice = dice_list[0] > dice_list[1] ? dice_list[0] : dice_list[1];
                            _impl.GameClientCaller.get_multicast(_impl.ClientUUIDS).rabbit_choose_dice(dice);
                            retTask.SetResult(dice);
                        }
                        catch (System.Exception e)
                        {
                            log.log.err(e.Message);
                        }

                    }).timeout(8000, () =>
                    {
                        try
                        {
                            var dice = dice_list[0] > dice_list[1] ? dice_list[0] : dice_list[1];
                            _impl.GameClientCaller.get_multicast(_impl.ClientUUIDS).rabbit_choose_dice(dice);
                            retTask.SetResult(dice);
                        }
                        catch (System.Exception e)
                        {
                            log.log.err(e.Message);
                        }
                    });
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }

            return retTask.Task;
        }

        public async Task check_stepped_effect()
        {
            try
            {
                for (short i = 0; i < PlayerGameInfo.animal_info.Count; ++i)
                {
                    var _animal_info = PlayerGameInfo.animal_info[i];
                    await _impl.check_pick_up(this, _animal_info, i, -1, -1);
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        private Task<int> get_throw_animal_target_pos(long guid, short animal_index, List<int> target_pos)
        {
            var task = new TaskCompletionSource<int>();

            try
            {
                var uuids = new List<string>(_impl.ClientUUIDS);
                uuids.Remove(uuid);
                _impl.GameClientCaller.get_multicast(uuids).throw_animal_ntf(PlayerGameInfo.guid, guid, animal_index, target_pos);

                if (PlayerGameInfo.guid > 0 && !is_auto_active)
                {
                    _impl.GameClientCaller.get_client(uuid).throw_animal(PlayerGameInfo.guid, guid, animal_index, target_pos).callBack((pos) =>
                    {
                        try
                        {
                            task.SetResult(pos);
                        }
                        catch (System.Exception e)
                        {
                            log.log.err(e.Message);
                        }

                    }, () =>
                    {
                        log.log.err("get_throw_animal_target_pos callback err!");
                    }).timeout(4000, () =>
                    {
                        try
                        {
                            task.SetResult(target_pos[target_pos.Count - 1]);
                        }
                        catch (System.Exception e)
                        {
                            log.log.err(e.Message);
                        }
                    });
                }
                else
                {
                    hub.hub._timer.addticktime(1000, (tick) =>
                    {
                        try
                        {
                            if (PlayerGameInfo.guid == guid)
                            {
                                task.SetResult(target_pos[target_pos.Count - 1]);
                            }
                            else
                            {
                                task.SetResult(target_pos[0]);
                            }
                        }
                        catch (System.Exception e)
                        {
                            log.log.err(e.Message);
                        }
                    });
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }

            return task.Task;
        }

        private bool check_throw_stepped_other_animal(client_proxy _client, animal_game_info throw_target, short throw_target_index, bool is_forward)
        {
            try
            {
                if (throw_target.current_pos >= (_impl.PlayergroundLenght - 1))
                {
                    return false;
                }

                if (throw_target.current_pos <= 0)
                {
                    return false;
                }

                foreach (var player in _impl.ClientProxys)
                {
                    for (short index = 0; index < player._game_info.animal_info.Count; ++index)
                    {
                        var _other = player._game_info.animal_info[index];

                        if (player == _client && _other.animal_id == throw_target.animal_id)
                        {
                            continue;
                        }

                        if (_other.current_pos == throw_target.current_pos)
                        {
                            var from = throw_target.current_pos;
                            if (is_forward)
                            {
                                throw_target.current_pos += 1;
                            }
                            else
                            {
                                throw_target.current_pos -= 1;
                            }
                            if (throw_target.current_pos >= (_impl.PlayergroundLenght - 1))
                            {
                                throw_target.current_pos = (short)_impl.PlayergroundLenght;
                                if (check_done_play())
                                {
                                    is_done_play = true;
                                    _impl.DonePlayClient = this;
                                    _impl.check_done_play();
                                }
                            }

                            var move_coefficient = 1.2f;
                            _impl.GameClientCaller.get_multicast(_impl.ClientUUIDS).move(_client.PlayerGameInfo.guid, throw_target_index, move_coefficient, from, throw_target.current_pos);

                            return true;
                        }
                    }
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }

            return false;
        }

        private void check_lion_snatch_props(client_proxy player, animal_game_info self, short index)
        {
            try
            {
                if (player != this && player.props_list.Count > 0 && self.animal_id == animal.lion)
                {
                    var prop_id = player.props_list[(int)hub.hub.randmon_uint((uint)player.props_list.Count)];
                    player.props_list.Remove(prop_id);
                    props_list.Add(prop_id);

                    _impl.GameClientCaller.get_multicast(_impl.ClientUUIDS).animal_effect_touch_off(_game_info.guid, _game_info.current_animal_index, player._game_info.guid, index);
                    _impl.GameClientCaller.get_client(uuid).ntf_player_prop_list(props_list);
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        private List<int> throw_animal_pos_list(animal_game_info self)
        {
            var target_pos_list = new List<int>();
            try
            {
                var const_target_pos_list = new List<int>() { self.current_pos - 2, self.current_pos - 1, self.current_pos + 1, self.current_pos + 2 };
                if (self.animal_id == animal.bear)
                {
                    const_target_pos_list = new List<int>() { self.current_pos - 3, self.current_pos - 2, self.current_pos - 1, self.current_pos + 1, self.current_pos + 2, self.current_pos + 3 };
                }
                foreach (var pos in const_target_pos_list)
                {
                    if (pos >= 0 && pos < (_impl.PlayergroundLenght - 1))
                    {
                        target_pos_list.Add(pos);
                    }
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }

            return target_pos_list;
        }

        private async Task check_throw_animal(client_proxy player, short index, animal_game_info _other, animal_game_info self)
        {
            try
            {
                var target_pos_list = throw_animal_pos_list(self);
                var target_pos = await get_throw_animal_target_pos(player._game_info.guid, index, target_pos_list);
                _impl.GameClientCaller.get_multicast(_impl.ClientUUIDS).throw_animal_move(player._game_info.guid, index, _other.current_pos, target_pos);

                var from = _other.current_pos;
                await _impl.check_pick_up(player, _other, index, from, _other.current_pos);

                var move = target_pos - _other.current_pos;
                var wait_time = (int)((float)Math.Abs(move) * 64 / (constant.speed * 1.2) + 500);
                await Task.Delay(wait_time);

                _other.current_pos = (short)target_pos;
                from = _other.current_pos;
                while (check_throw_stepped_other_animal(player, _other, index, move > 0))
                {
                    await _impl.check_pick_up(player, _other, index, from, _other.current_pos);
                    from = _other.current_pos;

                    wait_time = (int)((float)2 * 64 / (constant.speed * 1.5) + 500);
                    await Task.Delay(wait_time);
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        private async Task check_stepped_other_animal(animal_game_info self)
        {
            try
            {
                if (self.current_pos >= (_impl.PlayergroundLenght - 1))
                {
                    return;
                }

                foreach (var player in _impl.ClientProxys)
                {
                    for (short index = 0; index < player._game_info.animal_info.Count; ++index)
                    {
                        animal_game_info _other = player._game_info.animal_info[index];

                        if (player == this && _other.animal_id == self.animal_id)
                        {
                            continue;
                        }

                        if (_other.current_pos == self.current_pos)
                        {
                            check_lion_snatch_props(player, self, index);
                            _impl.GameClientCaller.get_multicast(_impl.ClientUUIDS).ntf_animal_be_stepped(player._game_info.guid, index);
                            await check_throw_animal(player, index, _other, self);

                            return;
                        }
                    }
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        public Tuple<long, short> get_nearest_ahead_animal(animal_game_info _animal_info)
        {
            long target_guid = -4;
            short target_animal_index = -1;
            try
            {
                short pos = short.MaxValue;
                foreach (var _client in _impl.ClientProxys)
                {
                    if (_client != this)
                    {
                        for (short i = 0; i < _client.PlayerGameInfo.animal_info.Count; i++)
                        {
                            var animal = _client.PlayerGameInfo.animal_info[i];
                            if (animal.current_pos > _animal_info.current_pos && animal.current_pos < pos)
                            {
                                target_guid = _client.PlayerGameInfo.guid;
                                target_animal_index = i;
                                pos = animal.current_pos;
                            }
                        }
                    }
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }

            return Tuple.Create(target_guid, target_animal_index);
        }

        private List<int> randmon_dice(animal_play_active_state animal_state)
        {
            var dice_list = new List<int>();
            try
            {
                for (var i = 0; i < animal_state.throw_dice_count; i++)
                {
                    if (phantom_dice())
                    {
                        var n = 6;
                        dice_list.Add(n);
                    }
                    else if (fake_dice())
                    {
                        var n = (int)hub.hub.randmon_uint(3) + 1;
                        dice_list.Add(n);
                    }
                    else
                    {
                        var n = (int)hub.hub.randmon_uint(6) + 1;
                        dice_list.Add(n);
                    }
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
            return dice_list;
        }

        private short animal_move_effect(animal_game_info _animal_info, short move)
        {
            try
            {
                if (_animal_info.animal_id == animal.rabbit)
                {
                    if (_animal_info.continuous_move_rounds < 5)
                    {
                        move += 1;
                    }
                    else
                    {
                        move += 2;
                    }
                }
                else if (_animal_info.animal_id == animal.chicken)
                {
                    move -= 1;
                    move = (short)(move <= 0 ? 1 : move);
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
            return move;
        }

        private void check_animal_action_effect(animal_game_info _animal_info)
        {
            try
            {
                if (_animal_info.animal_id == animal.chicken)
                {
                    if (_animal_info.continuous_move_rounds >= 3)
                    {
                        var (target_guid, target_index) = get_nearest_ahead_animal(_animal_info);
                        if (target_guid > -4 && target_index > -1)
                        {
                            var target_client = _impl.get_client_proxy(target_guid);
                            var taget_animal = target_client._game_info.animal_info[target_index];

                            var tmp = _animal_info.current_pos;
                            _animal_info.current_pos = taget_animal.current_pos;
                            taget_animal.current_pos = tmp;

                            _impl.GameClientCaller.get_multicast(_impl.ClientUUIDS).animal_effect_touch_off(_game_info.guid, _game_info.current_animal_index, target_guid, target_index);
                            _animal_info.continuous_move_rounds = 0;
                        }
                    }
                }
                else if (_animal_info.animal_id == animal.monkey && _animal_info.continuous_move_rounds >= 3)
                {
                    props_list.Add(props.help_vellus);
                    _impl.GameClientCaller.get_client(uuid).ntf_player_prop_list(props_list);
                    _impl.GameClientCaller.get_multicast(_impl.ClientUUIDS).animal_effect_touch_off(_game_info.guid, _game_info.current_animal_index, 0, 0);

                    _animal_info.continuous_move_rounds = 0;
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        public async Task throw_dice()
        {
            try
            {
                if (_impl.IsDonePlay)
                {
                    return;
                }

                _impl.WaitDice = true;

                await check_stepped_effect();

                var animal_state = get_animal_play_active_state(PlayerGameInfo.current_animal_index);
                if (animal_state == null)
                {
                    return;
                }

                if (animal_state.could_throw_dice)
                {
                    wait_active_time = service.timerservice.Tick;
                    log.log.trace($"guid:{PlayerGameInfo.guid}, wait_active_time:{wait_active_time}");

                    var dice_list = randmon_dice(animal_state);
                    _impl.GameClientCaller.get_multicast(_impl.ClientUUIDS).start_throw_dice(_game_info.guid, _game_info.current_animal_index);
                    await Task.Delay(constant.start_throw_dice_wait_switch_animal);

                    _impl.GameClientCaller.get_multicast(_impl.ClientUUIDS).throw_dice(_game_info.guid, dice_list);
                    await Task.Delay(constant.throw_dice_wait_play_dice_animation);
                    var dice = dice_list[0];
                    if (dice_list.Count >= 2)
                    {
                        dice = await choose_dice(dice_list);
                        await Task.Delay(constant.wait_choose_dice);
                    }

                    if (active_State.preemptive_strike && dice < 3 && !preemptive_strike_is_active)
                    {
                        preemptive_strike_is_active = true;
                        active_State.round_active_num++;
                    }

                    var _animal_info = _game_info.animal_info[_game_info.current_animal_index];
                    _animal_info.current_pos = (short)(_animal_info.current_pos < 0 ? 0 : _animal_info.current_pos);

                    var move_coefficient = get_animal_play_active_state(_game_info.current_animal_index).move_coefficient;
                    var move = (short)(dice * move_coefficient);
                    move = (short)(move <= 0 ? 1 : move);
                    move = animal_move_effect(_animal_info, move);
                    _animal_info.continuous_move_rounds++;

                    var from = _animal_info.current_pos;
                    _animal_info.current_pos += move;
                    _impl.GameClientCaller.get_multicast(_impl.ClientUUIDS).move(_game_info.guid, _game_info.current_animal_index, move_coefficient, from, _animal_info.current_pos);

                    if (animal_state.is_step_lotus)
                    {
                        for (var i = from; i <= _animal_info.current_pos; i++)
                        {
                            _impl.check_randmon_step_lotus_props(i);
                        }
                    }

                    var wait_time = (int)((float)move * 64 / (constant.speed * active_State.move_coefficient) + 500);
                    await Task.Delay(wait_time);

                    if (check_done_play())
                    {
                        return;
                    }

                    await _impl.check_pick_up(this, _animal_info, _game_info.current_animal_index, from, _animal_info.current_pos);
                    await check_stepped_other_animal(_animal_info);
                    check_animal_action_effect(_animal_info);
                }
            }
            catch (System.Exception ex)
            {
                log.log.err($"{ex}");
            }
            finally
            {
                check_set_skill_active_state_unactive();
                check_set_props_active_state_unactive();
                check_set_throw_dice_active_state_unactive();

                _impl.WaitDice = false;
            }
        }

        private Tuple<long, short> random_skill_target()
        {
            long target_guid = -1;
            short target_animal_index = 0;
            try
            {
                if (PlayerGameInfo.skill_id == skill.step_lotus)
                {
                    target_guid = PlayerGameInfo.guid;
                    target_animal_index = PlayerGameInfo.current_animal_index;
                }
                else
                {
                    client_proxy _target_client = null;
                    foreach (var _client in _impl.ClientProxys)
                    {
                        if (_client != this)
                        {
                            _target_client = _client;
                            break;
                        }
                    }

                    target_guid = _target_client.PlayerGameInfo.guid;
                    target_animal_index = _target_client.PlayerGameInfo.current_animal_index;
                }
                target_animal_index = (short)(target_animal_index < 0 ? 0 : target_animal_index);
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
            return Tuple.Create(target_guid, target_animal_index);
        }

        private Tuple<short, short> get_last_animal_and_pos()
        {
            short index = 0;
            short min_pos = (short)_impl.PlayergroundLenght;
            try
            {
                for (var i = 0; i < PlayerGameInfo.animal_info.Count; i++)
                {
                    var animal = PlayerGameInfo.animal_info[i];
                    if (animal.current_pos < min_pos)
                    {
                        index = (short)i;
                        min_pos = animal.current_pos;
                    }
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
            return Tuple.Create(index, min_pos);
        }

        private Tuple<long, short> get_front_target(short pos)
        {
            long target_guid = -4;
            short target_animal_index = 0;
            try
            {
                foreach (var _client in _impl.ClientProxys)
                {
                    if (_client != this)
                    {
                        for (var i = 0; i < _client.PlayerGameInfo.animal_info.Count; i++)
                        {
                            var animal = _client.PlayerGameInfo.animal_info[i];
                            if (animal.current_pos > pos)
                            {
                                target_guid = _client.PlayerGameInfo.guid;
                                target_animal_index = (short)i;
                                pos = animal.current_pos;
                            }
                        }
                    }
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }

            return Tuple.Create(target_guid, target_animal_index);
        }

        private async Task auto_use_skill()
        {
            try
            {
                if (PlayerGameInfo.skill_id == skill.soul_moving_method || PlayerGameInfo.skill_id == skill.swap_places)
                {
                    var last_animal = get_last_animal_and_pos();
                    PlayerGameInfo.current_animal_index = last_animal.Item1;
                    _impl.GameClientCaller.get_multicast(_impl.ClientUUIDS).relay(PlayerGameInfo.guid, PlayerGameInfo.current_animal_index, true);
                    await Task.Delay(constant.wait_relay_animal);
                    var target = get_front_target(last_animal.Item2);
                    await use_skill(target.Item1, target.Item2);
                }
                else
                {
                    var target = random_skill_target();
                    await use_skill(target.Item1, target.Item2);
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        private Tuple<long, short> random_prop_target()
        {
            long target_guid = -1;
            short target_animal_index = 0;
            try
            {
                client_proxy _target_client = null;
                foreach (var _client in _impl.ClientProxys)
                {
                    if (_client != this)
                    {
                        _target_client = _client;
                        break;
                    }
                }

                target_guid = _target_client.PlayerGameInfo.guid;
                target_animal_index = _target_client.PlayerGameInfo.current_animal_index;
                target_animal_index = (short)(target_animal_index < 0 ? 0 : target_animal_index);
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }

            return Tuple.Create(target_guid, target_animal_index);
        }

        private async Task auto_use_props()
        {
            try
            {
                var target = random_prop_target();
                await use_props(props_list[0], target.Item1, target.Item2);
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        public async Task auto_random_dice_animal()
        {
            try
            {
                var active_animal = new List<short>();
                foreach (var _animal_sate in active_State.animal_play_active_states)
                {
                    if (_animal_sate.could_throw_dice)
                    {
                        active_animal.Add(_animal_sate.animal_index);
                    }
                }

                PlayerGameInfo.current_animal_index = active_animal[(int)hub.hub.randmon_uint((uint)active_animal.Count)];
                _impl.GameClientCaller.get_multicast(_impl.ClientUUIDS).relay(PlayerGameInfo.guid, PlayerGameInfo.current_animal_index, true);
                await Task.Delay(constant.wait_relay_animal);
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        public async Task auto_random_prop_animal()
        {
            try
            {
                var active_animal = new List<short>();
                foreach (var _animal_sate in active_State.animal_play_active_states)
                {
                    if (_animal_sate.could_use_props)
                    {
                        active_animal.Add(_animal_sate.animal_index);
                    }
                }

                PlayerGameInfo.current_animal_index = active_animal[(int)hub.hub.randmon_uint((uint)active_animal.Count)];
                _impl.GameClientCaller.get_multicast(_impl.ClientUUIDS).relay(PlayerGameInfo.guid, PlayerGameInfo.current_animal_index, true);
                await Task.Delay(constant.wait_relay_animal);
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        public async Task auto_active()
        {
            try
            {
                if (!CouldMove)
                {
                    return;
                }

                var active_list = new List<int>();
                if (active_State.could_use_skill)
                {
                    active_list.Add(0);
                }
                if (CouldProp)
                {
                    active_list.Add(1);
                    active_list.Add(1);
                    active_list.Add(1);
                }
                if (CouldDice)
                {
                    active_list.Add(2);
                    active_list.Add(2);
                    active_list.Add(2);
                }

                var r = active_list[(int)hub.hub.randmon_uint((uint)active_list.Count)];
                if (r == 0)
                {
                    await auto_use_skill();
                }
                else if (r == 1)
                {
                    await auto_random_prop_animal();
                    await auto_use_props();
                }
                else if (r == 2)
                {
                    await auto_random_dice_animal();
                    await throw_dice();
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        private void check_set_skill_active_state_unactive()
        {
            try
            {
                log.log.trace("check_set_active_state_unactive begin");

                active_State.could_use_skill = false;
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        private void check_set_props_active_state_unactive()
        {
            try
            {
                foreach (var state in active_State.animal_play_active_states)
                {
                    state.could_use_props = false;
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        private void check_set_throw_dice_active_state_unactive()
        {
            try
            {
                foreach (var state in active_State.animal_play_active_states)
                {
                    state.could_throw_dice = false;
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        public bool check_end_round()
        {
            log.log.trace("check_end_round begin");

            try
            {
                active_State.round_active_num--;
                if (active_State.round_active_num > 0)
                {
                    log.log.trace("check_end_round round_active_num > 0");

                    if (check_could_use_skill() && PlayerGameInfo.skill_id != 0)
                    {
                        active_State.could_use_skill = true;
                    }
                    if (props_list.Count > 0)
                    {
                        foreach (var animal_state in active_State.animal_play_active_states)
                        {
                            animal_state.could_use_props = true;
                            animal_state.use_props_count = 1;
                        }
                    }

                    for (var _animal_index = 0; _animal_index < PlayerGameInfo.animal_info.Count; _animal_index++)
                    {
                        var _animal = PlayerGameInfo.animal_info[_animal_index];
                        if (_animal.current_pos < (_impl.PlayergroundLenght - 1) && _animal.could_move)
                        {
                            var animal_state = get_animal_play_active_state((short)_animal_index);
                            animal_state.could_throw_dice = true;
                            if (_animal.animal_id == animal.duck)
                            {
                                animal_state.throw_dice_count = 2;
                            }
                            else
                            {
                                animal_state.throw_dice_count = 1;
                            }
                        }
                    }
                }

                if (CouldMove)
                {
                    log.log.trace("check_end_round could move");
                    return false;
                }

                log.log.trace("check_end_round end!");
                rounds++;
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }

            return true;
        }

        public void choose_animal(short animal_index)
        {
            try
            {
                PlayerGameInfo.current_animal_index = animal_index;
                foreach (var target_uuid in _impl.ClientUUIDS)
                {
                    var is_follow = target_uuid == uuid;
                    _impl.GameClientCaller.get_multicast(new List<string> { target_uuid }).relay(PlayerGameInfo.guid, animal_index, is_follow);
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        public bool check_done_play()
        {
            try
            {
                foreach (var animal_info in _game_info.animal_info)
                {
                    if (animal_info.current_pos >= (_impl.PlayergroundLenght - 1))
                    {
                        is_done_play = true;
                        _impl.DonePlayClient = this;
                        _impl.check_done_play();

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

        public void set_ready()
        {
            is_ready = true;
        }

        public void set_auto_active(bool is_auto)
        {
            try
            {
                is_auto_active = is_auto;
                if (is_auto_active)
                {
                    _impl.GameClientCaller.get_client(uuid).ntf_player_auto();
                }
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }
    }
}
