import * as client_handle from "./client_handle";
import * as common from "./common";
/*this enum code is codegen by abelkhan codegen for ts*/

export enum enum_add_props_type{
    pick_up = 1,
    gacha_add = 2
}

/*this struct code is codegen by abelkhan codegen for typescript*/
export class effect_info
{
    public guid : number = 0;
    public grids : number[] = [];
    public effect_id : common.effect = common.effect.muddy;
    public continued_rounds : number = 0;

}

export function effect_info_to_protcol(_struct:effect_info){
    return _struct;
}

export function protcol_to_effect_info(_protocol:any){
    let _struct = new effect_info();
    for (const [key, val] of Object.entries(_protocol)) {
        if (key === "guid"){
            _struct.guid = val as number;
        }
        else if (key === "grids"){
            _struct.grids = [];
            for(let v_ of val as any){
                _struct.grids.push(v_);
            }
        }
        else if (key === "effect_id"){
            _struct.effect_id = val as common.effect;
        }
        else if (key === "continued_rounds"){
            _struct.continued_rounds = val as number;
        }
    }
    return _struct;
}

export class prop_info
{
    public grid : number = 0;
    public prop_id : common.props = common.props.none;
    public continued_rounds : number = 0;

}

export function prop_info_to_protcol(_struct:prop_info){
    return _struct;
}

export function protcol_to_prop_info(_protocol:any){
    let _struct = new prop_info();
    for (const [key, val] of Object.entries(_protocol)) {
        if (key === "grid"){
            _struct.grid = val as number;
        }
        else if (key === "prop_id"){
            _struct.prop_id = val as common.props;
        }
        else if (key === "continued_rounds"){
            _struct.continued_rounds = val as number;
        }
    }
    return _struct;
}

/*this module code is codegen by abelkhan codegen for typescript*/
export class game_client_choose_dice_rsp {
    private uuid_7ed84a95_822b_31ca_bfce_b880528f1fc1 : number;
    private hub_name_ffefe8e1_59c2_3292_8600_93dfa9b71e7f:string;
    private _client_handle:client_handle.client ;

    constructor(_client_handle_:client_handle.client, current_hub:string, _uuid:number){
        this._client_handle = _client_handle_;
        this.hub_name_ffefe8e1_59c2_3292_8600_93dfa9b71e7f = current_hub;
        this.uuid_7ed84a95_822b_31ca_bfce_b880528f1fc1 = _uuid;
    }

    public rsp(dice_index:number){
        let _argv_ffefe8e1_59c2_3292_8600_93dfa9b71e7f:any[] = [this.uuid_7ed84a95_822b_31ca_bfce_b880528f1fc1];
        _argv_ffefe8e1_59c2_3292_8600_93dfa9b71e7f.push(dice_index);
        this._client_handle.call_hub(this.hub_name_ffefe8e1_59c2_3292_8600_93dfa9b71e7f, "game_client_rsp_cb_choose_dice_rsp", _argv_ffefe8e1_59c2_3292_8600_93dfa9b71e7f);
    }

    public err(){
        let _argv_ffefe8e1_59c2_3292_8600_93dfa9b71e7f:any[] = [this.uuid_7ed84a95_822b_31ca_bfce_b880528f1fc1];
        this._client_handle.call_hub(this.hub_name_ffefe8e1_59c2_3292_8600_93dfa9b71e7f, "game_client_rsp_cb_choose_dice_err", _argv_ffefe8e1_59c2_3292_8600_93dfa9b71e7f);
    }

}

export class game_client_throw_animal_rsp {
    private uuid_02712198_786f_3dbf_bfa7_28e2b5e7591f : number;
    private hub_name_714173ef_315d_33be_bb9d_744035ce7024:string;
    private _client_handle:client_handle.client ;

