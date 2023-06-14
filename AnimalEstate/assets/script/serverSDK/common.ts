import * as client_handle from "./client_handle";
/*this enum code is codegen by abelkhan codegen for ts*/

export enum animal{
    chicken = 1,
    monkey = 2,
    rabbit = 3,
    duck = 4,
    mouse = 5,
    bear = 6,
    tiger = 7,
    lion = 8
}

export enum skin{
    chicken = 101,
    monkey = 201,
    rabbit = 301,
    duck = 401,
    mouse = 501,
    bear = 601,
    tiger = 701,
    lion = 801
}

export enum effect{
    muddy = 1,
    golden_apple = 2,
    rice_ear = 3,
    monkey_wine = 4,
    thunder = 101,
    clip = 102,
    landmine = 103,
    spring = 104,
    banana = 105,
    watermelon_rind = 106,
    red_mushroom = 107
}

export enum skill{
    phantom_dice = 1,
    soul_moving_method = 2,
    thief_reborn = 3,
    step_lotus = 4,
    preemptiv_strike = 5,
    swap_places = 6,
    altec_lightwave = 7
}

export enum props{
    none = 0,
    horn = 1,
    bomb = 2,
    help_vellus = 3,
    thunder = 4,
    clown_gift_box = 5,
    excited_petals = 6,
    clip = 7,
    landmine = 8,
    spring = 9,
    turtle_shell = 10,
    banana = 11,
    watermelon_rind = 12,
    red_mushroom = 13,
    gacha = 14,
    fake_dice = 15
}

export enum playground{
    random = 0,
    lakeside = 1,
    grassland = 2,
    hill = 3,
    snow = 4,
    desert = 5,
    countof = 6
}

/*this struct code is codegen by abelkhan codegen for typescript*/
export class player_friend_info
{
    public guid : number = 0;
    public sdk_uuid : string = "";
    public name : string = "";
    public avatar : string = "";
    public score : number = 0;

}

export function player_friend_info_to_protcol(_struct:player_friend_info){
    return _struct;
}

export function protcol_to_player_friend_info(_protocol:any){
    let _struct = new player_friend_info();
    for (const [key, val] of Object.entries(_protocol)) {
        if (key === "guid"){
            _struct.guid = val as number;
        }
        else if (key === "sdk_uuid"){
            _struct.sdk_uuid = val as string;
        }
        else if (key === "name"){
            _struct.name = val as string;
        }
        else if (key === "avatar"){
            _struct.avatar = val as string;
        }
        else if (key === "score"){
            _struct.score = val as number;
        }
    }
    return _struct;
}

export class player_info
{
    public guid : number = 0;
    public sdk_uuid : string = "";
    public name : string = "";
    public avatar : string = "";
    public score : number = 0;
    public friend_list : player_friend_info[] = [];
    public invite_list : player_friend_info[] = [];
    public be_invited_list : player_friend_info[] = [];
    public hero_list : animal[] = [];
    public skin_list : skin[] = [];
    public skill_list : skill[] = [];
    public playground_list : playground[] = [];

}

export function player_info_to_protcol(_struct:player_info){
    return _struct;
}

