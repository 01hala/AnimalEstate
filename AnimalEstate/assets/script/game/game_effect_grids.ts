import { _decorator, Component, Animation, Prefab, instantiate, Label } from 'cc';
const { ccclass, property } = _decorator;

import { effect } from '../serverSDK/common';
import { effect_info } from '../serverSDK/gamecallc';

import * as singleton from '../netDriver/netSingleton';

import * as game_data_def from './global_game_data/game_data_def';
import * as game_data_effect from './global_game_data/game_effect_def';

@ccclass('main_game_effect_grids')
export class main_game_effect_grids extends Component {
    @property(Prefab)
    muddy1:Prefab = null;
    @property(Prefab)
    muddy2:Prefab = null;
    @property(Prefab)
    muddy3:Prefab = null;
    @property(Prefab)
    golden_apple:Prefab = null;
    @property(Prefab)
    rice_ear:Prefab = null;
    @property(Prefab)
    monkey_wine:Prefab = null;
    @property(Prefab)
    clip:Prefab = null;
    @property(Prefab)
    landmine:Prefab = null;
    @property(Prefab)
    spring:Prefab = null;
    @property(Prefab)
    watermelon_rind:Prefab = null;

    @property(Label)
    prompt_box:Label = null;

    start() {
        game_data_def.game_data.prompt_box = this.prompt_box;

        game_data_effect.game_data_effect.muddy1 = this.muddy1;
        game_data_effect.game_data_effect.muddy2 = this.muddy2;
        game_data_effect.game_data_effect.muddy3 = this.muddy3;
        game_data_effect.game_data_effect.golden_apple = this.golden_apple;
        game_data_effect.game_data_effect.rice_ear = this.rice_ear;
        game_data_effect.game_data_effect.monkey_wine = this.monkey_wine;
        game_data_effect.game_data_effect.clip = this.clip;
        game_data_effect.game_data_effect.landmine = this.landmine;
        game_data_effect.game_data_effect.spring = this.spring;
        game_data_effect.game_data_effect.watermelon_rind = this.watermelon_rind;

        singleton.netSingleton.game.cb_ntf_effect_info = this.on_cb_ntf_effect_info.bind(this);
        singleton.netSingleton.game.cb_ntf_new_effect_info = this.on_cb_ntf_new_effect_info.bind(this);
        singleton.netSingleton.game.cb_remove_effect = this.on_cb_remove_effect.bind(this);
        singleton.netSingleton.game.cb_remove_muddy = this.on_cb_remove_muddy.bind(this);
        singleton.netSingleton.game.cb_ntf_player_stepped_effect = this.on_cb_ntf_player_stepped_effect.bind(this);

        this.prompt_box.node.active = false;
    }

    set_effect_prefab_flashing(grid:number, effect_prefab:Prefab, is_animation:boolean) {
        let tile_pos = game_data_def.game_data.mapPlayground.get(grid);
        let target_x = tile_pos.x * 64 + 32 - game_data_def.game_data.layout_half_width;
        let target_y = tile_pos.y * 64 + 32 - game_data_def.game_data.layout_half_height;

        game_data_effect.game_data_effect.remove_effect(grid);

        let effect_instance = instantiate(effect_prefab);
        game_data_def.game_data.map.node.addChild(effect_instance);
        effect_instance.setPosition(target_x, target_y);

        if (!is_animation){
            let effect_list = game_data_effect.game_data_effect.mapEffect.get(grid);
            if (!effect_list) {
                game_data_effect.game_data_effect.mapEffect.set(grid, []);
                effect_list = game_data_effect.game_data_effect.mapEffect.get(grid);
            }
            effect_list.push(effect_instance);
        }
        else{
            let effect_list = game_data_effect.game_data_effect.mapAnimationEffect.get(grid);
            if (!effect_list) {
                game_data_effect.game_data_effect.mapAnimationEffect.set(grid, []);
                effect_list = game_data_effect.game_data_effect.mapAnimationEffect.get(grid);
            }
            effect_list.push(effect_instance);
        }

        setTimeout(() => {
            game_data_def.game_data.map.node.removeChild(effect_instance);
            game_data_def.game_data.map.node.insertChild(effect_instance, game_data_def.game_data.effect_index);
        }, 500);

    }

    on_cb_ntf_effect_info(info:effect_info[]) {
        game_data_effect.game_data_effect.set_effect(info);
    }

