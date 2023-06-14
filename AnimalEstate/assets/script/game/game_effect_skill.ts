import { _decorator, Canvas, Component, Button, Node, Sprite, Animation, Prefab, instantiate, NodeEventType, Label } from 'cc';
const { ccclass, property } = _decorator;

import { skill, play_active_state, animal_game_info } from '../serverSDK/common';

import * as singleton from '../netDriver/netSingleton';

import * as game_data_def from './global_game_data/game_data_def';

@ccclass('main_game_effect_skill')
export class main_game_effect_skill extends Component {
    @property(Canvas)
    main_canvas:Canvas = null;

    @property(Prefab)
    phantom_dice:Prefab = null;
    @property(Prefab)
    heidong:Prefab = null;
    @property(Prefab)
    altec_lightwave:Prefab = null;
    @property(Prefab)
    preemptive_strike:Prefab = null;

    @property(Prefab)
    altec_lightwave_ui:Prefab = null;
    @property(Prefab)
    step_lotus_ui:Prefab = null;
    @property(Prefab)
    soul_moving_ui:Prefab = null;
    @property(Prefab)
    preemptiv_strike_ui:Prefab = null;
    @property(Prefab)
    swap_places_ui:Prefab = null;
    @property(Prefab)
    thief_reborn_ui:Prefab = null;
    @property(Prefab)
    phantom_dice_ui:Prefab = null;
    @property(Prefab)
    skill_is_used:Prefab = null;
    
    @property(Prefab)
    cd0:Prefab = null;
    @property(Prefab)
    cd1:Prefab = null;
    @property(Prefab)
    cd2:Prefab = null;
    @property(Prefab)
    cd3:Prefab = null;
    @property(Prefab)
    cd4:Prefab = null;

    @property(Prefab)
    soul_moving_vfx:Prefab = null;
    @property(Prefab)
    altec_lightwave_vfx:Prefab = null;
    @property(Prefab)
    step_lotus_vfx:Prefab = null;
    @property(Prefab)
    preemptiv_strike_vfx:Prefab = null;
    @property(Prefab)
    swap_places_vfx:Prefab = null;
    @property(Prefab)
    thief_reborn_vfx:Prefab = null;
    @property(Prefab)
    phantom_dice_vfx:Prefab = null;

    @property(Sprite)
    select_player:Sprite = null;
    @property(Button)
    player1:Button = null;
    @property(Button)
    player2:Button = null;
    @property(Button)
    player3:Button = null;

    @property(Sprite)
    select_animal:Sprite = null;
    @property(Label)
    select_animal_player1:Label = null;
    @property(Sprite)
    select_animal_0_0:Sprite = null;
    @property(Label)
    select_animal_0_0_pos:Label = null;
    @property(Sprite)
    select_animal_0_1:Sprite = null;
    @property(Label)
    select_animal_0_1_pos:Label = null;
    @property(Sprite)
    select_animal_0_2:Sprite = null;
    @property(Label)
    select_animal_0_2_pos:Label = null;
    @property(Label)
    select_animal_player2:Label = null;
    @property(Sprite)
    select_animal_1_0:Sprite = null;
    @property(Label)
    select_animal_1_0_pos:Label = null;
    @property(Sprite)
    select_animal_1_1:Sprite = null;
    @property(Label)
    select_animal_1_1_pos:Label = null;
    @property(Sprite)
    select_animal_1_2:Sprite = null;
    @property(Label)
    select_animal_1_2_pos:Label = null;
    @property(Label)
    select_animal_player3:Label = null;
    @property(Sprite)
    select_animal_2_0:Sprite = null;
    @property(Label)
    select_animal_2_0_pos:Label = null;
    @property(Sprite)
    select_animal_2_1:Sprite = null;
    @property(Label)
    select_animal_2_1_pos:Label = null;
    @property(Sprite)
    select_animal_2_2:Sprite = null;
    @property(Label)
    select_animal_2_2_pos:Label = null;

