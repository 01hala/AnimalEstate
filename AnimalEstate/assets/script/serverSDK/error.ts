import * as client_handle from "./client_handle";
/*this enum code is codegen by abelkhan codegen for ts*/

export enum error{
    timeout = -2,
    db_error = -1,
    success = 0,
    server_busy = 1,
    unregistered_palyer = 2,
    room_is_destroy = 3,
    animal_order_len_not_four = 4
}

/*this struct code is codegen by abelkhan codegen for typescript*/
/*this module code is codegen by abelkhan codegen for typescript*/
export class error_code_ntf_module extends client_handle.imodule {
    public _client_handle:client_handle.client;
    constructor(_client_handle_:client_handle.client){
        super();
        this._client_handle = _client_handle_;
        this._client_handle._modulemng.add_method("error_code_ntf_error_code", this.error_code.bind(this));

        this.cb_error_code = null;
    }

    public cb_error_code : (err_code:error)=>void | null;
    error_code(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(inArray[0]);
        if (this.cb_error_code){
            this.cb_error_code.apply(null, _argv_);
        }
    }

}
