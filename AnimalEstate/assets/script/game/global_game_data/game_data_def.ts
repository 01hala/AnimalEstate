import { _decorator, Sprite, TiledMap, Vec2, Prefab, Animation, AnimationClip, instantiate, Label, Node, Button } from 'cc';

import { animal, animal_game_info } from '../../serverSDK/common';

import * as singleton from '../../netDriver/netSingleton';

export class move_info {
    public animal : any;
    public current : number;
    public to : number;
    public pos : Vec2;
    public speed : number;
    public is_step_lotus : boolean;
    public step_lotus_instance : Node;
}

export enum em_animation_state {
    em_animation_idle = 0,
    em_animation_run = 1, 
    em_animation_negative = 2, 
    em_animation_gain = 3,
    em_animation_tianlei = 4,
    em_animation_zhadan = 5,
}

export class game_data {
    public static map:TiledMap = null;
    public static layout_width:number = 0;
    public static layout_height:number = 0;
    public static layout_half_width:number = 0;
    public static layout_half_height:number = 0;
    public static layout_lenght:number = 0;
    public static layout_end:number = 0;

    public static role1:Sprite = null;
    public static role2:Sprite = null;
    public static role3:Sprite = null;

    public static bear:Prefab = null;
    public static chicken:Prefab = null;
    public static duck:Prefab = null;
    public static lion:Prefab = null;
    public static monkey:Prefab = null;
    public static mouse:Prefab = null;
    public static rabbit:Prefab = null;
    public static tiger:Prefab = null;

    public static prompt_box:Label = null;

    public static player1:Button = null;
    public static player2:Button = null;
    public static player3:Button = null;

    public static select_animal_player1:Label = null;
    public static select_animal_0_0:Sprite = null;
    public static select_animal_0_0_pos:Label = null;
    public static select_animal_0_1:Sprite = null;
    public static select_animal_0_1_pos:Label = null;
    public static select_animal_0_2:Sprite = null;
    public static select_animal_0_2_pos:Label = null;
    public static select_animal_player2:Label = null;
    public static select_animal_1_0:Sprite = null;
    public static select_animal_1_0_pos:Label = null;
    public static select_animal_1_1:Sprite = null;
    public static select_animal_1_1_pos:Label = null;
    public static select_animal_1_2:Sprite = null;
    public static select_animal_1_2_pos:Label = null;
    public static select_animal_player3:Label = null;
    public static select_animal_2_0:Sprite = null;
    public static select_animal_2_0_pos:Label = null;
    public static select_animal_2_1:Sprite = null;
    public static select_animal_2_1_pos:Label = null;
    public static select_animal_2_2:Sprite = null;
    public static select_animal_2_2_pos:Label = null;

    public static select_animal_0:Sprite = null;
    public static select_animal_1:Sprite = null;
    public static select_animal_2:Sprite = null;

    public static player1_guid:number = 0;
    public static player2_guid:number = 0;
    public static player3_guid:number = 0;

    public static mapPlayground:Map<number, Vec2> = new Map<number, Vec2>();
    public static PlayerAnimalMap : Map<number, Map<number, Node> > = new Map<number, Map<number, Node> >();
    public static PlayerAnimalAnimationMap : Map<number, Map<number, em_animation_state> > = new Map<number, Map<number, em_animation_state> >();
    public static current_move_obj:move_info = null;
    public static effect_index:number = 0;

    public static waitDice:boolean = false;

    public static init() {
        game_data.player1_guid = 0;
        game_data.player2_guid = 0;
        game_data.player3_guid = 0;

        game_data.mapPlayground = new Map<number, Vec2>();
        game_data.PlayerAnimalMap = new Map<number, Map<number, Node> >();
        game_data.PlayerAnimalAnimationMap = new Map<number, Map<number, em_animation_state> >();
        game_data.current_move_obj = null;
        game_data.effect_index = 0;

        game_data.waitDice = false;
        game_data.isInit = false;
        game_data.isStart = false;
    }
    
