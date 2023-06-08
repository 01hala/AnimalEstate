import { _decorator, Component, director } from 'cc';
const { ccclass } = _decorator;

import * as cli from '../serverSDK/client_handle';
import * as singleton from '../netDriver/netSingleton';

@ccclass('main_main_reconn')
export class main_main_reconn extends Component {

    private conn_gate_svr(url:string) {
        return new Promise<void>(resolve => {
            cli.cli_handle.connect_gate(url);
            cli.cli_handle.onGateConnect = () => {
                resolve();
            }
        });
    }

    start() {
        singleton.netSingleton.login.cb_player_login_sucess = () => {
            console.log("login sucess!");
            if (singleton.netSingleton.game.game_hub_name) {
                singleton.netSingleton.game.into_game(singleton.netSingleton.game.game_hub_name);
            }
            else {
                singleton.netSingleton.bundle.loadScene('main', function (err, scene) {
                    director.runScene(scene);
                });
            }
        }

        cli.cli_handle.onGateDisConnect = async () =>{
            await this.conn_gate_svr("wss://animal.ucat.games:3001");
            wx.login({
                success: (login_res) => {
                    singleton.netSingleton.login.login_player_no_author(login_res.code, singleton.netSingleton.login.nick_name, singleton.netSingleton.login.avatar_url);
                }
            });
        }
    }
}