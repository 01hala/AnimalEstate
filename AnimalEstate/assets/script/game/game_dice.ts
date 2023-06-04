import { _decorator, Component, Button, Node, Mask, Sprite, Canvas, macro, Animation, AnimationClip, Vec2, Prefab, UITransform, instantiate, Vec3, NodeEventType, Label, director } from 'cc';
const { ccclass, property } = _decorator;
import 'minigame-api-typings';

import { playground, play_active_state, animal_game_info, animal, effect, player_game_info, game_settle_info } from '../serverSDK/common';

import * as singleton from '../netDriver/netSingleton';

import * as game_data_def from './global_game_data/game_data_def';
import * as game_data_effect from './global_game_data/game_effect_def';
import * as game_data_props from './global_game_data/game_props_def';

@ccclass('main_game_dice')
export class main_game_dice extends Component {
    @property(Prefab)
    lake_map:Prefab = null;

    @property(Canvas)
    main_canvas:Canvas = null;

    @property(Sprite)
    bk:Sprite = null;
    @property(Mask)
    mask:Mask = null;

    @property(Prefab)
    bear:Prefab = null;
    @property(Prefab)
    chicken:Prefab = null;
    @property(Prefab)
    duck:Prefab = null;
    @property(Prefab)
    lion:Prefab = null;
    @property(Prefab)
    monkey:Prefab = null;
    @property(Prefab)
    mouse:Prefab = null;
    @property(Prefab)
    rabbit:Prefab = null;
    @property(Prefab)
    tiger:Prefab = null;

    @property(Prefab)
    step_lotus:Prefab = null;
    @property(Prefab)
    light_grid:Prefab = null;
    @property(Prefab)
    relay_animal:Prefab = null;

    @property(Prefab)
    settle:Prefab = null;

    @property(Sprite)
    gameUI:Sprite = null;
    @property(Sprite)
    diceBG:Sprite = null;
    @property(Sprite)
    diceTriggerBG:Sprite = null;
    @property(Sprite)
    cancel:Sprite = null;
    
    @property(Sprite)
    dice_instance:Sprite = null;
    @property(Sprite)
    dice2_1_instance:Sprite = null;
    @property(Sprite)
    dice2_2_instance:Sprite = null;

    @property(Sprite)
    dice_1:Sprite = null;
    @property(Sprite)
    dice_2:Sprite = null;
    @property(Sprite)
    dice_3:Sprite = null;
    @property(Sprite)
    dice_4:Sprite = null;
    @property(Sprite)
    dice_5:Sprite = null;
    @property(Sprite)
    dice_6:Sprite = null;

    @property(Sprite)
    dice_1_1:Sprite = null;
    @property(Sprite)
    dice_1_2:Sprite = null;
    @property(Sprite)
    dice_1_3:Sprite = null;
    @property(Sprite)
    dice_1_4:Sprite = null;
    @property(Sprite)
    dice_1_5:Sprite = null;
    @property(Sprite)
    dice_1_6:Sprite = null;

    @property(Sprite)
    dice_2_1:Sprite = null;
    @property(Sprite)
    dice_2_2:Sprite = null;
    @property(Sprite)
    dice_2_3:Sprite = null;
    @property(Sprite)
    dice_2_4:Sprite = null;
    @property(Sprite)
    dice_2_5:Sprite = null;
    @property(Sprite)
    dice_2_6:Sprite = null;

    @property(Sprite)
    ready_ui:Sprite = null;
    @property(Button)
    readyBtn:Button = null;
    @property(Button)
    diceBtn:Button = null;

    @property(Sprite)
    role1:Sprite = null;
    @property(Sprite)
    role2:Sprite = null;
    @property(Sprite)
    role3:Sprite = null;

    @property(Sprite)
    cancel_auto:Sprite = null;

    dice_result_instance:Sprite = null;
    dice_1_result_instance:Sprite = null;
    dice_2_result_instance:Sprite = null;
    dice_choose_index:number = -1;

    relay_animal_instance:Node = null

    private moveList:game_data_def.move_info[] = [];
    private activeStateMap:Map<number, play_active_state> = new Map<number, play_active_state>();
    private is_auto:boolean = false;

    private init_btn_event(ev_type:NodeEventType) {
        this.readyBtn.node.on(ev_type, this.ready_callback, this);
        this.diceBtn.node.on(ev_type, this.dice_callback, this);

        this.role1.node.on(ev_type, this.choose_role1, this);
        this.role2.node.on(ev_type, this.choose_role2, this);
        this.role3.node.on(ev_type, this.choose_role3, this);

        this.cancel_auto.node.on(ev_type, this.on_cancel_auto, this);
        this.cancel.node.on(ev_type, this.on_cancel_game, this);
    }