    @property(Sprite)
    select_self_animal:Sprite = null;
    @property(Sprite)
    select_animal_0:Sprite = null;
    @property(Sprite)
    select_animal_1:Sprite = null;
    @property(Sprite)
    select_animal_2:Sprite = null;

    @property(Sprite)
    skillBtn:Sprite = null;

    private round:number = 0;
    private skill_is_use:boolean = false;
    private is_skill:boolean = true;
    private target_guid:number = 0;
    private target_animal_index:number = 0;

    private skill_can_not_use_instance:Node = null;

    private init_btn_event(ev_type:NodeEventType) {
        this.player1.node.on(ev_type, this.choose_player1, this);
        this.player2.node.on(ev_type, this.choose_player2, this);
        this.player3.node.on(ev_type, this.choose_player3, this);

        this.select_animal_0_0.node.on(ev_type, this.choose_animal_0_0, this);
        this.select_animal_0_1.node.on(ev_type, this.choose_animal_0_1, this);
        this.select_animal_0_2.node.on(ev_type, this.choose_animal_0_2, this);
        this.select_animal_1_0.node.on(ev_type, this.choose_animal_1_0, this);
        this.select_animal_1_1.node.on(ev_type, this.choose_animal_1_1, this);
        this.select_animal_1_2.node.on(ev_type, this.choose_animal_1_2, this);
        this.select_animal_2_0.node.on(ev_type, this.choose_animal_2_0, this);
        this.select_animal_2_1.node.on(ev_type, this.choose_animal_2_1, this);
        this.select_animal_2_2.node.on(ev_type, this.choose_animal_2_2, this);

        this.select_animal_0.node.on(ev_type, this.choose_self_animal_0, this);
        this.select_animal_1.node.on(ev_type, this.choose_self_animal_1, this);
        this.select_animal_2.node.on(ev_type, this.choose_self_animal_2, this);

        this.skillBtn.node.on(ev_type, this.cb_use_skill, this)
    }

    private skill_prefab:Prefab = null;
    private on_cb_animal_order() {
        let player = singleton.netSingleton.game.get_player_game_info(singleton.netSingleton.login.player_info.guid);
        switch(player.skill_id) {
            case skill.altec_lightwave:
            {
                this.skill_prefab = this.altec_lightwave_ui;
            }
            break;

            case skill.phantom_dice:
            {
                this.skill_prefab = this.phantom_dice_ui;
            }
            break;

            case skill.preemptiv_strike:
            {
                this.skill_prefab = this.preemptiv_strike_ui;
            }
            break;

            case skill.soul_moving_method:
            {
                this.skill_prefab = this.soul_moving_ui;
            }
            break;

            case skill.step_lotus:
            {
                this.skill_prefab = this.step_lotus_ui;
            }
            break;

            case skill.swap_places:
            {
                this.skill_prefab = this.swap_places_ui;
            }
            break;

            case skill.thief_reborn:
            {
                this.skill_prefab = this.thief_reborn_ui;
            }
            break;
        }

        this.skillBtn.node.removeAllChildren();
        let skill_instance = instantiate(this.skill_prefab);
        this.skillBtn.node.addChild(skill_instance);
        if (this.skill_is_use) {
            this.skill_can_not_use_instance = instantiate(this.skill_is_used);
            this.skillBtn.node.addChild(this.skill_can_not_use_instance);
        }
        else {
            this.skill_can_not_use_instance = instantiate(this.cd0);
            this.skillBtn.node.addChild(this.skill_can_not_use_instance);
        }

        console.log("cb_animal_order");
    }

    start() {
        this.round = 0;
        this.skill_is_use = false;
        this.is_skill = true;
        this.target_guid = 0;
        this.target_animal_index = 0;
        this.skill_can_not_use_instance = null;

        singleton.netSingleton.game.cb_turn_player_round.push(this.on_cb_turn_player_round.bind(this));
        singleton.netSingleton.game.cb_use_skill = this.on_cb_use_skill.bind(this);
        singleton.netSingleton.game.cb_animal_order.push(this.on_cb_animal_order.bind(this));

        let game_info = singleton.netSingleton.game.get_player_game_info(singleton.netSingleton.login.player_info.guid);
        if (game_info) {
            this.skill_is_use = game_info.skill_is_used;
        }

        this.on_cb_animal_order();
        this.init_btn_event(Node.EventType.TOUCH_START);
    }

