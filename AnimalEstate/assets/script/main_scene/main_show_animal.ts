import { _decorator, Component, Sprite, Node } from 'cc';
const { ccclass, property } = _decorator;

import { animal } from '../serverSDK/common';

@ccclass('main_show_animal')
export class main_show_animal extends Component {
    
    @property(Sprite)
    cancle_btn:Sprite = null;
    @property(Sprite)
    left_btn:Sprite = null;
    @property(Sprite)
    right_btn:Sprite = null;

    @property(Sprite)
    bear_img:Sprite = null;
    @property(Sprite)
    bear_text:Sprite = null;
    @property(Sprite)
    chicken_img:Sprite = null;
    @property(Sprite)
    chicken_text:Sprite = null;
    @property(Sprite)
    duck_img:Sprite = null;
    @property(Sprite)
    duck_text:Sprite = null;
    @property(Sprite)
    lion_img:Sprite = null;
    @property(Sprite)
    lion_text:Sprite = null;
    @property(Sprite)
    monkey_img:Sprite = null;
    @property(Sprite)
    monkey_text:Sprite = null;
    @property(Sprite)
    mouse_img:Sprite = null;
    @property(Sprite)
    mouse_text:Sprite = null;
    @property(Sprite)
    rabbit_img:Sprite = null;
    @property(Sprite)
    rabbit_text:Sprite = null;
    @property(Sprite)
    tiger_img:Sprite = null;
    @property(Sprite)
    tiger_text:Sprite = null;

    animal_id:animal = animal.bear;

    private set_img_text_active_false() {
        this.bear_img.node.active = false;
        this.bear_text.node.active = false;
        this.chicken_img.node.active = false;
        this.chicken_text.node.active = false;
        this.duck_img.node.active = false;
        this.duck_text.node.active = false;
        this.lion_img.node.active = false;
        this.lion_text.node.active = false;
        this.monkey_img.node.active = false;
        this.monkey_text.node.active = false;
        this.mouse_img.node.active = false;
        this.mouse_text.node.active = false;
        this.rabbit_img.node.active = false;
        this.rabbit_text.node.active = false;
        this.tiger_img.node.active = false;
        this.tiger_text.node.active = false;
    }

    private set_img_text_active() {
        this.set_img_text_active_false();

        if (this.animal_id == animal.bear) {
            this.bear_img.node.active = true;
            this.bear_text.node.active = true;
        }
        else if (this.animal_id == animal.chicken) {
            this.chicken_img.node.active = true;
            this.chicken_text.node.active = true;
        }
        else if (this.animal_id == animal.duck) {
            this.duck_img.node.active = true;
            this.duck_text.node.active = true;
        }
        else if (this.animal_id == animal.lion) {
            this.lion_img.node.active = true;
            this.lion_text.node.active = true;
        }
        else if (this.animal_id == animal.monkey) {
            this.monkey_img.node.active = true;
            this.monkey_text.node.active = true;
        }
        else if (this.animal_id == animal.mouse) {
            this.mouse_img.node.active = true;
            this.mouse_text.node.active = true;
        }
        else if (this.animal_id == animal.rabbit) {
            this.rabbit_img.node.active = true;
            this.rabbit_text.node.active = true;
        }
        else if (this.animal_id == animal.tiger) {
            this.tiger_img.node.active = true;
            this.tiger_text.node.active = true;
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
        --this.animal_id;
        if (this.animal_id <= 0) {
            this.animal_id = animal.lion;
        }
        this.set_img_text_active();
    }

    right_btn_callback() {
        ++this.animal_id;
        if (this.animal_id > 8) {
            this.animal_id = animal.chicken;
        }
        this.set_img_text_active();
    }

    update(deltaTime: number) {
    }

}