    private init_global_res() {
        game_data_def.game_data.role1 = this.role1;
        game_data_def.game_data.role2 = this.role2;
        game_data_def.game_data.role3 = this.role3;

        game_data_def.game_data.bear = this.bear;
        game_data_def.game_data.chicken = this.chicken;
        game_data_def.game_data.duck = this.duck;
        game_data_def.game_data.lion = this.lion;
        game_data_def.game_data.monkey = this.monkey;
        game_data_def.game_data.mouse = this.mouse;
        game_data_def.game_data.rabbit = this.rabbit;
        game_data_def.game_data.tiger = this.tiger;
    }

    private init_net_msg() {
        singleton.netSingleton.game.cb_turn_player_round.push(this.on_cb_turn_player_round.bind(this));
        singleton.netSingleton.game.cb_ntf_player_auto = this.on_cb_ntf_player_auto.bind(this);
        singleton.netSingleton.game.cb_relay = this.on_cb_relay.bind(this);
        singleton.netSingleton.game.cb_move = this.on_cb_move.bind(this);
        singleton.netSingleton.game.cb_effect_move = this.cb_effect_move.bind(this);
        singleton.netSingleton.game.cb_start_dice = this.on_cb_start_dice.bind(this);
        singleton.netSingleton.game.cb_throw_dice = this.on_cb_throw_dice.bind(this);
        singleton.netSingleton.game.cb_choose_dice = this.on_cb_choose_dice.bind(this);
        singleton.netSingleton.game.cb_rabbit_choose_dice = this.on_cb_rabbit_choose_dice.bind(this);
        singleton.netSingleton.game.cb_throw_animal = this.on_cb_throw_animal.bind(this);
        singleton.netSingleton.game.cb_throw_animal_ntf = this.on_cb_throw_animal_ntf.bind(this);
        singleton.netSingleton.game.cb_throw_animal_move = this.on_cb_throw_animal_move.bind(this);
        singleton.netSingleton.game.cb_animal_effect_touch_off = this.on_cb_animal_effect_touch_off.bind(this);
        singleton.netSingleton.game.cb_animal_order.push(this.on_cb_animal_order.bind(this));

        singleton.netSingleton.match.cb_settle = (settle_info:game_settle_info) => {
            for (let info of settle_info.settle_info) {
                if (info.rank <= 1) {
                    let settle_ui = instantiate(this.settle);
                    this.main_canvas.node.addChild(settle_ui);
                    settle_ui.setPosition(0, 200);
                    
                    let label_node = settle_ui.getChildByName("name")
                    let label = label_node.getComponent(Label);
                    label.string = info.name;

                    this.main_canvas.node.on(Node.EventType.TOUCH_START, ()=>{
                        settle_ui.destroy();
                        this.cancel_game();
                    }, this);
                }
            }
        }
    }

    private init_role_select_box() {
        for(let player_info of singleton.netSingleton.game.PlayerGameInfo) {
            if (player_info.guid == singleton.netSingleton.login.player_info.guid) {
                for(let index = 0; index < player_info.animal_info.length; index++) {
                    let animal_info = player_info.animal_info[index];
                    let animal_prefab = game_data_def.game_data.get_animal_prefab(animal_info.animal_id);
                    let animal_instance = instantiate(animal_prefab);
                    if (index == 0) {
                        this.role1.node.removeAllChildren();
                        this.role1.node.addChild(animal_instance);
                    }
                    else if (index == 1) {
                        this.role2.node.removeAllChildren();
                        this.role2.node.addChild(animal_instance);
                    }
                    else if (index == 2) {
                        this.role3.node.removeAllChildren();
                        this.role3.node.addChild(animal_instance);
                    }
                    
                    let label_node = animal_instance.getChildByName("name")
                    let label = label_node.getComponent(Label);
                    label.string = "";
                }

                if (player_info.current_animal_index == 0) {
                    this.set_selection_box_choose(this.role1);
                }
                else if (player_info.current_animal_index == 1) {
                    this.set_selection_box_choose(this.role2);
                } 
                else if (player_info.current_animal_index == 2) {
                    this.set_selection_box_choose(this.role3);
                }
                break;
            }
        }
    }

    private init_dice() {
        this.dice_instance.node.setPosition(0, 0);
        this.dice_instance.node.active = false;
        
        this.dice2_1_instance.node.setPosition(-96, 0);
        this.dice2_1_instance.node.active = false;
        this.dice2_2_instance.node.setPosition(96, 0);
        this.dice2_2_instance.node.active = false;

        this.dice_1.node.setPosition(0, 0);
        this.dice_1.node.active = false;
        this.dice_2.node.setPosition(0, 0);
        this.dice_2.node.active = false;
        this.dice_3.node.setPosition(0, 0);
        this.dice_3.node.active = false;
        this.dice_4.node.setPosition(0, 0);
        this.dice_4.node.active = false;
        this.dice_5.node.setPosition(0, 0);
        this.dice_5.node.active = false;
        this.dice_6.node.setPosition(0, 0);
        this.dice_6.node.active = false;
        
        this.dice_1_1.node.setPosition(-96, 0);
        this.dice_1_1.node.active = false;
        this.dice_1_2.node.setPosition(-96, 0);
        this.dice_1_2.node.active = false;
        this.dice_1_3.node.setPosition(-96, 0);
        this.dice_1_3.node.active = false;
        this.dice_1_4.node.setPosition(-96, 0);
        this.dice_1_4.node.active = false;
        this.dice_1_5.node.setPosition(-96, 0);
        this.dice_1_5.node.active = false;
        this.dice_1_6.node.setPosition(-96, 0);
        this.dice_1_6.node.active = false;

        this.dice_2_1.node.setPosition(96, 0);
        this.dice_2_1.node.active = false;
        this.dice_2_2.node.setPosition(96, 0);
        this.dice_2_2.node.active = false;
        this.dice_2_3.node.setPosition(96, 0);
        this.dice_2_3.node.active = false;
        this.dice_2_4.node.setPosition(96, 0);
        this.dice_2_4.node.active = false;
        this.dice_2_5.node.setPosition(96, 0);
        this.dice_2_5.node.active = false;
        this.dice_2_6.node.setPosition(96, 0);
        this.dice_2_6.node.active = false;

        this.diceBG.node.active = true;
        this.diceTriggerBG.node.active = false;
    }

