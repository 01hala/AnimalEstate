import { _decorator, Component, Node, Sprite, SpriteFrame, Prefab, instantiate, Label, ScrollView, math, UITransform, Size, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

import * as singleton from '../netDriver/netSingleton';
import { playground, player_friend_info } from '../serverSDK/common';

import * as util from './main_scene';

@ccclass('main_invite_friend')
export class main_invite_friend extends Component {

    @property(ScrollView)
    view:ScrollView = null;

    @property(Prefab)
    friend_frame:Prefab = null;
    @property(Prefab)
    avatar_frame:Prefab = null;
    @property(Prefab)
    num_frame:Prefab = null;
    @property(Prefab)
    agree_btn:Prefab = null;
    @property(Prefab)
    reject_btn:Prefab = null;
    
    bottom:number = 0;

    private refresh_invite_list() {
        if (!this.view) {
            return;
        }

        this.view.content.removeAllChildren();

        let friend_count = 0;
        for (let friend of singleton.netSingleton.login.player_info.invite_list) {
            let _friend_frame = instantiate(this.friend_frame);
            
            util.main_scene.load_img(friend.avatar, (img)=>{
                let _avatar_frame = new Sprite();
                _avatar_frame.spriteFrame = SpriteFrame.createWithImage(img);
                _friend_frame.addChild(_avatar_frame.node);
                _avatar_frame.node.setPosition(-205, 5);
            });
            
            let name_node = instantiate(this.num_frame);
            var name = name_node.getChildByName("num").getComponent(Label);
            name.color = new math.Color(195, 90, 90);
            name.fontSize = 28;
            name.lineHeight = 24;
            name.string = friend.name;
            _friend_frame.addChild(name_node);
            name_node.setPosition(-108, 26);

            let _coin_node = instantiate(this.num_frame);
            var coin = _coin_node.getChildByName("num").getComponent(Label);
            coin.color = new math.Color(195, 90, 90);
            coin.fontSize = 28;
            coin.lineHeight = 24;
            coin.string = friend.coin.toString();
            _friend_frame.addChild(_coin_node);
            _coin_node.setPosition(-108, -16);

            let _score_node = instantiate(this.num_frame);
            var score = _score_node.getChildByName("num").getComponent(Label);
            score.color = new math.Color(195, 90, 90);
            score.fontSize = 28;
            score.lineHeight = 24;
            score.string = friend.score.toString();
            _friend_frame.addChild(_score_node);
            _score_node.setPosition(-12, -16);

            let _agree_btn = instantiate(this.agree_btn)
            _friend_frame.addChild(_agree_btn)
            _agree_btn.setPosition(198, 4);
            _agree_btn.on(Node.EventType.TOUCH_START, ()=>{
                singleton.netSingleton.friend.agree_role_friend(friend.guid, true);
                let index = singleton.netSingleton.login.player_info.invite_list.indexOf(friend);
                singleton.netSingleton.login.player_info.invite_list.splice(index, 1);
                this.refresh_invite_list();
            }, this);

            let _reject_btn = instantiate(this.reject_btn)
            _friend_frame.addChild(_reject_btn)
            _reject_btn.setPosition(94, 4);
            _reject_btn.on(Node.EventType.TOUCH_START, ()=>{
                singleton.netSingleton.friend.agree_role_friend(friend.guid, false);
                let index = singleton.netSingleton.login.player_info.invite_list.indexOf(friend);
                singleton.netSingleton.login.player_info.invite_list.splice(index, 1);
                this.refresh_invite_list();
            }, this);

            this.view.content.addChild(_friend_frame);
            _friend_frame.setPosition(0, -100 - friend_count * 129);

            friend_count++;
        }
        this.bottom = (friend_count - 5) * 129;
        this.view.content.getComponent(UITransform).setContentSize(new Size(560, 100 + friend_count * 129));

        this.view.node.on(ScrollView.EventType.SCROLLING, this.scrolling_callback, this);
    }

    start() {
        this.refresh_invite_list();

        singleton.netSingleton.friend.cb_be_invite_role_friend = this.refresh_invite_list.bind(this);
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