    private is_active = false;
    private on_cb_turn_player_round(guid:number, active_state:play_active_state, animal_index:number, round:number) {
        if (guid == singleton.netSingleton.login.player_info.guid) {
            if (round == 1) {
                this.skillBtn.node.removeChild(this.skill_can_not_use_instance);
                this.skill_can_not_use_instance.destroy();
                this.skill_can_not_use_instance = instantiate(this.cd1);
                this.skillBtn.node.addChild(this.skill_can_not_use_instance);
            }
            else if (round == 2) {
                this.skillBtn.node.removeChild(this.skill_can_not_use_instance);
                this.skill_can_not_use_instance.destroy();
                this.skill_can_not_use_instance = instantiate(this.cd2);
                this.skillBtn.node.addChild(this.skill_can_not_use_instance);
            }
            else if (round == 3) {
                this.skillBtn.node.removeChild(this.skill_can_not_use_instance);
                this.skill_can_not_use_instance.destroy();
                this.skill_can_not_use_instance = instantiate(this.cd3);
                this.skillBtn.node.addChild(this.skill_can_not_use_instance);
            }
            else if (round == 4) {
                this.skillBtn.node.removeChild(this.skill_can_not_use_instance);
                this.skill_can_not_use_instance.destroy();
                this.skill_can_not_use_instance = instantiate(this.cd4);
                this.skillBtn.node.addChild(this.skill_can_not_use_instance);
            }
            else if (round >= 5 && !this.skill_is_use && this.skill_can_not_use_instance) {
                this.is_active = true;
                this.skillBtn.node.removeAllChildren();
                this.skill_can_not_use_instance.destroy();
                this.skill_can_not_use_instance = null;
                let skill_instance = instantiate(this.skill_prefab);
                this.skillBtn.node.addChild(skill_instance);
            }
        }
    }

    private async cb_use_skill() {
        console.log("cb_use_skill begin! skill_is_use:", this.skill_is_use);
        if (this.skill_is_use) {
            return;
        }
        console.log("cb_use_skill start! is_active:", this.is_active);
        if (!this.is_active) {
            return;
        }
        console.log("cb_use_skill ready! current_guid:" + singleton.netSingleton.game.current_guid + " self_guid:" + singleton.netSingleton.login.player_info.guid);
        if (singleton.netSingleton.game.current_guid != singleton.netSingleton.login.player_info.guid) {
            return;
        }

        let player = singleton.netSingleton.game.get_player_game_info(singleton.netSingleton.login.player_info.guid);
        if (player.skill_id == skill.phantom_dice || player.skill_id == skill.preemptiv_strike) {
            singleton.netSingleton.game.use_skill(this.target_guid, this.target_animal_index);
        }
        else if (player.skill_id == skill.thief_reborn) {
            game_data_def.game_data.init_select_player_ui();
            this.select_player.node.active = true;
        }
        else if (player.skill_id == skill.altec_lightwave) {
            game_data_def.game_data.init_select_animal_ui();
            this.select_animal.node.active = true;
        }
        else if (player.skill_id == skill.step_lotus) {
            await this.call_select_self_animal();
            singleton.netSingleton.game.use_skill(this.target_guid, this.target_animal_index);
        }
        else if (player.skill_id == skill.soul_moving_method || player.skill_id == skill.swap_places) {
            await this.call_select_self_animal();
            game_data_def.game_data.init_select_animal_ui();
            this.select_animal.node.active = true;
        }
        game_data_def.game_data.waitDice = false;

        this.skill_can_not_use_instance = instantiate(this.skill_is_used);
        this.skillBtn.node.addChild(this.skill_can_not_use_instance);
    }