    onLoad(){
        this.dice_result_instance = null;
        this.dice_1_result_instance = null;
        this.dice_2_result_instance = null;
        this.dice_choose_index = -1;

        this.relay_animal_instance = null

        this.moveList = [];
        this.activeStateMap = new Map<number, play_active_state>();
        this.is_auto = false;
        this.is_start = false;

        this.begin();
    }

    begin() {
        console.log("main_game_dice start begin!");

        this.init_net_msg();
        this.init_global_res();
        this.init_btn_event(Node.EventType.TOUCH_START);
        this.init_role_select_box();
        this.init_dice();
        
        this.is_auto = singleton.netSingleton.game.is_auto;
        if (this.is_auto) {
            this.cancel_auto.node.active = true;
        }
        else {
            this.cancel_auto.node.active = false;
        }

        if (singleton.netSingleton.game.CurrentPlayerInfo) {
            this.ready_ui.node.active = false;
        }

        if (singleton.netSingleton.game.Playground == playground.lakeside) {
            let index = this.mask.node.getSiblingIndex();
            let lake_map_node = instantiate(this.lake_map);
            this.bk.node.insertChild(lake_map_node, index); 
        }
        
        console.log("main_game_dice start end!");
    }

    private ready_callback() {
        console.log("ready!");

        singleton.netSingleton.game.play_order();
        singleton.netSingleton.game.ready();
        this.ready_ui.node.active = false;
    }

    private dice_callback() {
        singleton.netSingleton.game.throw_dice();

        game_data_def.game_data.waitDice = false;
        this.diceBG.node.active = true;
        this.diceTriggerBG.node.active = false;
    }

    private update_dice_bg() {
        if (game_data_def.game_data.waitDice) {
            setTimeout(this.update_dice_bg.bind(this), 300);
        }
        else {
            this.diceBG.node.active = true;
            this.diceTriggerBG.node.active = false;
            return;
        }

        if (this.diceBG.node.active){
            this.diceBG.node.active = false;
        }
        else {
            this.diceBG.node.active = true;
        }

        if (this.diceTriggerBG.node.active) {
            this.diceTriggerBG.node.active = false;
        }
        else {
            this.diceTriggerBG.node.active = true;
        }
    }

    private is_start:boolean = false;
    private on_cb_turn_player_round(guid:number, active_state:play_active_state, animal_index:number, round:number) {
        console.log("cb_turn_player_round guid:" + guid + " animal_index:" + animal_index + " round:" + round);

        if (!this.is_start) {
            if (game_data_def.game_data.set_animal_born_pos()){
                this.is_start = true;
            }
        }

        this.activeStateMap.set(guid, active_state);

        if (animal_index >= 0) {
            let player_game_info = singleton.netSingleton.game.get_player_game_info(guid);
            let pos = player_game_info.animal_info[animal_index].current_pos;
            if (pos < 0) {
                pos = 0;
            }
            if (pos >= game_data_def.game_data.layout_lenght) {
                pos = game_data_def.game_data.layout_end;
            }
            game_data_def.game_data.set_camera_pos_grid(pos);
            game_data_def.game_data.current_move_obj = null;
        }
        
        this.ready_ui.node.active = false;
        if (guid == singleton.netSingleton.login.player_info.guid && !this.is_auto) {
            game_data_def.game_data.waitDice = true;
            setTimeout(this.update_dice_bg.bind(this), 300);

            console.log("on_cb_turn_player_round guid:", guid);
        }
    }

    private on_cb_ntf_player_auto() {
        this.is_auto = true;
        this.cancel_auto.node.active = true;

        game_data_def.game_data.waitDice = false;
        this.diceBG.node.active = true;
        this.diceTriggerBG.node.active = false;
    }

    private on_cancel_auto() {
        this.is_auto = false;
        this.cancel_auto.node.active = false;

        singleton.netSingleton.game.cancel_auto();
    }

