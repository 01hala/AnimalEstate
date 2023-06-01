import { _decorator, Prefab, instantiate } from 'cc';

import { effect } from '../../serverSDK/common';
import { effect_info } from '../../serverSDK/gamecallc';

import * as game_data_def from './game_data_def';

export class game_data_effect {
    public static muddy1:Prefab = null;
    public static muddy2:Prefab = null;
    public static muddy3:Prefab = null;
    public static golden_apple:Prefab = null;
    public static rice_ear:Prefab = null;
    public static monkey_wine:Prefab = null;
    public static clip:Prefab = null;
    public static landmine:Prefab = null;
    public static spring:Prefab = null;
    public static watermelon_rind:Prefab = null;

    public static mapEffect:Map<number, any[]> = new Map<number, any[]>();
    public static mapAnimationEffect:Map<number, any[]> = new Map<number, any[]>();

    public static mapMuddy:Map<number, any> = new Map<number, any>();

    public static remove_all_effect() {
        game_data_effect.mapEffect.forEach((effect, grid) => {
            for (let old_effect_instance of effect) {
                old_effect_instance.active = false;
                game_data_def.game_data.map.node.removeChild(old_effect_instance);
            }
        });

        game_data_effect.mapAnimationEffect.forEach((effect, grid) => {
            for (let old_effect_instance of effect) {
                old_effect_instance.active = false;
                game_data_def.game_data.map.node.removeChild(old_effect_instance);
            }
        });

        game_data_effect.mapMuddy.forEach((effect, grid) => {
            for (let old_effect_instance of effect) {
                old_effect_instance.active = false;
                game_data_def.game_data.map.node.removeChild(old_effect_instance);
            }
        });
    }

    public static set_effect_prefab(grids:number[], effect_prefab:Prefab, is_animation:boolean) {
        for(let grid of grids) {
            let tile_pos = game_data_def.game_data.mapPlayground.get(grid);
            let target_x = tile_pos.x * 64 + 32 - game_data_def.game_data.layout_half_width;
            let target_y = tile_pos.y * 64 + 32 - game_data_def.game_data.layout_half_height;

            let effect_instance = instantiate(effect_prefab);
            game_data_def.game_data.map.node.insertChild(effect_instance, game_data_def.game_data.effect_index);
            effect_instance.setPosition(target_x, target_y);

            if (!is_animation){
                let effect_list = game_data_effect.mapEffect.get(grid);
                if (!effect_list) {
                    game_data_effect.mapEffect.set(grid, []);
                    effect_list = game_data_effect.mapEffect.get(grid);
                }
                effect_list.push(effect_instance);
            }
            else{
                let effect_list = game_data_effect.mapAnimationEffect.get(grid);
                if (!effect_list) {
                    game_data_effect.mapAnimationEffect.set(grid, []);
                    effect_list = game_data_effect.mapAnimationEffect.get(grid);
                }
                effect_list.push(effect_instance);
            }
        }
    }
    
    public static set_muddy(grids:number[], muddy:Prefab) {
        for(let grid of grids) {
            let tile_pos = game_data_def.game_data.mapPlayground.get(grid);
            let target_x = tile_pos.x * 64 + 32 - game_data_def.game_data.layout_half_width;
            let target_y = tile_pos.y * 64 + 32 - game_data_def.game_data.layout_half_height;

            let muddy_instance = instantiate(muddy);
            game_data_def.game_data.map.node.insertChild(muddy_instance, game_data_def.game_data.effect_index);
            muddy_instance.setPosition(target_x, target_y);

            game_data_effect.mapMuddy.set(grid, muddy_instance)
        }
    }

