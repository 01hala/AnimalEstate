using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using MsgPack.Serialization;

namespace abelkhan
{
/*this enum code is codegen by abelkhan codegen for c#*/

    public enum enum_add_props_type{
        pick_up = 1,
        gacha_add = 2
    }
/*this struct code is codegen by abelkhan codegen for c#*/
    public class effect_info
    {
        public Int64 guid;
        public List<Int16> grids;
        public effect effect_id;
        public Int32 continued_rounds;
        public static MsgPack.MessagePackObjectDictionary effect_info_to_protcol(effect_info _struct){
            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("guid", _struct.guid);
            if (_struct.grids != null) {
                var _array_grids = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.grids){
                    _array_grids.Add(v_);
                }
                _protocol.Add("grids", new MsgPack.MessagePackObject(_array_grids));
            }
            _protocol.Add("effect_id", (Int32)_struct.effect_id);
            _protocol.Add("continued_rounds", _struct.continued_rounds);
            return _protocol;
        }
        public static effect_info protcol_to_effect_info(MsgPack.MessagePackObjectDictionary _protocol){
            var _struct3934263e_8a7e_3773_9a47_c85f982b70f5 = new effect_info();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "guid"){
                    _struct3934263e_8a7e_3773_9a47_c85f982b70f5.guid = ((MsgPack.MessagePackObject)i.Value).AsInt64();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "grids"){
                    _struct3934263e_8a7e_3773_9a47_c85f982b70f5.grids = new();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _struct3934263e_8a7e_3773_9a47_c85f982b70f5.grids.Add(((MsgPack.MessagePackObject)v_).AsInt16());
                    }
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "effect_id"){
                    _struct3934263e_8a7e_3773_9a47_c85f982b70f5.effect_id = (effect)((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "continued_rounds"){
                    _struct3934263e_8a7e_3773_9a47_c85f982b70f5.continued_rounds = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
            }
            return _struct3934263e_8a7e_3773_9a47_c85f982b70f5;
        }
    }

    public class prop_info
    {
        public Int16 grid;
        public props prop_id;
        public Int32 continued_rounds;
        public static MsgPack.MessagePackObjectDictionary prop_info_to_protcol(prop_info _struct){
            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("grid", _struct.grid);
            _protocol.Add("prop_id", (Int32)_struct.prop_id);
            _protocol.Add("continued_rounds", _struct.continued_rounds);
            return _protocol;
        }
        public static prop_info protcol_to_prop_info(MsgPack.MessagePackObjectDictionary _protocol){
            var _structab1f8d61_fd7a_34ff_9196_69fd838e0ec1 = new prop_info();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "grid"){
                    _structab1f8d61_fd7a_34ff_9196_69fd838e0ec1.grid = ((MsgPack.MessagePackObject)i.Value).AsInt16();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "prop_id"){
                    _structab1f8d61_fd7a_34ff_9196_69fd838e0ec1.prop_id = (props)((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "continued_rounds"){
                    _structab1f8d61_fd7a_34ff_9196_69fd838e0ec1.continued_rounds = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
            }
            return _structab1f8d61_fd7a_34ff_9196_69fd838e0ec1;
        }
    }

/*this module code is codegen by abelkhan codegen for c#*/
    public class game_client_choose_dice_rsp : common.Response {
        private UInt64 uuid_7ed84a95_822b_31ca_bfce_b880528f1fc1;
        private string hub_name_ffefe8e1_59c2_3292_8600_93dfa9b71e7f;
        private client.client _client_handle;
        public game_client_choose_dice_rsp(client.client client_handle_, string current_hub, UInt64 _uuid) 
        {
            _client_handle = client_handle_;
            hub_name_ffefe8e1_59c2_3292_8600_93dfa9b71e7f = current_hub;
            uuid_7ed84a95_822b_31ca_bfce_b880528f1fc1 = _uuid;
        }

        public void rsp(Int16 dice_index_b0f3c0a3_ea3d_358f_b27c_8b8fe5449b35){
            var _argv_ffefe8e1_59c2_3292_8600_93dfa9b71e7f = new ArrayList();
            _argv_ffefe8e1_59c2_3292_8600_93dfa9b71e7f.Add(uuid_7ed84a95_822b_31ca_bfce_b880528f1fc1);
            _argv_ffefe8e1_59c2_3292_8600_93dfa9b71e7f.Add(dice_index_b0f3c0a3_ea3d_358f_b27c_8b8fe5449b35);
            _client_handle.call_hub(hub_name_ffefe8e1_59c2_3292_8600_93dfa9b71e7f, "game_client_rsp_cb_choose_dice_rsp", _argv_ffefe8e1_59c2_3292_8600_93dfa9b71e7f);
        }

        public void err(){
            var _argv_ffefe8e1_59c2_3292_8600_93dfa9b71e7f = new ArrayList();
            _argv_ffefe8e1_59c2_3292_8600_93dfa9b71e7f.Add(uuid_7ed84a95_822b_31ca_bfce_b880528f1fc1);
            _client_handle.call_hub(hub_name_ffefe8e1_59c2_3292_8600_93dfa9b71e7f, "game_client_rsp_cb_choose_dice_err", _argv_ffefe8e1_59c2_3292_8600_93dfa9b71e7f);
        }

    }

    public class game_client_throw_animal_rsp : common.Response {
        private UInt64 uuid_02712198_786f_3dbf_bfa7_28e2b5e7591f;
        private string hub_name_714173ef_315d_33be_bb9d_744035ce7024;
        private client.client _client_handle;
        public game_client_throw_animal_rsp(client.client client_handle_, string current_hub, UInt64 _uuid) 
        {
            _client_handle = client_handle_;
            hub_name_714173ef_315d_33be_bb9d_744035ce7024 = current_hub;
            uuid_02712198_786f_3dbf_bfa7_28e2b5e7591f = _uuid;
        }

        public void rsp(Int32 target_pos_07271958_c0eb_3758_ab24_d83905ff81de){
            var _argv_714173ef_315d_33be_bb9d_744035ce7024 = new ArrayList();
            _argv_714173ef_315d_33be_bb9d_744035ce7024.Add(uuid_02712198_786f_3dbf_bfa7_28e2b5e7591f);
            _argv_714173ef_315d_33be_bb9d_744035ce7024.Add(target_pos_07271958_c0eb_3758_ab24_d83905ff81de);
            _client_handle.call_hub(hub_name_714173ef_315d_33be_bb9d_744035ce7024, "game_client_rsp_cb_throw_animal_rsp", _argv_714173ef_315d_33be_bb9d_744035ce7024);
        }

        public void err(){
            var _argv_714173ef_315d_33be_bb9d_744035ce7024 = new ArrayList();
            _argv_714173ef_315d_33be_bb9d_744035ce7024.Add(uuid_02712198_786f_3dbf_bfa7_28e2b5e7591f);
            _client_handle.call_hub(hub_name_714173ef_315d_33be_bb9d_744035ce7024, "game_client_rsp_cb_throw_animal_err", _argv_714173ef_315d_33be_bb9d_744035ce7024);
        }

    }

    public class game_client_module : common.imodule {
        public client.client _client_handle;
        public game_client_module(client.client client_handle_) 
        {
            _client_handle = client_handle_;
            _client_handle.modulemanager.add_mothed("game_client_game_wait_start_info", game_wait_start_info);
            _client_handle.modulemanager.add_mothed("game_client_game_info", game_info);
            _client_handle.modulemanager.add_mothed("game_client_animal_order", animal_order);
            _client_handle.modulemanager.add_mothed("game_client_ntf_effect_info", ntf_effect_info);
            _client_handle.modulemanager.add_mothed("game_client_ntf_new_effect_info", ntf_new_effect_info);
            _client_handle.modulemanager.add_mothed("game_client_remove_effect", remove_effect);
            _client_handle.modulemanager.add_mothed("game_client_remove_muddy", remove_muddy);
            _client_handle.modulemanager.add_mothed("game_client_ntf_player_stepped_effect", ntf_player_stepped_effect);
            _client_handle.modulemanager.add_mothed("game_client_ntf_prop_info", ntf_prop_info);
            _client_handle.modulemanager.add_mothed("game_client_ntf_new_prop_info", ntf_new_prop_info);
            _client_handle.modulemanager.add_mothed("game_client_remove_prop", remove_prop);
            _client_handle.modulemanager.add_mothed("game_client_ntf_player_stepped_prop", ntf_player_stepped_prop);
            _client_handle.modulemanager.add_mothed("game_client_ntf_player_prop_list", ntf_player_prop_list);
            _client_handle.modulemanager.add_mothed("game_client_turn_player_round", turn_player_round);
            _client_handle.modulemanager.add_mothed("game_client_ntf_player_auto", ntf_player_auto);
            _client_handle.modulemanager.add_mothed("game_client_relay", relay);
            _client_handle.modulemanager.add_mothed("game_client_start_throw_dice", start_throw_dice);
            _client_handle.modulemanager.add_mothed("game_client_throw_dice", throw_dice);
            _client_handle.modulemanager.add_mothed("game_client_choose_dice", choose_dice);
            _client_handle.modulemanager.add_mothed("game_client_rabbit_choose_dice", rabbit_choose_dice);
            _client_handle.modulemanager.add_mothed("game_client_move", move);
            _client_handle.modulemanager.add_mothed("game_client_animal_effect_touch_off", animal_effect_touch_off);
            _client_handle.modulemanager.add_mothed("game_client_ntf_animal_be_stepped", ntf_animal_be_stepped);
            _client_handle.modulemanager.add_mothed("game_client_throw_animal", throw_animal);
            _client_handle.modulemanager.add_mothed("game_client_throw_animal_ntf", throw_animal_ntf);
            _client_handle.modulemanager.add_mothed("game_client_throw_animal_move", throw_animal_move);
            _client_handle.modulemanager.add_mothed("game_client_use_skill", use_skill);
            _client_handle.modulemanager.add_mothed("game_client_effect_move", effect_move);
            _client_handle.modulemanager.add_mothed("game_client_use_props", use_props);
            _client_handle.modulemanager.add_mothed("game_client_add_props", add_props);
            _client_handle.modulemanager.add_mothed("game_client_reverse_props", reverse_props);
            _client_handle.modulemanager.add_mothed("game_client_immunity_props", immunity_props);
            _client_handle.modulemanager.add_mothed("game_client_can_not_active_this_round", can_not_active_this_round);
        }

        public event Action<Int32, playground, List<player_game_info>, player_inline_info> on_game_wait_start_info;
        public void game_wait_start_info(IList<MsgPack.MessagePackObject> inArray){
            var _countdown = ((MsgPack.MessagePackObject)inArray[0]).AsInt32();
            var __playground = (playground)((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var _info = new List<player_game_info>();
            var _protocol_arrayinfo = ((MsgPack.MessagePackObject)inArray[2]).AsList();
            foreach (var v_d856b000_56e0_5f62_a6f3_e6a0c7859745 in _protocol_arrayinfo){
                _info.Add(player_game_info.protcol_to_player_game_info(((MsgPack.MessagePackObject)v_d856b000_56e0_5f62_a6f3_e6a0c7859745).AsDictionary()));
            }
            var _self_info = player_inline_info.protcol_to_player_inline_info(((MsgPack.MessagePackObject)inArray[3]).AsDictionary());
            if (on_game_wait_start_info != null){
                on_game_wait_start_info(_countdown, __playground, _info, _self_info);
            }
        }

        public event Action<playground, List<player_game_info>, Int64> on_game_info;
        public void game_info(IList<MsgPack.MessagePackObject> inArray){
            var __playground = (playground)((MsgPack.MessagePackObject)inArray[0]).AsInt32();
            var _info = new List<player_game_info>();
            var _protocol_arrayinfo = ((MsgPack.MessagePackObject)inArray[1]).AsList();
            foreach (var v_d856b000_56e0_5f62_a6f3_e6a0c7859745 in _protocol_arrayinfo){
                _info.Add(player_game_info.protcol_to_player_game_info(((MsgPack.MessagePackObject)v_d856b000_56e0_5f62_a6f3_e6a0c7859745).AsDictionary()));
            }
            var _round_player_guid = ((MsgPack.MessagePackObject)inArray[2]).AsInt64();
            if (on_game_info != null){
                on_game_info(__playground, _info, _round_player_guid);
            }
        }

        public event Action<Int64, List<animal_game_info>, skill> on_animal_order;
        public void animal_order(IList<MsgPack.MessagePackObject> inArray){
            var _guid = ((MsgPack.MessagePackObject)inArray[0]).AsInt64();
            var _animal_info = new List<animal_game_info>();
            var _protocol_arrayanimal_info = ((MsgPack.MessagePackObject)inArray[1]).AsList();
            foreach (var v_c00062dc_edff_54ff_a6ff_4b3c0f329e98 in _protocol_arrayanimal_info){
                _animal_info.Add(animal_game_info.protcol_to_animal_game_info(((MsgPack.MessagePackObject)v_c00062dc_edff_54ff_a6ff_4b3c0f329e98).AsDictionary()));
            }
            var _skill_id = (skill)((MsgPack.MessagePackObject)inArray[2]).AsInt32();
            if (on_animal_order != null){
                on_animal_order(_guid, _animal_info, _skill_id);
            }
        }

        public event Action<List<effect_info>> on_ntf_effect_info;
        public void ntf_effect_info(IList<MsgPack.MessagePackObject> inArray){
            var _info = new List<effect_info>();
            var _protocol_arrayinfo = ((MsgPack.MessagePackObject)inArray[0]).AsList();
            foreach (var v_d856b000_56e0_5f62_a6f3_e6a0c7859745 in _protocol_arrayinfo){
                _info.Add(effect_info.protcol_to_effect_info(((MsgPack.MessagePackObject)v_d856b000_56e0_5f62_a6f3_e6a0c7859745).AsDictionary()));
            }
            if (on_ntf_effect_info != null){
                on_ntf_effect_info(_info);
            }
        }

        public event Action<effect_info> on_ntf_new_effect_info;
        public void ntf_new_effect_info(IList<MsgPack.MessagePackObject> inArray){
            var _info = effect_info.protcol_to_effect_info(((MsgPack.MessagePackObject)inArray[0]).AsDictionary());
            if (on_ntf_new_effect_info != null){
                on_ntf_new_effect_info(_info);
            }
        }

        public event Action<Int16> on_remove_effect;
        public void remove_effect(IList<MsgPack.MessagePackObject> inArray){
            var _grids = ((MsgPack.MessagePackObject)inArray[0]).AsInt16();
            if (on_remove_effect != null){
                on_remove_effect(_grids);
            }
        }

        public event Action<List<Int16>> on_remove_muddy;
        public void remove_muddy(IList<MsgPack.MessagePackObject> inArray){
            var _grids = new List<Int16>();
            var _protocol_arraygrids = ((MsgPack.MessagePackObject)inArray[0]).AsList();
            foreach (var v_869f96cd_b409_5375_9cdb_439d0d5e2a47 in _protocol_arraygrids){
                _grids.Add(((MsgPack.MessagePackObject)v_869f96cd_b409_5375_9cdb_439d0d5e2a47).AsInt16());
            }
            if (on_remove_muddy != null){
                on_remove_muddy(_grids);
            }
        }

        public event Action<Int64, effect, Int16, bool> on_ntf_player_stepped_effect;
        public void ntf_player_stepped_effect(IList<MsgPack.MessagePackObject> inArray){
            var _guid = ((MsgPack.MessagePackObject)inArray[0]).AsInt64();
            var _effect_id = (effect)((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var _grid = ((MsgPack.MessagePackObject)inArray[2]).AsInt16();
            var _is_remove = ((MsgPack.MessagePackObject)inArray[3]).AsBoolean();
            if (on_ntf_player_stepped_effect != null){
                on_ntf_player_stepped_effect(_guid, _effect_id, _grid, _is_remove);
            }
        }

        public event Action<List<prop_info>> on_ntf_prop_info;
        public void ntf_prop_info(IList<MsgPack.MessagePackObject> inArray){
            var _info = new List<prop_info>();
            var _protocol_arrayinfo = ((MsgPack.MessagePackObject)inArray[0]).AsList();
            foreach (var v_d856b000_56e0_5f62_a6f3_e6a0c7859745 in _protocol_arrayinfo){
                _info.Add(prop_info.protcol_to_prop_info(((MsgPack.MessagePackObject)v_d856b000_56e0_5f62_a6f3_e6a0c7859745).AsDictionary()));
            }
            if (on_ntf_prop_info != null){
                on_ntf_prop_info(_info);
            }
        }

        public event Action<prop_info> on_ntf_new_prop_info;
        public void ntf_new_prop_info(IList<MsgPack.MessagePackObject> inArray){
            var _info = prop_info.protcol_to_prop_info(((MsgPack.MessagePackObject)inArray[0]).AsDictionary());
            if (on_ntf_new_prop_info != null){
                on_ntf_new_prop_info(_info);
            }
        }

        public event Action<Int16> on_remove_prop;
        public void remove_prop(IList<MsgPack.MessagePackObject> inArray){
            var _grid = ((MsgPack.MessagePackObject)inArray[0]).AsInt16();
            if (on_remove_prop != null){
                on_remove_prop(_grid);
            }
        }

        public event Action<Int64, props> on_ntf_player_stepped_prop;
        public void ntf_player_stepped_prop(IList<MsgPack.MessagePackObject> inArray){
            var _guid = ((MsgPack.MessagePackObject)inArray[0]).AsInt64();
            var _prop_id = (props)((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            if (on_ntf_player_stepped_prop != null){
                on_ntf_player_stepped_prop(_guid, _prop_id);
            }
        }

        public event Action<List<props>> on_ntf_player_prop_list;
        public void ntf_player_prop_list(IList<MsgPack.MessagePackObject> inArray){
            var _prop_list = new List<props>();
            var _protocol_arrayprop_list = ((MsgPack.MessagePackObject)inArray[0]).AsList();
            foreach (var v_658c56cb_1649_5a10_843f_e261a651bc36 in _protocol_arrayprop_list){
                _prop_list.Add((props)((MsgPack.MessagePackObject)v_658c56cb_1649_5a10_843f_e261a651bc36).AsInt32());
            }
            if (on_ntf_player_prop_list != null){
                on_ntf_player_prop_list(_prop_list);
            }
        }

        public event Action<Int64, play_active_state, Int16, Int32> on_turn_player_round;
        public void turn_player_round(IList<MsgPack.MessagePackObject> inArray){
            var _guid = ((MsgPack.MessagePackObject)inArray[0]).AsInt64();
            var _active_state = play_active_state.protcol_to_play_active_state(((MsgPack.MessagePackObject)inArray[1]).AsDictionary());
            var _animal_index = ((MsgPack.MessagePackObject)inArray[2]).AsInt16();
            var _round = ((MsgPack.MessagePackObject)inArray[3]).AsInt32();
            if (on_turn_player_round != null){
                on_turn_player_round(_guid, _active_state, _animal_index, _round);
            }
        }

        public event Action on_ntf_player_auto;
        public void ntf_player_auto(IList<MsgPack.MessagePackObject> inArray){
            if (on_ntf_player_auto != null){
                on_ntf_player_auto();
            }
        }

        public event Action<Int64, Int16, bool> on_relay;
        public void relay(IList<MsgPack.MessagePackObject> inArray){
            var _guid = ((MsgPack.MessagePackObject)inArray[0]).AsInt64();
            var _new_animal_index = ((MsgPack.MessagePackObject)inArray[1]).AsInt16();
            var _is_follow = ((MsgPack.MessagePackObject)inArray[2]).AsBoolean();
            if (on_relay != null){
                on_relay(_guid, _new_animal_index, _is_follow);
            }
        }

        public event Action<Int64, Int16> on_start_throw_dice;
        public void start_throw_dice(IList<MsgPack.MessagePackObject> inArray){
            var _guid = ((MsgPack.MessagePackObject)inArray[0]).AsInt64();
            var _animal_index = ((MsgPack.MessagePackObject)inArray[1]).AsInt16();
            if (on_start_throw_dice != null){
                on_start_throw_dice(_guid, _animal_index);
            }
        }

        public event Action<Int64, List<Int32>> on_throw_dice;
        public void throw_dice(IList<MsgPack.MessagePackObject> inArray){
            var _guid = ((MsgPack.MessagePackObject)inArray[0]).AsInt64();
            var _dice = new List<Int32>();
            var _protocol_arraydice = ((MsgPack.MessagePackObject)inArray[1]).AsList();
            foreach (var v_9bcc4d08_9a5f_58b1_8d7e_695c05d8e04f in _protocol_arraydice){
                _dice.Add(((MsgPack.MessagePackObject)v_9bcc4d08_9a5f_58b1_8d7e_695c05d8e04f).AsInt32());
            }
            if (on_throw_dice != null){
                on_throw_dice(_guid, _dice);
            }
        }

        public event Action on_choose_dice;
        public void choose_dice(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            rsp = new game_client_choose_dice_rsp(_client_handle, _client_handle.current_hub, _cb_uuid);
            if (on_choose_dice != null){
                on_choose_dice();
            }
            rsp = null;
        }

        public event Action<Int32> on_rabbit_choose_dice;
        public void rabbit_choose_dice(IList<MsgPack.MessagePackObject> inArray){
            var _dice = ((MsgPack.MessagePackObject)inArray[0]).AsInt32();
            if (on_rabbit_choose_dice != null){
                on_rabbit_choose_dice(_dice);
            }
        }

        public event Action<Int64, Int16, float, Int32, Int32> on_move;
        public void move(IList<MsgPack.MessagePackObject> inArray){
            var _guid = ((MsgPack.MessagePackObject)inArray[0]).AsInt64();
            var _animal_index = ((MsgPack.MessagePackObject)inArray[1]).AsInt16();
            var _move_coefficient = ((MsgPack.MessagePackObject)inArray[2]).AsSingle();
            var _from = ((MsgPack.MessagePackObject)inArray[3]).AsInt32();
            var _to = ((MsgPack.MessagePackObject)inArray[4]).AsInt32();
            if (on_move != null){
                on_move(_guid, _animal_index, _move_coefficient, _from, _to);
            }
        }

        public event Action<Int64, Int16, Int64, Int16> on_animal_effect_touch_off;
        public void animal_effect_touch_off(IList<MsgPack.MessagePackObject> inArray){
            var _self_guid = ((MsgPack.MessagePackObject)inArray[0]).AsInt64();
            var _self_animal_index = ((MsgPack.MessagePackObject)inArray[1]).AsInt16();
            var _target_guid = ((MsgPack.MessagePackObject)inArray[2]).AsInt64();
            var _target_animal_index = ((MsgPack.MessagePackObject)inArray[3]).AsInt16();
            if (on_animal_effect_touch_off != null){
                on_animal_effect_touch_off(_self_guid, _self_animal_index, _target_guid, _target_animal_index);
            }
        }

        public event Action<Int64, Int16> on_ntf_animal_be_stepped;
        public void ntf_animal_be_stepped(IList<MsgPack.MessagePackObject> inArray){
            var _guid = ((MsgPack.MessagePackObject)inArray[0]).AsInt64();
            var _animal_index = ((MsgPack.MessagePackObject)inArray[1]).AsInt16();
            if (on_ntf_animal_be_stepped != null){
                on_ntf_animal_be_stepped(_guid, _animal_index);
            }
        }

        public event Action<Int64, Int64, Int16, List<Int32>> on_throw_animal;
        public void throw_animal(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _self_guid = ((MsgPack.MessagePackObject)inArray[1]).AsInt64();
            var _guid = ((MsgPack.MessagePackObject)inArray[2]).AsInt64();
            var _animal_index = ((MsgPack.MessagePackObject)inArray[3]).AsInt16();
            var _target_pos = new List<Int32>();
            var _protocol_arraytarget_pos = ((MsgPack.MessagePackObject)inArray[4]).AsList();
            foreach (var v_47f6ba3d_d4f7_5aa7_91f3_11e0c97b7925 in _protocol_arraytarget_pos){
                _target_pos.Add(((MsgPack.MessagePackObject)v_47f6ba3d_d4f7_5aa7_91f3_11e0c97b7925).AsInt32());
            }
            rsp = new game_client_throw_animal_rsp(_client_handle, _client_handle.current_hub, _cb_uuid);
            if (on_throw_animal != null){
                on_throw_animal(_self_guid, _guid, _animal_index, _target_pos);
            }
            rsp = null;
        }

        public event Action<Int64, Int64, Int16, List<Int32>> on_throw_animal_ntf;
        public void throw_animal_ntf(IList<MsgPack.MessagePackObject> inArray){
            var _self_guid = ((MsgPack.MessagePackObject)inArray[0]).AsInt64();
            var _guid = ((MsgPack.MessagePackObject)inArray[1]).AsInt64();
            var _animal_index = ((MsgPack.MessagePackObject)inArray[2]).AsInt16();
            var _target_pos = new List<Int32>();
            var _protocol_arraytarget_pos = ((MsgPack.MessagePackObject)inArray[3]).AsList();
            foreach (var v_47f6ba3d_d4f7_5aa7_91f3_11e0c97b7925 in _protocol_arraytarget_pos){
                _target_pos.Add(((MsgPack.MessagePackObject)v_47f6ba3d_d4f7_5aa7_91f3_11e0c97b7925).AsInt32());
            }
            if (on_throw_animal_ntf != null){
                on_throw_animal_ntf(_self_guid, _guid, _animal_index, _target_pos);
            }
        }

        public event Action<Int64, Int16, Int32, Int32> on_throw_animal_move;
        public void throw_animal_move(IList<MsgPack.MessagePackObject> inArray){
            var _guid = ((MsgPack.MessagePackObject)inArray[0]).AsInt64();
            var _animal_index = ((MsgPack.MessagePackObject)inArray[1]).AsInt16();
            var _from = ((MsgPack.MessagePackObject)inArray[2]).AsInt32();
            var _to = ((MsgPack.MessagePackObject)inArray[3]).AsInt32();
            if (on_throw_animal_move != null){
                on_throw_animal_move(_guid, _animal_index, _from, _to);
            }
        }

        public event Action<Int64, Int16, Int64, Int16> on_use_skill;
        public void use_skill(IList<MsgPack.MessagePackObject> inArray){
            var _guid = ((MsgPack.MessagePackObject)inArray[0]).AsInt64();
            var _animal_index = ((MsgPack.MessagePackObject)inArray[1]).AsInt16();
            var _target_guid = ((MsgPack.MessagePackObject)inArray[2]).AsInt64();
            var _target_animal_index = ((MsgPack.MessagePackObject)inArray[3]).AsInt16();
            if (on_use_skill != null){
                on_use_skill(_guid, _animal_index, _target_guid, _target_animal_index);
            }
        }

        public event Action<effect, Int64, Int16, Int32, Int32> on_effect_move;
        public void effect_move(IList<MsgPack.MessagePackObject> inArray){
            var _effect_id = (effect)((MsgPack.MessagePackObject)inArray[0]).AsInt32();
            var _guid = ((MsgPack.MessagePackObject)inArray[1]).AsInt64();
            var _target_animal_index = ((MsgPack.MessagePackObject)inArray[2]).AsInt16();
            var _from = ((MsgPack.MessagePackObject)inArray[3]).AsInt32();
            var _to = ((MsgPack.MessagePackObject)inArray[4]).AsInt32();
            if (on_effect_move != null){
                on_effect_move(_effect_id, _guid, _target_animal_index, _from, _to);
            }
        }

        public event Action<props, Int64, Int16, Int64, Int16> on_use_props;
        public void use_props(IList<MsgPack.MessagePackObject> inArray){
            var _props_id = (props)((MsgPack.MessagePackObject)inArray[0]).AsInt32();
            var _guid = ((MsgPack.MessagePackObject)inArray[1]).AsInt64();
            var _animal_index = ((MsgPack.MessagePackObject)inArray[2]).AsInt16();
            var _target_guid = ((MsgPack.MessagePackObject)inArray[3]).AsInt64();
            var _target_animal_index = ((MsgPack.MessagePackObject)inArray[4]).AsInt16();
            if (on_use_props != null){
                on_use_props(_props_id, _guid, _animal_index, _target_guid, _target_animal_index);
            }
        }

        public event Action<enum_add_props_type, Int64, props> on_add_props;
        public void add_props(IList<MsgPack.MessagePackObject> inArray){
            var _add_type = (enum_add_props_type)((MsgPack.MessagePackObject)inArray[0]).AsInt32();
            var _guid = ((MsgPack.MessagePackObject)inArray[1]).AsInt64();
            var _props_id = (props)((MsgPack.MessagePackObject)inArray[2]).AsInt32();
            if (on_add_props != null){
                on_add_props(_add_type, _guid, _props_id);
            }
        }

        public event Action<Int64, Int64, Int16, props, Int64, Int16> on_reverse_props;
        public void reverse_props(IList<MsgPack.MessagePackObject> inArray){
            var _src_guid = ((MsgPack.MessagePackObject)inArray[0]).AsInt64();
            var _target_guid = ((MsgPack.MessagePackObject)inArray[1]).AsInt64();
            var _target_animal_index = ((MsgPack.MessagePackObject)inArray[2]).AsInt16();
            var _props_id = (props)((MsgPack.MessagePackObject)inArray[3]).AsInt32();
            var _reverse_target_guid = ((MsgPack.MessagePackObject)inArray[4]).AsInt64();
            var _reverse_target_animal_index = ((MsgPack.MessagePackObject)inArray[5]).AsInt16();
            if (on_reverse_props != null){
                on_reverse_props(_src_guid, _target_guid, _target_animal_index, _props_id, _reverse_target_guid, _reverse_target_animal_index);
            }
        }

        public event Action<Int64, props, Int64, Int16> on_immunity_props;
        public void immunity_props(IList<MsgPack.MessagePackObject> inArray){
            var _guid = ((MsgPack.MessagePackObject)inArray[0]).AsInt64();
            var _props_id = (props)((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var _target_guid = ((MsgPack.MessagePackObject)inArray[2]).AsInt64();
            var _target_animal_index = ((MsgPack.MessagePackObject)inArray[3]).AsInt16();
            if (on_immunity_props != null){
                on_immunity_props(_guid, _props_id, _target_guid, _target_animal_index);
            }
        }

        public event Action<Int64> on_can_not_active_this_round;
        public void can_not_active_this_round(IList<MsgPack.MessagePackObject> inArray){
            var _guid = ((MsgPack.MessagePackObject)inArray[0]).AsInt64();
            if (on_can_not_active_this_round != null){
                on_can_not_active_this_round(_guid);
            }
        }

    }

}