    private resolve : (info:string) => void ;
    private async call_select_self_animal() {
        game_data_def.game_data.init_select_self_animal_ui();
        this.select_self_animal.node.active = true;
        return new Promise((resolve, reject)=>{
            this.resolve = resolve;
        });
    }

    private choose_player1() {
        if (!this.skill_is_use) {
            if (this.is_skill) {
                this.is_skill = false;
                this.skill_is_use = true;
                this.target_guid = game_data_def.game_data.player1_guid;
                singleton.netSingleton.game.use_skill(this.target_guid, this.target_animal_index);
                this.select_player.node.active = false;
            }
        }
    }

    private choose_player2() {
        if (!this.skill_is_use) {
            if (this.is_skill) {
                this.is_skill = false;
                this.skill_is_use = true;
                this.target_guid = game_data_def.game_data.player2_guid;
                singleton.netSingleton.game.use_skill(this.target_guid, this.target_animal_index);
                this.select_player.node.active = false;
            }
        }
    }

    private choose_player3() {
        if (!this.skill_is_use) {
            if (this.is_skill) {
                this.is_skill = false;
                this.skill_is_use = true;
                this.target_guid = game_data_def.game_data.player3_guid;
                singleton.netSingleton.game.use_skill(this.target_guid, this.target_animal_index);
                this.select_player.node.active = false;
            }
        }
    }

    private choose_animal_0_0() {
        if (!this.skill_is_use) {
            if (this.is_skill) {
                this.is_skill = false;
                this.skill_is_use = true;
                this.target_guid = game_data_def.game_data.player1_guid;
                this.target_animal_index = 0;
                singleton.netSingleton.game.use_skill(this.target_guid, this.target_animal_index);
                this.select_animal.node.active = false;
            }
        }
    }

    private choose_animal_0_1() {
        if (!this.skill_is_use) {
            if (this.is_skill) {
                this.is_skill = false;
                this.skill_is_use = true;
                this.target_guid = game_data_def.game_data.player1_guid;
                this.target_animal_index = 1;
                singleton.netSingleton.game.use_skill(this.target_guid, this.target_animal_index);
                this.select_animal.node.active = false;
            }
        }
    }

    private choose_animal_0_2() {
        if (!this.skill_is_use) {
            if (this.is_skill) {
                this.is_skill = false;
                this.skill_is_use = true;
                this.target_guid = game_data_def.game_data.player1_guid;
                this.target_animal_index = 2;
                singleton.netSingleton.game.use_skill(this.target_guid, this.target_animal_index);
                this.select_animal.node.active = false;
            }
        }
    }

    private choose_animal_1_0() {
        if (!this.skill_is_use) {
            if (this.is_skill) {
                this.is_skill = false;
                this.skill_is_use = true;
                this.target_guid = game_data_def.game_data.player2_guid;
                this.target_animal_index = 0;
                singleton.netSingleton.game.use_skill(this.target_guid, this.target_animal_index);
                this.select_animal.node.active = false;
            }
        }
    }

    private choose_animal_1_1() {
        if (!this.skill_is_use) {
            if (this.is_skill) {
                this.is_skill = false;
                this.skill_is_use = true;
                this.target_guid = game_data_def.game_data.player2_guid;
                this.target_animal_index = 1;
                singleton.netSingleton.game.use_skill(this.target_guid, this.target_animal_index);
                this.select_animal.node.active = false;
            }
        }
    }

    private choose_animal_1_2() {
        if (!this.skill_is_use) {
            if (this.is_skill) {
                this.is_skill = false;
                this.skill_is_use = true;
                this.target_guid = game_data_def.game_data.player2_guid;
                this.target_animal_index = 2;
                singleton.netSingleton.game.use_skill(this.target_guid, this.target_animal_index);
                this.select_animal.node.active = false;
            }
        }
    }

    private choose_animal_2_0() {
        if (!this.skill_is_use) {
            if (this.is_skill) {
                this.is_skill = false;
                this.skill_is_use = true;
                this.target_guid = game_data_def.game_data.player3_guid;
                this.target_animal_index = 0;
                singleton.netSingleton.game.use_skill(this.target_guid, this.target_animal_index);
                this.select_animal.node.active = false;
            }
        }
    }