    private on_cancel_game() {
        singleton.netSingleton.game.cancel_game().callBack(()=>{
            this.cancel_game();
        }, ()=>{
            console.log("on_cancel_game error!");
        });
    }

    private cancel_game() {
        console.log("cancle cb_settle!");
        console.log(singleton.netSingleton.mainScene);

        singleton.netSingleton.game.ReInit();

        game_data_def.game_data.init();
        game_data_effect.game_data_effect.init();
        game_data_props.game_data_props.init();

        singleton.netSingleton.bundle.loadScene('main', function (err, scene) {
            director.runScene(scene);
        });
    }

    private on_cb_relay(guid:number, new_animal_index:number, is_follow:boolean) {
        console.log("on_cb_relay guid:" + guid + " animal_index:" + new_animal_index);

        if (!this.is_start && !game_data_def.game_data.isStart) {
            return;
        }
        
        if (this.relay_animal_instance) {
            this.relay_animal_instance.destroy();
            this.relay_animal_instance = null;
        }

        let player_game_info = singleton.netSingleton.game.get_player_game_info(guid);
        player_game_info.current_animal_index = new_animal_index;

        if (is_follow) {
            game_data_def.game_data.set_camera_pos_animal(player_game_info.animal_info[new_animal_index]);
        }

        let animal_map = game_data_def.game_data.PlayerAnimalMap.get(guid);
        let _animal = animal_map.get(new_animal_index);
        this.relay_animal_instance = instantiate(this.relay_animal);
        _animal.addChild(this.relay_animal_instance);
        this.relay_animal_instance.setPosition(0, 48);

        if (guid == singleton.netSingleton.login.player_info.guid) {
            if (new_animal_index == 0) {
                this.set_selection_box_choose(this.role1);
                this.set_selection_box_normal(this.role2);
                this.set_selection_box_normal(this.role3);
            }
            else if (new_animal_index == 1) {
                this.set_selection_box_normal(this.role1);
                this.set_selection_box_choose(this.role2);
                this.set_selection_box_normal(this.role3);
            }
            else if (new_animal_index == 2) {
                this.set_selection_box_normal(this.role1);
                this.set_selection_box_normal(this.role2);
                this.set_selection_box_choose(this.role3);
            }
        }
    }

    private on_cb_start_dice(guid:number, animal_index:number) {
        let _current_animal:animal_game_info = null;
        for(let info of singleton.netSingleton.game.PlayerGameInfo) {
            if (info.guid == guid) {
                _current_animal = info.animal_info[animal_index];
            }
        }

        console.log("on_cb_start_dice guid:" + guid + " _current_animal.animal_id:", _current_animal.animal_id);

        if (_current_animal.animal_id != animal.duck) {
            this.dice_instance.node.active = true;
            let animationComponent = this.dice_instance.getComponent(Animation);
            const [ diceClip ] = animationComponent.clips;
            const diceState = animationComponent.getState(diceClip.name);
            animationComponent.play(diceState.name);
            diceState.wrapMode = AnimationClip.WrapMode.Loop;
        }
        else {
            {
                this.dice2_1_instance.node.active = true;
                let animationComponent = this.dice2_1_instance.getComponent(Animation);
                const [ diceClip ] = animationComponent.clips;
                const diceState = animationComponent.getState(diceClip.name);
                animationComponent.play(diceState.name);
                diceState.wrapMode = AnimationClip.WrapMode.Loop;
            }

            {
                this.dice2_2_instance.node.active = true;
                let animationComponent = this.dice2_2_instance.getComponent(Animation);
                const [ diceClip ] = animationComponent.clips;
                const diceState = animationComponent.getState(diceClip.name);
                animationComponent.play(diceState.name);
                diceState.wrapMode = AnimationClip.WrapMode.Loop;
            }
        }
    }