    constructor(_client_handle_:client_handle.client, current_hub:string, _uuid:number){
        this._client_handle = _client_handle_;
        this.hub_name_714173ef_315d_33be_bb9d_744035ce7024 = current_hub;
        this.uuid_02712198_786f_3dbf_bfa7_28e2b5e7591f = _uuid;
    }

    public rsp(target_pos:number){
        let _argv_714173ef_315d_33be_bb9d_744035ce7024:any[] = [this.uuid_02712198_786f_3dbf_bfa7_28e2b5e7591f];
        _argv_714173ef_315d_33be_bb9d_744035ce7024.push(target_pos);
        this._client_handle.call_hub(this.hub_name_714173ef_315d_33be_bb9d_744035ce7024, "game_client_rsp_cb_throw_animal_rsp", _argv_714173ef_315d_33be_bb9d_744035ce7024);
    }

    public err(){
        let _argv_714173ef_315d_33be_bb9d_744035ce7024:any[] = [this.uuid_02712198_786f_3dbf_bfa7_28e2b5e7591f];
        this._client_handle.call_hub(this.hub_name_714173ef_315d_33be_bb9d_744035ce7024, "game_client_rsp_cb_throw_animal_err", _argv_714173ef_315d_33be_bb9d_744035ce7024);
    }

}

export class game_client_module extends client_handle.imodule {
    public _client_handle:client_handle.client;
    constructor(_client_handle_:client_handle.client){
        super();
        this._client_handle = _client_handle_;
        this._client_handle._modulemng.add_method("game_client_game_wait_start_info", this.game_wait_start_info.bind(this));
        this._client_handle._modulemng.add_method("game_client_game_info", this.game_info.bind(this));
        this._client_handle._modulemng.add_method("game_client_animal_order", this.animal_order.bind(this));
        this._client_handle._modulemng.add_method("game_client_ntf_effect_info", this.ntf_effect_info.bind(this));
        this._client_handle._modulemng.add_method("game_client_ntf_new_effect_info", this.ntf_new_effect_info.bind(this));
        this._client_handle._modulemng.add_method("game_client_remove_effect", this.remove_effect.bind(this));
        this._client_handle._modulemng.add_method("game_client_remove_muddy", this.remove_muddy.bind(this));
        this._client_handle._modulemng.add_method("game_client_ntf_player_stepped_effect", this.ntf_player_stepped_effect.bind(this));
        this._client_handle._modulemng.add_method("game_client_ntf_prop_info", this.ntf_prop_info.bind(this));
        this._client_handle._modulemng.add_method("game_client_ntf_new_prop_info", this.ntf_new_prop_info.bind(this));
        this._client_handle._modulemng.add_method("game_client_remove_prop", this.remove_prop.bind(this));
        this._client_handle._modulemng.add_method("game_client_ntf_player_stepped_prop", this.ntf_player_stepped_prop.bind(this));
        this._client_handle._modulemng.add_method("game_client_ntf_player_prop_list", this.ntf_player_prop_list.bind(this));
        this._client_handle._modulemng.add_method("game_client_turn_player_round", this.turn_player_round.bind(this));
        this._client_handle._modulemng.add_method("game_client_ntf_player_auto", this.ntf_player_auto.bind(this));
        this._client_handle._modulemng.add_method("game_client_relay", this.relay.bind(this));
        this._client_handle._modulemng.add_method("game_client_start_throw_dice", this.start_throw_dice.bind(this));
        this._client_handle._modulemng.add_method("game_client_throw_dice", this.throw_dice.bind(this));
        this._client_handle._modulemng.add_method("game_client_choose_dice", this.choose_dice.bind(this));
        this._client_handle._modulemng.add_method("game_client_rabbit_choose_dice", this.rabbit_choose_dice.bind(this));
        this._client_handle._modulemng.add_method("game_client_move", this.move.bind(this));
        this._client_handle._modulemng.add_method("game_client_animal_effect_touch_off", this.animal_effect_touch_off.bind(this));
        this._client_handle._modulemng.add_method("game_client_ntf_animal_be_stepped", this.ntf_animal_be_stepped.bind(this));
        this._client_handle._modulemng.add_method("game_client_throw_animal", this.throw_animal.bind(this));
        this._client_handle._modulemng.add_method("game_client_throw_animal_ntf", this.throw_animal_ntf.bind(this));
        this._client_handle._modulemng.add_method("game_client_throw_animal_move", this.throw_animal_move.bind(this));
        this._client_handle._modulemng.add_method("game_client_use_skill", this.use_skill.bind(this));
        this._client_handle._modulemng.add_method("game_client_effect_move", this.effect_move.bind(this));
        this._client_handle._modulemng.add_method("game_client_use_props", this.use_props.bind(this));
        this._client_handle._modulemng.add_method("game_client_add_props", this.add_props.bind(this));
        this._client_handle._modulemng.add_method("game_client_reverse_props", this.reverse_props.bind(this));
        this._client_handle._modulemng.add_method("game_client_immunity_props", this.immunity_props.bind(this));
        this._client_handle._modulemng.add_method("game_client_can_not_active_this_round", this.can_not_active_this_round.bind(this));

        this.cb_game_wait_start_info = null;
        this.cb_game_info = null;
        this.cb_animal_order = null;
        this.cb_ntf_effect_info = null;
        this.cb_ntf_new_effect_info = null;
        this.cb_remove_effect = null;
        this.cb_remove_muddy = null;
        this.cb_ntf_player_stepped_effect = null;
        this.cb_ntf_prop_info = null;
        this.cb_ntf_new_prop_info = null;
        this.cb_remove_prop = null;
        this.cb_ntf_player_stepped_prop = null;
        this.cb_ntf_player_prop_list = null;
        this.cb_turn_player_round = null;
        this.cb_ntf_player_auto = null;
        this.cb_relay = null;
        this.cb_start_throw_dice = null;
        this.cb_throw_dice = null;
        this.cb_choose_dice = null;

        this.cb_rabbit_choose_dice = null;
        this.cb_move = null;
        this.cb_animal_effect_touch_off = null;
        this.cb_ntf_animal_be_stepped = null;
        this.cb_throw_animal = null;

        this.cb_throw_animal_ntf = null;
        this.cb_throw_animal_move = null;
        this.cb_use_skill = null;
        this.cb_effect_move = null;
        this.cb_use_props = null;
        this.cb_add_props = null;
        this.cb_reverse_props = null;
        this.cb_immunity_props = null;
        this.cb_can_not_active_this_round = null;
    }

