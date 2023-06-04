using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using MsgPack.Serialization;

namespace abelkhan
{
/*this enum code is codegen by abelkhan codegen for c#*/

/*this struct code is codegen by abelkhan codegen for c#*/
/*this module code is codegen by abelkhan codegen for c#*/
    public class game_cancel_game_rsp : common.Response {
        private string _client_uuid_51dfb5e9_b19e_3fc5_b7b3_c26a546e5e9b;
        private UInt64 uuid_d177c3cd_ad18_3e8f_96b3_9bc18f137c9a;
        public game_cancel_game_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_51dfb5e9_b19e_3fc5_b7b3_c26a546e5e9b = client_uuid;
            uuid_d177c3cd_ad18_3e8f_96b3_9bc18f137c9a = _uuid;
        }

        public void rsp(){
            var _argv_51dfb5e9_b19e_3fc5_b7b3_c26a546e5e9b = new ArrayList();
            _argv_51dfb5e9_b19e_3fc5_b7b3_c26a546e5e9b.Add(uuid_d177c3cd_ad18_3e8f_96b3_9bc18f137c9a);
            hub.hub._gates.call_client(_client_uuid_51dfb5e9_b19e_3fc5_b7b3_c26a546e5e9b, "game_rsp_cb_cancel_game_rsp", _argv_51dfb5e9_b19e_3fc5_b7b3_c26a546e5e9b);
        }

        public void err(){
            var _argv_51dfb5e9_b19e_3fc5_b7b3_c26a546e5e9b = new ArrayList();
            _argv_51dfb5e9_b19e_3fc5_b7b3_c26a546e5e9b.Add(uuid_d177c3cd_ad18_3e8f_96b3_9bc18f137c9a);
            hub.hub._gates.call_client(_client_uuid_51dfb5e9_b19e_3fc5_b7b3_c26a546e5e9b, "game_rsp_cb_cancel_game_err", _argv_51dfb5e9_b19e_3fc5_b7b3_c26a546e5e9b);
        }

    }

    public class game_module : common.imodule {
        public game_module()
        {
            hub.hub._modules.add_mothed("game_into_game", into_game);
            hub.hub._modules.add_mothed("game_play_order", play_order);
            hub.hub._modules.add_mothed("game_ready", ready);
            hub.hub._modules.add_mothed("game_use_skill", use_skill);
            hub.hub._modules.add_mothed("game_use_props", use_props);
            hub.hub._modules.add_mothed("game_throw_dice", throw_dice);
            hub.hub._modules.add_mothed("game_choose_animal", choose_animal);
            hub.hub._modules.add_mothed("game_cancel_auto", cancel_auto);
            hub.hub._modules.add_mothed("game_cancel_game", cancel_game);
        }

        public event Action<Int64> on_into_game;
        public void into_game(IList<MsgPack.MessagePackObject> inArray){
            var _guid = ((MsgPack.MessagePackObject)inArray[0]).AsInt64();
            if (on_into_game != null){
                on_into_game(_guid);
            }
        }

        public event Action<List<animal_game_info>, skill> on_play_order;
        public void play_order(IList<MsgPack.MessagePackObject> inArray){
            var _animal_info = new List<animal_game_info>();
            var _protocol_arrayanimal_info = ((MsgPack.MessagePackObject)inArray[0]).AsList();
            foreach (var v_c00062dc_edff_54ff_a6ff_4b3c0f329e98 in _protocol_arrayanimal_info){
                _animal_info.Add(animal_game_info.protcol_to_animal_game_info(((MsgPack.MessagePackObject)v_c00062dc_edff_54ff_a6ff_4b3c0f329e98).AsDictionary()));
            }
            var _skill_id = (skill)((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            if (on_play_order != null){
                on_play_order(_animal_info, _skill_id);
            }
        }

        public event Action on_ready;
        public void ready(IList<MsgPack.MessagePackObject> inArray){
            if (on_ready != null){
                on_ready();
            }
        }

        public event Action<Int64, Int16> on_use_skill;
        public void use_skill(IList<MsgPack.MessagePackObject> inArray){
            var _target_guid = ((MsgPack.MessagePackObject)inArray[0]).AsInt64();
            var _target_animal_index = ((MsgPack.MessagePackObject)inArray[1]).AsInt16();
            if (on_use_skill != null){
                on_use_skill(_target_guid, _target_animal_index);
            }
        }

        public event Action<props, Int64, Int16> on_use_props;
        public void use_props(IList<MsgPack.MessagePackObject> inArray){
            var _props_id = (props)((MsgPack.MessagePackObject)inArray[0]).AsInt32();
            var _target_guid = ((MsgPack.MessagePackObject)inArray[1]).AsInt64();
            var _target_animal_index = ((MsgPack.MessagePackObject)inArray[2]).AsInt16();
            if (on_use_props != null){
                on_use_props(_props_id, _target_guid, _target_animal_index);
            }
        }

        public event Action on_throw_dice;
        public void throw_dice(IList<MsgPack.MessagePackObject> inArray){
            if (on_throw_dice != null){
                on_throw_dice();
            }
        }

        public event Action<Int16> on_choose_animal;
        public void choose_animal(IList<MsgPack.MessagePackObject> inArray){
            var _animal_index = ((MsgPack.MessagePackObject)inArray[0]).AsInt16();
            if (on_choose_animal != null){
                on_choose_animal(_animal_index);
            }
        }

        public event Action on_cancel_auto;
        public void cancel_auto(IList<MsgPack.MessagePackObject> inArray){
            if (on_cancel_auto != null){
                on_cancel_auto();
            }
        }

        public event Action on_cancel_game;
        public void cancel_game(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            rsp = new game_cancel_game_rsp(hub.hub._gates.current_client_uuid, _cb_uuid);
            if (on_cancel_game != null){
                on_cancel_game();
            }
            rsp = null;
        }

    }

}