    private on_cb_throw_dice(guid:number, dice:number[]) {
        this.set_dice_result_instance_unactive();
        this.set_dice_two_result_instance_unactive();

        if (this.dice_instance) {
            this.dice_instance.node.active = false;
        }
        if (this.dice2_1_instance) {
            this.dice2_1_instance.node.active = false;
        }
        if (this.dice2_2_instance) {
            this.dice2_2_instance.node.active = false;
        }

        console.log("guid:" + guid + " on_cb_throw_dice dice:", dice);

        if (dice.length == 1) {
            let dice_num = dice[0];
            switch(dice_num){
                case 1:
                    this.dice_result_instance = this.dice_1;
                    break;
                case 2:
                    this.dice_result_instance = this.dice_2;
                    break;
                case 3:
                    this.dice_result_instance = this.dice_3;
                    break;
                case 4:
                    this.dice_result_instance = this.dice_4;
                    break;
                case 5:
                    this.dice_result_instance = this.dice_5;
                    break;
                case 6:
                    this.dice_result_instance = this.dice_6;
                    break;
            }
            this.dice_result_instance.node.active = true;
        }
        else {
            let dice_1_num = dice[0];
            let dice_2_num = dice[1];
            switch(dice_1_num){
                case 1:
                    this.dice_1_result_instance = this.dice_1_1;
                    break;
                case 2:
                    this.dice_1_result_instance = this.dice_1_2;
                    break;
                case 3:
                    this.dice_1_result_instance = this.dice_1_3;
                    break;
                case 4:
                    this.dice_1_result_instance = this.dice_1_4;
                    break;
                case 5:
                    this.dice_1_result_instance = this.dice_1_5;
                    break;
                case 6:
                    this.dice_1_result_instance = this.dice_1_6;
                    break;
            } 
            switch(dice_2_num){
                case 1:
                    this.dice_2_result_instance = this.dice_2_1;
                    break;
                case 2:
                    this.dice_2_result_instance = this.dice_2_2;
                    break;
                case 3:
                    this.dice_2_result_instance = this.dice_2_3;
                    break;
                case 4:
                    this.dice_2_result_instance = this.dice_2_4;
                    break;
                case 5:
                    this.dice_2_result_instance = this.dice_2_5;
                    break;
                case 6:
                    this.dice_2_result_instance = this.dice_2_6;
                    break;
            }
            this.dice_1_result_instance.node.active = true;
            this.dice_2_result_instance.node.active = true;

            if (guid == singleton.netSingleton.login.player_info.guid) {
                console.log("dice_1_2_result_instance");

                this.on_dice_callback(Node.EventType.TOUCH_START);
            }
        }
    }

    private on_dice_callback(ev_type:NodeEventType) {
        this.dice_1_result_instance.node.on(ev_type, this.dice_1_callback, this);
        this.dice_2_result_instance.node.on(ev_type, this.dice_2_callback, this);
    }

    private off_dice_callback(ev_type:NodeEventType) {
        this.dice_1_result_instance.node.off(ev_type, this.dice_1_callback, this);
        this.dice_2_result_instance.node.off(ev_type, this.dice_2_callback, this);
    }

    private dice_1_callback() {
       this.off_dice_callback(Node.EventType.TOUCH_START);

        console.log("dice_1_callback");
        if (singleton.netSingleton.game.choose_dice_rsp) {
            console.log("dice_1_callback rsp");
            singleton.netSingleton.game.choose_dice_rsp.rsp(0);
            singleton.netSingleton.game.choose_dice_rsp = null;
        }
        else {
            this.dice_choose_index = 0;
        }
    }

    private dice_2_callback() {
        this.off_dice_callback(Node.EventType.TOUCH_START);

        console.log("dice_2_callback");
        if (singleton.netSingleton.game.choose_dice_rsp) {
            console.log("dice_2_callback rsp");
            singleton.netSingleton.game.choose_dice_rsp.rsp(1);
            singleton.netSingleton.game.choose_dice_rsp = null;
        }
        else {
            this.dice_choose_index = 1;
        }
    }

    private on_cb_choose_dice() {
        if (this.dice_choose_index >= 0) {
            singleton.netSingleton.game.choose_dice_rsp.rsp(this.dice_choose_index);
            singleton.netSingleton.game.choose_dice_rsp = null;
        }
    }

    private throw_instance_list:Node[] = [];
    private on_cb_throw_animal(self_guid:number, guid:number, animal_index:number, target_pos:number[]) {
        let rsp = singleton.netSingleton.game.throw_animal_rsp;
        singleton.netSingleton.game.throw_animal_rsp = null;
        
        game_data_def.game_data.set_negative(guid, animal_index);

        console.log("target_pos:", target_pos);
        for (let target of target_pos) {
            let _throw_instance = instantiate(this.light_grid);
            game_data_def.game_data.map.node.insertChild(_throw_instance, game_data_def.game_data.effect_index);

            let tile_pos = game_data_def.game_data.mapPlayground.get(target);
            let target_x = tile_pos.x * 64 + 32 - game_data_def.game_data.layout_half_width;
            let target_y = tile_pos.y * 64 + 32 - game_data_def.game_data.layout_half_height;

            console.log("target_x:" + target_x + ",target_y:" + target_y);

            _throw_instance.setPosition(target_x, target_y);
            _throw_instance.on(Node.EventType.TOUCH_START, () => {
                if (self_guid == singleton.netSingleton.login.player_info.guid) {
                    rsp.rsp(target);
                }
            });

            this.throw_instance_list.push(_throw_instance);
        }
    }

    private on_cb_throw_animal_ntf(self_guid:number, guid:number, animal_index:number, target_pos:number[]) {
        game_data_def.game_data.set_negative(guid, animal_index);

        console.log("target_pos:", target_pos);
        for (let target of target_pos) {
            let _throw_instance = instantiate(this.light_grid);
            game_data_def.game_data.map.node.insertChild(_throw_instance, game_data_def.game_data.effect_index);

            let tile_pos = game_data_def.game_data.mapPlayground.get(target);
            let target_x = tile_pos.x * 64 + 32 - game_data_def.game_data.layout_half_width;
            let target_y = tile_pos.y * 64 + 32 - game_data_def.game_data.layout_half_height;

            console.log("target_x:" + target_x + ",target_y:" + target_y);

            _throw_instance.setPosition(target_x, target_y);
            this.throw_instance_list.push(_throw_instance);
        }
    }