    public cb_game_wait_start_info : (countdown:number, _playground:common.playground, info:common.player_game_info[], self_info:common.player_inline_info)=>void | null;
    game_wait_start_info(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(inArray[0]);
        _argv_.push(inArray[1]);
        let _array_:any[] = [];
        for(let v_ of inArray[2]){
            _array_.push(common.protcol_to_player_game_info(v_));
        }
        _argv_.push(_array_);
        _argv_.push(common.protcol_to_player_inline_info(inArray[3]));
        if (this.cb_game_wait_start_info){
            this.cb_game_wait_start_info.apply(null, _argv_);
        }
    }

    public cb_game_info : (_playground:common.playground, info:common.player_game_info[], round_player_guid:number)=>void | null;
    game_info(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(inArray[0]);
        let _array_:any[] = [];
        for(let v_ of inArray[1]){
            _array_.push(common.protcol_to_player_game_info(v_));
        }
        _argv_.push(_array_);
        _argv_.push(inArray[2]);
        if (this.cb_game_info){
            this.cb_game_info.apply(null, _argv_);
        }
    }

    public cb_animal_order : (guid:number, animal_info:common.animal_game_info[], skill_id:common.skill)=>void | null;
    animal_order(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(inArray[0]);
        let _array_:any[] = [];
        for(let v_ of inArray[1]){
            _array_.push(common.protcol_to_animal_game_info(v_));
        }
        _argv_.push(_array_);
        _argv_.push(inArray[2]);
        if (this.cb_animal_order){
            this.cb_animal_order.apply(null, _argv_);
        }
    }