export function protcol_to_player_info(_protocol:any){
    let _struct = new player_info();
    for (const [key, val] of Object.entries(_protocol)) {
        if (key === "guid"){
            _struct.guid = val as number;
        }
        else if (key === "sdk_uuid"){
            _struct.sdk_uuid = val as string;
        }
        else if (key === "name"){
            _struct.name = val as string;
        }
        else if (key === "avatar"){
            _struct.avatar = val as string;
        }
        else if (key === "score"){
            _struct.score = val as number;
        }
        else if (key === "friend_list"){
            _struct.friend_list = [];
            for(let v_ of val as any){
                _struct.friend_list.push(protcol_to_player_friend_info(v_));
            }
        }
        else if (key === "invite_list"){
            _struct.invite_list = [];
            for(let v_ of val as any){
                _struct.invite_list.push(protcol_to_player_friend_info(v_));
            }
        }
        else if (key === "be_invited_list"){
            _struct.be_invited_list = [];
            for(let v_ of val as any){
                _struct.be_invited_list.push(protcol_to_player_friend_info(v_));
            }
        }
        else if (key === "hero_list"){
            _struct.hero_list = [];
            for(let v_ of val as any){
                _struct.hero_list.push(v_);
            }
        }
        else if (key === "skin_list"){
            _struct.skin_list = [];
            for(let v_ of val as any){
                _struct.skin_list.push(v_);
            }
        }
        else if (key === "skill_list"){
            _struct.skill_list = [];
            for(let v_ of val as any){
                _struct.skill_list.push(v_);
            }
        }
        else if (key === "playground_list"){
            _struct.playground_list = [];
            for(let v_ of val as any){
                _struct.playground_list.push(v_);
            }
        }
    }
    return _struct;
}

export class player_inline_info
{
    public uuid : string = "";
    public guid : number = 0;
    public name : string = "";
    public avatar : string = "";
    public score : number = 0;
    public hero_list : animal[] = [];
    public skin_list : skin[] = [];
    public skill_list : skill[] = [];
    public playground_list : playground[] = [];

}

export function player_inline_info_to_protcol(_struct:player_inline_info){
    return _struct;
}

export function protcol_to_player_inline_info(_protocol:any){
    let _struct = new player_inline_info();
    for (const [key, val] of Object.entries(_protocol)) {
        if (key === "uuid"){
            _struct.uuid = val as string;
        }
        else if (key === "guid"){
            _struct.guid = val as number;
        }
        else if (key === "name"){
            _struct.name = val as string;
        }
        else if (key === "avatar"){
            _struct.avatar = val as string;
        }
        else if (key === "score"){
            _struct.score = val as number;
        }
        else if (key === "hero_list"){
            _struct.hero_list = [];
            for(let v_ of val as any){
                _struct.hero_list.push(v_);
            }
        }
        else if (key === "skin_list"){
            _struct.skin_list = [];
            for(let v_ of val as any){
                _struct.skin_list.push(v_);
            }
        }
        else if (key === "skill_list"){
            _struct.skill_list = [];
            for(let v_ of val as any){
                _struct.skill_list.push(v_);
            }
        }
        else if (key === "playground_list"){
            _struct.playground_list = [];
            for(let v_ of val as any){
                _struct.playground_list.push(v_);
            }
        }
    }
    return _struct;
}

export class room_info
{
    public room_uuid : string = "";
    public room_owner_guid : number = 0;
    public _playground : playground = playground.random;
    public room_player_list : player_inline_info[] = [];

}

export function room_info_to_protcol(_struct:room_info){
    return _struct;
}

export function protcol_to_room_info(_protocol:any){
    let _struct = new room_info();
    for (const [key, val] of Object.entries(_protocol)) {
        if (key === "room_uuid"){
            _struct.room_uuid = val as string;
        }
        else if (key === "room_owner_guid"){
            _struct.room_owner_guid = val as number;
        }
        else if (key === "_playground"){
            _struct._playground = val as playground;
        }
        else if (key === "room_player_list"){
            _struct.room_player_list = [];
            for(let v_ of val as any){
                _struct.room_player_list.push(protcol_to_player_inline_info(v_));
            }
        }
    }
    return _struct;
}

export class animal_game_info
{
    public animal_id : animal = animal.chicken;
    public skin_id : skin = skin.chicken;
    public current_pos : number = 0;
    public could_move : boolean = true;
    public unmovable_rounds : number = 0;
    public continuous_move_rounds : number = 0;

}

export function animal_game_info_to_protcol(_struct:animal_game_info){
    return _struct;
}

