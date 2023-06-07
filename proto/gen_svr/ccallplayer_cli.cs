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
    public class player_login_player_login_cb
    {
        private UInt64 cb_uuid;
        private player_login_rsp_cb module_rsp_cb;

        public player_login_player_login_cb(UInt64 _cb_uuid, player_login_rsp_cb _module_rsp_cb)
        {
            cb_uuid = _cb_uuid;
            module_rsp_cb = _module_rsp_cb;
        }

        public event Action<player_info, string> on_player_login_cb;
        public event Action<Int32> on_player_login_err;
        public event Action on_player_login_timeout;

        public player_login_player_login_cb callBack(Action<player_info, string> cb, Action<Int32> err)
        {
            on_player_login_cb += cb;
            on_player_login_err += err;
            return this;
        }

        public void timeout(UInt64 tick, Action timeout_cb)
        {
            TinyTimer.add_timer(tick, ()=>{
                module_rsp_cb.player_login_timeout(cb_uuid);
            });
            on_player_login_timeout += timeout_cb;
        }

        public void call_cb(player_info info, string rank_svr_name)
        {
            if (on_player_login_cb != null)
            {
                on_player_login_cb(info, rank_svr_name);
            }
        }

        public void call_err(Int32 err)
        {
            if (on_player_login_err != null)
            {
                on_player_login_err(err);
            }
        }

        public void call_timeout()
        {
            if (on_player_login_timeout != null)
            {
                on_player_login_timeout();
            }
        }

    }

    public class player_login_create_role_cb
    {
        private UInt64 cb_uuid;
        private player_login_rsp_cb module_rsp_cb;

        public player_login_create_role_cb(UInt64 _cb_uuid, player_login_rsp_cb _module_rsp_cb)
        {
            cb_uuid = _cb_uuid;
            module_rsp_cb = _module_rsp_cb;
        }

        public event Action<player_info, string> on_create_role_cb;
        public event Action<Int32> on_create_role_err;
        public event Action on_create_role_timeout;

        public player_login_create_role_cb callBack(Action<player_info, string> cb, Action<Int32> err)
        {
            on_create_role_cb += cb;
            on_create_role_err += err;
            return this;
        }

        public void timeout(UInt64 tick, Action timeout_cb)
        {
            TinyTimer.add_timer(tick, ()=>{
                module_rsp_cb.create_role_timeout(cb_uuid);
            });
            on_create_role_timeout += timeout_cb;
        }

        public void call_cb(player_info info, string rank_svr_name)
        {
            if (on_create_role_cb != null)
            {
                on_create_role_cb(info, rank_svr_name);
            }
        }

        public void call_err(Int32 err)
        {
            if (on_create_role_err != null)
            {
                on_create_role_err(err);
            }
        }

        public void call_timeout()
        {
            if (on_create_role_timeout != null)
            {
                on_create_role_timeout();
            }
        }

    }

