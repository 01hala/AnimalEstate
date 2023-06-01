import { _decorator, Component, Sprite, Node } from 'cc';
const { ccclass, property } = _decorator;

import { props } from '../serverSDK/common';

@ccclass('main_show_props')
export class main_show_props extends Component {
    
    @property(Sprite)
    cancle_btn:Sprite = null;
    @property(Sprite)
    left_btn:Sprite = null;
    @property(Sprite)
    right_btn:Sprite = null;

    @property(Sprite)
    horn_img:Sprite = null;
    @property(Sprite)
    horn_text:Sprite = null;
    @property(Sprite)
    bomb_img:Sprite = null;
    @property(Sprite)
    bomb_text:Sprite = null;
    @property(Sprite)
    help_vellus_img:Sprite = null;
    @property(Sprite)
    help_vellus_text:Sprite = null;
    @property(Sprite)
    thunder_img:Sprite = null;
    @property(Sprite)
    thunder_text:Sprite = null;
    @property(Sprite)
    clown_gift_box_img:Sprite = null;
    @property(Sprite)
    clown_gift_box_text:Sprite = null;
    @property(Sprite)
    excited_petals_img:Sprite = null;
    @property(Sprite)
    excited_petals_text:Sprite = null;
    @property(Sprite)
    clip_img:Sprite = null;
    @property(Sprite)
    clip_text:Sprite = null;
    @property(Sprite)
    landmine_img:Sprite = null;
    @property(Sprite)
    landmine_text:Sprite = null;
    @property(Sprite)
    spring_img:Sprite = null;
    @property(Sprite)
    spring_text:Sprite = null;
    @property(Sprite)
    turtle_shell_img:Sprite = null;
    @property(Sprite)
    turtle_shell_text:Sprite = null;
    @property(Sprite)
    banana_img:Sprite = null;
    @property(Sprite)
    banana_text:Sprite = null;
    @property(Sprite)
    watermelon_rind_img:Sprite = null;
    @property(Sprite)
    watermelon_rind_text:Sprite = null;
    @property(Sprite)
    red_mushroom_img:Sprite = null;
    @property(Sprite)
    red_mushroom_text:Sprite = null;
    @property(Sprite)
    gacha_img:Sprite = null;
    @property(Sprite)
    gacha_text:Sprite = null;
    @property(Sprite)
    fake_dice_img:Sprite = null;
    @property(Sprite)
    fake_dice_text:Sprite = null;

    props_id:props = props.horn;

    private set_img_text_active_false() {
        this.horn_img.node.active = false;
        this.horn_text.node.active = false;
        this.bomb_img.node.active = false;
        this.bomb_text.node.active = false;
        this.help_vellus_img.node.active = false;
        this.help_vellus_text.node.active = false;
        this.thunder_img.node.active = false;
        this.thunder_text.node.active = false;
        this.clown_gift_box_img.node.active = false;
        this.clown_gift_box_text.node.active = false;
        this.excited_petals_img.node.active = false;
        this.excited_petals_text.node.active = false;
        this.clip_img.node.active = false;
        this.clip_text.node.active = false;
        this.landmine_img.node.active = false;
        this.landmine_text.node.active = false;
        this.spring_img.node.active = false;
        this.spring_text.node.active = false;
        this.turtle_shell_img.node.active = false;
        this.turtle_shell_text.node.active = false;
        this.banana_img.node.active = false;
        this.banana_text.node.active = false;
        this.watermelon_rind_img.node.active = false;
        this.watermelon_rind_text.node.active = false;
        this.red_mushroom_img.node.active = false;
        this.red_mushroom_text.node.active = false;
        this.gacha_img.node.active = false;
        this.gacha_text.node.active = false;
        this.fake_dice_img.node.active = false;
        this.fake_dice_text.node.active = false;
    }

    private set_img_text_active() {
        this.set_img_text_active_false();

        if (this.props_id == props.banana) {
            this.banana_img.node.active = true;
            this.banana_text.node.active = true;
        }
        else if (this.props_id == props.bomb) {
            this.bomb_img.node.active = true;
            this.bomb_text.node.active = true;
        }
        else if (this.props_id == props.clip) {
            this.clip_img.node.active = true;
            this.clip_text.node.active = true;
        }
        else if (this.props_id == props.clown_gift_box) {
            this.clown_gift_box_img.node.active = true;
            this.clown_gift_box_text.node.active = true;
        }
        else if (this.props_id == props.excited_petals) {
            this.excited_petals_img.node.active = true;
            this.excited_petals_text.node.active = true;
        }
        else if (this.props_id == props.fake_dice) {
            this.fake_dice_img.node.active = true;
            this.fake_dice_text.node.active = true;
        }
        else if (this.props_id == props.gacha) {
            this.gacha_img.node.active = true;
            this.gacha_text.node.active = true;
        }
        else if (this.props_id == props.help_vellus) {
            this.help_vellus_img.node.active = true;
            this.help_vellus_text.node.active = true;
        }
        else if (this.props_id == props.horn) {
            this.horn_img.node.active = true;
            this.horn_text.node.active = true;
        }
        else if (this.props_id == props.landmine) {
            this.landmine_img.node.active = true;
            this.landmine_text.node.active = true;
        }
        else if (this.props_id == props.red_mushroom) {
            this.red_mushroom_img.node.active = true;
            this.red_mushroom_text.node.active = true;
        }
        else if (this.props_id == props.spring) {
            this.spring_img.node.active = true;
            this.spring_text.node.active = true;
        }
        else if (this.props_id == props.thunder) {
            this.thunder_img.node.active = true;
            this.thunder_text.node.active = true;
        }
        else if (this.props_id == props.turtle_shell) {
            this.turtle_shell_img.node.active = true;
            this.turtle_shell_text.node.active = true;
        }
        else if (this.props_id == props.watermelon_rind) {
            this.watermelon_rind_img.node.active = true;
            this.watermelon_rind_text.node.active = true;
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
        --this.props_id;
        if (this.props_id <= props.none) {
            this.props_id = props.fake_dice;
        }
        this.set_img_text_active();
    }

    right_btn_callback() {
        ++this.props_id;
        if (this.props_id > 15) {
            this.props_id = props.horn;
        }
        this.set_img_text_active();
    }

    update(deltaTime: number) {
    }

}