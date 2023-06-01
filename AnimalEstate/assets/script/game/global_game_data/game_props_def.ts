import { _decorator, Prefab, instantiate } from 'cc';

import { props } from '../../serverSDK/common';
import { prop_info } from '../../serverSDK/gamecallc';

import * as game_data_def from './game_data_def';

export class game_data_props {
    public static horn:Prefab = null;		
    public static bomb:Prefab = null;			
    public static help_vellus:Prefab = null;	
    public static thunder:Prefab = null;			
    public static clown_gift_box:Prefab = null;	
    public static excited_petals:Prefab = null;	
    public static clip_props:Prefab = null;			
    public static landmine_props:Prefab = null;		
    public static spring_props:Prefab = null;			
    public static turtle_shell:Prefab = null;	
    public static banana:Prefab = null;			
    public static watermelon_rind_props:Prefab = null;	
    public static red_mushroom:Prefab = null;	
    public static gacha:Prefab = null;			
    public static fake_dice:Prefab = null;	
    
    public static mapProps:Map<number, any> = new Map<number, any>();

    public static remove_all_prop() {
        game_data_props.mapProps.forEach((prop, grid) => {
            game_data_def.game_data.map.node.removeChild(prop);
        });
    }
    
    public static get_prop_prefab(prop_id:props) {	
        if (prop_id == props.horn) { //号角
            return game_data_props.horn;
        }
        else if (prop_id == props.bomb) { //炸弹
            return game_data_props.bomb;
        }
        else if (prop_id == props.help_vellus) { //救命毫毛
            return game_data_props.help_vellus;
        }
        else if (prop_id == props.thunder) { //天雷
            return game_data_props.thunder;
        }
        else if (prop_id == props.clown_gift_box) { //小丑礼盒
            return game_data_props.clown_gift_box;
        }
        else if (prop_id == props.excited_petals) { //亢奋花瓣
            return game_data_props.excited_petals;
        }
        else if (prop_id == props.clip) { //夹子
            return game_data_props.clip_props;
        }
        else if (prop_id == props.landmine) { //地雷
            return game_data_props.landmine_props;
        }
        else if (prop_id == props.spring) { //弹簧
            return game_data_props.spring_props;
        }
        else if (prop_id == props.turtle_shell) { //无敌龟壳
            return game_data_props.turtle_shell;
        }
        else if (prop_id == props.banana) { //香蕉
            return game_data_props.banana;
        }
        else if (prop_id == props.watermelon_rind) { //西瓜皮
            return game_data_props.watermelon_rind_props;
        }
        else if (prop_id == props.red_mushroom) { //红蘑菇
            return game_data_props.red_mushroom;
        }
        else if (prop_id == props.gacha) { //扭蛋
            return game_data_props.gacha;
        }
        else if (prop_id == props.fake_dice) { //假骰子
            return game_data_props.fake_dice;
        }
        return null;
    }

    public static set_prop_prefab(grid:number, prop_prefab:Prefab) {
        let tile_pos = game_data_def.game_data.mapPlayground.get(grid);
        let target_x = tile_pos.x * 64 + 32 - game_data_def.game_data.layout_half_width;
        let target_y = tile_pos.y * 64 + 32 - game_data_def.game_data.layout_half_height;

        let prop_instance = instantiate(prop_prefab);
        game_data_def.game_data.map.node.insertChild(prop_instance, game_data_def.game_data.effect_index);
        prop_instance.setPosition(target_x, target_y);

        game_data_props.mapProps.set(grid, prop_instance);
    }

    public static set_prop(info:prop_info[]) {
        for (let prop_info of info) {
            let prop_prefab = game_data_props.get_prop_prefab(prop_info.prop_id);
            game_data_props.set_prop_prefab(prop_info.grid, prop_prefab);
        }
    }
}