/*this cb code is codegen by abelkhan for c#*/
    public class player_login_rsp_cb : common.imodule {
        public Dictionary<UInt64, player_login_player_login_cb> map_player_login;
        public Dictionary<UInt64, player_login_create_role_cb> map_create_role;
        public player_login_rsp_cb(common.modulemanager modules)
        {
            map_player_login = new Dictionary<UInt64, player_login_player_login_cb>();
            modules.add_mothed("player_login_rsp_cb_player_login_rsp", player_login_rsp);
            modules.add_mothed("player_login_rsp_cb_player_login_err", player_login_err);
            map_create_role = new Dictionary<UInt64, player_login_create_role_cb>();
            modules.add_mothed("player_login_rsp_cb_create_role_rsp", create_role_rsp);
            modules.add_mothed("player_login_rsp_cb_create_role_err", create_role_err);
        }

        public void player_login_rsp(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _info = player_info.protcol_to_player_info(((MsgPack.MessagePackObject)inArray[1]).AsDictionary());
            var _rank_svr_name = ((MsgPack.MessagePackObject)inArray[2]).AsString();
            var rsp = try_get_and_del_player_login_cb(uuid);
            if (rsp != null)
            {
                rsp.call_cb(_info, _rank_svr_name);
            }
        }

        public void player_login_err(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _err = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var rsp = try_get_and_del_player_login_cb(uuid);
            if (rsp != null)
            {
                rsp.call_err(_err);
            }
        }

        public void player_login_timeout(UInt64 cb_uuid){
            var rsp = try_get_and_del_player_login_cb(cb_uuid);
            if (rsp != null){
                rsp.call_timeout();
            }
        }

        private player_login_player_login_cb try_get_and_del_player_login_cb(UInt64 uuid){
            lock(map_player_login)
            {
                if (map_player_login.TryGetValue(uuid, out player_login_player_login_cb rsp))
                {
                    map_player_login.Remove(uuid);
                }
                return rsp;
            }
        }

        public void create_role_rsp(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _info = player_info.protcol_to_player_info(((MsgPack.MessagePackObject)inArray[1]).AsDictionary());
            var _rank_svr_name = ((MsgPack.MessagePackObject)inArray[2]).AsString();
            var rsp = try_get_and_del_create_role_cb(uuid);
            if (rsp != null)
            {
                rsp.call_cb(_info, _rank_svr_name);
            }
        }

        public void create_role_err(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _err = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var rsp = try_get_and_del_create_role_cb(uuid);
            if (rsp != null)
            {
                rsp.call_err(_err);
            }
        }

        public void create_role_timeout(UInt64 cb_uuid){
            var rsp = try_get_and_del_create_role_cb(cb_uuid);
            if (rsp != null){
                rsp.call_timeout();
            }
        }

        private player_login_create_role_cb try_get_and_del_create_role_cb(UInt64 uuid){
            lock(map_create_role)
            {
                if (map_create_role.TryGetValue(uuid, out player_login_create_role_cb rsp))
                {
                    map_create_role.Remove(uuid);
                }
                return rsp;
            }
        }

    }

    public class player_login_caller {
        public static player_login_rsp_cb rsp_cb_player_login_handle = null;
        private ThreadLocal<player_login_hubproxy> _hubproxy;
        public player_login_caller(client.client _client_handle) 
        {
            if (rsp_cb_player_login_handle == null)
            {
                rsp_cb_player_login_handle = new player_login_rsp_cb(_client_handle.modulemanager);
            }

            _hubproxy = new ThreadLocal<player_login_hubproxy>();
        }

        public player_login_hubproxy get_hub(string hub_name)
        {
            if (_hubproxy.Value == null)
{
                _hubproxy.Value = new player_login_hubproxy(_client_handle, rsp_cb_player_login_handle);
            }
            _hubproxy.Value.hub_name_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b = hub_name;
            return _hubproxy.Value;
        }

    }

    public class player_login_hubproxy {
        public string hub_name_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b;
        private Int32 uuid_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b = (Int32)RandomUUID.random();

        public client.client _client_handle;
        public player_login_rsp_cb rsp_cb_player_login_handle;

        public player_login_hubproxy(client.client client_handle_, player_login_rsp_cb rsp_cb_player_login_handle_)
        {
            _client_handle = client_handle_;
            rsp_cb_player_login_handle = rsp_cb_player_login_handle_;
        }

        public player_login_player_login_cb player_login(string token, string nick_name, string avatar_url){
            var uuid_ab86d08e_f3b3_5b3e_a2b9_8a2b5c189a51 = (UInt64)Interlocked.Increment(ref uuid_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b);

            var _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b = new ArrayList();
            _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b.Add(uuid_ab86d08e_f3b3_5b3e_a2b9_8a2b5c189a51);
            _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b.Add(token);
            _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b.Add(nick_name);
            _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b.Add(avatar_url);
            _client_handle.call_hub(hub_name_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b, "player_login_player_login", _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b);

            var cb_player_login_obj = new player_login_player_login_cb(uuid_ab86d08e_f3b3_5b3e_a2b9_8a2b5c189a51, rsp_cb_player_login_handle);
            lock(rsp_cb_player_login_handle.map_player_login)
            {                rsp_cb_player_login_handle.map_player_login.Add(uuid_ab86d08e_f3b3_5b3e_a2b9_8a2b5c189a51, cb_player_login_obj);
            }            return cb_player_login_obj;
        }

        public player_login_create_role_cb create_role(string name, string nick_name, string avatar_url){
            var uuid_ef86ed88_4838_5896_8241_9edf3c4b6d21 = (UInt64)Interlocked.Increment(ref uuid_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b);

            var _argv_30293c4a_8f5b_307e_a08a_ff76e003f95d = new ArrayList();
            _argv_30293c4a_8f5b_307e_a08a_ff76e003f95d.Add(uuid_ef86ed88_4838_5896_8241_9edf3c4b6d21);
            _argv_30293c4a_8f5b_307e_a08a_ff76e003f95d.Add(name);
            _argv_30293c4a_8f5b_307e_a08a_ff76e003f95d.Add(nick_name);
            _argv_30293c4a_8f5b_307e_a08a_ff76e003f95d.Add(avatar_url);
            _client_handle.call_hub(hub_name_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b, "player_login_create_role", _argv_30293c4a_8f5b_307e_a08a_ff76e003f95d);

            var cb_create_role_obj = new player_login_create_role_cb(uuid_ef86ed88_4838_5896_8241_9edf3c4b6d21, rsp_cb_player_login_handle);
            lock(rsp_cb_player_login_handle.map_create_role)
            {                rsp_cb_player_login_handle.map_create_role.Add(uuid_ef86ed88_4838_5896_8241_9edf3c4b6d21, cb_create_role_obj);
            }            return cb_create_role_obj;
        }

    }