    public cb_ntf_effect_info : (info:effect_info[])=>void | null;
    ntf_effect_info(inArray:any[]){
        let _argv_:any[] = [];
        let _array_:any[] = [];
        for(let v_ of inArray[0]){
            _array_.push(protcol_to_effect_info(v_));
        }
        _argv_.push(_array_);
        if (this.cb_ntf_effect_info){
            this.cb_ntf_effect_info.apply(null, _argv_);
        }
    }

    public cb_ntf_new_effect_info : (info:effect_info)=>void | null;
    ntf_new_effect_info(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(protcol_to_effect_info(inArray[0]));
        if (this.cb_ntf_new_effect_info){
            this.cb_ntf_new_effect_info.apply(null, _argv_);
        }
    }

    public cb_remove_effect : (grids:number)=>void | null;
    remove_effect(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(inArray[0]);
        if (this.cb_remove_effect){
            this.cb_remove_effect.apply(null, _argv_);
        }
    }

    public cb_remove_muddy : (grids:number[])=>void | null;
    remove_muddy(inArray:any[]){
        let _argv_:any[] = [];
        let _array_:any[] = [];
        for(let v_ of inArray[0]){
            _array_.push(v_);
        }
        _argv_.push(_array_);
        if (this.cb_remove_muddy){
            this.cb_remove_muddy.apply(null, _argv_);
        }
    }

    public cb_ntf_player_stepped_effect : (guid:number, effect_id:common.effect, grid:number, is_remove:boolean)=>void | null;
    ntf_player_stepped_effect(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(inArray[0]);
        _argv_.push(inArray[1]);
        _argv_.push(inArray[2]);
        _argv_.push(inArray[3]);
        if (this.cb_ntf_player_stepped_effect){
            this.cb_ntf_player_stepped_effect.apply(null, _argv_);
        }
    }

    public cb_ntf_prop_info : (info:prop_info[])=>void | null;
    ntf_prop_info(inArray:any[]){
        let _argv_:any[] = [];
        let _array_:any[] = [];
        for(let v_ of inArray[0]){
            _array_.push(protcol_to_prop_info(v_));
        }
        _argv_.push(_array_);
        if (this.cb_ntf_prop_info){
            this.cb_ntf_prop_info.apply(null, _argv_);
        }
    }

    public cb_ntf_new_prop_info : (info:prop_info)=>void | null;
    ntf_new_prop_info(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(protcol_to_prop_info(inArray[0]));
        if (this.cb_ntf_new_prop_info){
            this.cb_ntf_new_prop_info.apply(null, _argv_);
        }
    }

    public cb_remove_prop : (grid:number)=>void | null;
    remove_prop(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(inArray[0]);
        if (this.cb_remove_prop){
            this.cb_remove_prop.apply(null, _argv_);
        }
    }

    public cb_ntf_player_stepped_prop : (guid:number, prop_id:common.props)=>void | null;
    ntf_player_stepped_prop(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(inArray[0]);
        _argv_.push(inArray[1]);
        if (this.cb_ntf_player_stepped_prop){
            this.cb_ntf_player_stepped_prop.apply(null, _argv_);
        }
    }

    public cb_ntf_player_prop_list : (prop_list:common.props[])=>void | null;
    ntf_player_prop_list(inArray:any[]){
        let _argv_:any[] = [];
        let _array_:any[] = [];
        for(let v_ of inArray[0]){
            _array_.push(v_);
        }
        _argv_.push(_array_);
        if (this.cb_ntf_player_prop_list){
            this.cb_ntf_player_prop_list.apply(null, _argv_);
        }
    }

