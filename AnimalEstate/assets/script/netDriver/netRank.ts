import * as cli from "../serverSDK/client_handle"
import * as player_rank from "../serverSDK/ccallrank"

import * as singleton from './netSingleton';

export class netRank {
    private c_call_player_rank : player_rank.rank_cli_service_caller;

    public constructor() {
        this.c_call_player_rank = new player_rank.rank_cli_service_caller(cli.cli_handle);
    }

    public get_rank_range() {
        console.log("rank_svr_name:", singleton.netSingleton.login.rank_svr_name);
        return this.c_call_player_rank.get_hub(singleton.netSingleton.login.rank_svr_name).get_rank_range("rank", 0, 100);
    }
}