export function protcol_to_animal_game_info(_protocol:any){
    let _struct = new animal_game_info();
    for (const [key, val] of Object.entries(_protocol)) {
        if (key === "animal_id"){
            _struct.animal_id = val as animal;
        }
        else if (key === "skin_id"){
            _struct.skin_id = val as skin;
        }
        else if (key === "current_pos"){
            _struct.current_pos = val as number;
        }
        else if (key === "could_move"){
            _struct.could_move = val as boolean;
        }
        else if (key === "unmovable_rounds"){
            _struct.unmovable_rounds = val as number;
        }
        else if (key === "continuous_move_rounds"){
            _struct.continuous_move_rounds = val as number;
        }
    }
    return _struct;
}

export class animal_play_active_state
{
    public animal_index : number = 0;
    public could_use_props : boolean = false;
    public use_props_count : number = 0;
    public could_throw_dice : boolean = false;
    public is_step_lotus : boolean = false;
    public throw_dice_count : number = 0;
    public move_coefficient : number = 0.0;

}

export function animal_play_active_state_to_protcol(_struct:animal_play_active_state){
    return _struct;
}

export function protcol_to_animal_play_active_state(_protocol:any){
    let _struct = new animal_play_active_state();
    for (const [key, val] of Object.entries(_protocol)) {
        if (key === "animal_index"){
            _struct.animal_index = val as number;
        }
        else if (key === "could_use_props"){
            _struct.could_use_props = val as boolean;
        }
        else if (key === "use_props_count"){
            _struct.use_props_count = val as number;
        }
        else if (key === "could_throw_dice"){
            _struct.could_throw_dice = val as boolean;
        }
        else if (key === "is_step_lotus"){
            _struct.is_step_lotus = val as boolean;
        }
        else if (key === "throw_dice_count"){
            _struct.throw_dice_count = val as number;
        }
        else if (key === "move_coefficient"){
            _struct.move_coefficient = val as number;
        }
    }
    return _struct;
}

export class play_active_state
{
    public could_use_skill : boolean = false;
    public phantom_dice : boolean = false;
    public fake_dice : boolean = false;
    public move_coefficient : number = 0.0;
    public preemptive_strike : boolean = false;
    public round_active_num : number = 0;
    public animal_play_active_states : animal_play_active_state[] = [];

}

export function play_active_state_to_protcol(_struct:play_active_state){
    return _struct;
}

export function protcol_to_play_active_state(_protocol:any){
    let _struct = new play_active_state();
    for (const [key, val] of Object.entries(_protocol)) {
        if (key === "could_use_skill"){
            _struct.could_use_skill = val as boolean;
        }
        else if (key === "phantom_dice"){
            _struct.phantom_dice = val as boolean;
        }
        else if (key === "fake_dice"){
            _struct.fake_dice = val as boolean;
        }
        else if (key === "move_coefficient"){
            _struct.move_coefficient = val as number;
        }
        else if (key === "preemptive_strike"){
            _struct.preemptive_strike = val as boolean;
        }
        else if (key === "round_active_num"){
            _struct.round_active_num = val as number;
        }
        else if (key === "animal_play_active_states"){
            _struct.animal_play_active_states = [];
            for(let v_ of val as any){
                _struct.animal_play_active_states.push(protcol_to_animal_play_active_state(v_));
            }
        }
    }
    return _struct;
}

export class player_game_info
{
    public uuid : string = "";
    public guid : number = 0;
    public name : string = "";
    public avatar : string = "";
    public skill_id : skill = skill.phantom_dice;
    public skill_is_used : boolean = false;
    public animal_info : animal_game_info[] = [];
    public current_animal_index : number = 0;

}

export function player_game_info_to_protcol(_struct:player_game_info){
    return _struct;
}