/*this cb code is codegen by abelkhan for c#*/
    public class client_match_rsp_cb : common.imodule {
        public client_match_rsp_cb(common.modulemanager modules)
        {
        }

    }

    public class client_match_caller {
        public static client_match_rsp_cb rsp_cb_client_match_handle = null;
        private ThreadLocal<client_match_hubproxy> _hubproxy;
        public client_match_caller(client.client _client_handle) 
        {
            if (rsp_cb_client_match_handle == null)
            {
                rsp_cb_client_match_handle = new client_match_rsp_cb(_client_handle.modulemanager);
            }

            _hubproxy = new ThreadLocal<client_match_hubproxy>();
        }

        public client_match_hubproxy get_hub(string hub_name)
        {
            if (_hubproxy.Value == null)
{
                _hubproxy.Value = new client_match_hubproxy(_client_handle, rsp_cb_client_match_handle);
            }
            _hubproxy.Value.hub_name_a67a32be_6a98_3d05_88d9_696d83c9d775 = hub_name;
            return _hubproxy.Value;
        }

    }

    public class client_match_hubproxy {
        public string hub_name_a67a32be_6a98_3d05_88d9_696d83c9d775;
        private Int32 uuid_a67a32be_6a98_3d05_88d9_696d83c9d775 = (Int32)RandomUUID.random();

        public client.client _client_handle;
        public client_match_rsp_cb rsp_cb_client_match_handle;

        public client_match_hubproxy(client.client client_handle_, client_match_rsp_cb rsp_cb_client_match_handle_)
        {
            _client_handle = client_handle_;
            rsp_cb_client_match_handle = rsp_cb_client_match_handle_;
        }

        public void start_match(playground _playground){
            var _argv_5d1645a8_78f1_3219_bb7e_d14f420c9e1d = new ArrayList();
            _argv_5d1645a8_78f1_3219_bb7e_d14f420c9e1d.Add((int)_playground);
            _client_handle.call_hub(hub_name_a67a32be_6a98_3d05_88d9_696d83c9d775, "client_match_start_match", _argv_5d1645a8_78f1_3219_bb7e_d14f420c9e1d);
        }

    }
    public class client_room_player_create_room_cb
    {
        private UInt64 cb_uuid;
        private client_room_player_rsp_cb module_rsp_cb;

        public client_room_player_create_room_cb(UInt64 _cb_uuid, client_room_player_rsp_cb _module_rsp_cb)
        {
            cb_uuid = _cb_uuid;
            module_rsp_cb = _module_rsp_cb;
        }

        public event Action<string, room_info> on_create_room_cb;
        public event Action<Int32> on_create_room_err;
        public event Action on_create_room_timeout;

        public client_room_player_create_room_cb callBack(Action<string, room_info> cb, Action<Int32> err)
        {
            on_create_room_cb += cb;
            on_create_room_err += err;
            return this;
        }

        public void timeout(UInt64 tick, Action timeout_cb)
        {
            TinyTimer.add_timer(tick, ()=>{
                module_rsp_cb.create_room_timeout(cb_uuid);
            });
            on_create_room_timeout += timeout_cb;
        }

        public void call_cb(string room_hub_name, room_info _room_info)
        {
            if (on_create_room_cb != null)
            {
                on_create_room_cb(room_hub_name, _room_info);
            }
        }

        public void call_err(Int32 err)
        {
            if (on_create_room_err != null)
            {
                on_create_room_err(err);
            }
        }

        public void call_timeout()
        {
            if (on_create_room_timeout != null)
            {
                on_create_room_timeout();
            }
        }

    }

    public class client_room_player_agree_join_room_cb
    {
        private UInt64 cb_uuid;
        private client_room_player_rsp_cb module_rsp_cb;

        public client_room_player_agree_join_room_cb(UInt64 _cb_uuid, client_room_player_rsp_cb _module_rsp_cb)
        {
            cb_uuid = _cb_uuid;
            module_rsp_cb = _module_rsp_cb;
        }

        public event Action<string, room_info> on_agree_join_room_cb;
        public event Action<Int32> on_agree_join_room_err;
        public event Action on_agree_join_room_timeout;

        public client_room_player_agree_join_room_cb callBack(Action<string, room_info> cb, Action<Int32> err)
        {
            on_agree_join_room_cb += cb;
            on_agree_join_room_err += err;
            return this;
        }

        public void timeout(UInt64 tick, Action timeout_cb)
        {
            TinyTimer.add_timer(tick, ()=>{
                module_rsp_cb.agree_join_room_timeout(cb_uuid);
            });
            on_agree_join_room_timeout += timeout_cb;
        }

        public void call_cb(string room_hub_name, room_info _room_info)
        {
            if (on_agree_join_room_cb != null)
            {
                on_agree_join_room_cb(room_hub_name, _room_info);
            }
        }

        public void call_err(Int32 err)
        {
            if (on_agree_join_room_err != null)
            {
                on_agree_join_room_err(err);
            }
        }

        public void call_timeout()
        {
            if (on_agree_join_room_timeout != null)
            {
                on_agree_join_room_timeout();
            }
        }

    }