    public static init_select_player_ui() {
        let index = 0;
        for (let player of singleton.netSingleton.game.PlayerGameInfo) {
            if (player.guid != singleton.netSingleton.login.player_info.guid) {
                switch (index) {
                    case 0:
                        {
                            game_data.player1.node.getChildByName("Label").getComponent(Label).string = player.name;
                            game_data.player1_guid = player.guid;
                        }
                        break;

                    case 1:
                        {
                            game_data.player2.node.getChildByName("Label").getComponent(Label).string = player.name;
                            game_data.player2_guid = player.guid;
                        }
                        break;

                    case 2:
                        {
                            game_data.player3.node.getChildByName("Label").getComponent(Label).string = player.name;
                            game_data.player3_guid = player.guid;
                        }
                        break;
                }
                index++;
            }
        }
    }

    private static set_select_animal_info(select_animal_ui:Sprite, select_animal_pos_ui:Label, animal_info:animal_game_info) {
        select_animal_pos_ui.string = animal_info.current_pos.toString();

        select_animal_ui.node.removeAllChildren();
        let animal_prefab = game_data.get_animal_prefab(animal_info.animal_id);
        let animal_instance = instantiate(animal_prefab);
        let label_node = animal_instance.getChildByName("name")
        let label = label_node.getComponent(Label);
        label.string = "";
        select_animal_ui.node.addChild(animal_instance);
    }

    public static init_select_animal_ui() {
        let index = 0;
        for (let player of singleton.netSingleton.game.PlayerGameInfo) {
            if (player.guid != singleton.netSingleton.login.player_info.guid) {
                switch (index) {
                    case 0:
                        {
                            game_data.select_animal_player1.string = player.name;
                            game_data.player1_guid = player.guid;
                            for (let animal_index = 0; animal_index < player.animal_info.length; animal_index++) {
                                let animal_info = player.animal_info[animal_index];
                                if (animal_index == 0) {
                                    game_data.set_select_animal_info(game_data.select_animal_0_0, game_data.select_animal_0_0_pos, animal_info);
                                }
                                else if (animal_index == 1) {
                                    game_data.set_select_animal_info(game_data.select_animal_0_1, game_data.select_animal_0_1_pos, animal_info);
                                }
                                else if (animal_index == 2) {
                                    game_data.set_select_animal_info(game_data.select_animal_0_2, game_data.select_animal_0_2_pos, animal_info);
                                }
                            }
                        }
                        break;

                    case 1:
                        {
                            game_data.select_animal_player2.string = player.name;
                            game_data.player2_guid = player.guid;
                            for (let animal_index = 0; animal_index < player.animal_info.length; animal_index++) {
                                let animal_info = player.animal_info[animal_index];
                                if (animal_index == 0) {
                                    game_data.set_select_animal_info(game_data.select_animal_1_0, game_data.select_animal_1_0_pos, animal_info);
                                }
                                else if (animal_index == 1) {
                                    game_data.set_select_animal_info(game_data.select_animal_1_1, game_data.select_animal_1_1_pos, animal_info);
                                }
                                else if (animal_index == 2) {
                                    game_data.set_select_animal_info(game_data.select_animal_1_2, game_data.select_animal_1_2_pos, animal_info);
                                }
                            }
                        }
                        break;

                    case 2:
                        {
                            game_data.select_animal_player3.string = player.name;
                            game_data.player3_guid = player.guid;
                            for (let animal_index = 0; animal_index < player.animal_info.length; animal_index++) {
                                let animal_info = player.animal_info[animal_index];
                                if (animal_index == 0) {
                                    game_data.set_select_animal_info(game_data.select_animal_2_0, game_data.select_animal_2_0_pos, animal_info);
                                }
                                else if (animal_index == 1) {
                                    game_data.set_select_animal_info(game_data.select_animal_2_1, game_data.select_animal_2_1_pos, animal_info);
                                }
                                else if (animal_index == 2) {
                                    game_data.set_select_animal_info(game_data.select_animal_2_2, game_data.select_animal_2_2_pos, animal_info);
                                }
                            }
                        }
                        break;
                }
                index++;
            }
        }
    }

    private static set_select_self_animal_info(select_animal_ui:Sprite, animal_info:animal_game_info) {
        select_animal_ui.node.removeAllChildren();
        let animal_prefab = game_data.get_animal_prefab(animal_info.animal_id);
        let animal_instance = instantiate(animal_prefab);
        let label_node = animal_instance.getChildByName("name")
        let label = label_node.getComponent(Label);
        label.string = "";
        select_animal_ui.node.addChild(animal_instance);
    }