    public static remove_effect(grid:number) {
        let has_effect = true;

        let old_effect_instance_list = game_data_effect.mapEffect.get(grid);
        let old_effect_animation_instance_list = game_data_effect.mapAnimationEffect.get(grid);
        console.log(`remove_effect:${old_effect_instance_list}`)
        console.log(`remove_effect:${old_effect_animation_instance_list}`)
        if (old_effect_instance_list) {
            for (let old_effect_instance of old_effect_instance_list) {
                old_effect_instance.active = false;
                game_data_def.game_data.map.node.removeChild(old_effect_instance);
                old_effect_instance.destroy();
            }
        }
        else if (old_effect_animation_instance_list) {
            for (let old_effect_animation_instance of old_effect_animation_instance_list) {
                old_effect_animation_instance.active = false;
                game_data_def.game_data.map.node.removeChild(old_effect_animation_instance);
                old_effect_animation_instance.destroy();
            }
        }
        else {
            has_effect = false;
        }
        game_data_effect.mapEffect.delete(grid);
        game_data_effect.mapAnimationEffect.delete(grid);

        return has_effect;
    }

    public static remove_muddy(grids:number[]) {
        let has_effect = true;
        for(let grid of grids) {
            let old_effect_muddy_instance = game_data_effect.mapMuddy.get(grid);
            if (old_effect_muddy_instance) {
                old_effect_muddy_instance.active = false;
                game_data_def.game_data.map.node.removeChild(old_effect_muddy_instance);
                old_effect_muddy_instance.destroy();
            }
            else {
                has_effect = false;
            }
            game_data_effect.mapMuddy.delete(grid);
        }
        return has_effect;
    }

    public static set_muddy1(grids:number[]) {
        if (!game_data_effect.remove_muddy(grids)){
            return;
        }

        game_data_effect.set_muddy(grids, game_data_effect.muddy1);

        setTimeout(() => {
            game_data_effect.set_muddy2(grids);
        }, 600);
    }

    public static set_muddy2(grids:number[]) {
        if (!game_data_effect.remove_muddy(grids)){
            return;
        }

        game_data_effect.set_muddy(grids, game_data_effect.muddy2);

        setTimeout(() => {
            game_data_effect.set_muddy3(grids);
        }, 600);
    }

    public static set_muddy3(grids:number[]) {
        if (!game_data_effect.remove_muddy(grids)){
            return;
        }

        game_data_effect.set_muddy(grids, game_data_effect.muddy3);

        setTimeout(() => {
            game_data_effect.set_muddy1(grids);
        }, 600);
    }

    public static set_muddy_effect_prefab(grids:number[]) {
        game_data_effect.set_muddy(grids, game_data_effect.muddy1);

        setTimeout(() => {
            game_data_effect.set_muddy2(grids);
        }, 600);
    }

    public static set_effect(info:effect_info[]) {
        for (let effect_info of info) {
            if (effect_info.effect_id == effect.muddy) {
                game_data_effect.set_muddy_effect_prefab(effect_info.grids);
            }
            else if (effect_info.effect_id == effect.golden_apple) {
                game_data_effect.set_effect_prefab(effect_info.grids, game_data_effect.golden_apple, false);
            }
            else if (effect_info.effect_id == effect.rice_ear) {
                game_data_effect.set_effect_prefab(effect_info.grids, game_data_effect.rice_ear, false);
            }
            else if (effect_info.effect_id == effect.monkey_wine) {
                game_data_effect.set_effect_prefab(effect_info.grids, game_data_effect.monkey_wine, false);
            }
            else if (effect_info.effect_id == effect.landmine) {
                game_data_effect.set_effect_prefab(effect_info.grids, game_data_effect.landmine, false);
            }
            else if (effect_info.effect_id == effect.watermelon_rind) {
                game_data_effect.set_effect_prefab(effect_info.grids, game_data_effect.watermelon_rind, false);
            }
            else if (effect_info.effect_id == effect.clip) {
                game_data_effect.set_effect_prefab(effect_info.grids, game_data_effect.clip, true);
            }
            else if (effect_info.effect_id == effect.spring) {
                game_data_effect.set_effect_prefab(effect_info.grids, game_data_effect.spring, true);
            }
        }
    }
}