import * as cli from "../serverSDK/client_handle"
import * as common from "../serverSDK/common"

import * as client_game_caller from "../serverSDK/ccallgame"
import * as game_client_module from "../serverSDK/gamecallc"

import * as login from "./netLogin"
import { netSingleton } from "./netSingleton"

export class netGame {
    private login_handle : login.netLogin;

    public game_hub_name : string;
    private game_caller : client_game_caller.game_caller;

    private game_call_client_module : game_client_module.game_client_module;

    public constructor(_login : login.netLogin) {
        this.login_handle = _login;

        this.game_caller = new client_game_caller.game_caller(cli.cli_handle);

        this.game_call_client_module = new game_client_module.game_client_module(cli.cli_handle);
        this.game_call_client_module.cb_game_wait_start_info = this.on_cb_game_wait_start_info.bind(this);
        this.game_call_client_module.cb_game_info = this.on_cb_game_info.bind(this);
        this.game_call_client_module.cb_animal_order = this.on_cb_animal_order.bind(this);
        this.game_call_client_module.cb_ntf_effect_info = this.on_cb_ntf_effect_info.bind(this);
        this.game_call_client_module.cb_ntf_new_effect_info = this.on_cb_ntf_new_effect_info.bind(this);
        this.game_call_client_module.cb_remove_effect = this.on_cb_remove_effect.bind(this);
        this.game_call_client_module.cb_remove_muddy = this.on_cb_remove_muddy.bind(this);
        this.game_call_client_module.cb_ntf_player_stepped_effect = this.on_cb_ntf_player_stepped_effect.bind(this);
        this.game_call_client_module.cb_ntf_prop_info = this.on_cb_ntf_prop_info.bind(this);
        this.game_call_client_module.cb_ntf_new_prop_info = this.on_cb_ntf_new_prop_info.bind(this);
        this.game_call_client_module.cb_remove_prop = this.on_cb_remove_prop.bind(this);
        this.game_call_client_module.cb_ntf_player_prop_list = this.on_cb_ntf_player_prop_list.bind(this);
        this.game_call_client_module.cb_ntf_player_stepped_prop = this.on_cb_ntf_player_stepped_prop.bind(this);
        this.game_call_client_module.cb_turn_player_round = this.on_cb_turn_player_round.bind(this);
        this.game_call_client_module.cb_ntf_player_auto = this.on_cb_ntf_player_auto.bind(this);
        this.game_call_client_module.cb_start_throw_dice = this.on_cb_start_dice.bind(this);
        this.game_call_client_module.cb_throw_dice = this.on_cb_throw_dice.bind(this);
        this.game_call_client_module.cb_choose_dice = this.on_cb_choose_dice.bind(this);
        this.game_call_client_module.cb_rabbit_choose_dice = this.on_cb_rabbit_choose_dice.bind(this);
        this.game_call_client_module.cb_move = this.on_cb_move.bind(this);
        this.game_call_client_module.cb_ntf_animal_be_stepped = this.on_cb_ntf_animal_be_stepped.bind(this);
        this.game_call_client_module.cb_throw_animal = this.on_cb_throw_animal.bind(this);
        this.game_call_client_module.cb_throw_animal_ntf = this.on_cb_throw_animal_ntf.bind(this);
        this.game_call_client_module.cb_throw_animal_move = this.on_cb_throw_animal_move.bind(this);
        this.game_call_client_module.cb_animal_effect_touch_off = this.on_cb_animal_effect_touch_off.bind(this);
        this.game_call_client_module.cb_relay = this.on_cb_relay.bind(this);
        this.game_call_client_module.cb_use_skill = this.on_cb_use_skill.bind(this);
        this.game_call_client_module.cb_effect_move = this.on_cb_effect_move.bind(this);
        this.game_call_client_module.cb_use_props = this.on_cb_use_props.bind(this);
        this.game_call_client_module.cb_add_props = this.on_cb_add_props.bind(this);
	    this.game_call_client_module.cb_reverse_props = this.on_cb_reverse_props.bind(this);
        this.game_call_client_module.cb_immunity_props = this.on_cb_immunity_props.bind(this);
        this.game_call_client_module.cb_can_not_active_this_round = this.on_cb_can_not_active_this_round.bind(this);
    }

    public into_game(game_hub_name : string) {
        this.game_hub_name = game_hub_name;
        this.game_caller.get_hub(this.game_hub_name).into_game(this.login_handle.player_info.guid);
    }

