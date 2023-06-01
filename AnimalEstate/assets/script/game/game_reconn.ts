import { _decorator, Component, director } from 'cc';
const { ccclass } = _decorator;

import * as cli from '../serverSDK/client_handle';

import * as singleton from '../netDriver/netSingleton';

import * as game_data_def from './global_game_data/game_data_def';
import * as game_data_effect from './global_game_data/game_effect_def';
import * as game_data_props from './global_game_data/game_props_def';

@ccclass('main_game_reconn')
export class main_game_reconn extends Component {

    private conn_gate_svr(url:string) {
        return new Promise<void>(resolve => {
            cli.cli_handle.connect_gate(url);
            cli.cli_handle.onGateConnect = () => {
                resolve();
            }
        });
    }

    private check_reconnect() {
        if (singleton.netSingleton.game.game_hub_name) {
            console.log("start game!");
            console.log("Playground:", singleton.netSingleton.game.Playground);
            
            game_data_def.game_data.remove_all_animal();
            game_data_def.game_data.isInit = true; 
            game_data_def.game_data.isStart = false; 
            game_data_def.game_data.set_animal_born_pos();

            game_data_effect.game_data_effect.remove_all_effect();
            if (singleton.netSingleton.game.effect_info_list) {
                game_data_effect.game_data_effect.set_effect(singleton.netSingleton.game.effect_info_list);
            }

            game_data_props.game_data_props.remove_all_prop();
            if (singleton.netSingleton.game.prop_info_list) {
                game_data_props.game_data_props.set_prop(singleton.netSingleton.game.prop_info_list);
            }
        }
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

        singleton.netSingleton.game.cb_game_info = () => {
            console.log("start match!");
            this.check_reconnect();
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