    on_cb_ntf_new_effect_info(info:effect_info) {
        if (info.effect_id == effect.muddy) {
            game_data_effect.game_data_effect.set_muddy_effect_prefab(info.grids);
            game_data_def.game_data.set_prompt(`下雨了路面变的泥泞,路面上的玩家移动能力减弱\n(每轮色子移动速度/1.5),持续3回合`);
        }
        else if (info.effect_id == effect.golden_apple) {
            game_data_effect.game_data_effect.set_effect_prefab(info.grids, this.golden_apple, false);
            game_data_def.game_data.set_prompt(`幸运女神的金苹果出现在赛场上,获得的玩家可以连续\n行动2次,持续3回合 然后休息1回合`);
        }
        else if (info.effect_id == effect.rice_ear) {
            game_data_effect.game_data_effect.set_effect_prefab(info.grids, this.rice_ear, false);
            game_data_def.game_data.set_prompt(`丰收女神的稻穗出现在赛场上,获得的玩家移动能力\n加强(每轮移动色子点数*1.5),持续3回合`);
        }
        else if (info.effect_id == effect.monkey_wine) {
            game_data_effect.game_data_effect.set_effect_prefab(info.grids, this.monkey_wine, false);
            game_data_def.game_data.set_prompt(`猴子酿造的美酒出现在赛场上,获得的休息1回合`);
        }
        else if (info.effect_id == effect.landmine) {
            this.set_effect_prefab_flashing(info.grids[0], this.landmine, false);
        }
        else if (info.effect_id == effect.watermelon_rind) {
            this.set_effect_prefab_flashing(info.grids[0], this.watermelon_rind, false);
        }
        else if (info.effect_id == effect.clip) {
            this.set_effect_prefab_flashing(info.grids[0], this.clip, true);
        }
        else if (info.effect_id == effect.spring) {
            this.set_effect_prefab_flashing(info.grids[0], this.spring, true);
        }

        console.log("on_cb_ntf_new_effect_info new_effect grid:", info.grids[0]);
        game_data_def.game_data.set_camera_pos_grid(info.grids[0]);
        game_data_def.game_data.current_move_obj = null;
    }

    on_cb_remove_effect(grids:number) {
        console.log("on_cb_remove_effect grids:", grids);
        game_data_def.game_data.set_camera_pos_grid(grids);
        game_data_effect.game_data_effect.remove_effect(grids);
    }

    on_cb_remove_muddy(grids:number[]) {
        console.log("on_cb_remove_muddy grids:", grids);
        game_data_def.game_data.set_camera_pos_grid(grids[0]);
        game_data_effect.game_data_effect.remove_muddy(grids);
    }

    private set_effect_animation(grid:number) {
        let old_effect_instance_list = game_data_effect.game_data_effect.mapAnimationEffect.get(grid);
        if (old_effect_instance_list) {
            for (let old_effect_instance of old_effect_instance_list) {
                let animationComponent = old_effect_instance.getComponent(Animation);
                const [ clip ] = animationComponent.clips;
                animationComponent.play(clip.name);
        
                game_data_def.game_data.map.node.removeChild(old_effect_instance);
                game_data_def.game_data.map.node.addChild(old_effect_instance);
            }
        }

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve("end animation");
            }, 500);
        });
    }

    async on_cb_ntf_player_stepped_effect(guid:number, effect_id:effect, grid:number, is_remove:boolean) {
        console.log(`on_cb_ntf_player_stepped_effect guid:${guid}, effect_id:${effect_id}, grid:${grid}, is_remove:${is_remove}`);

        game_data_def.game_data.set_camera_pos_grid(grid);

        let player = singleton.netSingleton.game.get_player_game_info(guid);
        let animal = player.animal_info[player.current_animal_index];

        if (effect_id == effect.golden_apple) {
            game_data_def.game_data.set_prompt(`玩家${player.name}获得了幸运女神的馈赠——金苹果,获得连续\n行动2次的能力,持续3回合 然后休息1回合`);
            game_data_def.game_data.set_gain(guid);
        }
        else if (effect_id == effect.rice_ear) {
            game_data_def.game_data.set_prompt(`玩家${player.name}获得了丰收女神的馈赠——丰收的稻穗，移动\n能力加强(每轮移动色子点数*1.5)，持续3回合`);
            game_data_def.game_data.set_gain(guid);
        }
        else if (effect_id == effect.monkey_wine) {
            game_data_def.game_data.set_prompt(`玩家${player.name}获得了猴子酿造的\n美酒——猴儿酒,休息1回合`);
            await game_data_def.game_data.set_negative_await(guid, player.current_animal_index);
        }
        else if (effect_id == effect.landmine) {
            game_data_def.game_data.set_prompt(`玩家${player.name}的
                ${game_data_def.game_constant_data.animal_name(animal.animal_id)}踩到了地雷,后退4格`);
            await game_data_def.game_data.set_negative_await(guid, player.current_animal_index);
        }
        else if (effect_id == effect.watermelon_rind) {
        }
        else if (effect_id == effect.clip) {
            game_data_def.game_data.set_prompt(`玩家${player.name}的
                ${game_data_def.game_constant_data.animal_name(animal.animal_id)}踩到了夹子,下回合无法移动`);
            await this.set_effect_animation(grid);
            await game_data_def.game_data.set_negative_await(guid, player.current_animal_index);
        }
        else if (effect_id == effect.spring) {
            game_data_def.game_data.set_prompt(`玩家${player.name}的
                ${game_data_def.game_constant_data.animal_name(animal.animal_id)}踩到了弹簧被弹回原地`);
            await this.set_effect_animation(grid);
            await game_data_def.game_data.set_negative_await(guid, player.current_animal_index);
        }

        if (is_remove) {
            game_data_effect.game_data_effect.remove_effect(grid);
        }
    }
}