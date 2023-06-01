﻿using abelkhan;
using MongoDB.Bson;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Threading;
using static System.Net.WebRequestMethods;

namespace player
{
    class login_msg_handle
    {
        private readonly login_player_module login_player_Module;

        public login_msg_handle()
        {
            login_player_Module = new login_player_module();

            login_player_Module.on_player_login += Login_player_Module_on_player_login;
        }

        private async void Login_player_Module_on_player_login(string code)
        {
            log.log.trace("on_player_login begin!");

            var rsp = login_player_Module.rsp as login_player_player_login_rsp;

            try
            {
                var ret = await wx.wxSdk.code2Session(player.appid, player.secret, code);
                var token = await player.client_Mng.token_player_login(ret.openid);
                rsp.rsp(token);
            }
            catch(System.Exception ex)
            {
                log.log.err($"{ex}");
                rsp.err((int)error.db_error);
            }
        }
    }
}