/*this cb code is codegen by abelkhan for c#*/
    public class client_room_player_rsp_cb : common.imodule {
        public Dictionary<UInt64, client_room_player_create_room_cb> map_create_room;
        public Dictionary<UInt64, client_room_player_agree_join_room_cb> map_agree_join_room;
        public client_room_player_rsp_cb(common.modulemanager modules)
        {
            map_create_room = new Dictionary<UInt64, client_room_player_create_room_cb>();
            modules.add_mothed("client_room_player_rsp_cb_create_room_rsp", create_room_rsp);
            modules.add_mothed("client_room_player_rsp_cb_create_room_err", create_room_err);
            map_agree_join_room = new Dictionary<UInt64, client_room_player_agree_join_room_cb>();
            modules.add_mothed("client_room_player_rsp_cb_agree_join_room_rsp", agree_join_room_rsp);
            modules.add_mothed("client_room_player_rsp_cb_agree_join_room_err", agree_join_room_err);
        }

        public void create_room_rsp(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _room_hub_name = ((MsgPack.MessagePackObject)inArray[1]).AsString();
            var __room_info = room_info.protcol_to_room_info(((MsgPack.MessagePackObject)inArray[2]).AsDictionary());
            var rsp = try_get_and_del_create_room_cb(uuid);
            if (rsp != null)
            {
                rsp.call_cb(_room_hub_name, __room_info);
            }
        }

        public void create_room_err(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _err = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var rsp = try_get_and_del_create_room_cb(uuid);
            if (rsp != null)
            {
                rsp.call_err(_err);
            }
        }

        public void create_room_timeout(UInt64 cb_uuid){
            var rsp = try_get_and_del_create_room_cb(cb_uuid);
            if (rsp != null){
                rsp.call_timeout();
            }
        }

        private client_room_player_create_room_cb try_get_and_del_create_room_cb(UInt64 uuid){
            lock(map_create_room)
            {
                if (map_create_room.TryGetValue(uuid, out client_room_player_create_room_cb rsp))
                {
                    map_create_room.Remove(uuid);
                }
                return rsp;
            }
        }

        public void agree_join_room_rsp(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _room_hub_name = ((MsgPack.MessagePackObject)inArray[1]).AsString();
            var __room_info = room_info.protcol_to_room_info(((MsgPack.MessagePackObject)inArray[2]).AsDictionary());
            var rsp = try_get_and_del_agree_join_room_cb(uuid);
            if (rsp != null)
            {
                rsp.call_cb(_room_hub_name, __room_info);
            }
        }

        public void agree_join_room_err(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _err = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var rsp = try_get_and_del_agree_join_room_cb(uuid);
            if (rsp != null)
            {
                rsp.call_err(_err);
            }
        }

        public void agree_join_room_timeout(UInt64 cb_uuid){
            var rsp = try_get_and_del_agree_join_room_cb(cb_uuid);
            if (rsp != null){
                rsp.call_timeout();
            }
        }

        private client_room_player_agree_join_room_cb try_get_and_del_agree_join_room_cb(UInt64 uuid){
            lock(map_agree_join_room)
            {
                if (map_agree_join_room.TryGetValue(uuid, out client_room_player_agree_join_room_cb rsp))
                {
                    map_agree_join_room.Remove(uuid);
                }
                return rsp;
            }
        }

    }

    public class client_room_player_caller {
        public static client_room_player_rsp_cb rsp_cb_client_room_player_handle = null;
        private ThreadLocal<client_room_player_hubproxy> _hubproxy;
        public client_room_player_caller(client.client _client_handle) 
        {
            if (rsp_cb_client_room_player_handle == null)
            {
                rsp_cb_client_room_player_handle = new client_room_player_rsp_cb(_client_handle.modulemanager);
            }

            _hubproxy = new ThreadLocal<client_room_player_hubproxy>();
        }

        public client_room_player_hubproxy get_hub(string hub_name)
        {
            if (_hubproxy.Value == null)
{
                _hubproxy.Value = new client_room_player_hubproxy(_client_handle, rsp_cb_client_room_player_handle);
            }
            _hubproxy.Value.hub_name_8bda7395_33b3_34a3_bd3e_b6d6b2ba9cb2 = hub_name;
            return _hubproxy.Value;
        }

    }

    public class client_room_player_hubproxy {
        public string hub_name_8bda7395_33b3_34a3_bd3e_b6d6b2ba9cb2;
        private Int32 uuid_8bda7395_33b3_34a3_bd3e_b6d6b2ba9cb2 = (Int32)RandomUUID.random();

        public client.client _client_handle;
        public client_room_player_rsp_cb rsp_cb_client_room_player_handle;

        public client_room_player_hubproxy(client.client client_handle_, client_room_player_rsp_cb rsp_cb_client_room_player_handle_)
        {
            _client_handle = client_handle_;
            rsp_cb_client_room_player_handle = rsp_cb_client_room_player_handle_;
        }

        public client_room_player_create_room_cb create_room(playground _playground){
            var uuid_596b5288_d0f2_52ea_802a_a61621d93808 = (UInt64)Interlocked.Increment(ref uuid_8bda7395_33b3_34a3_bd3e_b6d6b2ba9cb2);

            var _argv_0f87a215_0b4f_3a78_9d92_9bd3f4aa6dee = new ArrayList();
            _argv_0f87a215_0b4f_3a78_9d92_9bd3f4aa6dee.Add(uuid_596b5288_d0f2_52ea_802a_a61621d93808);
            _argv_0f87a215_0b4f_3a78_9d92_9bd3f4aa6dee.Add((int)_playground);
            _client_handle.call_hub(hub_name_8bda7395_33b3_34a3_bd3e_b6d6b2ba9cb2, "client_room_player_create_room", _argv_0f87a215_0b4f_3a78_9d92_9bd3f4aa6dee);

            var cb_create_room_obj = new client_room_player_create_room_cb(uuid_596b5288_d0f2_52ea_802a_a61621d93808, rsp_cb_client_room_player_handle);
            lock(rsp_cb_client_room_player_handle.map_create_room)
            {                rsp_cb_client_room_player_handle.map_create_room.Add(uuid_596b5288_d0f2_52ea_802a_a61621d93808, cb_create_room_obj);
            }            return cb_create_room_obj;
        }

        public void invite_role_join_room(string sdk_uuid){
            var _argv_4afdf6f4_2ff9_314b_9be9_c6d0fa96e4f8 = new ArrayList();
            _argv_4afdf6f4_2ff9_314b_9be9_c6d0fa96e4f8.Add(sdk_uuid);
            _client_handle.call_hub(hub_name_8bda7395_33b3_34a3_bd3e_b6d6b2ba9cb2, "client_room_player_invite_role_join_room", _argv_4afdf6f4_2ff9_314b_9be9_c6d0fa96e4f8);
        }

        public client_room_player_agree_join_room_cb agree_join_room(string room_id){
            var uuid_2b5aaead_9c5d_5e1b_b2f5_62a6bfb42fe9 = (UInt64)Interlocked.Increment(ref uuid_8bda7395_33b3_34a3_bd3e_b6d6b2ba9cb2);

            var _argv_dd5a04d0_146c_30d4_bf08_5551c02a714b = new ArrayList();
            _argv_dd5a04d0_146c_30d4_bf08_5551c02a714b.Add(uuid_2b5aaead_9c5d_5e1b_b2f5_62a6bfb42fe9);
            _argv_dd5a04d0_146c_30d4_bf08_5551c02a714b.Add(room_id);
            _client_handle.call_hub(hub_name_8bda7395_33b3_34a3_bd3e_b6d6b2ba9cb2, "client_room_player_agree_join_room", _argv_dd5a04d0_146c_30d4_bf08_5551c02a714b);

            var cb_agree_join_room_obj = new client_room_player_agree_join_room_cb(uuid_2b5aaead_9c5d_5e1b_b2f5_62a6bfb42fe9, rsp_cb_client_room_player_handle);
            lock(rsp_cb_client_room_player_handle.map_agree_join_room)
            {                rsp_cb_client_room_player_handle.map_agree_join_room.Add(uuid_2b5aaead_9c5d_5e1b_b2f5_62a6bfb42fe9, cb_agree_join_room_obj);
            }            return cb_agree_join_room_obj;
        }

    }
    public class client_friend_lobby_find_role_cb
    {
        private UInt64 cb_uuid;
        private client_friend_lobby_rsp_cb module_rsp_cb;

        public client_friend_lobby_find_role_cb(UInt64 _cb_uuid, client_friend_lobby_rsp_cb _module_rsp_cb)
        {
            cb_uuid = _cb_uuid;
            module_rsp_cb = _module_rsp_cb;
        }

        public event Action<List<player_friend_info>> on_find_role_cb;
        public event Action<Int32> on_find_role_err;
        public event Action on_find_role_timeout;

        public client_friend_lobby_find_role_cb callBack(Action<List<player_friend_info>> cb, Action<Int32> err)
        {
            on_find_role_cb += cb;
            on_find_role_err += err;
            return this;
        }

        public void timeout(UInt64 tick, Action timeout_cb)
        {
            TinyTimer.add_timer(tick, ()=>{
                module_rsp_cb.find_role_timeout(cb_uuid);
            });
            on_find_role_timeout += timeout_cb;
        }

        public void call_cb(List<player_friend_info> find_info)
        {
            if (on_find_role_cb != null)
            {
                on_find_role_cb(find_info);
            }
        }

        public void call_err(Int32 err)
        {
            if (on_find_role_err != null)
            {
                on_find_role_err(err);
            }
        }

        public void call_timeout()
        {
            if (on_find_role_timeout != null)
            {
                on_find_role_timeout();
            }
        }

    }

    public class client_friend_lobby_get_friend_list_cb
    {
        private UInt64 cb_uuid;
        private client_friend_lobby_rsp_cb module_rsp_cb;

        public client_friend_lobby_get_friend_list_cb(UInt64 _cb_uuid, client_friend_lobby_rsp_cb _module_rsp_cb)
        {
            cb_uuid = _cb_uuid;
            module_rsp_cb = _module_rsp_cb;
        }

        public event Action<List<player_friend_info>> on_get_friend_list_cb;
        public event Action<Int32> on_get_friend_list_err;
        public event Action on_get_friend_list_timeout;

        public client_friend_lobby_get_friend_list_cb callBack(Action<List<player_friend_info>> cb, Action<Int32> err)
        {
            on_get_friend_list_cb += cb;
            on_get_friend_list_err += err;
            return this;
        }

        public void timeout(UInt64 tick, Action timeout_cb)
        {
            TinyTimer.add_timer(tick, ()=>{
                module_rsp_cb.get_friend_list_timeout(cb_uuid);
            });
            on_get_friend_list_timeout += timeout_cb;
        }

        public void call_cb(List<player_friend_info> friend_list)
        {
            if (on_get_friend_list_cb != null)
            {
                on_get_friend_list_cb(friend_list);
            }
        }

        public void call_err(Int32 err)
        {
            if (on_get_friend_list_err != null)
            {
                on_get_friend_list_err(err);
            }
        }

        public void call_timeout()
        {
            if (on_get_friend_list_timeout != null)
            {
                on_get_friend_list_timeout();
            }
        }

    }

