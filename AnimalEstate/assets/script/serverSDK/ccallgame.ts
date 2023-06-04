import * as client_handle from "./client_handle";
import * as common from "./common";
/*this enum code is codegen by abelkhan codegen for ts*/

/*this struct code is codegen by abelkhan codegen for typescript*/
/*this caller code is codegen by abelkhan codegen for typescript*/
export class game_cancel_game_cb{
    private cb_uuid : number;
    private module_rsp_cb : game_rsp_cb;

    public event_cancel_game_handle_cb : ()=>void | null;
    public event_cancel_game_handle_err : ()=>void | null;
    public event_cancel_game_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : game_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_cancel_game_handle_cb = null;
        this.event_cancel_game_handle_err = null;
        this.event_cancel_game_handle_timeout = null;
    }

    callBack(_cb:()=>void, _err:()=>void)
    {
        this.event_cancel_game_handle_cb = _cb;
        this.event_cancel_game_handle_err = _err;
        return this;
    }

    timeout(tick:number, timeout_cb:()=>void)
    {
        setTimeout(()=>{ this.module_rsp_cb.cancel_game_timeout(this.cb_uuid); }, tick);
        this.event_cancel_game_handle_timeout = timeout_cb;
    }

}

/*this cb code is codegen by abelkhan for ts*/
export class game_rsp_cb extends client_handle.imodule {
    public map_cancel_game:Map<number, game_cancel_game_cb>;
    constructor(modules:client_handle.modulemng){
        super();
        this.map_cancel_game = new Map<number, game_cancel_game_cb>();
        modules.add_method("game_rsp_cb_cancel_game_rsp", this.cancel_game_rsp.bind(this));
        modules.add_method("game_rsp_cb_cancel_game_err", this.cancel_game_err.bind(this));
    }
    public cancel_game_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_51dfb5e9_b19e_3fc5_b7b3_c26a546e5e9b:any[] = [];
        var rsp = this.try_get_and_del_cancel_game_cb(uuid);
        if (rsp && rsp.event_cancel_game_handle_cb) {
            rsp.event_cancel_game_handle_cb.apply(null, _argv_51dfb5e9_b19e_3fc5_b7b3_c26a546e5e9b);
        }
    }

    public cancel_game_err(inArray:any[]){
        let uuid = inArray[0];
        let _argv_51dfb5e9_b19e_3fc5_b7b3_c26a546e5e9b:any[] = [];
        var rsp = this.try_get_and_del_cancel_game_cb(uuid);
        if (rsp && rsp.event_cancel_game_handle_err) {
            rsp.event_cancel_game_handle_err.apply(null, _argv_51dfb5e9_b19e_3fc5_b7b3_c26a546e5e9b);
        }
    }

    public cancel_game_timeout(cb_uuid : number){
        let rsp = this.try_get_and_del_cancel_game_cb(cb_uuid);
        if (rsp){
            if (rsp.event_cancel_game_handle_timeout) {
                rsp.event_cancel_game_handle_timeout.apply(null);
            }
        }
    }

    private try_get_and_del_cancel_game_cb(uuid : number){
        var rsp = this.map_cancel_game.get(uuid);
        this.map_cancel_game.delete(uuid);
        return rsp;
    }

}

let rsp_cb_game_handle : game_rsp_cb | null = null;
export class game_caller {
    private _hubproxy:game_hubproxy;
    constructor(_client:client_handle.client){
        if (rsp_cb_game_handle == null){
            rsp_cb_game_handle = new game_rsp_cb(_client._modulemng);
        }
        this._hubproxy = new game_hubproxy(_client);
    }

    public get_hub(hub_name:string)
    {
        this._hubproxy.hub_name_b8b9723b_52d5_3bc2_8583_8bf5fd51de47 = hub_name;
        return this._hubproxy;
    }

}

export class game_hubproxy
{
    private uuid_b8b9723b_52d5_3bc2_8583_8bf5fd51de47 : number = Math.round(Math.random() * 1000);

    public hub_name_b8b9723b_52d5_3bc2_8583_8bf5fd51de47:string;
    private _client_handle:client_handle.client;

    constructor(client_handle_:client_handle.client)
    {
        this._client_handle = client_handle_;
    }

    public into_game(guid:number){
        let _argv_90a69cb9_3a0a_3a86_9cad_499708905276:any[] = [];
        _argv_90a69cb9_3a0a_3a86_9cad_499708905276.push(guid);
        this._client_handle.call_hub(this.hub_name_b8b9723b_52d5_3bc2_8583_8bf5fd51de47, "game_into_game", _argv_90a69cb9_3a0a_3a86_9cad_499708905276);
    }

