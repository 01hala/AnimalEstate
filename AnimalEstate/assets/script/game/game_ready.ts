import { _decorator, Component, NodeEventType, Node, Sprite, Prefab, instantiate, Label } from 'cc';
const { ccclass, property } = _decorator;

import { animal_game_info, animal, skill } from '../serverSDK/common';

import * as singleton from '../netDriver/netSingleton';

import * as game_data_def from './global_game_data/game_data_def';

@ccclass('main_game_ready')
export class main_game_ready extends Component {
    @property(Sprite)
    animal1:Sprite = null;
    @property(Sprite)
    animal2:Sprite = null;
    @property(Sprite)
    animal3:Sprite = null;
    @property(Sprite)
    animal4:Sprite = null;
    @property(Sprite)
    animal5:Sprite = null;
    @property(Sprite)
    animal6:Sprite = null;
    @property(Sprite)
    animal7:Sprite = null;
    @property(Sprite)
    animal8:Sprite = null;

    @property(Sprite)
    skill1:Sprite = null;
    @property(Sprite)
    skill2:Sprite = null;
    @property(Sprite)
    skill3:Sprite = null;
    @property(Sprite)
    skill4:Sprite = null;
    @property(Sprite)
    skill5:Sprite = null;
    @property(Sprite)
    skill6:Sprite = null;
    @property(Sprite)
    skill7:Sprite = null;
    @property(Sprite)
    skill8:Sprite = null;

    @property(Prefab)
    altec_lightwave:Prefab = null;
    @property(Prefab)
    step_lotus:Prefab = null;
    @property(Prefab)
    soul_moving:Prefab = null;
    @property(Prefab)
    preemptiv_strike:Prefab = null;
    @property(Prefab)
    swap_places:Prefab = null;
    @property(Prefab)
    thief_reborn:Prefab = null;
    @property(Prefab)
    phantom_dice:Prefab = null;

    @property(Prefab)
    select:Prefab = null;

    private selectAnimalMap:Map<animal, Node> = new Map<animal, Node>();
    private selectSkillMap:Map<skill, Node> = new Map<skill, Node>();

    private get_animal_instance(animal_id:animal) {
        let animal_prefab = game_data_def.game_data.get_animal_prefab(animal_id);
        let animal_instance = instantiate(animal_prefab);
        let label_node = animal_instance.getChildByName("name")
        let label = label_node.getComponent(Label);
        label.string = "";
        return animal_instance;
    }

    private get_skill_prefab(skill_id:skill) {
        if (skill_id == skill.altec_lightwave) {
            return this.altec_lightwave
        }
        else if (skill_id == skill.phantom_dice) {
            return this.phantom_dice;
        }
        else if (skill_id == skill.preemptiv_strike) {
            return this.preemptiv_strike;
        }
        else if (skill_id == skill.soul_moving_method) {
            return this.soul_moving;
        }
        else if (skill_id == skill.step_lotus) {
            return this.step_lotus;
        }
        else if (skill_id == skill.swap_places) {
            return this.swap_places;
        }
        else if (skill_id == skill.thief_reborn) {
            return this.thief_reborn;
        }
    }

    private get_skill_instance(skill_id:skill) {
        let skill_prefab = this.get_skill_prefab(skill_id);
        let skill_instance = instantiate(skill_prefab);
        return skill_instance;
    }

    private animalMap:Map<animal, Node> = new Map<animal, Node>();
    private get_animal_node(animal_id:animal) {
        return this.animalMap.get(animal_id);
    }

    private skillMap:Map<skill, Node> = new Map<skill, Node>();
    private get_skill_node(skill_id:skill) {
        return this.skillMap.get(skill_id);
    }

    private init_select() {
        this.selectAnimalMap.forEach((select_node, animal_id) => {
            let animal_node = this.get_animal_node(animal_id);
            animal_node.removeChild(select_node);
        });

        this.selectSkillMap.forEach((select_node, skill_id) => {
            let skill_node = this.get_skill_node(skill_id);
            skill_node.removeChild(select_node);
        });

        let player = singleton.netSingleton.game.get_player_game_info(singleton.netSingleton.login.player_info.guid);
        for (let animal of player.animal_info) {
            let animal_node = this.get_animal_node(animal.animal_id);
            if (animal_node) {
                let select_instance = instantiate(this.select);
                animal_node.addChild(select_instance);
                this.selectAnimalMap.set(animal.animal_id, select_instance);
            }
        }

        console.log("player.skill_id:", player.skill_id);
        let skill_node = this.get_skill_node(player.skill_id);
        if (skill_node) {
            let select_instance = instantiate(this.select);
            skill_node.addChild(select_instance);
            this.selectSkillMap.set(player.skill_id, select_instance);
        }
    }

