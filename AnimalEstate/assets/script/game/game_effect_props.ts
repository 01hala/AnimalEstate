import { _decorator, Component, Sprite, Prefab, instantiate, Button, Label, Node, NodeEventType } from 'cc';
const { ccclass, property } = _decorator;

import { props } from '../serverSDK/common';
import { prop_info } from '../serverSDK/gamecallc';

import * as singleton from '../netDriver/netSingleton';

import * as game_data_def from './global_game_data/game_data_def';
import * as game_data_props from './global_game_data/game_props_def';

@ccclass('main_game_effect_props')
export class main_game_effect_props extends Component {
    @property(Prefab)
    horn:Prefab = null;		
    @property(Prefab)		
    bomb:Prefab = null;			
    @property(Prefab)	
    help_vellus:Prefab = null;	
    @property(Prefab)	
    thunder:Prefab = null;			
    @property(Prefab)
    clown_gift_box:Prefab = null;	
    @property(Prefab)	
    excited_petals:Prefab = null;	
    @property(Prefab)	
    clip:Prefab = null;			
    @property(Prefab)	
    landmine:Prefab = null;		
    @property(Prefab)	
    spring:Prefab = null;			
    @property(Prefab)	
    turtle_shell:Prefab = null;	
    @property(Prefab)	
    banana:Prefab = null;			
    @property(Prefab)
    watermelon_rind:Prefab = null;	
    @property(Prefab)
    red_mushroom:Prefab = null;	
    @property(Prefab)	
    gacha:Prefab = null;			
    @property(Prefab)	
    fake_dice:Prefab = null;	
    
    @property(Prefab)	
    props_fake_dice:Prefab = null;	
    @property(Prefab)	
    horn_effect:Prefab = null;
    @property(Prefab)	
    clown_gift_box_effect:Prefab = null;	
    @property(Prefab)	
    excited_petals_effect:Prefab = null;
    @property(Prefab)	
    banana_effect:Prefab = null;
    @property(Prefab)	
    gacha_effect:Prefab = null;
    @property(Prefab)	
    red_mushroom_effect:Prefab = null;

    @property(Sprite)
    propsBtn:Sprite = null;
    @property(Sprite)
    prop1:Sprite = null;
    @property(Sprite)
    prop2:Sprite = null;
    @property(Sprite)
    prop3:Sprite = null;
    @property(Sprite)
    prop4:Sprite = null;
    @property(Sprite)
    prop5:Sprite = null;
    @property(Sprite)
    prop6:Sprite = null;
    private propsSelectMap:Map<number, props> = new Map<number, props>();

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

    private is_props:boolean = false;
    private use_prop_id:props = props.none;
    private target_guid:number = 0;
    private target_animal_index:number = 0;

    private propsList:props[] = [];

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
        