    public static init_select_self_animal_ui() {
        let player = singleton.netSingleton.game.get_player_game_info(singleton.netSingleton.login.player_info.guid);
        for (let animal_index = 0; animal_index < player.animal_info.length; animal_index++) {
            let animal_info = player.animal_info[animal_index];
            if (animal_index == 0) {
                game_data.set_select_self_animal_info(this.select_animal_0, animal_info);
            }
            else if (animal_index == 1) {
                game_data.set_select_self_animal_info(this.select_animal_1, animal_info);
            }
            else if (animal_index == 2) {
                game_data.set_select_self_animal_info(this.select_animal_2, animal_info);
            }
        }
    }

    public static remove_all_animal() {
        game_data.PlayerAnimalMap.forEach((animal_map, _) => {
            animal_map.forEach((animal, _) => {
                game_data.map.node.removeChild(animal);
            });
        });
    }

    public static set_reverse(animal) {
        animal.is3DNode = true;
        animal.eulerAngles = new Vec2(0, 180);

        let label_node = animal.getChildByName("name")
        label_node.eulerAngles = new Vec2(0, 180);
    }

    public static set_forward(animal) {
        animal.is3DNode = true;
        animal.eulerAngles = new Vec2(0, 0);

        let label_node = animal.getChildByName("name")
        label_node.eulerAngles = new Vec2(0, 0);
    }

    public static isInit = false;
    public static isStart = false;
    public static set_animal_born_pos() : boolean {
        if (!game_data.isInit) {
            return false;
        }
        if (game_data.isStart) {
            return true;
        }
        for(let index in singleton.netSingleton.game.PlayerGameInfo) {
            let info = singleton.netSingleton.game.PlayerGameInfo[index];

            let animal_map = new Map<number, any>();
            game_data.PlayerAnimalMap.set(info.guid, animal_map);

            let animation_map = new Map<number, em_animation_state>();
            game_data.PlayerAnimalAnimationMap.set(info.guid, animation_map);

            for(let animal_index in info.animal_info) {
                let animal_info = info.animal_info[animal_index];

                let layer_name = "出生点_" + index + "_" + animal_index;
                let layer = game_data.map.getLayer(layer_name);
                console.log(layer_name);
                console.log(layer);
                
                let need_reverse = false;
                let target_x = layer.rightTop.col * 64 + 32 - game_data.layout_half_width;
                let target_y=  layer.rightTop.row * 64 + 32 - game_data.layout_half_height;
                if (animal_info.current_pos > -1 && animal_info.current_pos < 64) {
                    let pos = game_data.mapPlayground.get(animal_info.current_pos);
                    target_x = pos.x * 64 + 32 - game_data.layout_half_width;
                    target_y=  pos.y * 64 + 32 - game_data.layout_half_height;

                    let next_layer_pos = animal_info.current_pos + 1;
                    if (next_layer_pos < 64) {
                        let next_pos = game_data.mapPlayground.get(next_layer_pos);
                        if (next_pos.x < pos.x) {
                            need_reverse = true;
                        }
                    }
                }

                let animal_prefab = game_data.get_animal_prefab(animal_info.animal_id);
                let animal_instance = instantiate(animal_prefab);
                game_data.map.node.addChild(animal_instance);
                animal_instance.setPosition(target_x, target_y);
                game_data.set_idle(animal_instance);

                let label_node = animal_instance.getChildByName("name")
                let label = label_node.getComponent(Label);
                label.string = `${info.name}`;

                if (need_reverse) {
                    game_data.set_reverse(animal_instance);
                }

                animal_map.set(Number(animal_index), animal_instance);
                animation_map.set(Number(animal_index), em_animation_state.em_animation_idle);
                
                if (game_data.effect_index == 0) {
                    game_data.effect_index = animal_instance.getSiblingIndex();
                }
            }
        }
        game_data.isStart = true;
        return true;
    }