    public play_order(animal_info:common.animal_game_info[], skill_id:common.skill){
        let _argv_72cd38c4_f976_3ca7_aeef_12b6fc619413:any[] = [];
        let _array_7044f738_3b40_35d1_a737_b6b236adbdd2:any[] = [];
        for(let v_c00062dc_edff_54ff_a6ff_4b3c0f329e98 of animal_info){
            _array_7044f738_3b40_35d1_a737_b6b236adbdd2.push(common.animal_game_info_to_protcol(v_c00062dc_edff_54ff_a6ff_4b3c0f329e98));
        }
        _argv_72cd38c4_f976_3ca7_aeef_12b6fc619413.push(_array_7044f738_3b40_35d1_a737_b6b236adbdd2);
        _argv_72cd38c4_f976_3ca7_aeef_12b6fc619413.push(skill_id);
        this._client_handle.call_hub(this.hub_name_b8b9723b_52d5_3bc2_8583_8bf5fd51de47, "game_play_order", _argv_72cd38c4_f976_3ca7_aeef_12b6fc619413);
    }

    public ready(){
        let _argv_d316cb5a_9c2e_37b4_b933_a89ca4e2b6bd:any[] = [];
        this._client_handle.call_hub(this.hub_name_b8b9723b_52d5_3bc2_8583_8bf5fd51de47, "game_ready", _argv_d316cb5a_9c2e_37b4_b933_a89ca4e2b6bd);
    }

    public use_skill(target_guid:number, target_animal_index:number){
        let _argv_f54ecac1_af9c_3003_a2f2_ed93134bfdfe:any[] = [];
        _argv_f54ecac1_af9c_3003_a2f2_ed93134bfdfe.push(target_guid);
        _argv_f54ecac1_af9c_3003_a2f2_ed93134bfdfe.push(target_animal_index);
        this._client_handle.call_hub(this.hub_name_b8b9723b_52d5_3bc2_8583_8bf5fd51de47, "game_use_skill", _argv_f54ecac1_af9c_3003_a2f2_ed93134bfdfe);
    }

    public use_props(props_id:common.props, target_guid:number, target_animal_index:number){
        let _argv_20fdd6aa_1127_36f5_b101_2ce394d2e1c9:any[] = [];
        _argv_20fdd6aa_1127_36f5_b101_2ce394d2e1c9.push(props_id);
        _argv_20fdd6aa_1127_36f5_b101_2ce394d2e1c9.push(target_guid);
        _argv_20fdd6aa_1127_36f5_b101_2ce394d2e1c9.push(target_animal_index);
        this._client_handle.call_hub(this.hub_name_b8b9723b_52d5_3bc2_8583_8bf5fd51de47, "game_use_props", _argv_20fdd6aa_1127_36f5_b101_2ce394d2e1c9);
    }

    public throw_dice(){
        let _argv_89caa8aa_910b_3726_9283_63467ea68426:any[] = [];
        this._client_handle.call_hub(this.hub_name_b8b9723b_52d5_3bc2_8583_8bf5fd51de47, "game_throw_dice", _argv_89caa8aa_910b_3726_9283_63467ea68426);
    }

    public choose_animal(animal_index:number){
        let _argv_616b879f_2ebb_3ffd_9a6e_1add223b9f20:any[] = [];
        _argv_616b879f_2ebb_3ffd_9a6e_1add223b9f20.push(animal_index);
        this._client_handle.call_hub(this.hub_name_b8b9723b_52d5_3bc2_8583_8bf5fd51de47, "game_choose_animal", _argv_616b879f_2ebb_3ffd_9a6e_1add223b9f20);
    }

    public cancel_auto(){
        let _argv_31dd4b62_c4d1_3244_801b_586f309b805d:any[] = [];
        this._client_handle.call_hub(this.hub_name_b8b9723b_52d5_3bc2_8583_8bf5fd51de47, "game_cancel_auto", _argv_31dd4b62_c4d1_3244_801b_586f309b805d);
    }

    public cancel_game(){
        let uuid_b75bfcdc_9de4_53c5_b31e_af9c4d3ae88a = Math.round(this.uuid_b8b9723b_52d5_3bc2_8583_8bf5fd51de47++);

        let _argv_51dfb5e9_b19e_3fc5_b7b3_c26a546e5e9b:any[] = [uuid_b75bfcdc_9de4_53c5_b31e_af9c4d3ae88a];
        this._client_handle.call_hub(this.hub_name_b8b9723b_52d5_3bc2_8583_8bf5fd51de47, "game_cancel_game", _argv_51dfb5e9_b19e_3fc5_b7b3_c26a546e5e9b);
        let cb_cancel_game_obj = new game_cancel_game_cb(uuid_b75bfcdc_9de4_53c5_b31e_af9c4d3ae88a, rsp_cb_game_handle);
        if (rsp_cb_game_handle){
            rsp_cb_game_handle.map_cancel_game.set(uuid_b75bfcdc_9de4_53c5_b31e_af9c4d3ae88a, cb_cancel_game_obj);
        }
        return cb_cancel_game_obj;
    }

}