    private choose_animal_2_1() {
        if (!this.skill_is_use) {
            if (this.is_skill) {
                this.is_skill = false;
                this.skill_is_use = true;
                this.target_guid = game_data_def.game_data.player3_guid;
                this.target_animal_index = 1;
                singleton.netSingleton.game.use_skill(this.target_guid, this.target_animal_index);
                this.select_animal.node.active = false;
            }
        }
    }

    private choose_animal_2_2() {
        if (!this.skill_is_use) {
            if (this.is_skill) {
                this.is_skill = false;
                this.skill_is_use = true;
                this.target_guid = game_data_def.game_data.player3_guid;
                this.target_animal_index = 2;
                singleton.netSingleton.game.use_skill(this.target_guid, this.target_animal_index);
                this.select_animal.node.active = false;
            }
        }
    }

    private choose_self_animal_0() {
        if (!this.skill_is_use) {
            if (this.is_skill) {
                singleton.netSingleton.game.choose_animal(0);
                this.select_self_animal.node.active = false;
                this.resolve("choose_self_animal_0");
            }
        }
    }

    private choose_self_animal_1() {
        if (!this.skill_is_use) {
            if (this.is_skill) {
                singleton.netSingleton.game.choose_animal(1);
                this.select_self_animal.node.active = false;
                this.resolve("choose_self_animal_1");
            }
        }
    }

    private choose_self_animal_2() {
        if (!this.skill_is_use) {
            if (this.is_skill) {
                singleton.netSingleton.game.choose_animal(2);
                this.select_self_animal.node.active = false;
                this.resolve("choose_self_animal_2");
            }
        }
    }

    private phantom_dice_exhibit_count = 3;
    private phantom_dice_exhibit_instance:Node = null;
    private phantom_dice_exhibit_state = true;
    private phantom_dice_exhibit(_animal:any) {
        this.phantom_dice_exhibit_state = !this.phantom_dice_exhibit_state;
        this.phantom_dice_exhibit_instance.active = this.phantom_dice_exhibit_state;

        this.phantom_dice_exhibit_count--;
        if (this.phantom_dice_exhibit_count > 0) {
            setTimeout(() => {
                this.phantom_dice_exhibit(_animal);
            }, 300);
        }
        else {
            _animal.removeChild(this.phantom_dice_exhibit_instance);
            this.phantom_dice_exhibit_instance.destroy();
            this.phantom_dice_exhibit_instance = null;

            game_data_def.game_data.set_idle(_animal);
        }
    }

    private set_phantom_dice(guid:number) {
        let player = singleton.netSingleton.game.get_player_game_info(guid);
        let animal = player.animal_info[player.current_animal_index];
        game_data_def.game_data.set_camera_pos_animal(animal);

        game_data_def.game_data.set_prompt(`玩家${player.name}使用了技能幻影色子,之后五个回合,他的色子都会投出6`);

        game_data_def.game_data.set_gain(guid);

        this.show_skill_vfx(this.phantom_dice_vfx);

        let animal_map = game_data_def.game_data.PlayerAnimalMap.get(guid);
        let _animal = animal_map.get(player.current_animal_index);
        this.phantom_dice_exhibit_instance = instantiate(this.phantom_dice);
        _animal.addChild(this.phantom_dice_exhibit_instance);
        this.phantom_dice_exhibit_instance.setScale(0.33, 0.33);
        this.phantom_dice_exhibit_instance.setPosition(0, 64);
        setTimeout(() => {
            this.phantom_dice_exhibit(_animal);
        }, 300);
    }

    private show_skill_vfx(vfx_prefab:Prefab) {
        let soul_moving_vfx_ins = instantiate(vfx_prefab);
        this.main_canvas.node.addChild(soul_moving_vfx_ins);
        let animationComponent = soul_moving_vfx_ins.getComponent(Animation);
        const [ clip ] = animationComponent.clips;
        animationComponent.play(clip.name);

        setTimeout(() => {
            soul_moving_vfx_ins.active = false;
            this.main_canvas.node.removeChild(soul_moving_vfx_ins);
            soul_moving_vfx_ins.destroy();
        }, 2200);
    }