    public static get_animal_prefab(animal_id) {
        let animal_prefab = null;
        switch(animal_id) {
            case animal.bear:
                {
                    animal_prefab = game_data.bear;
                }
                break;

            case animal.chicken:
                {
                    animal_prefab = game_data.chicken;
                }
                break;

            case animal.duck:
                {
                    animal_prefab = game_data.duck;
                }
                break;
            
            case animal.lion:
                {
                    animal_prefab = game_data.lion;
                }
                break;

            case animal.monkey:
                {
                    animal_prefab = game_data.monkey;
                }
                break;

            case animal.mouse:
                {
                    animal_prefab = game_data.mouse;
                }
                break;

            case animal.rabbit:
                {
                    animal_prefab = game_data.rabbit;
                }
                break;

            case animal.tiger:
                {
                    animal_prefab = game_data.tiger;
                }
                break;
        }
        return animal_prefab;
    }

    public static set_camera_pos(x:number, y:number) {
        let target_x = x;
        if (target_x < 320) {
            target_x = 320;
        }
        else if ((game_data.layout_width - target_x) < 320) {
            target_x = game_data.layout_width - 320;
        }
        let view_center_x = game_data.layout_half_width - target_x;

        let target_y = y;
        if (target_y < 500) {
            target_y = 500;
        }
        else if ((game_data.layout_height - target_y) < 480) {
            target_y = game_data.layout_height - 480;
        }
        let view_center_y = game_data.layout_half_height + 160 - target_y;

        game_data.map.node.setPosition(view_center_x, view_center_y);
    }

    public static set_camera_pos_grid(grid_index:number) {
        let tile_pos = game_data.mapPlayground.get(grid_index);
        let target_x = tile_pos.x * 64 + 32;
        let target_y = tile_pos.y * 64 + 32;
        
        game_data.set_camera_pos(target_x, target_y);
    }

    public static set_camera_pos_animal(animal:animal_game_info) {
        let pos = animal.current_pos;
        if (pos < 0) {
            pos = 0;
        }
        if (pos >= game_data.layout_lenght) {
            pos = game_data.layout_end;
        }
        console.log("set_camera_pos_animal pos:", pos);
        game_data.set_camera_pos_grid(pos);
        game_data.current_move_obj = null;
    }

    public static set_prompt(prompt:string){
        game_data.prompt_box.string = prompt;
        game_data.prompt_box.node.active = true;
        setTimeout(() => {
            game_data.prompt_box.string = "";
            game_data.prompt_box.node.active = false;
        }, 3200);
    }

    public static set_gain(guid:number) {
        if (!game_data.isStart) {
            return;
        }

        let player = singleton.netSingleton.game.get_player_game_info(guid);
        let animal_map = game_data.PlayerAnimalMap.get(guid);
        let _animal = animal_map.get(player.current_animal_index);
        let animationComponent = _animal.getComponent(Animation);
        const [ idleClip, runClip, negativeClip, gainClip, tianleiClip, zhadanClip ] = animationComponent.clips;
        animationComponent.play(gainClip.name);

        let animal_index = player.current_animal_index;
        let animation_map = game_data.PlayerAnimalAnimationMap.get(guid);
        animation_map.set(animal_index, em_animation_state.em_animation_gain);

        setTimeout(() => {
            let animation_map = game_data.PlayerAnimalAnimationMap.get(guid);
            if (animation_map.get(animal_index) == em_animation_state.em_animation_gain) {
                game_data.set_idle(_animal);
            }
        }, 1200);
    }

    public static async set_gain_await(guid:number, animal_index:number) {
        if (!game_data.isStart) {
            return;
        }

        let animal_map = game_data.PlayerAnimalMap.get(guid);
        let _animal = animal_map.get(animal_index);
        let animationComponent = _animal.getComponent(Animation);
        const [ idleClip, runClip, negativeClip, gainClip, tianleiClip, zhadanClip, thiefClip, altecLightwaveClip, resetPosClip ] = animationComponent.clips;
        animationComponent.play(gainClip.name);

        let animation_map = game_data.PlayerAnimalAnimationMap.get(guid);
        animation_map.set(animal_index, em_animation_state.em_animation_gain);

        return new Promise((resolve, reject)=>{
            setTimeout(() => {
                let animation_map = game_data.PlayerAnimalAnimationMap.get(guid);
                if (animation_map.get(animal_index) == em_animation_state.em_animation_gain) {
                    game_data.set_idle(_animal);
                }
                resolve("end animation!");
            }, 1200);
        });
    }

