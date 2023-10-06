import { _decorator, Component, Node, Label, ProgressBar, Button, EditBox, director, assetManager, AssetManager, SceneAsset } from 'cc';
import 'minigame-api-typings';
const { ccclass, property } = _decorator;

import * as singleton from '../netDriver/netSingleton';

@ccclass('login')
export class login extends Component {
    @property(Node)
    netBode:Node = null;
    @property(Button)
    loginBtn:Button = null;
    @property(EditBox)
    account:EditBox = null;

    @property(Label)
    loadState:Label = null;

    private progress = 0;
    @property(ProgressBar)
    progressBar:ProgressBar = null;

    async load_scene(bundle:AssetManager.Bundle, sceneName:string) {
        return new Promise<SceneAsset>((resolve, reject)=>{
            bundle.loadScene(sceneName, function (err, scene) {
                resolve(scene);
            });
        });
    }
    
    time_set_progress() {
        this.progress += 0.1;
        this.set_progress(this.progress);

        setTimeout(() => {
            this.time_set_progress();
        }, 1000);
    }

    set_progress(progress:number) {
        this.progressBar.progress = 1 - this.progress;
    }

    start() {
        this.account.node.active = false;
        this.loginBtn.node.active = false;

        this.progress = 0;
        this.progressBar.node.active = true;

        singleton.netSingleton.login.cb_player_login_non_account = () => {
            console.log("login non_account create role");
            singleton.netSingleton.login.create_role(singleton.netSingleton.login.nick_name, singleton.netSingleton.login.nick_name, singleton.netSingleton.login.avatar_url);
            this.loadState.string = "创建角色......"
        };

        singleton.netSingleton.login.cb_player_login_sucess = () => {
            this.loadState.string = "登录成功......"
            console.log("login sucess!");
            director.runScene(singleton.netSingleton.mainScene);
        }

        singleton.netSingleton.game.cb_game_info = () => {
            console.log("start match!");
            director.runScene(singleton.netSingleton.gameScene);
        }

        this.netBode.on("connect",(e)=>{
            this.account.node.active = true;
        });

        wx.login({
            complete: (res) => {
                console.log("login complete:" + JSON.stringify(res));
            },
            fail: (res) => {
                console.log("login fail:" + JSON.stringify(res));
            },
            success: (login_res) => {
                console.log("login success:" + JSON.stringify(login_res));
                wx.getSetting({
                    complete: (res) => {
                        console.log("authSetting complete:", JSON.stringify(res));
                    },
                    fail: (res) => {
                        console.log("authSetting fail:", JSON.stringify(res));
                    },
                    success: (res) => {
                        console.log("authSetting:", JSON.stringify(res));
                        if (res.authSetting['scope.userInfo']) {
                            this.get_user_info_login(login_res.code)
                        }
                        else {
                            console.log("authSetting createUserInfoButton:", JSON.stringify(res));
                            let wxSize = wx.getSystemInfoSync();
                            let btn = wx.createUserInfoButton({
                                type: 'text',
                                text: '微信登录',
                                style: {
                                    left: wxSize.screenWidth / 2 - 100,
                                    top: wxSize.screenHeight / 2 - 40,
                                    width: 200,
                                    height: 40,
                                    lineHeight: 40,
                                    backgroundColor: '#ffffff',
                                    borderColor: '#ffffff',
                                    borderWidth: 1,
                                    color: '#000000',
                                    textAlign: 'center',
                                    fontSize: 16,
                                    borderRadius: 4
                                }
                            });
                            btn.onTap((res) => {
                                console.log("createUserInfoButton:" + JSON.stringify(res));
                                this.get_user_info_login(login_res.code)
                                btn.destroy();
                            });
                        }
                    }
                });
            }
        });
    }

    get_user_info_login(code:string) {
        this.progress += 0.1;
        this.set_progress(this.progress);
        wx.getUserInfo({ 
            withCredentials:false,
            success: (result) => {
                assetManager.loadBundle('main_scene', async (err, bundle) => {
                    singleton.netSingleton.bundle = bundle;

                    this.loadState.string = "加载主界面中......"
                    singleton.netSingleton.mainScene = await this.load_scene(bundle, 'main');
                    this.progress += 0.1;
                    this.set_progress(this.progress);
                    this.loadState.string = "加载主界面成功......"
    
                    this.loadState.string = "加载游戏场景......"
                    this.time_set_progress();
                    singleton.netSingleton.gameScene = await this.load_scene(bundle, 'lakeside_game');
                    this.progress += 0.1;
                    this.set_progress(this.progress);
                    this.loadState.string = "加载游戏场景成功......"
                    
                    singleton.netSingleton.login.nick_name = result.userInfo.nickName.slice(0, 3);
                    singleton.netSingleton.login.avatar_url = result.userInfo.avatarUrl;
                    singleton.netSingleton.login.login_player_no_author(code, singleton.netSingleton.login.nick_name, singleton.netSingleton.login.avatar_url);
                    this.loadState.string = "登录微信中......"
                });
            },
            fail: (res) => {
                console.log("fail:" + JSON.stringify(res));
            },
            complete: (res) => {
                console.log("complete:" + JSON.stringify(res));
            }
        });
    }

    update(deltaTime: number) {
    }
}

