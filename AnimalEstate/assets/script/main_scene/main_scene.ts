import { _decorator, Component, Node, Sprite, Canvas, Prefab, director, instantiate, Label, ImageAsset, assetManager, Asset, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

import * as cli from '../serverSDK/client_handle';
import * as singleton from '../netDriver/netSingleton';
import { playground, player_friend_info } from '../serverSDK/common';

@ccclass('main_scene')
export class main_scene extends Component {
    @property(Canvas)
    main:Canvas = null;

    @property(Sprite)
    avatar:Sprite = null;
    @property(Label)
    user_name:Label = null;
    @property(Label)
    guid:Label = null;
    @property(Label)
    score:Label = null;

    @property(Sprite)
    ranking:Sprite = null;

    @property(Sprite)
    role:Sprite = null;
    @property(Prefab)
    role_info:Prefab = null;

    @property(Sprite)
    skill:Sprite = null;
    @property(Prefab)
    skill_info:Prefab = null;
    
    @property(Sprite)
    props:Sprite = null;
    @property(Prefab)
    props_info:Prefab = null;

    @property(Sprite)
    friend:Sprite = null;
    @property(Label)
    friend_num:Label = null;

    @property(Sprite)
    start_match_btn:Sprite = null;
    @property(Sprite)
    create_room_btn:Sprite = null;

    @property(Prefab)
    match_interface_prefab:Prefab = null;
    @property(Prefab)
    rank_frame_prefab:Prefab = null;
    @property(Prefab)
    friend_frame_prefab:Prefab = null;
    @property(Prefab)
    room_frame_prefab:Prefab = null;
    @property(Prefab)
    room_invite_frame:Prefab = null;

    room_invite_instance:Node = null;

    public static load_img(url:string, cb:(img:ImageAsset)=>void) {
        assetManager.loadRemote(url, {ext:'.png'}, (err:Error, asset:Asset)=>{
            if (err) {
                console.log(err.message);
            }
            cb(asset as ImageAsset);
        });
    }

    init_btn_touch() {
        console.log("init_btn_touch begin!");

        this.start_match_btn.node.on(Node.EventType.TOUCH_START, this.start_match_callback, this);
        this.ranking.node.on(Node.EventType.TOUCH_START, this.ranking_callback, this);
        this.role.node.on(Node.EventType.TOUCH_START, this.role_callback, this);
        this.skill.node.on(Node.EventType.TOUCH_START, this.skill_callback, this);
        this.props.node.on(Node.EventType.TOUCH_START, this.props_callback, this);
        this.create_room_btn.node.on(Node.EventType.TOUCH_START, this.create_room_callback, this);
        this.friend.node.on(Node.EventType.TOUCH_START, this.friend_callback, this);

        console.log("init_btn_touch end!");
    }
    
    init_avatar() {
        console.log("init_avatar begin!");

        main_scene.load_img(singleton.netSingleton.login.player_info.avatar, (img)=>{
            if (this.avatar) {
                this.avatar.spriteFrame = SpriteFrame.createWithImage(img);
            }
        });
        this.user_name.string = singleton.netSingleton.login.player_info.name.slice(0, 3);
        this.guid.string = singleton.netSingleton.login.player_info.guid.toString();
        this.score.string = singleton.netSingleton.login.player_info.score.toString();

        console.log("init_avatar end!");
    }

    init_friend() {
        console.log("main scene invite_list begin!");

        if (singleton.netSingleton.login.player_info.invite_list && singleton.netSingleton.login.player_info.invite_list.length > 0) {
            this.friend_num.string = "+" + singleton.netSingleton.login.player_info.invite_list.length;
        }
        else{
            this.friend_num.string = ""
        }
        singleton.netSingleton.friend.cb_be_invite_role_friend = this.on_cb_be_invite_role_friend.bind(this);

        console.log("main scene invite_list end!");
    }

    check_reconnect() {
        console.log("main scene check_reconnect begin!");

        if (singleton.netSingleton.game.game_hub_name) {
            console.log("start game!");
            console.log("Playground:", singleton.netSingleton.game.Playground);
            if (singleton.netSingleton.game.Playground == playground.lakeside){
                console.log("start game reconnect!");
                singleton.netSingleton.bundle.loadScene('lakeside_game', function (err, scene) {
                    console.log("lakeside_game loadScene error:", err);
                    director.runScene(scene);
                });
            }
        }
        
        console.log("main scene check_reconnect end!");
    }

    check_init_room() {
        console.log("check_init_room begin!");

        if (singleton.netSingleton.room.room_hub_name) {
            singleton.netSingleton.room.into_room(singleton.netSingleton.room.room_hub_name);
            singleton.netSingleton.room.cb_refresh_room_info.push(()=>{
                let main_room_instance = instantiate(this.room_frame_prefab);
                this.main.node.addChild(main_room_instance);
            })
        }

        console.log("check_init_room end!");
    }

    private conn_gate_svr(url:string) {
        return new Promise<void>(resolve => {
            cli.cli_handle.connect_gate(url);
            cli.cli_handle.onGateConnect = () => {
                resolve();
            }
        });
    }

    async relogin() {
        await this.conn_gate_svr("wss://animal.ucat.games:3001");
        return new Promise((resolve, reject)=>{
            singleton.netSingleton.login.cb_player_login_sucess = () => {
                console.log("login sucess!");
                resolve("cb_player_login_sucess");
            }

            wx.login({
                success: (login_res) => {
                    singleton.netSingleton.login.login_player_no_author(login_res.code, singleton.netSingleton.login.nick_name, singleton.netSingleton.login.avatar_url);
                }
            });
        });
    }

    async start() {
        console.log("main scene start!");

        await this.relogin();

        singleton.netSingleton.game.cb_game_info = () => {
            console.log("start match!");
            this.check_reconnect();
        }

        singleton.netSingleton.room.create_room_callback = () => {
            let main_room_instance = instantiate(this.room_frame_prefab);
            this.main.node.addChild(main_room_instance);
        }
        singleton.netSingleton.room.agree_join_room_callback = () => {
            let main_room_instance = instantiate(this.room_frame_prefab);
            this.main.node.addChild(main_room_instance);
        }

        singleton.netSingleton.room.cb_invite_role_join_room = (room_id:string, invite_role_name:string) => {
            console.log("cb_invite_role_join_room!");

            this.room_invite_instance = instantiate(this.room_invite_frame);
            this.main.node.addChild(this.room_invite_instance);

            let name = this.room_invite_instance.getChildByName("name").getComponent(Label);
            name.string = invite_role_name;

            let agree_btn = this.room_invite_instance.getChildByName("agree");
            agree_btn.on(Node.EventType.TOUCH_START, () => {
                singleton.netSingleton.room.agree_join_room(room_id);
                this.room_invite_instance.destroy();
            });

            let reject_btn = this.room_invite_instance.getChildByName("reject");
            reject_btn.on(Node.EventType.TOUCH_START, () => {
                this.room_invite_instance.destroy();
            });
        }

        this.init_btn_touch();
        this.init_avatar();
        this.init_friend();
        this.check_reconnect();
        this.check_init_room();
    }

    update(deltaTime: number) {
    }

    on_cb_be_invite_role_friend (invite_player:player_friend_info){
        if (singleton.netSingleton.login.player_info.invite_list && singleton.netSingleton.login.player_info.invite_list.length > 0) {
            this.friend_num.string = "+" + singleton.netSingleton.login.player_info.invite_list.length;
        }
        else{
            this.friend_num.string = ""
        }
    }

    start_match_callback() {
        console.log("start match!");

        let match_interface = instantiate(this.match_interface_prefab);
        this.main.node.addChild(match_interface);
    }

    ranking_callback() {
        let rank_info_interface = instantiate(this.rank_frame_prefab);
        this.main.node.addChild(rank_info_interface);
    }

    role_callback() {
        let role_info_interface = instantiate(this.role_info);
        this.main.node.addChild(role_info_interface);
    }

    skill_callback() {
        let skill_info_interface = instantiate(this.skill_info);
        this.main.node.addChild(skill_info_interface);
    }

    props_callback() {
        let props_info_interface = instantiate(this.props_info);
        this.main.node.addChild(props_info_interface);
    }

    create_room_callback() {
        console.log("create room!");

        singleton.netSingleton.room.create_room(playground.random);
    }

    friend_callback() {
        console.log("friend!");

        this.friend_num.string = "";

        let friend_frame = instantiate(this.friend_frame_prefab);
        this.main.node.addChild(friend_frame);
    }
}