    public static set_negative(target_guid:number, target_animal_index:number) {
        if (!game_data.isStart) {
            return;
        }

        let animal_map = game_data.PlayerAnimalMap.get(target_guid);
        let _animal = animal_map.get(target_animal_index);
        let animationComponent = _animal.getComponent(Animation);
        const [ idleClip, runClip, negativeClip, gainClip, tianleiClip, zhadanClip, thiefClip, altecLightwaveClip, resetPosClip ] = animationComponent.clips;;
        animationComponent.play(negativeClip.name);

        let animation_map = game_data.PlayerAnimalAnimationMap.get(target_guid);
        animation_map.set(target_animal_index, em_animation_state.em_animation_negative);

        setTimeout(() => {
            let animation_map = game_data.PlayerAnimalAnimationMap.get(target_guid);
            if (animation_map.get(target_animal_index) == em_animation_state.em_animation_negative) {
                game_data.set_idle(_animal);
            }
        }, 800);
    }

    public static async set_negative_await(target_guid:number, target_animal_index:number) {
        if (!game_data.isStart) {
            return;
        }

        let animal_map = game_data.PlayerAnimalMap.get(target_guid);
        let _animal = animal_map.get(target_animal_index);
        let animationComponent = _animal.getComponent(Animation);
        const [ idleClip, runClip, negativeClip, gainClip, tianleiClip, zhadanClip, thiefClip, altecLightwaveClip, resetPosClip ] = animationComponent.clips;;
        animationComponent.play(negativeClip.name);

        let animation_map = game_data.PlayerAnimalAnimationMap.get(target_guid);
        animation_map.set(target_animal_index, em_animation_state.em_animation_negative);

        return new Promise((resolve, reject)=>{
            setTimeout(() => {
                let animation_map = game_data.PlayerAnimalAnimationMap.get(target_guid);
                if (animation_map.get(target_animal_index) == em_animation_state.em_animation_negative) {
                    game_data.set_idle(_animal);
                }
                resolve("end animation!");
            }, 800);
        });
    }

    public static async set_tianlei_await(target_guid:number, target_animal_index:number) {
        if (!game_data.isStart) {
            return;
        }

        let animal_map = game_data.PlayerAnimalMap.get(target_guid);
        let _animal = animal_map.get(target_animal_index);
        let animationComponent = _animal.getComponent(Animation);
        const [ idleClip, runClip, negativeClip, gainClip, tianleiClip, zhadanClip, thiefClip, altecLightwaveClip, resetPosClip ] = animationComponent.clips;;
        const tianleiState = animationComponent.getState(tianleiClip.name);
        animationComponent.play(tianleiClip.name);

        let animation_map = game_data.PlayerAnimalAnimationMap.get(target_guid);
        animation_map.set(target_animal_index, em_animation_state.em_animation_tianlei);

        return new Promise((resolve, reject)=>{
            setTimeout(() => {
                let animation_map = game_data.PlayerAnimalAnimationMap.get(target_guid);
                if (animation_map.get(target_animal_index) == em_animation_state.em_animation_tianlei) {
                    game_data.set_idle(_animal);
                }
                resolve("end animation!");
            }, 800);
        });
    }

    public static set_zhadan(target_guid:number, target_animal_index:number) {
        if (!game_data.isStart) {
            return;
        }

        let animal_map = game_data.PlayerAnimalMap.get(target_guid);
        let _animal = animal_map.get(target_animal_index);
        let animationComponent = _animal.getComponent(Animation);
        const [ idleClip, runClip, negativeClip, gainClip, tianleiClip, zhadanClip, thiefClip, altecLightwaveClip, resetPosClip ] = animationComponent.clips;;
        const zhadanState = animationComponent.getState(zhadanClip.name);
        animationComponent.play(zhadanClip.name);

        let animation_map = game_data.PlayerAnimalAnimationMap.get(target_guid);
        animation_map.set(target_animal_index, em_animation_state.em_animation_zhadan);

        setTimeout(() => {
            let animation_map = game_data.PlayerAnimalAnimationMap.get(target_guid);
            if (animation_map.get(target_animal_index) == em_animation_state.em_animation_zhadan) {
                game_data.set_idle(_animal);
            }
        }, 800);
    }