    private delay(timeout) {
        return new Promise((resolve) => setTimeout(resolve, timeout));
    }

    private async on_cb_throw_animal_move(guid:number, animal_index:number, from:number, to:number) {
        this.throw_instance_list.forEach(instance_list => {
            game_data_def.game_data.map.node.removeChild(instance_list);
            instance_list.destroy();
        });
        this.throw_instance_list = [];

        game_data_def.game_data.set_negative(guid, animal_index);

        let animal_map = game_data_def.game_data.PlayerAnimalMap.get(guid);
        let _animal = animal_map.get(animal_index);

        let _move_info = new game_data_def.move_info();
        _move_info.animal = _animal;
        _move_info.current = from;
        _move_info.to = to;
        let from_Pos = game_data_def.game_data.mapPlayground.get(from);
        _move_info.pos = new Vec2(from_Pos.x * 64 + 32 - game_data_def.game_data.layout_half_width, from_Pos.y * 64 + 32 - game_data_def.game_data.layout_half_height);
        _move_info.speed = 6 * 64 / 3 * 1.6;

        let move_to = to;
        if (from > to) {
            move_to = from - 1;
        }
        else {
            move_to = from + 1;
        }
        let next_pos = game_data_def.game_data.mapPlayground.get(move_to);
        if (next_pos.x < from_Pos.x) {
            _move_info.pos.x += 48; 
        }
        else if (next_pos.x > from_Pos.x) {
            _move_info.pos.x -= 48; 
        }
        else if (next_pos.y < from_Pos.y) {
            _move_info.pos.y += 48; 
        }
        else if (next_pos.y > from_Pos.y) {
            _move_info.pos.y -= 48; 
        }
        _animal.setPosition(_move_info.pos.x, _move_info.pos.y);
        await this.delay(800);

        this.moveList.push(_move_info);
        game_data_def.game_data.current_move_obj = _move_info;
    }

    private async monkey_effect_touch_off(self_guid:number, self_animal_index:number) {
        let player_game_info = singleton.netSingleton.game.get_player_game_info(self_guid);
        await game_data_def.game_data.set_gain_await(self_guid, self_animal_index);
        game_data_def.game_data.set_prompt(`玩家${player_game_info.name}的小机灵行动3回合,获得了道具救命毫毛`);
    }

    private lion_effect_touch_off(self_guid:number, self_animal_index:number, target_guid:number, target_animal_index:number) {
        let player_game_info = singleton.netSingleton.game.get_player_game_info(self_guid);
        let target_player_game_info = singleton.netSingleton.game.get_player_game_info(target_guid);
        game_data_def.game_data.set_prompt(`玩家${player_game_info.name}的辛巴从玩家${target_player_game_info.name}身上抢夺了一个道具`);
    }

    private async chicken_effect_touch_off(self_guid:number, self_animal_index:number, target_guid:number, target_animal_index:number) {
        let player_game_info = singleton.netSingleton.game.get_player_game_info(self_guid);
        let animal_info = player_game_info.animal_info[self_animal_index];
        let target_player_game_info = singleton.netSingleton.game.get_player_game_info(target_guid);
        let target_animal_info = target_player_game_info.animal_info[target_animal_index];

        game_data_def.game_data.set_prompt(`玩家${player_game_info.name}的战斗鸡行动3回合,与玩家${target_player_game_info.name}的
            ${game_data_def.game_constant_data.animal_name(target_animal_info.animal_id)}交换位置`);

        let pos = animal_info.current_pos;
        animal_info.current_pos = target_animal_info.current_pos;
        target_animal_info.current_pos = pos;

        let animal_map = game_data_def.game_data.PlayerAnimalMap.get(self_guid);
        let _animal = animal_map.get(player_game_info.current_animal_index);
        let target_animal_map = game_data_def.game_data.PlayerAnimalMap.get(target_guid);
        let _target_animal = target_animal_map.get(target_animal_index);

        await game_data_def.game_data.show_top_flashing_del(_animal, animal_info);
        var new_animal_instance = await game_data_def.game_data.set_new_animal(animal_info.animal_id, animal_info.current_pos, player_game_info.name);
        animal_map.set(player_game_info.current_animal_index, new_animal_instance);

        await game_data_def.game_data.show_top_flashing_del(_target_animal, target_animal_info);
        var new_target_animal_instance = await game_data_def.game_data.set_new_animal(target_animal_info.animal_id, target_animal_info.current_pos, target_player_game_info.name);
        target_animal_map.set(target_animal_index, new_target_animal_instance);
    }

