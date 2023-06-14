import { _decorator, Component, Node, Sprite, UITransform, Prefab, instantiate, Label, ScrollView, Size, math, EditBox, SpriteFrame, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

import * as singleton from '../netDriver/netSingleton';
import { playground, player_friend_info } from '../serverSDK/common';

import * as util from './main_scene';

@ccclass('main_add_friend')
export class main_add_friend extends Component {

    @property(ScrollView)
    view:ScrollView = null;
    @property(EditBox)
    input:EditBox = null;

    @property(Prefab)
    friend_frame:Prefab = null;
    @property(Prefab)
    avatar_frame:Prefab = null;
    @property(Prefab)
    num_frame:Prefab = null;
    @property(Prefab)
    invite_friend_btn:Prefab = null;
    
    bottom:number = 0;
    
    start() {
        this.view.node.on(Node.EventType.TOUCH_START, this.on_search, this)
    }

    on_search() {
        console.log("on_search " + this.input.string);
        let guid = 0;
        if (this.input.string) {
            guid = parseInt(this.input.string);
        }
        singleton.netSingleton.friend.find_role(guid).callBack((find_list) => {
            this.view.content.removeAllChildren();
            let friend_count = 0;
            for (let find_info of find_list) {
                console.log("on_search " + JSON.stringify(find_info));

                util.main_scene.load_img(find_info.avatar, (img)=>{
                        
                    let _friend_frame = instantiate(this.friend_frame);
                    let _uiTransform =  _friend_frame.getComponent(UITransform);
                    _uiTransform.setContentSize(480, 125);
                    console.log("on_search _friend_frame");

                    console.log(img)
                    let _avatar = instantiate(this.avatar_frame);
                    let _avatar_frame = _avatar.getComponent(Sprite);
                    console.log(_avatar_frame)
                    let frame = SpriteFrame.createWithImage(img);
                    console.log(frame);
                    _avatar_frame.spriteFrame = frame;
                    console.log(_avatar_frame.spriteFrame)
                    _friend_frame.addChild(_avatar_frame.node);
                    _avatar_frame.node.setPosition(-170, 5);
                    
                    let name_node = instantiate(this.num_frame);
                    var name = name_node.getChildByName("num").getComponent(Label);
                    name.color = new math.Color(195, 90, 90);
                    name.fontSize = 28;
                    name.lineHeight = 24;
                    name.string = find_info.name;
                    _friend_frame.addChild(name_node);
                    name_node.setPosition(-74, 24);
                    console.log("on_search name_node");

                    let _guid_node = instantiate(this.num_frame);
                    var guid = _guid_node.getChildByName("num").getComponent(Label);
                    guid.color = new math.Color(195, 90, 90);
                    guid.fontSize = 28;
                    guid.lineHeight = 24;
                    guid.string = find_info.guid.toString();
                    _friend_frame.addChild(_guid_node);
                    _guid_node.setPosition(-74, -16);
                    console.log("on_search _coin_node");

                    let _score_node = instantiate(this.num_frame);
                    var score = _score_node.getChildByName("num").getComponent(Label);
                    score.color = new math.Color(195, 90, 90);
                    score.fontSize = 28;
                    score.lineHeight = 24;
                    score.string = find_info.score.toString();
                    _friend_frame.addChild(_score_node);
                    _score_node.setPosition(10, -16);
                    console.log("on_search _score_node");

                    if (find_info.guid != singleton.netSingleton.login.player_info.guid) {
                        let _invite_friend_btn = instantiate(this.invite_friend_btn)
                        _friend_frame.addChild(_invite_friend_btn)
                        _invite_friend_btn.setPosition(145, 0);
                        _invite_friend_btn.on(Node.EventType.TOUCH_START, ()=>{
                            let self = new player_friend_info();
                            self.guid = singleton.netSingleton.login.player_info.guid;
                            self.sdk_uuid = singleton.netSingleton.login.player_info.sdk_uuid;
                            self.name = singleton.netSingleton.login.player_info.name;
                            self.avatar = singleton.netSingleton.login.player_info.avatar;
                            self.score = singleton.netSingleton.login.player_info.score;
                            singleton.netSingleton.friend.invite_role_friend(self, find_info);
                        }, this);
                    }
                    console.log("on_search _invite_friend_btn");

                    this.view.content.addChild(_friend_frame);
                    _friend_frame.setPosition(0, -80 - friend_count * 129);

                    friend_count++;
                });
                
                console.log("on_search view");
            }

            this.bottom = (friend_count - 5) * 129;
            this.view.content.getComponent(UITransform).setContentSize(new Size(560, 100 + find_list.length * 129));

            this.view.node.on(ScrollView.EventType.SCROLLING, this.scrolling_callback, this);

        }, (err)=>{
            console.log("find role:" + err);
        }).timeout(3000, ()=>{
            console.log("find role timeout!");
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