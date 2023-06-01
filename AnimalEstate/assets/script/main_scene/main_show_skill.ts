import { _decorator, Component, Sprite, Node } from 'cc';
const { ccclass, property } = _decorator;

import { skill } from '../serverSDK/common';

@ccclass('main_show_skill')
export class main_show_skill extends Component {
    
    @property(Sprite)
    cancle_btn:Sprite = null;
    @property(Sprite)
    left_btn:Sprite = null;
    @property(Sprite)
    right_btn:Sprite = null;

    @property(Sprite)
    phantom_dice_img:Sprite = null;
    @property(Sprite)
    phantom_dice_name:Sprite = null;
    @property(Sprite)
    phantom_dice_text:Sprite = null;
    @property(Sprite)
    soul_moving_img:Sprite = null;
    @property(Sprite)
    soul_moving_name:Sprite = null;
    @property(Sprite)
    soul_moving_text:Sprite = null;
    @property(Sprite)
    thief_reborn_img:Sprite = null;
    @property(Sprite)
    thief_reborn_name:Sprite = null;
    @property(Sprite)
    thief_reborn_text:Sprite = null;
    @property(Sprite)
    step_lotus_img:Sprite = null;
    @property(Sprite)
    step_lotus_name:Sprite = null;
    @property(Sprite)
    step_lotus_text:Sprite = null;
    @property(Sprite)
    preemptiv_strike_img:Sprite = null;
    @property(Sprite)
    preemptiv_strike_name:Sprite = null;
    @property(Sprite)
    preemptiv_strike_text:Sprite = null;
    @property(Sprite)
    swap_places_img:Sprite = null;
    @property(Sprite)
    swap_places_name:Sprite = null;
    @property(Sprite)
    swap_places_text:Sprite = null;
    @property(Sprite)
    altec_lightwave_img:Sprite = null;
    @property(Sprite)
    altec_lightwave_name:Sprite = null;
    @property(Sprite)
    altec_lightwave_text:Sprite = null;

    skill_id:skill = skill.phantom_dice;

    private set_img_text_active_false() {
        this.phantom_dice_img.node.active = false;
        this.phantom_dice_name.node.active = false;
        this.phantom_dice_text.node.active = false;
        this.soul_moving_img.node.active = false;
        this.soul_moving_name.node.active = false;
        this.soul_moving_text.node.active = false;
        this.thief_reborn_img.node.active = false;
        this.thief_reborn_name.node.active = false;
        this.thief_reborn_text.node.active = false;
        this.step_lotus_img.node.active = false;
        this.step_lotus_name.node.active = false;
        this.step_lotus_text.node.active = false;
        this.preemptiv_strike_img.node.active = false;
        this.preemptiv_strike_name.node.active = false;
        this.preemptiv_strike_text.node.active = false;
        this.swap_places_img.node.active = false;
        this.swap_places_name.node.active = false;
        this.swap_places_text.node.active = false;
        this.altec_lightwave_img.node.active = false;
        this.altec_lightwave_name.node.active = false;
        this.altec_lightwave_text.node.active = false;
    }

    private set_img_text_active() {
        this.set_img_text_active_false();

        if (this.skill_id == skill.phantom_dice) {
            this.phantom_dice_img.node.active = true;
            this.phantom_dice_name.node.active = true;
            this.phantom_dice_text.node.active = true;
        }
        else if (this.skill_id == skill.soul_moving_method) {
            this.soul_moving_img.node.active = true;
            this.soul_moving_name.node.active = true;
            this.soul_moving_text.node.active = true;
        }
        else if (this.skill_id == skill.thief_reborn) {
            this.thief_reborn_img.node.active = true;
            this.thief_reborn_name.node.active = true;
            this.thief_reborn_text.node.active = true;
        }
        else if (this.skill_id == skill.step_lotus) {
            this.step_lotus_img.node.active = true;
            this.step_lotus_name.node.active = true;
            this.step_lotus_text.node.active = true;
        }
        else if (this.skill_id == skill.preemptiv_strike) {
            this.preemptiv_strike_img.node.active = true;
            this.preemptiv_strike_name.node.active = true;
            this.preemptiv_strike_text.node.active = true;
        }
        else if (this.skill_id == skill.swap_places) {
            this.swap_places_img.node.active = true;
            this.swap_places_name.node.active = true;
            this.swap_places_text.node.active = true;
        }
        else if (this.skill_id == skill.altec_lightwave) {
            this.altec_lightwave_img.node.active = true;
            this.altec_lightwave_name.node.active = true;
            this.altec_lightwave_text.node.active = true;
        }
    }

    start() {
        this.set_img_text_active();

        this.cancle_btn.node.on(Node.EventType.TOUCH_START, this.cancle_btn_callback, this);
        this.left_btn.node.on(Node.EventType.TOUCH_START, this.left_btn_callback, this);
        this.right_btn.node.on(Node.EventType.TOUCH_START, this.right_btn_callback, this);
    }

    cancle_btn_callback() {
        console.log("cancle_btn_callback");

        this.node.active = false;
        
    }

    left_btn_callback() {
        --this.skill_id;
        if (this.skill_id <= 0) {
            this.skill_id = skill.altec_lightwave;
        }
        this.set_img_text_active();
    }

    right_btn_callback() {
        ++this.skill_id;
        if (this.skill_id > 7) {
            this.skill_id = skill.phantom_dice;
        }
        this.set_img_text_active();
    }

    update(deltaTime: number) {
    }

}