    private async on_cb_animal_effect_touch_off(self_guid:number, self_animal_index:number, target_guid:number, target_animal_index:number) {
        let player_game_info = singleton.netSingleton.game.get_player_game_info(self_guid);
        let animal_info = player_game_info.animal_info[self_animal_index];
        if (animal_info.animal_id == animal.monkey) {
            await this.monkey_effect_touch_off(self_guid, self_animal_index);
        }
        else if (animal_info.animal_id == animal.lion) {
            this.lion_effect_touch_off(self_guid, self_animal_index, target_guid, target_animal_index);
        }
        else if (animal_info.animal_id == animal.chicken) {
            await this.chicken_effect_touch_off(self_guid, self_animal_index, target_guid, target_animal_index);
        }
    }

    private set_dice_two_result_instance_unactive() {
        this.dice_1_1.node.active = false;
        this.dice_1_2.node.active = false;
        this.dice_1_3.node.active = false;
        this.dice_1_4.node.active = false;
        this.dice_1_5.node.active = false;
        this.dice_1_6.node.active = false;

        this.dice_2_1.node.active = false;
        this.dice_2_2.node.active = false;
        this.dice_2_3.node.active = false;
        this.dice_2_4.node.active = false;
        this.dice_2_5.node.active = false;
        this.dice_2_6.node.active = false;
    }

    private on_cb_rabbit_choose_dice(dice:number) {
        this.set_dice_result_instance_unactive();
        this.set_dice_two_result_instance_unactive();

        switch(dice){
            case 1:
                this.dice_result_instance = this.dice_1;
                break;
            case 2:
                this.dice_result_instance = this.dice_2;
                break;
            case 3:
                this.dice_result_instance = this.dice_3;
                break;
            case 4:
                this.dice_result_instance = this.dice_4;
                break;
            case 5:
                this.dice_result_instance = this.dice_5;
                break;
            case 6:
                this.dice_result_instance = this.dice_6;
                break;
        }
        this.dice_result_instance.node.active = true;
    }

    private set_step_lotus(_move_info:game_data_def.move_info) {
        _move_info.step_lotus_instance = instantiate(this.step_lotus);
        game_data_def.game_data.map.node.insertChild(_move_info.step_lotus_instance, game_data_def.game_data.effect_index);
        _move_info.step_lotus_instance.setPosition(_move_info.pos.x, _move_info.pos.y, 0);
    }

    private remove_step_lotus(_move_info:game_data_def.move_info) {
        if (_move_info.step_lotus_instance) {
            game_data_def.game_data.map.node.removeChild(_move_info.step_lotus_instance);
            _move_info.step_lotus_instance.destroy();
            _move_info.step_lotus_instance = null;
        }
    }

    private set_move(guid:number, animal_index:number, move_coefficient:number, from:number, to:number) {
        console.log(`set_move guid:${guid}, move_coefficient:${move_coefficient}, from:${from}, to:${to}`);

        from = from >= singleton.netSingleton.game.get_playground_len() ? singleton.netSingleton.game.get_playground_len() -1 : from;
        to = to >= singleton.netSingleton.game.get_playground_len() ? singleton.netSingleton.game.get_playground_len() -1 : to;

        let player = singleton.netSingleton.game.get_player_game_info(guid);
        player.animal_info[animal_index].current_pos = to;
        let animal_map = game_data_def.game_data.PlayerAnimalMap.get(guid);
        let _animal = animal_map.get(animal_index);
        game_data_def.game_data.set_move(_animal);

        if (this.relay_animal_instance) {
            this.relay_animal_instance.destroy();
            this.relay_animal_instance = null;
        }

        let active_state = this.activeStateMap.get(guid);
        let is_step_lotus = false;
        if (active_state)
        {
            for (let state of active_state.animal_play_active_states) {
                if (state.animal_index == animal_index) {
                    is_step_lotus = state.is_step_lotus;
                    break;
                }
            }
        }
        
        let _move_info = new game_data_def.move_info();
        _move_info.animal = _animal;
        _move_info.is_step_lotus = is_step_lotus;
        _move_info.current = from;
        _move_info.to = to;
        let from_Pos = game_data_def.game_data.mapPlayground.get(from);
        _move_info.pos = new Vec2(from_Pos.x * 64 + 32 - game_data_def.game_data.layout_half_width, from_Pos.y * 64 + 32 - game_data_def.game_data.layout_half_height);
        _move_info.speed = 6 * 64 / 3 * move_coefficient;
        this.moveList.push(_move_info);

        if (_move_info.is_step_lotus) {
            this.set_step_lotus(_move_info);
        }

        game_data_def.game_data.current_move_obj = _move_info;
    }

    private set_dice_result_instance_unactive() {
        this.dice_1.node.active = false;
        this.dice_2.node.active = false;
        this.dice_3.node.active = false;
        this.dice_4.node.active = false;
        this.dice_5.node.active = false;
        this.dice_6.node.active = false;
    }

    private on_cb_move(guid:number, animal_index:number, move_coefficient:number, from:number, to:number) {
        console.log("on_cb_move guid:" + guid + " animal_index:" + animal_index);

        this.set_dice_result_instance_unactive();
        this.set_dice_two_result_instance_unactive();

        this.set_move(guid, animal_index, move_coefficient, from, to);
    }

