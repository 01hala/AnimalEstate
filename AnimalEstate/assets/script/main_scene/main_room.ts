import { _decorator, Component, Node, Sprite, Label, Event, Prefab, instantiate, director } from 'cc';
const { ccclass, property } = _decorator;

import * as singleton from '../netDriver/netSingleton';
import { playground, player_friend_info } from '../serverSDK/common';

@ccclass('main_room')
export class main_room extends Component {
    
    @property(Prefab)
    friend_invite_background:Prefab = null;

    @property(Sprite)
    room_frame:Sprite = null;
    @property(Sprite)
    avatar_frame:Sprite = null;
    @property(Sprite)
    map_frame:Sprite = null;

    @property(Sprite)
    avatar0:Sprite = null;
    @property(Label)
    name0:Label = null;
    @property(Sprite)
    avatar1:Sprite = null;
    @property(Label)
    name1:Label = null;
    @property(Sprite)
    avatar2:Sprite = null;
    @property(Label)
    name2:Label = null;

    @property(Sprite)
    left:Sprite = null;
    @property(Sprite)
    right:Sprite = null;
    @property(Sprite)
    random_sprite:Sprite = null;
    @property(Sprite)
    lakside_sprite:Sprite = null;

    @property(Sprite)
    invite:Sprite = null;
    @property(Sprite)
    start_match:Sprite = null;
    @property(Label)
    countdown:Label = null;

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

    set_room_info() {
        if (!singleton.netSingleton.room.RoomInfo.room_player_list) {
            return;
        }
        for (let i = 0; i < singleton.netSingleton.room.RoomInfo.room_player_list.length; i++) {
            let player_info = singleton.netSingleton.room.RoomInfo.room_player_list[i];
            console.log(player_info);
            if (i == 0) {
                this.name0.string = player_info.name;
            }
            else if (i == 1) {
                this.name1.string = player_info.name;
            }
            else if (i == 2) {
                this.name2.string = player_info.name;
            }
        }
    }

    refresh_room_info() {
        console.log("refresh_room_info");
        this.set_thumbnail();
        this.set_room_info();
    }

    init_btn_touch() {
        console.log("main_room init_btn_touch begin!");

        this.left.node.on(Node.EventType.TOUCH_START, this.left_callback, this);
        this.right.node.on(Node.EventType.TOUCH_START, this.right_callback, this);
        this.start_match.node.on(Node.EventType.TOUCH_START, this.start_match_game_callback, this);
        this.invite.node.on(Node.EventType.TOUCH_START, this.invite_callback, this);
        this.room_frame.node.on(Node.EventType.TOUCH_START, this.room_frame_callback, this);
        this.avatar_frame.node.on(Node.EventType.TOUCH_START, this.avatar_frame_callback, this);
        this.map_frame.node.on(Node.EventType.TOUCH_START, this.map_frame_callback, this);
        
        console.log("main_room init_btn_touch end!");
    }

    init_control_active() {
        console.log("main_room init_control_active begin!");

        this.countdown.node.active = false;
        if (singleton.netSingleton.room.RoomInfo.room_owner_guid != singleton.netSingleton.login.player_info.guid) {
            this.start_match.node.active = false;
            this.left.node.active = false;
            this.right.node.active = false;
        }
        
        console.log("main_room init_control_active end!");
    }

    start() {
        this.enum_playground = singleton.netSingleton.room.RoomInfo._playground;

        singleton.netSingleton.game.cb_game_wait_start_info = () => {
            console.log("start match!");

            this.unschedule(this.countdown_callback);
            this.node.active = false;
            
            singleton.netSingleton.bundle.loadScene('lakeside_game', function (err, scene) {
                director.runScene(scene);
            });
        };
        singleton.netSingleton.room.cb_refresh_room_info.push(this.refresh_room_info.bind(this));
        singleton.netSingleton.room.cb_team_into_match = this.cb_team_into_match.bind(this);

        this.refresh_room_info();
        this.init_btn_touch();
        this.init_control_active();
    }

    update(deltaTime: number) {
    }

    avatar_frame_callback(event:Event) {
        event.propagationStopped = true
    }

    map_frame_callback(event:Event) {
        event.propagationStopped = true
    }

    room_frame_callback() {
        if (!this.is_start_match) {
            this.node.destroy();
        }
    }

    invite_callback(event:Event) {
        event.propagationStopped = true

        let friend_invite_instance = instantiate(this.friend_invite_background);
        this.room_frame.node.addChild(friend_invite_instance);
    }

    cb_team_into_match() {
        this.countdown.node.active = true;
        this.schedule(this.countdown_callback, 1);
    }

    countdown_callback() {
        this.countdown.string = (--this.countdown_count).toString();
    }

    private is_start_match:boolean = false;
    start_match_game_callback(event:Event) {
        event.propagationStopped = true
        singleton.netSingleton.room.start_match();
        this.is_start_match = true;
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