/*this cb code is codegen by abelkhan for c#*/
    public class client_friend_lobby_rsp_cb : common.imodule {
        public Dictionary<UInt64, client_friend_lobby_find_role_cb> map_find_role;
        public Dictionary<UInt64, client_friend_lobby_get_friend_list_cb> map_get_friend_list;
        public client_friend_lobby_rsp_cb(common.modulemanager modules)
        {
            map_find_role = new Dictionary<UInt64, client_friend_lobby_find_role_cb>();
            modules.add_mothed("client_friend_lobby_rsp_cb_find_role_rsp", find_role_rsp);
            modules.add_mothed("client_friend_lobby_rsp_cb_find_role_err", find_role_err);
            map_get_friend_list = new Dictionary<UInt64, client_friend_lobby_get_friend_list_cb>();
            modules.add_mothed("client_friend_lobby_rsp_cb_get_friend_list_rsp", get_friend_list_rsp);
            modules.add_mothed("client_friend_lobby_rsp_cb_get_friend_list_err", get_friend_list_err);
        }

        public void find_role_rsp(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _find_info = new List<player_friend_info>();
            var _protocol_arrayfind_info = ((MsgPack.MessagePackObject)inArray[1]).AsList();
            foreach (var v_59f70070_d69e_56a1_8b2e_e05a940a595f in _protocol_arrayfind_info){
                _find_info.Add(player_friend_info.protcol_to_player_friend_info(((MsgPack.MessagePackObject)v_59f70070_d69e_56a1_8b2e_e05a940a595f).AsDictionary()));
            }
            var rsp = try_get_and_del_find_role_cb(uuid);
            if (rsp != null)
            {
                rsp.call_cb(_find_info);
            }
        }

        public void find_role_err(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _err = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var rsp = try_get_and_del_find_role_cb(uuid);
            if (rsp != null)
            {
                rsp.call_err(_err);
            }
        }

        public void find_role_timeout(UInt64 cb_uuid){
            var rsp = try_get_and_del_find_role_cb(cb_uuid);
            if (rsp != null){
                rsp.call_timeout();
            }
        }

        private client_friend_lobby_find_role_cb try_get_and_del_find_role_cb(UInt64 uuid){
            lock(map_find_role)
            {
                if (map_find_role.TryGetValue(uuid, out client_friend_lobby_find_role_cb rsp))
                {
                    map_find_role.Remove(uuid);
                }
                return rsp;
            }
        }

        public void get_friend_list_rsp(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _friend_list = new List<player_friend_info>();
            var _protocol_arrayfriend_list = ((MsgPack.MessagePackObject)inArray[1]).AsList();
            foreach (var v_437ff999_4551_5d8c_8d22_dedd3b275633 in _protocol_arrayfriend_list){
                _friend_list.Add(player_friend_info.protcol_to_player_friend_info(((MsgPack.MessagePackObject)v_437ff999_4551_5d8c_8d22_dedd3b275633).AsDictionary()));
            }
            var rsp = try_get_and_del_get_friend_list_cb(uuid);
            if (rsp != null)
            {
                rsp.call_cb(_friend_list);
            }
        }

        public void get_friend_list_err(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _err = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var rsp = try_get_and_del_get_friend_list_cb(uuid);
            if (rsp != null)
            {
                rsp.call_err(_err);
            }
        }

        public void get_friend_list_timeout(UInt64 cb_uuid){
            var rsp = try_get_and_del_get_friend_list_cb(cb_uuid);
            if (rsp != null){
                rsp.call_timeout();
            }
        }

        private client_friend_lobby_get_friend_list_cb try_get_and_del_get_friend_list_cb(UInt64 uuid){
            lock(map_get_friend_list)
            {
                if (map_get_friend_list.TryGetValue(uuid, out client_friend_lobby_get_friend_list_cb rsp))
                {
                    map_get_friend_list.Remove(uuid);
                }
                return rsp;
            }
        }

    }

    public class client_friend_lobby_caller {
        public static client_friend_lobby_rsp_cb rsp_cb_client_friend_lobby_handle = null;
        private ThreadLocal<client_friend_lobby_hubproxy> _hubproxy;
        public client_friend_lobby_caller(client.client _client_handle) 
        {
            if (rsp_cb_client_friend_lobby_handle == null)
            {
                rsp_cb_client_friend_lobby_handle = new client_friend_lobby_rsp_cb(_client_handle.modulemanager);
            }

            _hubproxy = new ThreadLocal<client_friend_lobby_hubproxy>();
        }

        public client_friend_lobby_hubproxy get_hub(string hub_name)
        {
            if (_hubproxy.Value == null)
{
                _hubproxy.Value = new client_friend_lobby_hubproxy(_client_handle, rsp_cb_client_friend_lobby_handle);
            }
            _hubproxy.Value.hub_name_f2e2d46a_373f_3b99_b818_f5e5b675f4da = hub_name;
            return _hubproxy.Value;
        }

    }

    public class client_friend_lobby_hubproxy {
        public string hub_name_f2e2d46a_373f_3b99_b818_f5e5b675f4da;
        private Int32 uuid_f2e2d46a_373f_3b99_b818_f5e5b675f4da = (Int32)RandomUUID.random();

        public client.client _client_handle;
        public client_friend_lobby_rsp_cb rsp_cb_client_friend_lobby_handle;

        public client_friend_lobby_hubproxy(client.client client_handle_, client_friend_lobby_rsp_cb rsp_cb_client_friend_lobby_handle_)
        {
            _client_handle = client_handle_;
            rsp_cb_client_friend_lobby_handle = rsp_cb_client_friend_lobby_handle_;
        }

        public client_friend_lobby_find_role_cb find_role(Int64 guid){
            var uuid_23e9c7cc_ac81_5213_8bc2_d73a51d7f87b = (UInt64)Interlocked.Increment(ref uuid_f2e2d46a_373f_3b99_b818_f5e5b675f4da);

            var _argv_ba126e3b_fd75_3aa1_a5be_1d096547ca8f = new ArrayList();
            _argv_ba126e3b_fd75_3aa1_a5be_1d096547ca8f.Add(uuid_23e9c7cc_ac81_5213_8bc2_d73a51d7f87b);
            _argv_ba126e3b_fd75_3aa1_a5be_1d096547ca8f.Add(guid);
            _client_handle.call_hub(hub_name_f2e2d46a_373f_3b99_b818_f5e5b675f4da, "client_friend_lobby_find_role", _argv_ba126e3b_fd75_3aa1_a5be_1d096547ca8f);

            var cb_find_role_obj = new client_friend_lobby_find_role_cb(uuid_23e9c7cc_ac81_5213_8bc2_d73a51d7f87b, rsp_cb_client_friend_lobby_handle);
            lock(rsp_cb_client_friend_lobby_handle.map_find_role)
            {                rsp_cb_client_friend_lobby_handle.map_find_role.Add(uuid_23e9c7cc_ac81_5213_8bc2_d73a51d7f87b, cb_find_role_obj);
            }            return cb_find_role_obj;
        }

        public void invite_role_friend(player_friend_info self_info, player_friend_info target_info){
            var _argv_7b2d0e53_b589_37f7_a9bc_31fcce44d278 = new ArrayList();
            _argv_7b2d0e53_b589_37f7_a9bc_31fcce44d278.Add(player_friend_info.player_friend_info_to_protcol(self_info));
            _argv_7b2d0e53_b589_37f7_a9bc_31fcce44d278.Add(player_friend_info.player_friend_info_to_protcol(target_info));
            _client_handle.call_hub(hub_name_f2e2d46a_373f_3b99_b818_f5e5b675f4da, "client_friend_lobby_invite_role_friend", _argv_7b2d0e53_b589_37f7_a9bc_31fcce44d278);
        }

        public void agree_role_friend(Int64 invite_guid, bool be_agree){
            var _argv_1f120946_a2d8_34bf_a794_941de0d70f98 = new ArrayList();
            _argv_1f120946_a2d8_34bf_a794_941de0d70f98.Add(invite_guid);
            _argv_1f120946_a2d8_34bf_a794_941de0d70f98.Add(be_agree);
            _client_handle.call_hub(hub_name_f2e2d46a_373f_3b99_b818_f5e5b675f4da, "client_friend_lobby_agree_role_friend", _argv_1f120946_a2d8_34bf_a794_941de0d70f98);
        }

        public client_friend_lobby_get_friend_list_cb get_friend_list(){
            var uuid_4646fc9a_812d_55f5_b3d3_3c578d4da2da = (UInt64)Interlocked.Increment(ref uuid_f2e2d46a_373f_3b99_b818_f5e5b675f4da);

            var _argv_89f7345c_eb0f_36da_8e5e_c32eac488465 = new ArrayList();
            _argv_89f7345c_eb0f_36da_8e5e_c32eac488465.Add(uuid_4646fc9a_812d_55f5_b3d3_3c578d4da2da);
            _client_handle.call_hub(hub_name_f2e2d46a_373f_3b99_b818_f5e5b675f4da, "client_friend_lobby_get_friend_list", _argv_89f7345c_eb0f_36da_8e5e_c32eac488465);

            var cb_get_friend_list_obj = new client_friend_lobby_get_friend_list_cb(uuid_4646fc9a_812d_55f5_b3d3_3c578d4da2da, rsp_cb_client_friend_lobby_handle);
            lock(rsp_cb_client_friend_lobby_handle.map_get_friend_list)
            {                rsp_cb_client_friend_lobby_handle.map_get_friend_list.Add(uuid_4646fc9a_812d_55f5_b3d3_3c578d4da2da, cb_get_friend_list_obj);
            }            return cb_get_friend_list_obj;
        }

    }

}