    public play_order() {
        let player_game_info = netSingleton.game.get_player_game_info(this.login_handle.player_info.guid);
        this.game_caller.get_hub(this.game_hub_name).play_order(player_game_info.animal_info, player_game_info.skill_id);
    }

    public ready() {
        this.game_caller.get_hub(this.game_hub_name).ready();
    }

    public use_skill(target_guid:number, target_animal_index:number) {
        this.game_caller.get_hub(this.game_hub_name).use_skill(target_guid, target_animal_index);
    }

    public use_prop(props_id:common.props, target_guid:number, target_animal_index:number) {
        this.game_caller.get_hub(this.game_hub_name).use_props(props_id, target_guid, target_animal_index);
    }

    public throw_dice() {
        if (this.CurrentPlayerInfo && netSingleton.login.player_info.guid == this.CurrentPlayerInfo.guid) {
            console.log("dice!");
            this.game_caller.get_hub(this.game_hub_name).throw_dice();
        }
    }

    public choose_animal(animal_index:number) {
        this.game_caller.get_hub(this.game_hub_name).choose_animal(animal_index);
    }

    public cancel_auto() {
        this.game_caller.get_hub(this.game_hub_name).cancel_auto();
    }

    public get_playground_len(){
        if (this.Playground == common.playground.lakeside) {
            return 64;
        }

        return 0;
    }

    public Countdown:number;
    public Playground:common.playground;
    public CurrentPlayerInfo:common.player_game_info = null;
    public PlayerGameInfo:common.player_game_info[];
    public SelfPlayerInlineInfo:common.player_inline_info;
    public cb_game_wait_start_info : () => void;
    private on_cb_game_wait_start_info(countdown:number, _playground:common.playground, info:common.player_game_info[], self_info:common.player_inline_info) {
        this.Countdown = countdown;
        this.Playground = _playground;
        this.PlayerGameInfo = info;
        this.SelfPlayerInlineInfo = self_info;
        if (this.cb_game_wait_start_info) {
            this.cb_game_wait_start_info.call(null);
        }
    }

    public isInitGameInfo = false;
    public cb_game_info : () => void;
    private on_cb_game_info(_playground:common.playground, info:common.player_game_info[], round_player_guid:number) {
        this.Playground = _playground;
        console.log("this.Playground:", this.Playground);
        this.isInitGameInfo = true;
        this.PlayerGameInfo = info;
        for(let info of this.PlayerGameInfo) {
            if (info.guid == round_player_guid) {
                this.CurrentPlayerInfo = info;
            }
        }
        if (this.cb_game_info) {
            this.cb_game_info.call(null);
        }
    }

    public cb_animal_order : (() => void)[] = [];
    private on_cb_animal_order(guid:number, animal_info:common.animal_game_info[], skill_id:common.skill){
        for(let info of this.PlayerGameInfo) {
            if (info.guid == guid) {
                info.animal_info = animal_info;
                info.skill_id == skill_id;
                break;
            }
        }

        if (guid == this.login_handle.player_info.guid) {
            if (this.cb_animal_order.length > 0) {
                for (let cb of this.cb_animal_order) {
                    cb.call(null);
                }
            }
        }
    }

    public get_player_game_info(guid:number) {
        for(let info of this.PlayerGameInfo) {
            if (info.guid == guid) {
                return info;
            }
        }
        return null;
    }

    public effect_info_list:game_client_module.effect_info[] = null;
    public cb_ntf_effect_info : (info:game_client_module.effect_info[]) => void;
    private on_cb_ntf_effect_info(info:game_client_module.effect_info[]) {
        this.effect_info_list = info;
        if (this.cb_ntf_effect_info) {
            this.cb_ntf_effect_info.call(null, info);
        }
    }

    public cb_ntf_new_effect_info : (info:game_client_module.effect_info) => void;
    private on_cb_ntf_new_effect_info(info:game_client_module.effect_info) {
        if (this.cb_ntf_new_effect_info) {
            this.cb_ntf_new_effect_info.call(null, info);
        }
    }

    public cb_remove_effect : (grids:number) => void;
    private on_cb_remove_effect(grids:number) {
        if (this.cb_remove_effect) {
            this.cb_remove_effect.call(null, grids);
        }
    }

    public cb_remove_muddy : (grids:number[]) => void;
    private on_cb_remove_muddy(grids:number[]) {
        if (this.cb_remove_muddy) {
            this.cb_remove_muddy.call(null, grids);
        }
    }

