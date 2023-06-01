﻿using abelkhan;
using MsgPack.Serialization;
using Newtonsoft.Json.Linq;
using offline_msg;
using System;
using System.IO;
using System.Threading;
using static player.client_msg_handle;

namespace player
{
    public struct settle_info_msg
    {
        public game_settle_info _settle_info;
    }

    class game_msg_handle
    {
        private readonly game_player_module game_Player_Module;

        public game_msg_handle()
        {
            game_Player_Module = new game_player_module();
            game_Player_Module.on_settle += Game_Player_Module_on_settle;

            player.offline_Msg_Mng.register_offline_msg_callback("settle_info_msg", process_settle_info_msg);
        }

        private void process_settle_info_msg(offline_msg.offline_msg msg)
        {
            try
            {
                using var _tmp = constant.constant.rcStMgr.GetStream();
                _tmp.Write(msg.msg, 0, msg.msg.Length);
                _tmp.Position = 0;
                var _serializer = MessagePackSerializer.Get<settle_info_msg>();
                var _settle_info_msg = _serializer.Unpack(_tmp);

                var target_player = player.client_Mng.guid_get_client_proxy(long.Parse(msg.player_guid));
                target_player.settle(_settle_info_msg._settle_info);
                client_mng.PlayerGameClientCaller.get_client(target_player.uuid).settle(_settle_info_msg._settle_info);

                player.offline_Msg_Mng.del_offline_msg(msg.msg_guid);
            }
            catch (System.Exception ex)
            {
                log.log.err("process_settle_info_msg ex:{0}", ex);
            }
        }

        private void Game_Player_Module_on_settle(game_settle_info settle_info)
        {
            log.log.trace("on_settle begin!");

            try
            {
                foreach (var info in settle_info.settle_info)
                {
                    var _msg = new settle_info_msg()
                    {
                        _settle_info = settle_info
                    };
                    using var st = constant.constant.rcStMgr.GetStream();
                    var _serializer = MessagePackSerializer.Get<settle_info_msg>();
                    _serializer.Pack(st, _msg);

                    var _offline_msg = new offline_msg.offline_msg()
                    {
                        msg_guid = Guid.NewGuid().ToString("N"),
                        player_guid = info.guid.ToString(),
                        send_timetmp = service.timerservice.Tick,
                        msg_type = "settle_info_msg",
                        msg = st.ToArray(),
                    };
                    client_mng.forward_offline_msg(_offline_msg);
                }
            }
            catch (System.Exception ex)
            {
                log.log.err("Game_Player_Module_on_settle ex:{0}", ex);
            }
        }
    }
}
