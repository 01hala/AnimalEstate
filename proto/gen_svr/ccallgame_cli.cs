using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using MsgPack.Serialization;

namespace abelkhan
{
/*this enum code is codegen by abelkhan codegen for c#*/

/*this struct code is codegen by abelkhan codegen for c#*/
/*this caller code is codegen by abelkhan codegen for c#*/
    public class game_cancel_game_cb
    {
        private UInt64 cb_uuid;
        private game_rsp_cb module_rsp_cb;

        public game_cancel_game_cb(UInt64 _cb_uuid, game_rsp_cb _module_rsp_cb)
        {
            cb_uuid = _cb_uuid;
            module_rsp_cb = _module_rsp_cb;
        }

        public event Action on_cancel_game_cb;
        public event Action on_cancel_game_err;
        public event Action on_cancel_game_timeout;

        public game_cancel_game_cb callBack(Action cb, Action err)
        {
            on_cancel_game_cb += cb;
            on_cancel_game_err += err;
            return this;
        }

        public void timeout(UInt64 tick, Action timeout_cb)
        {
            TinyTimer.add_timer(tick, ()=>{
                module_rsp_cb.cancel_game_timeout(cb_uuid);
            });
            on_cancel_game_timeout += timeout_cb;
        }

        public void call_cb()
        {
            if (on_cancel_game_cb != null)
            {
                on_cancel_game_cb();
            }
        }

        public void call_err()
        {
            if (on_cancel_game_err != null)
            {
                on_cancel_game_err();
            }
        }

        public void call_timeout()
        {
            if (on_cancel_game_timeout != null)
            {
                on_cancel_game_timeout();
            }
        }

    }

/*this cb code is codegen by abelkhan for c#*/
    public class game_rsp_cb : common.imodule {
        public Dictionary<UInt64, game_cancel_game_cb> map_cancel_game;
        public game_rsp_cb(common.modulemanager modules)
        {
            map_cancel_game = new Dictionary<UInt64, game_cancel_game_cb>();
            modules.add_mothed("game_rsp_cb_cancel_game_rsp", cancel_game_rsp);
            modules.add_mothed("game_rsp_cb_cancel_game_err", cancel_game_err);
        }

        public void cancel_game_rsp(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var rsp = try_get_and_del_cancel_game_cb(uuid);
            if (rsp != null)
            {
                rsp.call_cb();
            }
        }

        public void cancel_game_err(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var rsp = try_get_and_del_cancel_game_cb(uuid);
            if (rsp != null)
            {
                rsp.call_err();
            }
        }

        public void cancel_game_timeout(UInt64 cb_uuid){
            var rsp = try_get_and_del_cancel_game_cb(cb_uuid);
            if (rsp != null){
                rsp.call_timeout();
            }
        }

        private game_cancel_game_cb try_get_and_del_cancel_game_cb(UInt64 uuid){
            lock(map_cancel_game)
            {
                if (map_cancel_game.TryGetValue(uuid, out game_cancel_game_cb rsp))
                {
                    map_cancel_game.Remove(uuid);
                }
                return rsp;
            }
        }

    }

    public class game_caller {
        public static game_rsp_cb rsp_cb_game_handle = null;
        private ThreadLocal<game_hubproxy> _hubproxy;
        public game_caller(client.client _client_handle) 
        {
            if (rsp_cb_game_handle == null)
            {
                rsp_cb_game_handle = new game_rsp_cb(_client_handle.modulemanager);
            }

            _hubproxy = new ThreadLocal<game_hubproxy>();
        }

        public game_hubproxy get_hub(string hub_name)
        {
            if (_hubproxy.Value == null)
{
                _hubproxy.Value = new game_hubproxy(_client_handle, rsp_cb_game_handle);
            }
            _hubproxy.Value.hub_name_b8b9723b_52d5_3bc2_8583_8bf5fd51de47 = hub_name;
            return _hubproxy.Value;
        }

    }

    public class game_hubproxy {
        public string hub_name_b8b9723b_52d5_3bc2_8583_8bf5fd51de47;
        private Int32 uuid_b8b9723b_52d5_3bc2_8583_8bf5fd51de47 = (Int32)RandomUUID.random();

        public client.client _client_handle;
        public game_rsp_cb rsp_cb_game_handle;

        public game_hubproxy(client.client client_handle_, game_rsp_cb rsp_cb_game_handle_)
        {
            _client_handle = client_handle_;
            rsp_cb_game_handle = rsp_cb_game_handle_;
        }

        public void into_game(Int64 guid){
            var _argv_90a69cb9_3a0a_3a86_9cad_499708905276 = new ArrayList();
            _argv_90a69cb9_3a0a_3a86_9cad_499708905276.Add(guid);
            _client_handle.call_hub(hub_name_b8b9723b_52d5_3bc2_8583_8bf5fd51de47, "game_into_game", _argv_90a69cb9_3a0a_3a86_9cad_499708905276);
        }

