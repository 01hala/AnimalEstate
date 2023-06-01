import { _decorator, Component, Node, Sprite, Event, Prefab, instantiate, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

import * as singleton from '../netDriver/netSingleton';
import { playground, player_friend_info } from '../serverSDK/common';

@ccclass('main_friend')
export class main_friend extends Component {
    @property(Prefab)
    my_friend_inner_frame:Prefab = null;
    @property(Prefab)
    add_friend_inner_frame:Prefab = null;
    @property(Prefab)
    invite_friend_inner_frame:Prefab = null;

    @property(Sprite)
    my_friend:Sprite = null;
    @property(Sprite)
    add_friend:Sprite = null;
    @property(Sprite)
    invite_friend:Sprite = null;
    @property(Sprite)
    ui_frame:Sprite = null;
    @property(Sprite)
    background:Sprite = null;

    friend_ui_frame:Node = null;
    
    private init_friend_frame(ui_frame_prefab:Prefab, pos:Vec2 = new Vec2(0, 0)) {
        if (this.friend_ui_frame) {
            this.ui_frame.node.removeChild(this.friend_ui_frame);
            this.friend_ui_frame.destroy();
        }
        this.friend_ui_frame = instantiate(ui_frame_prefab);
        this.ui_frame.node.addChild(this.friend_ui_frame);
        this.friend_ui_frame.setPosition(pos.x, pos.y);
    }

    background_callback() {
        this.node.destroy();
    }

    ui_frame_callback(event:Event) {
        event.propagationStopped = true
    }

    start() {
        this.init_friend_frame(this.my_friend_inner_frame);

        this.my_friend.node.on(Node.EventType.TOUCH_START, this.my_friend_callback, this);
        this.add_friend.node.on(Node.EventType.TOUCH_START, this.add_friend_callback, this);
        this.invite_friend.node.on(Node.EventType.TOUCH_START, this.invite_friend_callback, this);

        this.ui_frame.node.on(Node.EventType.TOUCH_START, this.ui_frame_callback, this);

        this.background.node.on(Node.EventType.TOUCH_START, this.background_callback, this);
    }

    invite_friend_callback(event:Event) {
        console.log("invite_friend_callback");
        event.propagationStopped = true
        this.init_friend_frame(this.invite_friend_inner_frame);
    }

    add_friend_callback(event:Event) {
        console.log("add_friend_callback");
        event.propagationStopped = true
        this.init_friend_frame(this.add_friend_inner_frame, new Vec2(0, -56));
    }

    my_friend_callback(event:Event) {
        console.log("my_friend_callback");
        event.propagationStopped = true
        this.init_friend_frame(this.my_friend_inner_frame);
    }

    update(deltaTime: number) {
    }
}