    public static set_crown(target_guid:number, target_animal_index:number, prefab:Prefab) {
        if (!game_data.isStart) {
            return;
        }

        let animal_map = game_data.PlayerAnimalMap.get(target_guid);
        let _animal = animal_map.get(target_animal_index);
        
        let prefab_instance = instantiate(prefab);
        _animal.addChild(prefab_instance);
        prefab_instance.setPosition(0, 64);

        let prefabAnimationComponent = prefab_instance.getComponent(Animation);
        const [ animationClip ] = prefabAnimationComponent.clips;
        if (animationClip) {
            const animatioState = prefabAnimationComponent.getState(animationClip.name);
            prefabAnimationComponent.play(animationClip.name);
            animatioState.wrapMode = AnimationClip.WrapMode.Loop;
        }

        setTimeout(() => {
            prefab_instance.active = false;
            _animal.removeChild(prefab_instance);
        }, 1300);
    }

    public static flashing(animal:Node, active:boolean) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                animal.active = active;
                resolve(`${active}`);
            }, 300);
        });
    }

    public static set_animal_pos(animal:Node, pos:number) {
        console.log("animal pos:" + pos);
        let tile_pos = game_data.mapPlayground.get(pos);
        let target_x = tile_pos.x * 64 + 32 - game_data.layout_half_width;
        let target_y=  tile_pos.y * 64 + 32 - game_data.layout_half_height;

        animal.setPosition(target_x, target_y);
    }

    public static show_top(animal:Node, pos:number) {
        game_data.map.node.removeChild(animal);
        game_data.map.node.addChild(animal);
        game_data.set_animal_pos(animal, pos);
    }

    public static async show_top_flashing_del(_animal:Node, animal_info:animal_game_info) {
        game_data.set_camera_pos_animal(animal_info);
        game_data.show_top(_animal, animal_info.current_pos);
        await game_data.flashing(_animal, false);
        await game_data.flashing(_animal, true);
        await game_data.flashing(_animal, false);
        game_data.map.node.removeChild(_animal);
        _animal.active = false;
        _animal.destroy();
    }

    public static set_new_animal(animal_id:number, pos:number, name:string) : Promise<Node> {
        return new Promise<Node>((resolve, reject) => {
            setTimeout(() => {
                let animal_prefab = game_data.get_animal_prefab(animal_id);
                let animal_instance = instantiate(animal_prefab);

                let label_node = animal_instance.getChildByName("name")
                let label = label_node.getComponent(Label);
                label.string = name;
                
                game_data.map.node.addChild(animal_instance);
                game_data.set_animal_pos(animal_instance, pos);
                
                resolve(animal_instance);
            }, 300);
        });
    }

    public static set_move(_animal:any) {
        let animationComponent = _animal.getComponent(Animation);
        const [ idleClip, runClip, negativeClip, gainClip, tianleiClip, zhadanClip, thiefClip, altecLightwaveClip, resetPosClip ] = animationComponent.clips;;
        const runState = animationComponent.getState(runClip.name);
        animationComponent.play(runClip.name);
        runState.wrapMode = AnimationClip.WrapMode.Loop;
    }

    public static set_idle(animal_instance:any) {
        let animationComponent = animal_instance.getComponent(Animation);
        const [ idleClip, runClip, negativeClip, gainClip, tianleiClip, zhadanClip, thiefClip, altecLightwaveClip, resetPosClip ] = animationComponent.clips;;
        const idleState = animationComponent.getState(idleClip.name);
        animationComponent.play(idleClip.name);
        idleState.wrapMode = AnimationClip.WrapMode.Loop;
    }
}

export class game_constant_data {
    public static animal_name(animal_id:number) {
        switch(animal_id) {
            case animal.bear:
                return "大力熊";

            case animal.chicken:
                return "战斗鸡";

            case animal.duck:
                return "丑小鸭";
            
            case animal.lion:
                return "辛巴";

            case animal.monkey:
                return "小机灵";

            case animal.mouse:
                return "一只耳";

            case animal.rabbit:
                return "种花兔";

            case animal.tiger:
                return "王小虎";
        }
        
        return "";
    }
}