    private reset_role_box(animal_index:number, animal_id:number) {
        let role_box:Sprite = null;
            if (animal_index == 0) {
                role_box = game_data_def.game_data.role1;
            }
            else if (animal_index == 1) {
                role_box = game_data_def.game_data.role2;
            }
            else if (animal_index == 2) {
                role_box = game_data_def.game_data.role3;
            }

            role_box.node.removeAllChildren();
            let animal_prefab = game_data_def.game_data.get_animal_prefab(animal_id);
            let animal_instance = instantiate(animal_prefab);

            let label_node = animal_instance.getChildByName("name")
            let label = label_node.getComponent(Label);
            label.string = "";
            
            role_box.node.addChild(animal_instance);
    }

    private async show_top_flashing_rename(_animal:Node, animal:animal_game_info, name:string) {
        game_data_def.game_data.set_camera_pos_animal(animal);
        game_data_def.game_data.show_top(_animal, animal.current_pos);
        await game_data_def.game_data.flashing(_animal, false);
        await game_data_def.game_data.flashing(_animal, true);
        await game_data_def.game_data.flashing(_animal, false);
        await game_data_def.game_data.flashing(_animal, true);
        let label_node = _animal.getChildByName("name")
        let label = label_node.getComponent(Label);
        label.string = name;
    }

    private async set_soul_moving(guid:number, animal_index:number, target_guid:number, target_animal_index:number) {
        let player = singleton.netSingleton.game.get_player_game_info(guid);
        let animal = player.animal_info[animal_index];
        let target_player = singleton.netSingleton.game.get_player_game_info(target_guid);
        let target_animal = target_player.animal_info[target_animal_index];

        game_data_def.game_data.set_prompt(`玩家${player.name}对玩家${target_player.name}使用了技能移魂大法,\n
            双方角色${game_data_def.game_constant_data.animal_name(animal.animal_id)}和
            ${game_data_def.game_constant_data.animal_name(target_animal.animal_id)}发生交换`);

        this.show_skill_vfx(this.soul_moving_vfx);
        
        let animal_map = game_data_def.game_data.PlayerAnimalMap.get(guid);
        let _animal = animal_map.get(animal_index);
        let target_animal_map = game_data_def.game_data.PlayerAnimalMap.get(target_guid);
        let _target_animal = target_animal_map.get(target_animal_index);

        if (guid == singleton.netSingleton.login.player_info.guid) {
            this.reset_role_box(animal_index, target_animal.animal_id);
        }
        else if (target_guid == singleton.netSingleton.login.player_info.guid) {
            this.reset_role_box(target_animal_index, animal.animal_id);
        }

        animal.current_pos = animal.current_pos < 0 ? 0 : animal.current_pos;
        target_animal.current_pos = target_animal.current_pos < 0 ? 0 : target_animal.current_pos;

        await this.show_top_flashing_rename(_animal, animal, target_player.name);
        await this.show_top_flashing_rename(_target_animal, target_animal, player.name);
        
        player.animal_info[animal_index] = target_animal;
        target_player.animal_info[target_animal_index] = animal;

        animal_map.set(animal_index, _target_animal);
        target_animal_map.set(target_animal_index, _animal);
    }