        public void play_order(List<animal_game_info> animal_info, skill skill_id){
            var _argv_72cd38c4_f976_3ca7_aeef_12b6fc619413 = new ArrayList();
            var _array_7044f738_3b40_35d1_a737_b6b236adbdd2 = new ArrayList();
            foreach(var v_6dc408dd_fea4_5767_a896_5cfbe6a4974f in animal_info){
                _array_7044f738_3b40_35d1_a737_b6b236adbdd2.Add(animal_game_info.animal_game_info_to_protcol(v_6dc408dd_fea4_5767_a896_5cfbe6a4974f));
            }
            _argv_72cd38c4_f976_3ca7_aeef_12b6fc619413.Add(_array_7044f738_3b40_35d1_a737_b6b236adbdd2);
            _argv_72cd38c4_f976_3ca7_aeef_12b6fc619413.Add((int)skill_id);
            _client_handle.call_hub(hub_name_b8b9723b_52d5_3bc2_8583_8bf5fd51de47, "game_play_order", _argv_72cd38c4_f976_3ca7_aeef_12b6fc619413);
        }

        public void ready(){
            var _argv_d316cb5a_9c2e_37b4_b933_a89ca4e2b6bd = new ArrayList();
            _client_handle.call_hub(hub_name_b8b9723b_52d5_3bc2_8583_8bf5fd51de47, "game_ready", _argv_d316cb5a_9c2e_37b4_b933_a89ca4e2b6bd);
        }

        public void use_skill(Int64 target_guid, Int16 target_animal_index){
            var _argv_f54ecac1_af9c_3003_a2f2_ed93134bfdfe = new ArrayList();
            _argv_f54ecac1_af9c_3003_a2f2_ed93134bfdfe.Add(target_guid);
            _argv_f54ecac1_af9c_3003_a2f2_ed93134bfdfe.Add(target_animal_index);
            _client_handle.call_hub(hub_name_b8b9723b_52d5_3bc2_8583_8bf5fd51de47, "game_use_skill", _argv_f54ecac1_af9c_3003_a2f2_ed93134bfdfe);
        }

        public void use_props(props props_id, Int64 target_guid, Int16 target_animal_index){
            var _argv_20fdd6aa_1127_36f5_b101_2ce394d2e1c9 = new ArrayList();
            _argv_20fdd6aa_1127_36f5_b101_2ce394d2e1c9.Add((int)props_id);
            _argv_20fdd6aa_1127_36f5_b101_2ce394d2e1c9.Add(target_guid);
            _argv_20fdd6aa_1127_36f5_b101_2ce394d2e1c9.Add(target_animal_index);
            _client_handle.call_hub(hub_name_b8b9723b_52d5_3bc2_8583_8bf5fd51de47, "game_use_props", _argv_20fdd6aa_1127_36f5_b101_2ce394d2e1c9);
        }

        public void throw_dice(){
            var _argv_89caa8aa_910b_3726_9283_63467ea68426 = new ArrayList();
            _client_handle.call_hub(hub_name_b8b9723b_52d5_3bc2_8583_8bf5fd51de47, "game_throw_dice", _argv_89caa8aa_910b_3726_9283_63467ea68426);
        }

        public void choose_animal(Int16 animal_index){
            var _argv_616b879f_2ebb_3ffd_9a6e_1add223b9f20 = new ArrayList();
            _argv_616b879f_2ebb_3ffd_9a6e_1add223b9f20.Add(animal_index);
            _client_handle.call_hub(hub_name_b8b9723b_52d5_3bc2_8583_8bf5fd51de47, "game_choose_animal", _argv_616b879f_2ebb_3ffd_9a6e_1add223b9f20);
        }

        public void cancel_auto(){
            var _argv_31dd4b62_c4d1_3244_801b_586f309b805d = new ArrayList();
            _client_handle.call_hub(hub_name_b8b9723b_52d5_3bc2_8583_8bf5fd51de47, "game_cancel_auto", _argv_31dd4b62_c4d1_3244_801b_586f309b805d);
        }

        public game_cancel_game_cb cancel_game(){
            var uuid_b75bfcdc_9de4_53c5_b31e_af9c4d3ae88a = (UInt64)Interlocked.Increment(ref uuid_b8b9723b_52d5_3bc2_8583_8bf5fd51de47);

            var _argv_51dfb5e9_b19e_3fc5_b7b3_c26a546e5e9b = new ArrayList();
            _argv_51dfb5e9_b19e_3fc5_b7b3_c26a546e5e9b.Add(uuid_b75bfcdc_9de4_53c5_b31e_af9c4d3ae88a);
            _client_handle.call_hub(hub_name_b8b9723b_52d5_3bc2_8583_8bf5fd51de47, "game_cancel_game", _argv_51dfb5e9_b19e_3fc5_b7b3_c26a546e5e9b);

            var cb_cancel_game_obj = new game_cancel_game_cb(uuid_b75bfcdc_9de4_53c5_b31e_af9c4d3ae88a, rsp_cb_game_handle);
            lock(rsp_cb_game_handle.map_cancel_game)
            {                rsp_cb_game_handle.map_cancel_game.Add(uuid_b75bfcdc_9de4_53c5_b31e_af9c4d3ae88a, cb_cancel_game_obj);
            }            return cb_cancel_game_obj;
        }

    }

}
