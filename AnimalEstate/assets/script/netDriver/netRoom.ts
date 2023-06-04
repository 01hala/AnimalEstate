import * as cli from "../serverSDK/client_handle"
import * as common from "../serverSDK/common"

import * as client_call_player_room_caller from "../serverSDK/ccallplayer"
import * as client_call_room_caller from "../serverSDK/ccallroom"

import * as player_room_client from "../serverSDK/playercallc"
import * as room_client from "../serverSDK/roomcallc"

import * as login from "./netLogin"
import * as game from "./netGame"

export class netRoom {
    private login_handle : login.netLogin;
    private game_handle : game.netGame;

    private client_call_player_room_caller : client_call_player_room_caller.client_room_player_caller;
    private player_room_client_module : player_room_client.player_room_client_module;

    public room_hub_name : string;
    private ccallroom : client_call_room_caller.client_room_match_caller;

    private room_call_client : room_client.room_client_module;
    private room_match_call_client : room_client.room_match_client_module;

    public constructor(_login:login.netLogin, _game:game.netGame) {
        this.login_handle = _login;
        this.game_handle = _game;

        this.client_call_player_room_caller = new client_call_player_room_caller.client_room_player_caller(cli.cli_handle);

        this.player_room_client_module = new player_room_client.player_room_client_module(cli.cli_handle);
        this.player_room_client_module.cb_invite_role_join_room = this.on_cb_invite_role_join_room.bind(this);

        this.ccallroom = new client_call_room_caller.client_room_match_caller(cli.cli_handle);

        this.room_call_client = new room_client.room_client_module(cli.cli_handle);
        this.room_call_client.cb_refresh_room_info = this.on_cb_refresh_room_info.bind(this);
        this.room_call_client.cb_chat = this.on_cb_chat.bind(this);
        this.room_call_client.cb_room_is_free = this.on_cb_room_is_free.bind(this);
        this.room_call_client.cb_player_leave_room_success = this.on_cb_player_leave_room_success.bind(this);
        this.room_call_client.cb_be_kicked = this.on_cb_be_kicked.bind(this);
        this.room_call_client.cb_team_into_match = this.on_cb_team_into_match.bind(this);

        this.room_match_call_client = new room_client.room_match_client_module(cli.cli_handle);
        this.room_match_call_client.cb_role_into_game = this.on_cb_role_into_game.bind(this);
    }

    public ReInit() {
        this.cb_refresh_room_info = [];
    }

    public RoomInfo:common.room_info = null;
    public create_room_callback : (room_hub_name:string, _room_info:common.room_info) => void = null;
    public create_room(_playground : common.playground) {
        this.client_call_player_room_caller.get_hub(this.login_handle.player_name).create_room(_playground).callBack((room_hub_name, room_info)=>{
            if (this.create_room_callback) {
                this.room_hub_name = room_hub_name;
                this.RoomInfo = room_info;
                this.create_room_callback.call(null, room_hub_name, room_info);
            }
        }, (err)=>{
            console.log("create_room faild:" + err);
        }).timeout(3000, ()=>{
            console.log("create_room timeout");
        });
    }

    public agree_join_room_callback : (room_hub_name:string, _room_info:common.room_info)=>void = null;
    public agree_join_room(room_id : string) {
        this.client_call_player_room_caller.get_hub(this.login_handle.player_name).agree_join_room(room_id).callBack((room_hub_name, room_info)=>{
            if (this.agree_join_room_callback) {
                this.room_hub_name = room_hub_name;
                this.RoomInfo = room_info;
                this.agree_join_room_callback.call(null, room_hub_name, room_info);
            }
        }, (err)=>{
            console.log("agree_join_room faild:" + err);
        }).timeout(3000, ()=>{
            console.log("agree_join_room timeout");
        });
    }

    public invite_role_join_room(sdk_uuid : string) {
        this.client_call_player_room_caller.get_hub(this.login_handle.player_name).invite_role_join_room(sdk_uuid);
    }

    public cb_invite_role_join_room : (room_id:string, invite_role_name:string)=>void;
    private on_cb_invite_role_join_room(room_id:string, invite_role_name:string) {
        if (this.cb_invite_role_join_room) {
            this.cb_invite_role_join_room.call(null, room_id, invite_role_name);
        }
    }

    public into_room(room_hub_name : string) {
        this.room_hub_name = room_hub_name;
        this.ccallroom.get_hub(this.room_hub_name).into_room();
    }

    public chat(chat_str : string) {
        this.ccallroom.get_hub(this.room_hub_name).chat(chat_str);
    }

    public leave_room() {
        this.ccallroom.get_hub(this.room_hub_name).leave_room();
    }

    public kick_out(guid : number) {
        this.ccallroom.get_hub(this.room_hub_name).kick_out(guid);
    }

    public disband() {
        this.ccallroom.get_hub(this.room_hub_name).disband();
    }

    public start_match() {
        this.ccallroom.get_hub(this.room_hub_name).start_match();
    }

    public cb_refresh_room_info : ((info:common.room_info) => void)[] = [];
    private on_cb_refresh_room_info(info:common.room_info) {
        console.log("cb_refresh_room_info!!!");
        this.RoomInfo = info;
        if (this.cb_refresh_room_info) {
            for (let cb of this.cb_refresh_room_info) {
                cb.call(null, info);
            }
        }
    }

    public cb_chat : (chat_player_guid:number, chat_str:string) => void;
    private on_cb_chat(chat_player_guid:number, chat_str:string) {
        if (this.cb_chat) {
            this.cb_chat.call(null, chat_player_guid, chat_str)
        }
    }

    public cb_room_is_free : () => void;
    private on_cb_room_is_free() {
        if (this.cb_room_is_free) {
            this.cb_room_is_free.call(null);
            this.room_hub_name = "";
        }
    }

    private on_cb_player_leave_room_success() {
        this.room_hub_name = "";
    }

    public cb_be_kicked : () => void;
    private on_cb_be_kicked() {
        if (this.cb_be_kicked) {
            this.cb_be_kicked.call(null);
            this.room_hub_name = "";
        }
    }

    public cb_team_into_match : () => void;
    private on_cb_team_into_match() {
        if (this.cb_team_into_match) {
            this.cb_team_into_match.call(null);
        }
    }

    private on_cb_role_into_game(game_hub_name:string) {
        this.game_handle.into_game(game_hub_name);
    }
}