    private async set_swap_places(guid:number, animal_index:number, target_guid:number, target_animal_index:number) {
        let player = singleton.netSingleton.game.get_player_game_info(guid);
        let animal = player.animal_info[animal_index];
        let target_player = singleton.netSingleton.game.get_player_game_info(target_guid);
        let target_animal = target_player.animal_info[target_animal_index];

        game_data_def.game_data.set_prompt(`玩家${player.name}对玩家${target_player.name}使用了技能移形换影,\n
            双方角色${game_data_def.game_constant_data.animal_name(animal.animal_id)}和
            ${game_data_def.game_constant_data.animal_name(target_animal.animal_id)}交换位置`);

        this.show_skill_vfx(this.swap_places_vfx);

        let pos = animal.current_pos;
        animal.current_pos = target_animal.current_pos;
        target_animal.current_pos = pos;

        animal.current_pos = animal.current_pos < 0 ? 0 : animal.current_pos;
        target_animal.current_pos = target_animal.current_pos < 0 ? 0 : target_animal.current_pos;

        let animal_map = game_data_def.game_data.PlayerAnimalMap.get(guid);
        let _animal = animal_map.get(animal_index);
        let target_animal_map = game_data_def.game_data.PlayerAnimalMap.get(target_guid);
        let _target_animal = target_animal_map.get(target_animal_index);

        await game_data_def.game_data.show_top_flashing_del(_animal, animal);
        var new_animal_instance = await game_data_def.game_data.set_new_animal(animal.animal_id, animal.current_pos, player.name);
        animal_map.set(animal_index, new_animal_instance);

        await game_data_def.game_data.show_top_flashing_del(_target_animal, target_animal);
        var new_target_animal_instance = await game_data_def.game_data.set_new_animal(target_animal.animal_id, target_animal.current_pos, target_player.name);
        target_animal_map.set(target_animal_index, new_target_animal_instance);
    }

    private async animation_thief_reborn(guid:number) {
        let player = singleton.netSingleton.game.get_player_game_info(guid);
        let animal = player.animal_info[player.current_animal_index];
        let animal_map = game_data_def.game_data.PlayerAnimalMap.get(guid);
        let _animal = animal_map.get(player.current_animal_index);

        let animationComponent = _animal.getComponent(Animation);
        const [ idleClip, runClip, negativeClip, gainClip, tianleiClip, zhadanClip, thiefClip, altecLightwaveClip, resetPosClip ] = animationComponent.clips;;
        animationComponent.play(thiefClip.name);

        let heidong_instance = instantiate(this.heidong);
        _animal.addChild(heidong_instance);
        heidong_instance.setScale(0.66, 0.66);
        heidong_instance.setPosition(56, 0);

        return new Promise((resolve, reject)=>{
            setTimeout(() => {
                game_data_def.game_data.set_idle(_animal);
                _animal.removeChild(heidong_instance);
                heidong_instance.destroy();
                resolve("end thief reborn animation");
            }, 1000)
        });
    }

    private async set_thief_reborn(guid:number, target_guid:number) {
        let player = singleton.netSingleton.game.get_player_game_info(guid);
        let animal = player.animal_info[player.current_animal_index];
        let target_player = singleton.netSingleton.game.get_player_game_info(target_guid);
        let target_animal = target_player.animal_info[target_player.current_animal_index];

        game_data_def.game_data.set_prompt(`玩家${player.name}对玩家${target_player.name}使用了技能神偷再世,\n
            偷取玩家${target_player.name}的所有道具并且可以在这个回合使用三次道具`);

        this.show_skill_vfx(this.thief_reborn_vfx);

        game_data_def.game_data.set_camera_pos_animal(animal);
        await this.animation_thief_reborn(guid);

        game_data_def.game_data.set_camera_pos_animal(target_animal);
        await game_data_def.game_data.set_negative_await(target_guid, target_player.current_animal_index);
    }

