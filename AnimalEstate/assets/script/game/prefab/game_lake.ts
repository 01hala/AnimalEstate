import { _decorator, Component, TiledMap, Sprite, Vec2, instantiate } from 'cc';
const { ccclass, property } = _decorator;

import * as singleton from '../../netDriver/netSingleton';

import * as game_data_def from '../global_game_data/game_data_def';
import * as game_data_effect from '../global_game_data/game_effect_def';
import * as game_data_props from '../global_game_data/game_props_def';

@ccclass('main_game_lake')
export class main_game_lake extends Component {
    @property(TiledMap)
    lake_map:TiledMap = null;
    @property(Sprite)
    lake:Sprite = null;
    @property(Sprite)
    lake_effect1:Sprite = null;
    @property(Sprite)
    lake_effect2:Sprite = null;
    @property(Sprite)
    lake_effect3:Sprite = null;

    start() {
        console.log("main_game_lake!");

        let playgroundLenght = singleton.netSingleton.game.get_playground_len();
        game_data_def.game_data.layout_lenght = playgroundLenght;
        game_data_def.game_data.layout_end = playgroundLenght - 1;

        game_data_def.game_data.map = this.lake_map;
        game_data_def.game_data.layout_width = 1600;
        game_data_def.game_data.layout_height = 1600;
        game_data_def.game_data.layout_half_width = 800;
        game_data_def.game_data.layout_half_height = 800;

        for(let i = 0; i < playgroundLenght; i++) {
            let layer_name = "跑道" + i;
            let layer = game_data_def.game_data.map.getLayer(layer_name);
            let tile_pos = new Vec2(layer.rightTop.col, layer.rightTop.row);
            game_data_def.game_data.mapPlayground.set(i, tile_pos);
        }

        if (!singleton.netSingleton.game.CurrentPlayerInfo) {
            game_data_def.game_data.set_camera_pos_grid(0);
        }
        else {
            var current_animal = singleton.netSingleton.game.CurrentPlayerInfo.animal_info[singleton.netSingleton.game.CurrentPlayerInfo.current_animal_index];
            if (current_animal) {
                if (current_animal.current_pos < 0) {
                    game_data_def.game_data.set_camera_pos_grid(0);
                }
                else if (current_animal.current_pos >= game_data_def.game_data.layout_lenght) {
                    game_data_def.game_data.set_camera_pos_grid(game_data_def.game_data.layout_end);
                }
                else {
                    game_data_def.game_data.set_camera_pos_grid(current_animal.current_pos);
                }
            }
        }

        game_data_def.game_data.isInit = true;
        if (singleton.netSingleton.game.isInitGameInfo) {
            game_data_def.game_data.set_animal_born_pos();
        }
        
        if (singleton.netSingleton.game.effect_info_list) {
            game_data_effect.game_data_effect.set_effect(singleton.netSingleton.game.effect_info_list);
        }

        if (singleton.netSingleton.game.prop_info_list) {
            game_data_props.game_data_props.set_prop(singleton.netSingleton.game.prop_info_list);
        }

        this.tick_lake1();
    }

    private tick_lake1() {
        this.lake_effect1.node.active = true;
        this.lake_effect2.node.active = false;
        this.lake_effect3.node.active = false;

        setTimeout(this.tick_lake2.bind(this), 240);
    }

    private tick_lake2() {
        this.lake_effect1.node.active = false;
        this.lake_effect2.node.active = true;
        this.lake_effect3.node.active = false;

        setTimeout(this.tick_lake3.bind(this), 240);
    }

    private tick_lake3() {
        this.lake_effect1.node.active = false;
        this.lake_effect2.node.active = false;
        this.lake_effect3.node.active = true;

        setTimeout(this.tick_lake1.bind(this), 240);
    }
}