    public cb_turn_player_round : (guid:number, active_state:common.play_active_state, animal_index:number, round:number)=>void | null;
    turn_player_round(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(inArray[0]);
        _argv_.push(common.protcol_to_play_active_state(inArray[1]));
        _argv_.push(inArray[2]);
        _argv_.push(inArray[3]);
        if (this.cb_turn_player_round){
            this.cb_turn_player_round.apply(null, _argv_);
        }
    }

    public cb_ntf_player_auto : ()=>void | null;
    ntf_player_auto(inArray:any[]){
        let _argv_:any[] = [];
        if (this.cb_ntf_player_auto){
            this.cb_ntf_player_auto.apply(null, _argv_);
        }
    }

    public cb_relay : (guid:number, new_animal_index:number, is_follow:boolean)=>void | null;
    relay(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(inArray[0]);
        _argv_.push(inArray[1]);
        _argv_.push(inArray[2]);
        if (this.cb_relay){
            this.cb_relay.apply(null, _argv_);
        }
    }

    public cb_start_throw_dice : (guid:number, animal_index:number)=>void | null;
    start_throw_dice(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(inArray[0]);
        _argv_.push(inArray[1]);
        if (this.cb_start_throw_dice){
            this.cb_start_throw_dice.apply(null, _argv_);
        }
    }

    public cb_throw_dice : (guid:number, dice:number[])=>void | null;
    throw_dice(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(inArray[0]);
        let _array_:any[] = [];
        for(let v_ of inArray[1]){
            _array_.push(v_);
        }
        _argv_.push(_array_);
        if (this.cb_throw_dice){
            this.cb_throw_dice.apply(null, _argv_);
        }
    }

    public cb_choose_dice : ()=>void | null;
    choose_dice(inArray:any[]){
        let _cb_uuid = inArray[0];
        let _argv_:any[] = [];
        this.rsp = new game_client_choose_dice_rsp(this._client_handle, this._client_handle.current_hub, _cb_uuid);
        if (this.cb_choose_dice){
            this.cb_choose_dice.apply(null, _argv_);
        }
        this.rsp = null;
    }

    public cb_rabbit_choose_dice : (dice:number)=>void | null;
    rabbit_choose_dice(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(inArray[0]);
        if (this.cb_rabbit_choose_dice){
            this.cb_rabbit_choose_dice.apply(null, _argv_);
        }
    }

    public cb_move : (guid:number, animal_index:number, move_coefficient:number, from:number, to:number)=>void | null;
    move(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(inArray[0]);
        _argv_.push(inArray[1]);
        _argv_.push(inArray[2]);
        _argv_.push(inArray[3]);
        _argv_.push(inArray[4]);
        if (this.cb_move){
            this.cb_move.apply(null, _argv_);
        }
    }

    public cb_animal_effect_touch_off : (self_guid:number, self_animal_index:number, target_guid:number, target_animal_index:number)=>void | null;
    animal_effect_touch_off(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(inArray[0]);
        _argv_.push(inArray[1]);
        _argv_.push(inArray[2]);
        _argv_.push(inArray[3]);
        if (this.cb_animal_effect_touch_off){
            this.cb_animal_effect_touch_off.apply(null, _argv_);
        }
    }

    public cb_ntf_animal_be_stepped : (guid:number, animal_index:number)=>void | null;
    ntf_animal_be_stepped(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(inArray[0]);
        _argv_.push(inArray[1]);
        if (this.cb_ntf_animal_be_stepped){
            this.cb_ntf_animal_be_stepped.apply(null, _argv_);
        }
    }

    public cb_throw_animal : (self_guid:number, guid:number, animal_index:number, target_pos:number[])=>void | null;
    throw_animal(inArray:any[]){
        let _cb_uuid = inArray[0];
        let _argv_:any[] = [];
        _argv_.push(inArray[1]);
        _argv_.push(inArray[2]);
        _argv_.push(inArray[3]);
        let _array_:any[] = [];        for(let v_ of inArray[4]){
            _array_.push(v_);
        }
        _argv_.push(_array_);
        this.rsp = new game_client_throw_animal_rsp(this._client_handle, this._client_handle.current_hub, _cb_uuid);
        if (this.cb_throw_animal){
            this.cb_throw_animal.apply(null, _argv_);
        }
        this.rsp = null;
    }