    private init_animal_btn_callback(ev_type:NodeEventType, btn:Sprite, animal_id:animal) {
        if (animal_id == animal.bear) {
            btn.node.on(ev_type, this.choose_bear, this);
        }
        else if (animal_id == animal.chicken) {
            btn.node.on(ev_type, this.choose_chicken, this);
        }
        else if (animal_id == animal.duck) {
            btn.node.on(ev_type, this.choose_duck, this);
        }
        else if (animal_id == animal.lion) {
            btn.node.on(ev_type, this.choose_lion, this);
        }
        else if (animal_id == animal.monkey) {
            btn.node.on(ev_type, this.choose_monkey, this);
        }
        else if (animal_id == animal.mouse) {
            btn.node.on(ev_type, this.choose_mouse, this);
        }
        else if (animal_id == animal.rabbit) {
            btn.node.on(ev_type, this.choose_rabbit, this);
        }
        else if (animal_id == animal.tiger) {
            btn.node.on(ev_type, this.choose_tiger, this);
        }  
    }

    private init_skill_btn_callback(ev_type:NodeEventType, btn:Sprite, skill_id:skill) {
        if (skill_id == skill.altec_lightwave) {
            btn.node.on(ev_type, this.choose_altec_lightwave, this);
        }
        else if (skill_id == skill.phantom_dice) {
            btn.node.on(ev_type, this.choose_phantom_dice, this);
        }
        else if (skill_id == skill.preemptiv_strike) {
            btn.node.on(ev_type, this.choose_preemptiv_strike, this);
        }
        else if (skill_id == skill.soul_moving_method) {
            btn.node.on(ev_type, this.choose_soul_moving, this);
        }
        else if (skill_id == skill.step_lotus) {
            btn.node.on(ev_type, this.choose_step_lotus, this);
        }
        else if (skill_id == skill.swap_places) {
            btn.node.on(ev_type, this.choose_swap_places, this);
        }
        else if (skill_id == skill.thief_reborn) {
            btn.node.on(ev_type, this.choose_thief_reborn, this);
        }
    }

    private init_btn_event(ev_type:NodeEventType) {
        if (singleton.netSingleton.game.SelfPlayerInlineInfo) {
            let index = 1;
            for(let animal_id of singleton.netSingleton.game.SelfPlayerInlineInfo.hero_list) {
                let animal_instance = this.get_animal_instance(animal_id);
                let animal_btn = null;
                if (index == 1) {
                    animal_btn = this.animal1;
                }
                else if (index == 2) {
                    animal_btn = this.animal2;
                }
                else if (index == 3) {
                    animal_btn = this.animal3;
                }
                else if (index == 4) {
                    animal_btn = this.animal4;
                }
                else if (index == 5) {
                    animal_btn = this.animal5;
                }
                else if (index == 6) {
                    animal_btn = this.animal6;
                }
                else if (index == 7) {
                    animal_btn = this.animal7;
                }
                else if (index == 8) {
                    animal_btn = this.animal8;
                }
                animal_btn.node.addChild(animal_instance);
                this.init_animal_btn_callback(ev_type, animal_btn, animal_id);
                this.animalMap.set(animal_id, animal_instance);
                ++index;
            }

            index = 1;
            for(let skill_id of singleton.netSingleton.game.SelfPlayerInlineInfo.skill_list) {
                let skill_instance = this.get_skill_instance(skill_id);
                let skill_btn = null;
                if (index == 1) {
                    skill_btn = this.skill1;
                }
                else if (index == 2) {
                    skill_btn = this.skill2;
                }
                else if (index == 3) {
                    skill_btn = this.skill3;
                }
                else if (index == 4) {
                    skill_btn = this.skill4;
                }
                else if (index == 5) {
                    skill_btn = this.skill5;
                }
                else if (index == 6) {
                    skill_btn = this.skill6;
                }
                else if (index == 7) {
                    skill_btn = this.skill7;
                }
                else if (index == 8) {
                    skill_btn = this.skill8;
                }
                skill_btn.node.addChild(skill_instance);
                this.init_skill_btn_callback(ev_type, skill_btn, skill_id);
                this.skillMap.set(skill_id, skill_instance);
                ++index;
            }
        }
    }

