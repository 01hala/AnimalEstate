import { _decorator, Component, Node, Button, Sprite, Label, director, Event } from 'cc';
const { ccclass, property } = _decorator;

import * as singleton from '../netDriver/netSingleton';
import { playground } from '../serverSDK/common';

@ccclass('match_interface')
export class match_interface extends Component {
    @property(Button)
    start_match_game:Button = null;
    @property(Button)
    left:Button = null;
    @property(Button)
    right:Button = null;
    @property(Label)
    countdown:Label = null;
    @property(Sprite)
    random_sprite:Sprite = null;
    @property(Sprite)
    lakside_sprite:Sprite = null;

    @property(Sprite)
    select_background:Sprite = null;
    @property(Sprite)
    background:Sprite = null;

    start_match:boolean = false;
    enum_playground:playground = playground.random;
    countdown_count:number = 5;

    set_thumbnail() {
        this.random_sprite.node.active = false;
        this.lakside_sprite.node.active = false;

        switch(this.enum_playground) {
            case playground.random:
                this.random_sprite.node.active = true;
                break;
            case playground.lakeside:
                this.lakside_sprite.node.active = true;
                break;
        }
    }

    start() {
        this.set_thumbnail();

        this.countdown.node.active = false;

        this.start_match_game.node.on(Node.EventType.TOUCH_START, this.start_match_game_callback, this);
        this.left.node.on(Node.EventType.TOUCH_START, this.left_callback, this);
        this.right.node.on(Node.EventType.TOUCH_START, this.right_callback, this);

        this.select_background.node.on(Node.EventType.TOUCH_START, this.select_background_callback, this);
        this.background.node.on(Node.EventType.TOUCH_START, this.background_callback, this);

        singleton.netSingleton.game.cb_game_wait_start_info = () => {
            console.log("start match!");

            this.unschedule(this.countdown_callback);
            this.node.active = false;

            singleton.netSingleton.room.ReInit();
            
            singleton.netSingleton.bundle.loadScene('lakeside_game', function (err, scene) {
                console.log("lakeside_game loadScene error:", err);
                director.runScene(scene);
            });
        };
    }

    update(deltaTime: number) {
    }
    
    countdown_callback() {
        this.countdown.string = (--this.countdown_count).toString();
    }

    select_background_callback(event:Event) {
        event.propagationStopped = true
    }

    background_callback(event:Event) {
        event.propagationStopped = true
        
        if (!this.start_match) {
            this.node.destroy();
        }
    }

    start_match_game_callback(event:Event) {
        event.propagationStopped = true

        singleton.netSingleton.match.start_match(this.enum_playground);

        this.start_match = true;
        this.countdown.node.active = true;
        this.schedule(this.countdown_callback, 1);
    }

    left_callback() {
        this.enum_playground--;
        if (this.enum_playground < 0) {
            this.enum_playground = playground.lakeside;
        }
        this.set_thumbnail();
    }

    right_callback() {
        this.enum_playground++;
        if (this.enum_playground > playground.lakeside) {
            this.enum_playground = playground.random;
        }
        this.set_thumbnail();
    }
}