        this.prop1.node.on(ev_type, this.choose_prop1, this);
        this.prop2.node.on(ev_type, this.choose_prop2, this);
        this.prop3.node.on(ev_type, this.choose_prop3, this);
        this.prop4.node.on(ev_type, this.choose_prop4, this);
        this.prop5.node.on(ev_type, this.choose_prop5, this);
        this.prop6.node.on(ev_type, this.choose_prop6, this);
        this.propsBtn.node.on(ev_type, this.use_props, this);
    }

    private init_props_prefab() {
        game_data_props.game_data_props.horn = this.horn;		
        game_data_props.game_data_props.bomb = this.bomb;			
        game_data_props.game_data_props.help_vellus = this.help_vellus;	
        game_data_props.game_data_props.thunder = this.thunder;			
        game_data_props.game_data_props.clown_gift_box = this.clown_gift_box;	
        game_data_props.game_data_props.excited_petals = this.excited_petals;	
        game_data_props.game_data_props.clip_props = this.clip;			
        game_data_props.game_data_props.landmine_props = this.landmine;		
        game_data_props.game_data_props.spring_props = this.spring;			
        game_data_props.game_data_props.turtle_shell = this.turtle_shell;	
        game_data_props.game_data_props.banana = this.banana;			
        game_data_props.game_data_props.watermelon_rind_props = this.watermelon_rind;	
        game_data_props.game_data_props.red_mushroom = this.red_mushroom;	
        game_data_props.game_data_props.gacha = this.gacha;			
        game_data_props.game_data_props.fake_dice = this.fake_dice;	
    }

    start() {
        this.init_props_prefab();

        this.is_props = false;
        this.use_prop_id = props.none;
        this.target_guid = 0;
        this.target_animal_index = 0;
        this.propsList = [];

        singleton.netSingleton.game.cb_ntf_prop_info = this.on_cb_ntf_prop_info.bind(this);
        singleton.netSingleton.game.cb_ntf_new_prop_info = this.on_cb_ntf_new_prop_info.bind(this);
        singleton.netSingleton.game.cb_remove_prop = this.on_cb_remove_prop.bind(this);
        singleton.netSingleton.game.cb_ntf_player_stepped_prop = this.on_cb_ntf_player_stepped_prop.bind(this);
        singleton.netSingleton.game.cb_ntf_player_prop_list = this.on_cb_ntf_player_prop_list.bind(this);
        singleton.netSingleton.game.cb_use_props = this.on_cb_use_props.bind(this);

        game_data_def.game_data.player1 = this.player1;
        game_data_def.game_data.player2 = this.player2;
        game_data_def.game_data.player3 = this.player3;

        game_data_def.game_data.select_animal_player1 = this.select_animal_player1;
        game_data_def.game_data.select_animal_0_0 = this.select_animal_0_0;
        game_data_def.game_data.select_animal_0_0_pos = this.select_animal_0_0_pos;
        game_data_def.game_data.select_animal_0_1 = this.select_animal_0_1;
        game_data_def.game_data.select_animal_0_1_pos = this.select_animal_0_1_pos;
        game_data_def.game_data.select_animal_0_2 = this.select_animal_0_2;
        game_data_def.game_data.select_animal_0_2_pos = this.select_animal_0_2_pos;
        game_data_def.game_data.select_animal_player2 = this.select_animal_player2;
        game_data_def.game_data.select_animal_1_0 = this.select_animal_1_0;
        game_data_def.game_data.select_animal_1_0_pos = this.select_animal_1_0_pos;
        game_data_def.game_data.select_animal_1_1 = this.select_animal_1_1;
        game_data_def.game_data.select_animal_1_1_pos = this.select_animal_1_1_pos;
        game_data_def.game_data.select_animal_1_2 = this.select_animal_1_2;
        game_data_def.game_data.select_animal_1_2_pos = this.select_animal_1_2_pos;
        game_data_def.game_data.select_animal_player3 = this.select_animal_player3;
        game_data_def.game_data.select_animal_2_0 = this.select_animal_2_0;
        game_data_def.game_data.select_animal_2_0_pos = this.select_animal_2_0_pos;
        game_data_def.game_data.select_animal_2_1 = this.select_animal_2_1;
        game_data_def.game_data.select_animal_2_1_pos = this.select_animal_2_1_pos;
        game_data_def.game_data.select_animal_2_2 = this.select_animal_2_2;
        game_data_def.game_data.select_animal_2_2_pos = this.select_animal_2_2_pos;

        game_data_def.game_data.select_animal_0 = this.select_animal_0;
        game_data_def.game_data.select_animal_1 = this.select_animal_1;
        game_data_def.game_data.select_animal_2 = this.select_animal_2;

        this.select_player.node.active = false;
        this.select_animal.node.active = false;
        this.select_self_animal.node.active = false;

        game_data_def.game_data.init_select_player_ui();
        game_data_def.game_data.init_select_animal_ui();
        game_data_def.game_data.init_select_self_animal_ui();

        this.init_btn_event(Node.EventType.TOUCH_START);

        if (singleton.netSingleton.game.SelfPropList) {
            this.propsList = singleton.netSingleton.game.SelfPropList;
            this.set_prop_icon();
        }
    }

    private use_props() {
        if (singleton.netSingleton.game.current_guid != singleton.netSingleton.login.player_info.guid) {
            return;
        }

        if (this.use_prop_id == props.turtle_shell) {
            return;
        }
        else if (this.use_prop_id == props.help_vellus || this.use_prop_id == props.thunder || this.use_prop_id == props.excited_petals ||
            this.use_prop_id == props.clip || this.use_prop_id == props.landmine || this.use_prop_id == props.spring ||
            this.use_prop_id == props.watermelon_rind || this.use_prop_id == props.gacha) {
            singleton.netSingleton.game.use_prop(this.use_prop_id, this.target_guid, this.target_animal_index);
        }
        else if (this.use_prop_id == props.clown_gift_box || this.use_prop_id == props.banana || this.use_prop_id == props.fake_dice) {
            this.is_props = true;
            game_data_def.game_data.init_select_player_ui();
            this.select_player.node.active = true;
        }
        else if (this.use_prop_id == props.horn || this.use_prop_id == props.bomb) {
            this.is_props = true;
            game_data_def.game_data.init_select_animal_ui();
            this.select_animal.node.active = true;
        }
        else if (this.use_prop_id == props.red_mushroom) {
            this.is_props = true;
            game_data_def.game_data.init_select_self_animal_ui();
            this.select_self_animal.node.active = true;
        }
        game_data_def.game_data.waitDice = false;
    }

    private choose_self_animal_0() {
        if (this.is_props) {
            this.is_props = false;
            this.target_guid = singleton.netSingleton.login.player_info.guid;
            this.target_animal_index = 0;
            singleton.netSingleton.game.use_prop(this.use_prop_id, this.target_guid, this.target_animal_index);
            this.select_self_animal.node.active = false;
        }
    }

    private choose_self_animal_1() {
        if (this.is_props) {
            this.is_props = false;
            this.target_guid = singleton.netSingleton.login.player_info.guid;
            this.target_animal_index = 1;
            singleton.netSingleton.game.use_prop(this.use_prop_id, this.target_guid, this.target_animal_index);
            this.select_self_animal.node.active = false;
        }
    }

    private choose_self_animal_2() {
        if (this.is_props) {
            this.is_props = false;
            this.target_guid = singleton.netSingleton.login.player_info.guid;
            this.target_animal_index = 2;
            singleton.netSingleton.game.use_prop(this.use_prop_id, this.target_guid, this.target_animal_index);
            this.select_self_animal.node.active = false;
        }
    }

    private choose_animal_0_0() {
        if (this.is_props) {
            this.is_props = false;
            this.target_guid = game_data_def.game_data.player1_guid;
            this.target_animal_index = 0;
            singleton.netSingleton.game.use_prop(this.use_prop_id, this.target_guid, this.target_animal_index);
            this.select_animal.node.active = false;
        }
    }

    private choose_animal_0_1() {
        if (this.is_props) {
            this.is_props = false;
            this.target_guid = game_data_def.game_data.player1_guid;
            this.target_animal_index = 1;
            singleton.netSingleton.game.use_prop(this.use_prop_id, this.target_guid, this.target_animal_index);
            this.select_animal.node.active = false;
        }
    }

    private choose_animal_0_2() {
        if (this.is_props) {
            this.is_props = false;
            this.target_guid = game_data_def.game_data.player1_guid;
            this.target_animal_index = 2;
            singleton.netSingleton.game.use_prop(this.use_prop_id, this.target_guid, this.target_animal_index);
            this.select_animal.node.active = false;
        }
    }

    private choose_animal_1_0() {
        if (this.is_props) {
            this.is_props = false;
            this.target_guid = game_data_def.game_data.player2_guid;
            this.target_animal_index = 0;
            singleton.netSingleton.game.use_prop(this.use_prop_id, this.target_guid, this.target_animal_index);
            this.select_animal.node.active = false;
        }
    }

    private choose_animal_1_1() {
        if (this.is_props) {
            this.is_props = false;
            this.target_guid = game_data_def.game_data.player2_guid;
            this.target_animal_index = 1;
            singleton.netSingleton.game.use_prop(this.use_prop_id, this.target_guid, this.target_animal_index);
            this.select_animal.node.active = false;
        }
    }

    private choose_animal_1_2() {
        if (this.is_props) {
            this.is_props = false;
            this.target_guid = game_data_def.game_data.player2_guid;
            this.target_animal_index = 2;
            singleton.netSingleton.game.use_prop(this.use_prop_id, this.target_guid, this.target_animal_index);
            this.select_animal.node.active = false;
        }
    }

    private choose_animal_2_0() {
        if (this.is_props) {
            this.is_props = false;
            this.target_guid = game_data_def.game_data.player3_guid;
            this.target_animal_index = 0;
            singleton.netSingleton.game.use_prop(this.use_prop_id, this.target_guid, this.target_animal_index);
            this.select_animal.node.active = false;
        }
    }

    private choose_animal_2_1() {
        if (this.is_props) {
            this.is_props = false;
            this.target_guid = game_data_def.game_data.player3_guid;
            this.target_animal_index = 1;
            singleton.netSingleton.game.use_prop(this.use_prop_id, this.target_guid, this.target_animal_index);
            this.select_animal.node.active = false;
        }
    }

    private choose_animal_2_2() {
        if (this.is_props) {
            this.is_props = false;
            this.target_guid = game_data_def.game_data.player3_guid;
            this.target_animal_index = 2;
            singleton.netSingleton.game.use_prop(this.use_prop_id, this.target_guid, this.target_animal_index);
            this.select_animal.node.active = false;
        }
    }

    private choose_props(index:number) {
        this.propsBtn.node.removeAllChildren();

        let props_id = this.propsSelectMap.get(index);
        let prop_prefab = game_data_props.game_data_props.get_prop_prefab(props_id);
        let prop_instance = instantiate(prop_prefab);
        this.propsBtn.node.addChild(prop_instance);

        this.use_prop_id = props_id;

        game_data_def.game_data.waitDice = false;
    }

    private choose_prop1() {
        this.choose_props(0);
    }

    private choose_prop2() {
        this.choose_props(1);
    }

    private choose_prop3() {
        this.choose_props(2);
    }

    private choose_prop4() {
        this.choose_props(3);
    }

    private choose_prop5() {
        this.choose_props(4);
    }

    private choose_prop6() {
        this.choose_props(5);
    }

    private choose_player1() {
        if (this.is_props) {
            this.is_props = false;
            this.target_guid = game_data_def.game_data.player1_guid;
            singleton.netSingleton.game.use_prop(this.use_prop_id, this.target_guid, this.target_animal_index);
            this.select_player.node.active = false;
        }
    }

    private choose_player2() {
        if (this.is_props) {
            this.is_props = false;
            this.target_guid = game_data_def.game_data.player2_guid;
            singleton.netSingleton.game.use_prop(this.use_prop_id, this.target_guid, this.target_animal_index);
            this.select_player.node.active = false;
        }
    }

    private choose_player3() {
        if (this.is_props) {
            this.is_props = false;
            this.target_guid = game_data_def.game_data.player3_guid;
            singleton.netSingleton.game.use_prop(this.use_prop_id, this.target_guid, this.target_animal_index);
            this.select_player.node.active = false;
        }
    }

    private fake_dice_exhibit_count = 3;
    private fake_dice_exhibit_instance:Node = null;
    private fake_dice_exhibit_state = true;
    private fake_dice_exhibit(_animal:any) {
        this.fake_dice_exhibit_state = !this.fake_dice_exhibit_state;
        this.fake_dice_exhibit_instance.active = this.fake_dice_exhibit_state;

        this.fake_dice_exhibit_count--;
        if (this.fake_dice_exhibit_count > 0) {
            setTimeout(() => {
                this.fake_dice_exhibit(_animal);
            }, 300);
        }
        else {
            _animal.removeChild(this.fake_dice_exhibit_instance);
            this.fake_dice_exhibit_instance.destroy();
            this.fake_dice_exhibit_instance = null;
        }
    }

    private set_fake_dice(target_guid:number) {
        let target = singleton.netSingleton.game.get_player_game_info(target_guid);
        let target_animal = target.animal_info[target.current_animal_index];
        game_data_def.game_data.set_camera_pos_animal(target_animal);

        let animal_map = game_data_def.game_data.PlayerAnimalMap.get(target_guid);
        let _animal = animal_map.get(target.current_animal_index);
        this.fake_dice_exhibit_instance = instantiate(this.props_fake_dice);
        _animal.addChild(this.fake_dice_exhibit_instance);
        this.fake_dice_exhibit_instance.setScale(0.33, 0.33);
        this.fake_dice_exhibit_instance.setPosition(0, 64);
        setTimeout(() => {
            this.fake_dice_exhibit(_animal);
        }, 300);
    }

    on_cb_use_props(props_id:props, guid:number, animal_index:number, target_guid:number, target_animal_index:number) {
        console.log(`on_cb_use_props guid:${guid}, target_guid:${target_guid}, target_animal_index:${target_animal_index}`);

        let player = singleton.netSingleton.game.get_player_game_info(guid);
        let player_animal = player.animal_info[animal_index];
        let player_animal_name = game_data_def.game_constant_data.animal_name(player_animal.animal_id);
        let target = singleton.netSingleton.game.get_player_game_info(target_guid);
        let target_animal = target.animal_info[target_animal_index];
        let target_animal_name = game_data_def.game_constant_data.animal_name(target_animal.animal_id);

        if (guid == singleton.netSingleton.login.player_info.guid) {
            let index = this.propsList.indexOf(props_id);
            if (index >= 0) {
                this.propsList.splice(index, 1);
            }
            this.set_prop_icon();
        }

        if (props_id == props.horn) { //号角
            game_data_def.game_data.set_prompt(`玩家${player.name}对玩家${target.name}的${target_animal_name}是使用了道具号角,
                ${target_animal_name}移动能力减弱(每轮移动色子点数/2)持续两回合`);
            game_data_def.game_data.set_negative(target_guid, target_animal_index);
            game_data_def.game_data.set_crown(target_guid, target_animal_index, this.horn_effect);
        }
        else if (props_id == props.bomb) { //炸弹
            game_data_def.game_data.set_prompt(`玩家${player.name}对玩家${target.name}的${target_animal_name}是使用了道具炸弹,
                ${target_animal_name}停止行动2回合`);
            game_data_def.game_data.set_zhadan(target_guid, target_animal_index);
        }
        else if (props_id == props.help_vellus) { //救命毫毛
            game_data_def.game_data.set_prompt(`玩家${player.name}使用了道具救命毫毛,三回合内可免疫一次道具攻击`);
            game_data_def.game_data.set_gain(guid);
        }
        else if (props_id == props.thunder) { //天雷
            game_data_def.game_data.set_prompt(`玩家${player.name}使用了道具天雷,除${player.name}外所有玩家角色向后退后三格`);
        }
        else if (props_id == props.clown_gift_box) { //小丑礼盒
            game_data_def.game_data.set_prompt(`玩家${player.name}对玩家${target.name}使用了道具小丑礼盒,玩家${target.name}三回合无法使用道具`);
            game_data_def.game_data.set_negative(target_guid, target_animal_index);
            game_data_def.game_data.set_crown(target_guid, target_animal_index, this.clown_gift_box_effect);
        }
        else if (props_id == props.excited_petals) { //亢奋花瓣
            game_data_def.game_data.set_prompt(`玩家${player.name}使用了道具亢奋花瓣,下个回合玩家${player.name}额外获得两次行动`);
            game_data_def.game_data.set_gain(guid);
            game_data_def.game_data.set_crown(target_guid, target_animal_index, this.excited_petals_effect);
        }
        else if (props_id == props.clip) { //夹子
            game_data_def.game_data.set_prompt(`玩家${player.name}使用了道具夹子,踩上夹子的角色无法使用丢骰子移动`);
        }
        else if (props_id == props.landmine) { //地雷
            game_data_def.game_data.set_prompt(`玩家${player.name}使用了道具地雷,踩上地雷的角色后退4格`);
        }
        else if (props_id == props.spring) { //弹簧
            game_data_def.game_data.set_prompt(`玩家${player.name}使用了道具弹簧,踩上弹簧的地雷弹回上次移动位置`);
        }
        else if (props_id == props.banana) { //香蕉
            game_data_def.game_data.set_prompt(`玩家${player.name}对玩家${target.name}使用了道具香蕉,玩家${target.name}下次投骰子将往反方向移动`);
            game_data_def.game_data.set_negative(target_guid, target_animal_index);
            game_data_def.game_data.set_crown(target_guid, target_animal_index, this.banana_effect);
        }
        else if (props_id == props.watermelon_rind) { //西瓜皮
            game_data_def.game_data.set_prompt(`玩家${player.name}使用了道具西瓜皮,踩上的角色随机向前或是向后移动3格`);
        }
        else if (props_id == props.red_mushroom) { //红蘑菇
            game_data_def.game_data.set_prompt(`玩家${player.name}使用了道具红蘑菇,他的角色${player_animal_name}向前移动4格`);
            game_data_def.game_data.set_gain(guid);
            game_data_def.game_data.set_crown(target_guid, target_animal_index, this.red_mushroom_effect);
        }
        else if (props_id == props.gacha) { //扭蛋
            game_data_def.game_data.set_prompt(`玩家${player.name}使用了道具扭蛋,随机获得一个道具`);
            game_data_def.game_data.set_gain(guid);
            game_data_def.game_data.set_crown(target_guid, target_animal_index, this.gacha_effect);
        }
        else if (props_id == props.fake_dice) { //假骰子
            game_data_def.game_data.set_prompt(`玩家${player.name}对玩家${target.name}使用了道具假骰子,玩家${target.name}下次投骰子只能投出1—3`);
            this.set_fake_dice(target_guid);
        }
    }

    on_cb_ntf_prop_info(info:prop_info[]) {
        game_data_props.game_data_props.set_prop(info);
    }

    on_cb_ntf_new_prop_info(info:prop_info) {
        if (info.prop_id == props.horn) { //号角
            game_data_def.game_data.set_prompt(`道具号角出现在赛场上\n使目标角色移动能力减弱(每轮移动色子点数/2)持续两回合`);
        }
        else if (info.prop_id == props.bomb) { //炸弹
            game_data_def.game_data.set_prompt(`道具炸弹出现在赛场上\n轰炸目标角色,使他停止行动2回合`);
        }
        else if (info.prop_id == props.help_vellus) { //救命毫毛
            game_data_def.game_data.set_prompt(`道具救命毫毛出现在赛场上\n使用后三回合内免疫一次道具攻击`);
        }
        else if (info.prop_id == props.thunder) { //天雷
            game_data_def.game_data.set_prompt(`道具天雷出现在赛场上\n除自己外,所有玩家向后退后三格`);
        }
        else if (info.prop_id == props.clown_gift_box) { //小丑礼盒
            game_data_def.game_data.set_prompt(`道具小丑礼盒出现在赛场上\n使用后使任意一个玩家三回合无法使用道具`);
        }
        else if (info.prop_id == props.excited_petals) { //亢奋花瓣
            game_data_def.game_data.set_prompt(`道具亢奋花瓣出现在赛场上\n使你下个回合额外获得两次行动回合`);
        }
        else if (info.prop_id == props.clip) { //夹子
            game_data_def.game_data.set_prompt(`道具夹子出现在赛场上\n原地留下一个夹子,使踩上角色无法使用丢骰子移动`);
        }
        else if (info.prop_id == props.landmine) { //地雷
            game_data_def.game_data.set_prompt(`道具地雷出现在赛场上\n原地留下一个地雷,使踩上的玩家后退4格`);
        }
        else if (info.prop_id == props.spring) { //弹簧
            game_data_def.game_data.set_prompt(`道具弹簧出现在赛场上\n原地留下一个弹簧,使踩上的玩家弹会上次移动位置`);
        }
        else if (info.prop_id == props.turtle_shell) { //无敌龟壳
            game_data_def.game_data.set_prompt(`道具无敌龟壳出现在赛场上\n获得者可以反射一次负面道具,但不能反射给发射者`);
        }
        else if (info.prop_id == props.banana) { //香蕉
            game_data_def.game_data.set_prompt(`道具香蕉出现在赛场上\n使任意一个玩家下次投骰子往反方向移动`);
        }
        else if (info.prop_id == props.watermelon_rind) { //西瓜皮
            game_data_def.game_data.set_prompt(`道具西瓜皮出现在赛场上\n原地扔下西瓜皮,踩上的玩家随机向前或是向后移动3格`);
        }
        else if (info.prop_id == props.red_mushroom) { //红蘑菇
            game_data_def.game_data.set_prompt(`道具红蘑菇出现在赛场上\n选择一个你的角色,使他向前固定移动4格`);
        }
        else if (info.prop_id == props.gacha) { //扭蛋
            game_data_def.game_data.set_prompt(`道具扭蛋出现在赛场上\n使用后随机获得一个道具`);
        }
        else if (info.prop_id == props.fake_dice) { //假骰子
            game_data_def.game_data.set_prompt(`道具假骰子出现在赛场上\n选择一个玩家,使他下次投骰子只能投出1—3`);
        }

        console.log("on_cb_ntf_new_prop_info new_prop_info grid:", info.grid);
        game_data_def.game_data.set_camera_pos_grid(info.grid);
        game_data_def.game_data.current_move_obj = null;

        let prop_prefab = game_data_props.game_data_props.get_prop_prefab(info.prop_id);
        game_data_props.game_data_props.set_prop_prefab(info.grid, prop_prefab);
    }

    remove_prop(grid:number) {
        let old_prop_instance = game_data_props.game_data_props.mapProps.get(grid);
        if (old_prop_instance) {
            old_prop_instance.active = false;
            game_data_def.game_data.map.node.removeChild(old_prop_instance);
            old_prop_instance.destroy();
        }
        game_data_props.game_data_props.mapProps.delete(grid);
    }

    on_cb_remove_prop(grid:number) {
        console.log("on_cb_remove_prop grid:", grid);
        game_data_def.game_data.set_camera_pos_grid(grid);
        this.remove_prop(grid);
    }

    on_cb_ntf_player_stepped_prop(guid:number, prop_id:props) {
        let player = singleton.netSingleton.game.get_player_game_info(guid);

        if (prop_id == props.horn) { //号角
            game_data_def.game_data.set_prompt(`玩家${player.name}获得了道具号角`);
        }
        else if (prop_id == props.bomb) { //炸弹
            game_data_def.game_data.set_prompt(`玩家${player.name}获得了道具炸弹`);
        }
        else if (prop_id == props.help_vellus) { //救命毫毛
            game_data_def.game_data.set_prompt(`玩家${player.name}获得了道具救命毫毛`);
        }
        else if (prop_id == props.thunder) { //天雷
            game_data_def.game_data.set_prompt(`玩家${player.name}获得了道具天雷`);
        }
        else if (prop_id == props.clown_gift_box) { //小丑礼盒
            game_data_def.game_data.set_prompt(`玩家${player.name}获得了道具小丑礼盒`);
        }
        else if (prop_id == props.excited_petals) { //亢奋花瓣
            game_data_def.game_data.set_prompt(`玩家${player.name}获得了道具亢奋花瓣`);
        }
        else if (prop_id == props.clip) { //夹子
            game_data_def.game_data.set_prompt(`玩家${player.name}获得了道具夹子`);
        }
        else if (prop_id == props.landmine) { //地雷
            game_data_def.game_data.set_prompt(`玩家${player.name}获得了道具地雷`);
        }
        else if (prop_id == props.spring) { //弹簧
            game_data_def.game_data.set_prompt(`玩家${player.name}获得了道具弹簧`);
        }
        else if (prop_id == props.turtle_shell) { //无敌龟壳
            game_data_def.game_data.set_prompt(`玩家${player.name}获得了道具无敌龟壳`);
        }
        else if (prop_id == props.banana) { //香蕉
            game_data_def.game_data.set_prompt(`玩家${player.name}获得了道具香蕉`);
        }
        else if (prop_id == props.watermelon_rind) { //西瓜皮
            game_data_def.game_data.set_prompt(`玩家${player.name}获得了道具西瓜皮`);
        }
        else if (prop_id == props.red_mushroom) { //红蘑菇
            game_data_def.game_data.set_prompt(`玩家${player.name}获得了道具红蘑菇`);
        }
        else if (prop_id == props.gacha) { //扭蛋
            game_data_def.game_data.set_prompt(`玩家${player.name}获得了道具扭蛋`);
        }
        else if (prop_id == props.fake_dice) { //假骰子
            game_data_def.game_data.set_prompt(`玩家${player.name}获得了道具假骰子`);
        }

        if (guid == singleton.netSingleton.login.player_info.guid) {
            this.propsList.push(prop_id);
            this.set_prop_icon();
        }
    }

    on_cb_ntf_player_prop_list(prop_list:props[]) {
        this.propsList = prop_list;
        this.set_prop_icon();
    }

    props_instance_list:Node[] = []
    set_prop_icon() {
        this.prop1.node.removeAllChildren();
        this.prop2.node.removeAllChildren();
        this.prop3.node.removeAllChildren();
        this.prop4.node.removeAllChildren();
        this.prop5.node.removeAllChildren();
        this.prop6.node.removeAllChildren();

        this.propsSelectMap.clear();

        for (let ins of this.props_instance_list) {
            ins.destroy();
        }
        this.props_instance_list = [];

        let index = 0;
        for(let prop_id of this.propsList) {
            this.propsSelectMap.set(index, prop_id);
            let prop_prefab = game_data_props.game_data_props.get_prop_prefab(prop_id);
            let prop_instance = instantiate(prop_prefab);
            this.props_instance_list.push(prop_instance)
            if (index == 0) {
                this.prop1.node.addChild(prop_instance);
            }
            else if (index == 1) {
                this.prop2.node.addChild(prop_instance);
            }
            else if (index == 2) {
                this.prop3.node.addChild(prop_instance);
            }
            else if (index == 3) {
                this.prop4.node.addChild(prop_instance);
            }
            else if (index == 4) {
                this.prop5.node.addChild(prop_instance);
            }
            else if (index == 5) {
                this.prop6.node.addChild(prop_instance);
            }
            index++;
        }
        
        if (this.propsSelectMap.size > 0) {
            this.choose_props(0);
        }
    }

}