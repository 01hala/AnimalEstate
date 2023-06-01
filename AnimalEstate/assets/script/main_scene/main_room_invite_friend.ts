import { _decorator, Component, Node, Sprite, Label, Event, Prefab, instantiate, ScrollView, Vec2, UITransform, Size } from 'cc';
const { ccclass, property } = _decorator;

import * as singleton from '../netDriver/netSingleton';
import { playground, player_friend_info } from '../serverSDK/common';

@ccclass('main_room_invite_friend')
export class main_room_invite_friend extends Component {
    
    @property(ScrollView)
    friend_frame:ScrollView = null;
    @property(Prefab)
    friend_invite:Prefab = null;

    @property(Sprite)
    friend_background:Sprite = null;
    @property(Sprite)
    frame1:Sprite = null;

    top:number = 0;
    bottom:number = 0;

    set_friend_list() {
        singleton.netSingleton.friend.get_friend_list().callBack((friend_list) => {
            let friend_count = 0;
            for (let friend of friend_list) {
                let _friend_invite = instantiate(this.friend_invite);

                var id_name = _friend_invite.getChildByName("id_name").getChildByName("id_name").getComponent(Label);
                id_name.string = friend.name + " " + friend.guid;

                var invited_btn = _friend_invite.getChildByName("invited_btn");
                invited_btn.active = false;

                var invite_btn = _friend_invite.getChildByName("invite_btn");
                invite_btn.on(Node.EventType.TOUCH_START, () => {
                    console.log("invite_btn! friend.sdk_uuid", friend.sdk_uuid);
                    invite_btn.active = false;
                    invited_btn.active = true;
                    singleton.netSingleton.room.invite_role_join_room(friend.sdk_uuid);
                }, this);

                this.friend_frame.content.addChild(_friend_invite);
                _friend_invite.setPosition(0, -50 - friend_count * 100);

                friend_count++;
            }
            this.bottom = (friend_count - 5) * 100;
            this.friend_frame.content.getComponent(UITransform).setContentSize(new Size(450, 50 + friend_count * 100));
        }, (err) => {
            console.log("get_friend_list error:", err);
        }).timeout(3000, () =>{
            console.log("get_friend_list timeout");
        });
    }

    start() {
        this.friend_background.node.on(Node.EventType.TOUCH_START, this.friend_background_callback, this);
        this.frame1.node.on(Node.EventType.TOUCH_START, this.frame1_callback, this);

        this.friend_frame.node.on(ScrollView.EventType.SCROLLING, this.scrolling_callback, this);

        this.set_friend_list();
    }

    scrolling_callback() {
        let pos = this.friend_frame.getScrollOffset().y;

        if (pos < this.top - 200) {
            this.friend_frame.scrollToOffset(new Vec2(0, pos), 10);
        }
        else if (pos > this.bottom + 200) {
            let maxScrollOffset = this.friend_frame.getMaxScrollOffset();
            this.friend_frame.scrollToOffset(new Vec2(0, maxScrollOffset.y), 10);
        }
    }

    frame1_callback(event:Event) {
        event.propagationStopped = true
    }

    friend_background_callback(event:Event) {
        event.propagationStopped = true
        this.node.destroy();
    }

    update(deltaTime: number) {
    }
}