    public cb_throw_animal_ntf : (self_guid:number, guid:number, animal_index:number, target_pos:number[])=>void | null;
    throw_animal_ntf(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(inArray[0]);
        _argv_.push(inArray[1]);
        _argv_.push(inArray[2]);
        let _array_:any[] = [];
        for(let v_ of inArray[3]){
            _array_.push(v_);
        }
        _argv_.push(_array_);
        if (this.cb_throw_animal_ntf){
            this.cb_throw_animal_ntf.apply(null, _argv_);
        }
    }

    public cb_throw_animal_move : (guid:number, animal_index:number, from:number, to:number)=>void | null;
    throw_animal_move(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(inArray[0]);
        _argv_.push(inArray[1]);
        _argv_.push(inArray[2]);
        _argv_.push(inArray[3]);
        if (this.cb_throw_animal_move){
            this.cb_throw_animal_move.apply(null, _argv_);
        }
    }

    public cb_use_skill : (guid:number, animal_index:number, target_guid:number, target_animal_index:number)=>void | null;
    use_skill(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(inArray[0]);
        _argv_.push(inArray[1]);
        _argv_.push(inArray[2]);
        _argv_.push(inArray[3]);
        if (this.cb_use_skill){
            this.cb_use_skill.apply(null, _argv_);
        }
    }

    public cb_effect_move : (effect_id:common.effect, guid:number, target_animal_index:number, from:number, to:number)=>void | null;
    effect_move(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(inArray[0]);
        _argv_.push(inArray[1]);
        _argv_.push(inArray[2]);
        _argv_.push(inArray[3]);
        _argv_.push(inArray[4]);
        if (this.cb_effect_move){
            this.cb_effect_move.apply(null, _argv_);
        }
    }

    public cb_use_props : (props_id:common.props, guid:number, animal_index:number, target_guid:number, target_animal_index:number)=>void | null;
    use_props(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(inArray[0]);
        _argv_.push(inArray[1]);
        _argv_.push(inArray[2]);
        _argv_.push(inArray[3]);
        _argv_.push(inArray[4]);
        if (this.cb_use_props){
            this.cb_use_props.apply(null, _argv_);
        }
    }

    public cb_add_props : (add_type:enum_add_props_type, guid:number, props_id:common.props)=>void | null;
    add_props(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(inArray[0]);
        _argv_.push(inArray[1]);
        _argv_.push(inArray[2]);
        if (this.cb_add_props){
            this.cb_add_props.apply(null, _argv_);
        }
    }

    public cb_reverse_props : (src_guid:number, target_guid:number, target_animal_index:number, props_id:common.props, reverse_target_guid:number, reverse_target_animal_index:number)=>void | null;
    reverse_props(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(inArray[0]);
        _argv_.push(inArray[1]);
        _argv_.push(inArray[2]);
        _argv_.push(inArray[3]);
        _argv_.push(inArray[4]);
        _argv_.push(inArray[5]);
        if (this.cb_reverse_props){
            this.cb_reverse_props.apply(null, _argv_);
        }
    }

    public cb_immunity_props : (guid:number, props_id:common.props, target_guid:number, target_animal_index:number)=>void | null;
    immunity_props(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(inArray[0]);
        _argv_.push(inArray[1]);
        _argv_.push(inArray[2]);
        _argv_.push(inArray[3]);
        if (this.cb_immunity_props){
            this.cb_immunity_props.apply(null, _argv_);
        }
    }

    public cb_can_not_active_this_round : (guid:number)=>void | null;
    can_not_active_this_round(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(inArray[0]);
        if (this.cb_can_not_active_this_round){
            this.cb_can_not_active_this_round.apply(null, _argv_);
        }
    }

}