    start() {
        this.init_btn_event(Node.EventType.TOUCH_START);
        this.init_select();
    }

    private choose_altec_lightwave() {
        console.log("choose_altec_lightwave");

        let player = singleton.netSingleton.game.get_player_game_info(singleton.netSingleton.login.player_info.guid);
        player.skill_id = skill.altec_lightwave;
        this.init_select();
    }

    private choose_step_lotus() {
        console.log("choose_step_lotus");

        let player = singleton.netSingleton.game.get_player_game_info(singleton.netSingleton.login.player_info.guid);
        player.skill_id = skill.step_lotus;
        this.init_select();
    }

    private choose_soul_moving() {
        console.log("choose_soul_moving");

        let player = singleton.netSingleton.game.get_player_game_info(singleton.netSingleton.login.player_info.guid);
        player.skill_id = skill.soul_moving_method;
        this.init_select();
    }

    private choose_preemptiv_strike() {
        console.log("choose_preemptiv_strike");

        let player = singleton.netSingleton.game.get_player_game_info(singleton.netSingleton.login.player_info.guid);
        player.skill_id = skill.preemptiv_strike;
        this.init_select();
    }

    private choose_swap_places() {
        console.log("choose_swap_places");

        let player = singleton.netSingleton.game.get_player_game_info(singleton.netSingleton.login.player_info.guid);
        player.skill_id = skill.swap_places;
        this.init_select();
    }

    private choose_thief_reborn() {
        console.log("choose_thief_reborn");

        let player = singleton.netSingleton.game.get_player_game_info(singleton.netSingleton.login.player_info.guid);
        player.skill_id = skill.thief_reborn;
        this.init_select();
    }

    private choose_phantom_dice() {
        console.log("choose_phantom_dice");

        let player = singleton.netSingleton.game.get_player_game_info(singleton.netSingleton.login.player_info.guid);
        player.skill_id = skill.phantom_dice;
        this.init_select();
    }

    private check_animal_is_in_select(animal_id:animal) {
        let player = singleton.netSingleton.game.get_player_game_info(singleton.netSingleton.login.player_info.guid);
        for (let animal of player.animal_info) {
            if (animal.animal_id == animal_id) {
                return true;
            }
        }
        return false;
    }

    private select_animal(animal_id:animal) {
        let player = singleton.netSingleton.game.get_player_game_info(singleton.netSingleton.login.player_info.guid);
        player.animal_info.shift();
        let new_animal_info = new animal_game_info();
        new_animal_info.animal_id = animal_id;
        new_animal_info.could_move = true;
        new_animal_info.current_pos = -1;
        new_animal_info.skin_id = animal_id * 100 + 1;
        new_animal_info.unmovable_rounds = 0;
        player.animal_info.push(new_animal_info);

        this.init_select();
    }

    private choose_bear() {
        if (this.check_animal_is_in_select(animal.bear)) {
            return;
        }
        this.select_animal(animal.bear);
    }

    private choose_chicken() {
        if (this.check_animal_is_in_select(animal.chicken)) {
            return;
        }
        this.select_animal(animal.chicken);
    }

    private choose_duck() {
        if (this.check_animal_is_in_select(animal.duck)) {
            return;
        }
        this.select_animal(animal.duck);
    }

    private choose_lion() {
        if (this.check_animal_is_in_select(animal.lion)) {
            return;
        }
        this.select_animal(animal.lion);
    }

    private choose_monkey() {
        if (this.check_animal_is_in_select(animal.monkey)) {
            return;
        }
        this.select_animal(animal.monkey);
    }

    private choose_mouse() {
        if (this.check_animal_is_in_select(animal.mouse)) {
            return;
        }
        this.select_animal(animal.mouse);
    }

    private choose_rabbit() {
        if (this.check_animal_is_in_select(animal.rabbit)) {
            return;
        }
        this.select_animal(animal.rabbit);
    }

    private choose_tiger() {
        if (this.check_animal_is_in_select(animal.tiger)) {
            return;
        }
        this.select_animal(animal.tiger);
    }
}