export function protcol_to_player_game_info(_protocol:any){
    let _struct = new player_game_info();
    for (const [key, val] of Object.entries(_protocol)) {
        if (key === "uuid"){
            _struct.uuid = val as string;
        }
        else if (key === "guid"){
            _struct.guid = val as number;
        }
        else if (key === "name"){
            _struct.name = val as string;
        }
        else if (key === "avatar"){
            _struct.avatar = val as string;
        }
        else if (key === "skill_id"){
            _struct.skill_id = val as skill;
        }
        else if (key === "skill_is_used"){
            _struct.skill_is_used = val as boolean;
        }
        else if (key === "animal_info"){
            _struct.animal_info = [];
            for(let v_ of val as any){
                _struct.animal_info.push(protcol_to_animal_game_info(v_));
            }
        }
        else if (key === "current_animal_index"){
            _struct.current_animal_index = val as number;
        }
    }
    return _struct;
}

export class game_player_settle_info
{
    public guid : number = 0;
    public name : string = "";
    public rank : number = 0;

}

export function game_player_settle_info_to_protcol(_struct:game_player_settle_info){
    return _struct;
}

export function protcol_to_game_player_settle_info(_protocol:any){
    let _struct = new game_player_settle_info();
    for (const [key, val] of Object.entries(_protocol)) {
        if (key === "guid"){
            _struct.guid = val as number;
        }
        else if (key === "name"){
            _struct.name = val as string;
        }
        else if (key === "rank"){
            _struct.rank = val as number;
        }
    }
    return _struct;
}

export class game_settle_info
{
    public settle_info : game_player_settle_info[] = [];

}

export function game_settle_info_to_protcol(_struct:game_settle_info){
    return _struct;
}

export function protcol_to_game_settle_info(_protocol:any){
    let _struct = new game_settle_info();
    for (const [key, val] of Object.entries(_protocol)) {
        if (key === "settle_info"){
            _struct.settle_info = [];
            for(let v_ of val as any){
                _struct.settle_info.push(protcol_to_game_player_settle_info(v_));
            }
        }
    }
    return _struct;
}

export class svr_info
{
    public tick_time : number = 0;
    public player_num : number = 0;

}

export function svr_info_to_protcol(_struct:svr_info){
    return _struct;
}

export function protcol_to_svr_info(_protocol:any){
    let _struct = new svr_info();
    for (const [key, val] of Object.entries(_protocol)) {
        if (key === "tick_time"){
            _struct.tick_time = val as number;
        }
        else if (key === "player_num"){
            _struct.player_num = val as number;
        }
    }
    return _struct;
}

export class player_rank_info
{
    public guid : number = 0;
    public sdk_uuid : string = "";
    public name : string = "";
    public avatar : string = "";
    public score : number = 0;

}

export function player_rank_info_to_protcol(_struct:player_rank_info){
    return _struct;
}

export function protcol_to_player_rank_info(_protocol:any){
    let _struct = new player_rank_info();
    for (const [key, val] of Object.entries(_protocol)) {
        if (key === "guid"){
            _struct.guid = val as number;
        }
        else if (key === "sdk_uuid"){
            _struct.sdk_uuid = val as string;
        }
        else if (key === "name"){
            _struct.name = val as string;
        }
        else if (key === "avatar"){
            _struct.avatar = val as string;
        }
        else if (key === "score"){
            _struct.score = val as number;
        }
    }
    return _struct;
}

export class rank_item
{
    public guid : number = 0;
    public score : number = 0;
    public rank : number = 0;
    public item : Uint8Array = Uint8Array.from([]);

}

export function rank_item_to_protcol(_struct:rank_item){
    return _struct;
}

export function protcol_to_rank_item(_protocol:any){
    let _struct = new rank_item();
    for (const [key, val] of Object.entries(_protocol)) {
        if (key === "guid"){
            _struct.guid = val as number;
        }
        else if (key === "score"){
            _struct.score = val as number;
        }
        else if (key === "rank"){
            _struct.rank = val as number;
        }
        else if (key === "item"){
            _struct.item = val as Uint8Array;
        }
    }
    return _struct;
}

/*this module code is codegen by abelkhan codegen for typescript*/
