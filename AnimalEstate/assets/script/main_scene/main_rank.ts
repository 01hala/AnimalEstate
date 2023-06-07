import { _decorator, Component, Node, Sprite, UITransform, Prefab, instantiate, Label, ScrollView, Size, math, EditBox, SpriteFrame, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

import * as msgpack from '../serverSDK/@msgpack/msgpack'
import * as singleton from '../netDriver/netSingleton';
import { player_rank_info } from '../serverSDK/common';

import * as util from './main_scene';

@ccclass('main_rank')
export class main_rank extends Component {

    @property(ScrollView)
    view:ScrollView = null;
    @property(Sprite)
    cancel:Sprite = null;

    @property(Prefab)
    rank_player_frame:Prefab = null;
    
    bottom:number = 0;
    
    start() {
        this.on_get_rank();

        this.cancel.node.on(Node.EventType.TOUCH_START, ()=>{
            this.node.destroy();
        }, this); 
    }

    on_get_rank() {
        singleton.netSingleton.rank.get_rank_range().callBack((rank_list) => {
            this.view.content.removeAllChildren();
            let friend_count = 0;
            for (let rank_info of rank_list) {
                console.log("on_get_rank " + JSON.stringify(rank_info));

                let player_info = msgpack.decode(rank_info.item) as player_rank_info;
                let _rank_player_frame = instantiate(this.rank_player_frame);

                let rank_label = _rank_player_frame.getChildByName("rank").getComponent(Label);
                rank_label.string = rank_info.rank.toString();

                util.main_scene.load_img(player_info.avatar, (img)=>{
                    let _avatar_frame = _rank_player_frame.getChildByName("avatar").getComponent(Sprite);
                    _avatar_frame.spriteFrame = SpriteFrame.createWithImage(img);
                });

                let name_label = _rank_player_frame.getChildByName("name").getComponent(Label);
                name_label.string = player_info.name;

                let guid_label = _rank_player_frame.getChildByName("guid").getComponent(Label);
                guid_label.string = player_info.guid.toString();

                let score_label = _rank_player_frame.getChildByName("score").getComponent(Label);
                score_label.string = player_info.score.toString();

                this.view.content.addChild(_rank_player_frame);
                _rank_player_frame.setPosition(0, -60 - friend_count * 120);

                friend_count++;
            }

            this.bottom = (friend_count - 7) * 120;
            this.view.content.getComponent(UITransform).setContentSize(new Size(580, 100 + friend_count * 120));

            this.view.node.on(ScrollView.EventType.SCROLLING, this.scrolling_callback, this);

        }, ()=>{
            console.log("get rank error!");
        }).timeout(3000, ()=>{
            console.log("get rank timeout!");
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