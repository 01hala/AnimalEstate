import * as cli from "../serverSDK/client_handle"
import * as common from "../serverSDK/common"

import * as friend_caller from "../serverSDK/ccallplayer"
import * as friend_module from "../serverSDK/playercallc"

import * as login from "./netLogin"

export class netFriend {
    private login_handle : login.netLogin;

    private _friend_caller : friend_caller.client_friend_lobby_caller;
    private friend_module : friend_module.player_friend_client_module;
    
    public constructor(_login : login.netLogin) {
        this.login_handle = _login;

        this._friend_caller = new friend_caller.client_friend_lobby_caller(cli.cli_handle);

        this.friend_module = new friend_module.player_friend_client_module(cli.cli_handle);
        this.friend_module.cb_invite_role_friend = this.on_cb_invite_role_friend.bind(this);
        this.friend_module.cb_agree_role_friend = this.on_cb_agree_role_friend.bind(this);
    }

    public find_role(guid : number) : friend_caller.client_friend_lobby_find_role_cb  {
        return this._friend_caller.get_hub(this.login_handle.player_name).find_role(guid);
    }

    public invite_role_friend(self_info:common.player_friend_info, target_info:common.player_friend_info) {
        this._friend_caller.get_hub(this.login_handle.player_name).invite_role_friend(self_info, target_info);
    }

    public agree_role_friend(invite_guid:number, be_agree:boolean) {
        this._friend_caller.get_hub(this.login_handle.player_name).agree_role_friend(invite_guid, be_agree);
    }

    public get_friend_list() : friend_caller.client_friend_lobby_get_friend_list_cb {
        return this._friend_caller.get_hub(this.login_handle.player_name).get_friend_list();
    }

    private check_in_list(invite_player:common.player_friend_info, invite_list:common.player_friend_info[]) : boolean {
        for (let player of invite_list) {
            if (player.guid == invite_player.guid) {
                return true;
            }
        }
        return false;
    }

    public cb_be_invite_role_friend : (invite_player:common.player_friend_info)=>void;
    private on_cb_invite_role_friend(invite_player:common.player_friend_info) {
        console.log("on_cb_invite_role_friend!");
        if (!this.check_in_list(invite_player, this.login_handle.player_info.invite_list)) {
            this.login_handle.player_info.invite_list.push(invite_player);
        }
        if (this.cb_be_invite_role_friend) {
            this.cb_be_invite_role_friend.call(null, invite_player);
            let rsp = this.friend_module.rsp as friend_module.player_friend_client_invite_role_friend_rsp;
            rsp.rsp();
        }
    }

    public cb_be_agree_role_friend : (target_player:common.player_friend_info)=>void;
    private on_cb_agree_role_friend(target_player:common.player_friend_info) {
        if (this.cb_be_agree_role_friend) {
            this.cb_be_agree_role_friend.call(null, target_player);
            let rsp = this.friend_module.rsp as friend_module.player_friend_client_agree_role_friend_rsp;
            rsp.rsp();
        }
    }
}