    public cb_ntf_player_stepped_effect : (guid:number, effect_id:common.effect, grid:number, is_remove:boolean) => void;
    private on_cb_ntf_player_stepped_effect (guid:number, effect_id:common.effect, grid:number, is_remove:boolean) {
        if (this.cb_ntf_player_stepped_effect) {
            this.cb_ntf_player_stepped_effect.call(null, guid, effect_id, grid, is_remove);
        }
    }

    public prop_info_list:game_client_module.prop_info[] = null;
    public cb_ntf_prop_info : (info:game_client_module.prop_info[]) => void;
    private on_cb_ntf_prop_info(info:game_client_module.prop_info[]) {
        this.prop_info_list = info;
        if (this.cb_ntf_prop_info) {
            this.cb_ntf_prop_info.call(null, info);
        } 
    }

    public cb_ntf_new_prop_info : (info:game_client_module.prop_info) => void;
    private on_cb_ntf_new_prop_info(info:game_client_module.prop_info) {
        if (this.cb_ntf_new_prop_info) {
            this.cb_ntf_new_prop_info.call(null, info);
        } 
    }

    public cb_remove_prop : (grid:number) => void;
    private on_cb_remove_prop(grid:number) {
        if (this.cb_remove_prop) {
            this.cb_remove_prop.call(null, grid);
        }
    }

    public SelfPropList:common.props[] = null;
    public cb_ntf_player_prop_list : (prop_list:common.props[]) => void;
    private on_cb_ntf_player_prop_list(prop_list:common.props[]) {
        this.SelfPropList = prop_list;
        if (this.cb_ntf_player_prop_list) {
            this.cb_ntf_player_prop_list.call(null, prop_list);
        }
    }

    public cb_ntf_player_stepped_prop : (guid:number, prop_id:common.props) => void;
    private on_cb_ntf_player_stepped_prop(guid:number, prop_id:common.props) {
        if (this.cb_ntf_player_stepped_prop) {
            this.cb_ntf_player_stepped_prop.call(null, guid, prop_id);
        }
    }

    public current_guid:number = -4;
    public cb_turn_player_round : ((guid:number, active_state:common.play_active_state, animal_index:number, round:number) => void)[] = [];
    private on_cb_turn_player_round(guid:number, active_state:common.play_active_state, animal_index:number, round:number) {
        this.CurrentPlayerInfo = this.get_player_game_info(guid);
        this.current_guid = guid;
        for (let fn of this.cb_turn_player_round) {
            fn.call(null, guid, active_state, animal_index, round);
        }
    }

    public is_auto:boolean = false;
    public cb_ntf_player_auto : () => void;
    private on_cb_ntf_player_auto() {
        this.is_auto = true;
        if (this.cb_ntf_player_auto) {
            this.cb_ntf_player_auto.call(null);
        }
    }

    public cb_throw_dice : (guid:number, dice:number[]) => void;
    private on_cb_throw_dice(guid:number, dice:number[]) {
        if (this.cb_throw_dice) {
            this.cb_throw_dice.call(null, guid, dice);
        }
    }

    public choose_dice_rsp : game_client_module.game_client_choose_dice_rsp = null;
    public cb_choose_dice : () => void;
    private on_cb_choose_dice() {
        this.choose_dice_rsp = this.game_call_client_module.rsp;
        if (this.cb_choose_dice) {
            this.cb_choose_dice.call(null);
        }
    }

    public cb_rabbit_choose_dice : (dice:number) => void;
    private on_cb_rabbit_choose_dice(dice:number) {
        if (this.cb_rabbit_choose_dice) {
            this.cb_rabbit_choose_dice.call(null, dice);
        }
    }

    public cb_start_dice: (guid:number, animal_index:number) => void;
    private on_cb_start_dice(guid:number, animal_index:number) {
        if (this.cb_start_dice) {
            this.cb_start_dice.call(null, guid, animal_index);
        }
    }

    public cb_move : (guid:number, animal_index:number, move_coefficient:number, from:number, to:number) => void;
    private on_cb_move(guid:number, animal_index:number, move_coefficient:number, from:number, to:number) {
        if (this.cb_move) {
            this.cb_move.call(null, guid, animal_index, move_coefficient, from, to);
        }
    }

    public cb_ntf_animal_be_stepped : (guid:number, animal_index:number)=>void;
    private on_cb_ntf_animal_be_stepped(guid:number, animal_index:number) {
        if (this.cb_ntf_animal_be_stepped) {
            this.cb_ntf_animal_be_stepped.call(null, guid, animal_index);
        }
    }