    private async set_altec_lightwave(guid:number, target_guid:number, target_animal_index:number) {
        let player = singleton.netSingleton.game.get_player_game_info(guid);
        let target_player = singleton.netSingleton.game.get_player_game_info(target_guid);
        let target_animal = target_player.animal_info[target_player.current_animal_index];

        game_data_def.game_data.set_prompt(`玩家${player.name}对玩家${target_player.name}的
            角色${game_data_def.game_constant_data.animal_name(target_animal.animal_id)}使用了技能奥特光波,\n
            角色${game_data_def.game_constant_data.animal_name(target_animal.animal_id)}沉睡十回合`);

        this.show_skill_vfx(this.altec_lightwave_vfx);

        let animal_map = game_data_def.game_data.PlayerAnimalMap.get(target_guid);
        let _animal = animal_map.get(target_animal_index);

        game_data_def.game_data.set_camera_pos_animal(target_animal);

        let animationComponent = _animal.getComponent(Animation);
        const [ idleClip, runClip, negativeClip, gainClip, tianleiClip, zhadanClip, thiefClip, altecLightwaveClip, resetPosClip ] = animationComponent.clips;
        animationComponent.play(altecLightwaveClip.name);

        let altec_lightwave_instance = instantiate(this.altec_lightwave);
        _animal.addChild(altec_lightwave_instance);
        altec_lightwave_instance.setPosition(0, 64);

        return new Promise((resolve, reject)=>{
            setTimeout(() => {
                game_data_def.game_data.set_idle(_animal);
                _animal.removeChild(altec_lightwave_instance);
                altec_lightwave_instance.destroy();
                resolve("end thief reborn animation");
            }, 1000)
        });
    }

    private async set_preemptive_strike(guid:number) {
        let player = singleton.netSingleton.game.get_player_game_info(guid);
        let animal = player.animal_info[player.current_animal_index];
        let animal_map = game_data_def.game_data.PlayerAnimalMap.get(guid);
        let _animal = animal_map.get(player.current_animal_index);

        game_data_def.game_data.set_prompt(`玩家${player.name}使用了技能先发制人,\n
            玩家${player.name}每轮第一个行动，并且摇到3以下就额外行动一次`);

        this.show_skill_vfx(this.preemptiv_strike_vfx);

        let preemptive_strike_instance = instantiate(this.preemptive_strike);
        _animal.addChild(preemptive_strike_instance);
        preemptive_strike_instance.setPosition(0, 64);

        game_data_def.game_data.set_camera_pos_animal(animal);
    
        return new Promise((resolve, reject)=>{
            setTimeout(() => {
                game_data_def.game_data.set_idle(_animal);
                _animal.removeChild(preemptive_strike_instance);
                preemptive_strike_instance.destroy();
                resolve("end preemptive strike animation");
            }, 1000)
        });
    }

    private async on_cb_use_skill(guid:number, animal_index:number, target_guid:number, target_animal_index:number) {
        console.log(`cb_use_skill guid:${guid}, target_guid:${target_guid}, target_animal_index:${target_animal_index}`);

        if (guid == singleton.netSingleton.login.player_info.guid) {
            this.skill_is_use = true;
        }

        let player_game_info = singleton.netSingleton.game.get_player_game_info(guid);
        if (player_game_info.skill_id == skill.phantom_dice) { //幻影骰子
            this.set_phantom_dice(guid);
        }
        else if (player_game_info.skill_id == skill.soul_moving_method) { //移魂大法
            await this.set_soul_moving(guid, animal_index, target_guid, target_animal_index);
        }
        else if (player_game_info.skill_id == skill.thief_reborn) { //神偷再世
            await this.set_thief_reborn(guid, target_guid);
        }
        else if (player_game_info.skill_id == skill.step_lotus) { //步步生莲
            let animal = player_game_info.animal_info[player_game_info.current_animal_index];
            game_data_def.game_data.set_prompt(`玩家${player_game_info.name}的角色
                ${game_data_def.game_constant_data.animal_name(animal.animal_id)}使用了技能步步生莲,\n
                角色${game_data_def.game_constant_data.animal_name(animal.animal_id)}走过的地方以30%的概率生成一个(夹子/地雷/弹簧)持续五个回合`);
            
            this.show_skill_vfx(this.step_lotus_vfx);
        }
        else if (player_game_info.skill_id == skill.preemptiv_strike) { //先发制人
            await this.set_preemptive_strike(guid);
        }
        else if (player_game_info.skill_id == skill.swap_places) { //移形换影
            await this.set_swap_places(guid, animal_index, target_guid, target_animal_index);
        }
        else if (player_game_info.skill_id == skill.altec_lightwave) { //奥特光波
            await this.set_altec_lightwave(guid, target_guid, target_animal_index);
        }
    }
}