    private async cb_effect_move(effect_id:effect, guid:number, target_animal_index:number, from:number, to:number) {
        console.log("cb_effect_move guid:" + guid);

        if (effect_id == effect.watermelon_rind) {
            let player = singleton.netSingleton.game.get_player_game_info(guid);
            let animal = player.animal_info[target_animal_index];

            if (from > to) {
                game_data_def.game_data.set_prompt(`玩家${player.name}的
                    ${game_data_def.game_constant_data.animal_name(animal.animal_id)}踩到了西瓜皮,向后滑动3格`);
                await game_data_def.game_data.set_negative_await(guid, target_animal_index);
            }
            else {
                game_data_def.game_data.set_prompt(`玩家${player.name}的
                    ${game_data_def.game_constant_data.animal_name(animal.animal_id)}踩到了西瓜皮,向前滑动3格`);
                await game_data_def.game_data.set_gain_await(guid, target_animal_index);
            }
        }
        else if (effect_id == effect.thunder) {
            await game_data_def.game_data.set_tianlei_await(guid, target_animal_index);
        }

        this.set_move(guid, target_animal_index, 3.0, from, to);
    }

    update(deltaTime: number) {
        let map_half_width = game_data_def.game_data.layout_half_width;
        let map_half_height = game_data_def.game_data.layout_half_height;
        let remove_list = [];
        for (let _info of this.moveList) {
            let target_grid = 0;
            if (_info.to > _info.current) {
                target_grid = _info.current + 1;
            }
            else if (_info.to < _info.current) {
                target_grid = _info.current - 1;
            }

            if (target_grid >= singleton.netSingleton.game.get_playground_len()) {
                remove_list.push(_info);
                continue;
            }
            let target_config_pos = game_data_def.game_data.mapPlayground.get(target_grid);
            let target_pos = new Vec2(target_config_pos.x * 64 + 32 - map_half_width, target_config_pos.y * 64 + 32 - map_half_height);

            do {
                if (target_pos.x == _info.pos.x) {
                    var _move = target_pos.y - _info.pos.y;
                    if (_move > 0) {
                        _info.pos.y += deltaTime * _info.speed;
                        if (_info.pos.y >= target_pos.y) {
                            _info.pos.y = target_pos.y;
                            _info.current = target_grid;
                        }
                        else{
                            break;
                        }
                    }
                    else {
                        _info.pos.y -= deltaTime * _info.speed;
                        if (_info.pos.y <= target_pos.y) {
                            _info.pos.y = target_pos.y;
                            _info.current = target_grid;
                        }
                        else{
                            break;
                        }
                    }
                }
                else if (target_pos.y == _info.pos.y) {
                    var _move = target_pos.x - _info.pos.x;
                    if (_move > 0) {
                        game_data_def.game_data.set_forward(_info.animal);

                        _info.pos.x += deltaTime * _info.speed;
                        if (_info.pos.x >= target_pos.x) {
                            _info.pos.x = target_pos.x;
                            _info.current = target_grid;
                        }
                        else{
                            break;
                        }
                    }
                    else {                        
                        game_data_def.game_data.set_reverse(_info.animal);

                        _info.pos.x -= deltaTime * _info.speed;
                        if (_info.pos.x <= target_pos.x) {
                            _info.pos.x = target_pos.x;
                            _info.current = target_grid;
                        }
                        else{
                            break;
                        }
                    }
                }

                if (_info.is_step_lotus) {
                    _info.step_lotus_instance.setPosition(_info.pos.x, _info.pos.y, 0);
                }

            } while(false);

            _info.animal.setPosition(_info.pos.x, _info.pos.y);

            if (_info.current == _info.to) {
                this.remove_step_lotus(_info);    
                remove_list.push(_info);
            }
        }

        for (let _remove of remove_list) {
            this.moveList.splice(this.moveList.indexOf(_remove), 1);
            game_data_def.game_data.set_idle(_remove.animal);
        }

        if (game_data_def.game_data.current_move_obj) {
            game_data_def.game_data.set_camera_pos(game_data_def.game_data.current_move_obj.pos.x + map_half_width, game_data_def.game_data.current_move_obj.pos.y + map_half_height);
        }
    }

    on_cb_animal_order() {
        this.init_role_select_box();
    }

    set_selection_box_normal(sbox:Sprite) {
        sbox.node.setScale(new Vec3(1, 1, 1));
        let pos = sbox.node.getPosition();
        sbox.node.setPosition(pos);
    }

    set_selection_box_choose(sbox:Sprite) {
        sbox.node.setScale(new Vec3(1.142, 1.142, 1));
        let pos = sbox.node.getPosition();
        sbox.node.setPosition(pos);
    }

    choose_role1() {
        singleton.netSingleton.game.choose_animal(0);
    }

    choose_role2() {
        singleton.netSingleton.game.choose_animal(1);
    }

    choose_role3() {
        singleton.netSingleton.game.choose_animal(2);
    }
}