    public throw_animal_rsp : game_client_module.game_client_throw_animal_rsp = null;
    public cb_throw_animal : (self_guid:number, guid:number, animal_index:number, target_pos:number[])=>void;
    private on_cb_throw_animal(self_guid:number, guid:number, animal_index:number, target_pos:number[]) {
        if (this.cb_throw_animal) {
            this.throw_animal_rsp = this.game_call_client_module.rsp;
            this.cb_throw_animal.call(null, self_guid, guid, animal_index, target_pos);
        }
    }

    public cb_throw_animal_ntf : (self_guid:number, guid:number, animal_index:number, target_pos:number[])=>void;
    private on_cb_throw_animal_ntf(self_guid:number, guid:number, animal_index:number, target_pos:number[]) {
        if (this.cb_throw_animal_ntf) {
            this.cb_throw_animal_ntf.call(null, self_guid, guid, animal_index, target_pos);
        }
    }

    public cb_throw_animal_move : (guid:number, animal_index:number, from:number, to:number)=>void;
    private on_cb_throw_animal_move(guid:number, animal_index:number, from:number, to:number) {
        if (this.cb_throw_animal_move) {
            this.cb_throw_animal_move.call(null, guid, animal_index, from, to);
        }
    }

    public cb_animal_effect_touch_off : (self_guid:number, self_animal_index:number, target_guid:number, target_animal_index:number)=>void;
    private on_cb_animal_effect_touch_off(self_guid:number, self_animal_index:number, target_guid:number, target_animal_index:number) {
        if (this.cb_animal_effect_touch_off) {
            this.cb_animal_effect_touch_off.call(null, self_guid, self_animal_index, target_guid, target_animal_index);
        }
    }

    public cb_relay : (guid:number, new_animal_index:number, is_follow:boolean) => void;
    private on_cb_relay(guid:number, new_animal_index:number, is_follow:boolean) {
        if (this.cb_relay) {
            this.cb_relay.call(null, guid, new_animal_index, is_follow);
        }
    }

    public cb_use_skill : (guid:number, animal_index:number, target_guid:number, target_animal_index:number) => void
    private on_cb_use_skill(guid:number, animal_index:number, target_guid:number, target_animal_index:number) {
        if (this.cb_use_skill) {
            this.cb_use_skill.call(null, guid, animal_index, target_guid, target_animal_index);
        }
    }

    public cb_effect_move : (effect_id:common.effect, guid:number, target_animal_index:number, from:number, to:number) => void;
    private on_cb_effect_move(effect_id:common.effect, guid:number, target_animal_index:number, from:number, to:number) {
        if (this.cb_effect_move) {
            this.cb_effect_move.call(null, effect_id, guid, target_animal_index, from, to);
        }
    }

    public cb_use_props : (props_id:common.props, guid:number, animal_index:number, target_guid:number, target_animal_index:number) => void;
    private on_cb_use_props(props_id:common.props, guid:number, animal_index:number, target_guid:number, target_animal_index:number) {
        if (this.cb_use_props) {
            this.cb_use_props.call(null, props_id, guid, animal_index, target_guid, target_animal_index);
        }
    }

    public cb_add_props : (add_type:game_client_module.enum_add_props_type, guid:number, props_id:common.props) => void;
    private on_cb_add_props(add_type:game_client_module.enum_add_props_type, guid:number, props_id:common.props) {
        if (this.cb_add_props) {
            this.cb_add_props.call(null, add_type, guid, props_id);
        }
    }

    public cb_reverse_props : (src_guid:number, target_guid:number, target_animal_index:number, props_id:common.props, reverse_target_guid:number, reverse_target_animal_index:number) => void;
    private on_cb_reverse_props(src_guid:number, target_guid:number, target_animal_index:number, props_id:common.props, reverse_target_guid:number, reverse_target_animal_index:number) {
        if (this.cb_reverse_props) {
            this.cb_reverse_props.call(null, src_guid, target_guid, target_animal_index, props_id, reverse_target_guid, reverse_target_animal_index);
        }
    }

    public cb_immunity_props : (guid:number, props_id:common.props, target_guid:number, target_animal_index:number) => void;
    private on_cb_immunity_props(guid:number, props_id:common.props, target_guid:number, target_animal_index:number) {
        if (this.cb_immunity_props) {
            this.cb_immunity_props.call(null, guid, props_id, target_guid, target_animal_index);
        }
    }

    public cb_can_not_active_this_round : (guid:number) => void;
    private on_cb_can_not_active_this_round(guid:number) {
        if (this.cb_can_not_active_this_round) {
            this.cb_can_not_active_this_round.call(null, guid);
        }
    }
}