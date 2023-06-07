import { _decorator, Component, Node, Sprite, Canvas, Prefab, director, instantiate, Label, ScrollView, math, UITransform, Size, Vec2, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

import * as singleton from '../netDriver/netSingleton';
import { playground, player_friend_info } from '../serverSDK/common';

import * as util from './main_scene';

@ccclass('main_my_friend')
export class main_my_friend extends Component {

    @property(ScrollView)
    view:ScrollView = null;

    @property(Prefab)
    friend_frame:Prefab = null;
    @property(Prefab)
    avatar_frame:Prefab = null;
    @property(Prefab)
    num_frame:Prefab = null;
    
    bottom:number = 0;

    start() {
        singleton.netSingleton.friend.get_friend_list().callBack((friend_list) => {
            let friend_count = 0;
            for (let friend of friend_list) {
                let _friend_frame = instantiate(this.friend_frame);
                
                util.main_scene.load_img(friend.avatar, (img)=>{
                    let _avatar = instantiate(this.avatar_frame);
                    let _avatar_frame = _avatar.getComponent(Sprite);
                    _avatar_frame.spriteFrame = SpriteFrame.createWithImage(img);
                    _friend_frame.addChild(_avatar_frame.node);
                    _avatar_frame.node.setPosition(-170, 5);
                });
                
                let name_node = instantiate(this.num_frame)
                var name = name_node.getChildByName("num").getComponent(Label);
                name.color = new math.Color(195, 90, 90);
                name.fontSize = 28;
                name.lineHeight = 24;
                name.string = friend.name;
                _friend_frame.addChild(name_node);
                name_node.setPosition(-108, 26);

                let _guid_node = instantiate(this.num_frame);
                var guid = _guid_node.getChildByName("num").getComponent(Label);
                guid.color = new math.Color(195, 90, 90);
                guid.fontSize = 28;
                guid.lineHeight = 24;
                guid.string = friend.guid.toString();
                _friend_frame.addChild(_guid_node);
                _guid_node.setPosition(-108, -16);

                let _score_node = instantiate(this.num_frame);
                var score = _score_node.getChildByName("num").getComponent(Label);
                score.color = new math.Color(195, 90, 90);
                score.fontSize = 28;
                score.lineHeight = 24;
                score.string = friend.score.toString();
                _friend_frame.addChild(_score_node);
                _score_node.setPosition(-12, -16);

                this.view.content.addChild(_friend_frame);
                _friend_frame.setPosition(0, -100 - friend_count * 129);

                friend_count++;
            }
            this.bottom = (friend_count - 5) * 129;
            this.view.content.getComponent(UITransform).setContentSize(new Size(560, 100 + friend_count * 129));

            this.view.node.on(ScrollView.EventType.SCROLLING, this.scrolling_callback, this);
        }, (err) => {
            console.log("get_friend_list error:", err);
        }).timeout(3000, () =>{
            console.log("get_friend_list timeout");
        });
    }

    update(deltaTime: number) {
    }

    scrolling_callback() {
        let pos = this.view.getScrollOffset().y;

        if (pos < - 200) {
            this.view.scrollToOffset(new Vec2(0, pos), 10);
        }
        else if (pos > this.bottom + 200) {
            let maxScrollOffset = this.view.getMaxScrollOffset();
            this.view.scrollToOffset(new Vec2(0, maxScrollOffset.y), 10);
        }
    }
}