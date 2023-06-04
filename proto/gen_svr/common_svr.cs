using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using MsgPack.Serialization;

namespace abelkhan
{
/*this enum code is codegen by abelkhan codegen for c#*/

    public enum animal{
        chicken = 1,
        monkey = 2,
        rabbit = 3,
        duck = 4,
        mouse = 5,
        bear = 6,
        tiger = 7,
        lion = 8
    }
    public enum skin{
        chicken = 101,
        monkey = 201,
        rabbit = 301,
        duck = 401,
        mouse = 501,
        bear = 601,
        tiger = 701,
        lion = 801
    }
    public enum effect{
        muddy = 1,
        golden_apple = 2,
        rice_ear = 3,
        monkey_wine = 4,
        thunder = 101,
        clip = 102,
        landmine = 103,
        spring = 104,
        banana = 105,
        watermelon_rind = 106,
        red_mushroom = 107
    }
    public enum skill{
        phantom_dice = 1,
        soul_moving_method = 2,
        thief_reborn = 3,
        step_lotus = 4,
        preemptiv_strike = 5,
        swap_places = 6,
        altec_lightwave = 7
    }
    public enum props{
        none = 0,
        horn = 1,
        bomb = 2,
        help_vellus = 3,
        thunder = 4,
        clown_gift_box = 5,
        excited_petals = 6,
        clip = 7,
        landmine = 8,
        spring = 9,
        turtle_shell = 10,
        banana = 11,
        watermelon_rind = 12,
        red_mushroom = 13,
        gacha = 14,
        fake_dice = 15
    }
    public enum playground{
        random = 0,
        lakeside = 1,
        grassland = 2,
        hill = 3,
        snow = 4,
        desert = 5,
        countof = 6
    }
/*this struct code is codegen by abelkhan codegen for c#*/
    public class player_friend_info
    {
        public Int64 guid;
        public string sdk_uuid;
        public string name;
        public string avatar;
        public Int32 coin;
        public Int32 score;
        public static MsgPack.MessagePackObjectDictionary player_friend_info_to_protcol(player_friend_info _struct){
            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("guid", _struct.guid);
            _protocol.Add("sdk_uuid", _struct.sdk_uuid);
            _protocol.Add("name", _struct.name);
            _protocol.Add("avatar", _struct.avatar);
            _protocol.Add("coin", _struct.coin);
            _protocol.Add("score", _struct.score);
            return _protocol;
        }
        public static player_friend_info protcol_to_player_friend_info(MsgPack.MessagePackObjectDictionary _protocol){
            var _struct9b9e8b33_ad4e_3bf3_b537_d892bf5094fa = new player_friend_info();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "guid"){
                    _struct9b9e8b33_ad4e_3bf3_b537_d892bf5094fa.guid = ((MsgPack.MessagePackObject)i.Value).AsInt64();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "sdk_uuid"){
                    _struct9b9e8b33_ad4e_3bf3_b537_d892bf5094fa.sdk_uuid = ((MsgPack.MessagePackObject)i.Value).AsString();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "name"){
                    _struct9b9e8b33_ad4e_3bf3_b537_d892bf5094fa.name = ((MsgPack.MessagePackObject)i.Value).AsString();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "avatar"){
                    _struct9b9e8b33_ad4e_3bf3_b537_d892bf5094fa.avatar = ((MsgPack.MessagePackObject)i.Value).AsString();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "coin"){
                    _struct9b9e8b33_ad4e_3bf3_b537_d892bf5094fa.coin = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "score"){
                    _struct9b9e8b33_ad4e_3bf3_b537_d892bf5094fa.score = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
            }
            return _struct9b9e8b33_ad4e_3bf3_b537_d892bf5094fa;
        }
    }

    public class player_info
    {
        public Int64 guid;
        public string sdk_uuid;
        public string name;
        public string avatar;
        public Int32 coin;
        public Int32 score;
        public List<player_friend_info> friend_list;
        public List<player_friend_info> invite_list;
        public List<player_friend_info> be_invited_list;
        public List<animal> hero_list;
        public List<skin> skin_list;
        public List<skill> skill_list;
        public List<playground> playground_list;
        public static MsgPack.MessagePackObjectDictionary player_info_to_protcol(player_info _struct){
            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("guid", _struct.guid);
            _protocol.Add("sdk_uuid", _struct.sdk_uuid);
            _protocol.Add("name", _struct.name);
            _protocol.Add("avatar", _struct.avatar);
            _protocol.Add("coin", _struct.coin);
            _protocol.Add("score", _struct.score);
            if (_struct.friend_list != null) {
                var _array_friend_list = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.friend_list){
                    _array_friend_list.Add( new MsgPack.MessagePackObject(player_friend_info.player_friend_info_to_protcol(v_)));
                }
                _protocol.Add("friend_list", new MsgPack.MessagePackObject(_array_friend_list));
            }
            if (_struct.invite_list != null) {
                var _array_invite_list = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.invite_list){
                    _array_invite_list.Add( new MsgPack.MessagePackObject(player_friend_info.player_friend_info_to_protcol(v_)));
                }
                _protocol.Add("invite_list", new MsgPack.MessagePackObject(_array_invite_list));
            }
            if (_struct.be_invited_list != null) {
                var _array_be_invited_list = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.be_invited_list){
                    _array_be_invited_list.Add( new MsgPack.MessagePackObject(player_friend_info.player_friend_info_to_protcol(v_)));
                }
                _protocol.Add("be_invited_list", new MsgPack.MessagePackObject(_array_be_invited_list));
            }
            if (_struct.hero_list != null) {
                var _array_hero_list = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.hero_list){
                    _array_hero_list.Add((Int32)v_);
                }
                _protocol.Add("hero_list", new MsgPack.MessagePackObject(_array_hero_list));
            }
            if (_struct.skin_list != null) {
                var _array_skin_list = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.skin_list){
                    _array_skin_list.Add((Int32)v_);
                }
                _protocol.Add("skin_list", new MsgPack.MessagePackObject(_array_skin_list));
            }
            if (_struct.skill_list != null) {
                var _array_skill_list = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.skill_list){
                    _array_skill_list.Add((Int32)v_);
                }
                _protocol.Add("skill_list", new MsgPack.MessagePackObject(_array_skill_list));
            }
            if (_struct.playground_list != null) {
                var _array_playground_list = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.playground_list){
                    _array_playground_list.Add((Int32)v_);
                }
                _protocol.Add("playground_list", new MsgPack.MessagePackObject(_array_playground_list));
            }
            return _protocol;
        }
        public static player_info protcol_to_player_info(MsgPack.MessagePackObjectDictionary _protocol){
            var _structba9db598_9e11_365a_9abc_c16f0f380537 = new player_info();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "guid"){
                    _structba9db598_9e11_365a_9abc_c16f0f380537.guid = ((MsgPack.MessagePackObject)i.Value).AsInt64();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "sdk_uuid"){
                    _structba9db598_9e11_365a_9abc_c16f0f380537.sdk_uuid = ((MsgPack.MessagePackObject)i.Value).AsString();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "name"){
                    _structba9db598_9e11_365a_9abc_c16f0f380537.name = ((MsgPack.MessagePackObject)i.Value).AsString();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "avatar"){
                    _structba9db598_9e11_365a_9abc_c16f0f380537.avatar = ((MsgPack.MessagePackObject)i.Value).AsString();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "coin"){
                    _structba9db598_9e11_365a_9abc_c16f0f380537.coin = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "score"){
                    _structba9db598_9e11_365a_9abc_c16f0f380537.score = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "friend_list"){
                    _structba9db598_9e11_365a_9abc_c16f0f380537.friend_list = new();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _structba9db598_9e11_365a_9abc_c16f0f380537.friend_list.Add(player_friend_info.protcol_to_player_friend_info(((MsgPack.MessagePackObject)v_).AsDictionary()));
                    }
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "invite_list"){
                    _structba9db598_9e11_365a_9abc_c16f0f380537.invite_list = new();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _structba9db598_9e11_365a_9abc_c16f0f380537.invite_list.Add(player_friend_info.protcol_to_player_friend_info(((MsgPack.MessagePackObject)v_).AsDictionary()));
                    }
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "be_invited_list"){
                    _structba9db598_9e11_365a_9abc_c16f0f380537.be_invited_list = new();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _structba9db598_9e11_365a_9abc_c16f0f380537.be_invited_list.Add(player_friend_info.protcol_to_player_friend_info(((MsgPack.MessagePackObject)v_).AsDictionary()));
                    }
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "hero_list"){
                    _structba9db598_9e11_365a_9abc_c16f0f380537.hero_list = new();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _structba9db598_9e11_365a_9abc_c16f0f380537.hero_list.Add((animal)((MsgPack.MessagePackObject)v_).AsInt32());
                    }
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "skin_list"){
                    _structba9db598_9e11_365a_9abc_c16f0f380537.skin_list = new();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _structba9db598_9e11_365a_9abc_c16f0f380537.skin_list.Add((skin)((MsgPack.MessagePackObject)v_).AsInt32());
                    }
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "skill_list"){
                    _structba9db598_9e11_365a_9abc_c16f0f380537.skill_list = new();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _structba9db598_9e11_365a_9abc_c16f0f380537.skill_list.Add((skill)((MsgPack.MessagePackObject)v_).AsInt32());
                    }
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "playground_list"){
                    _structba9db598_9e11_365a_9abc_c16f0f380537.playground_list = new();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _structba9db598_9e11_365a_9abc_c16f0f380537.playground_list.Add((playground)((MsgPack.MessagePackObject)v_).AsInt32());
                    }
                }
            }
            return _structba9db598_9e11_365a_9abc_c16f0f380537;
        }
    }

    public class player_inline_info
    {
        public string uuid;
        public Int64 guid;
        public string name;
        public string avatar;
        public Int32 coin;
        public Int32 score;
        public List<animal> hero_list;
        public List<skin> skin_list;
        public List<skill> skill_list;
        public List<playground> playground_list;
        public static MsgPack.MessagePackObjectDictionary player_inline_info_to_protcol(player_inline_info _struct){
            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("uuid", _struct.uuid);
            _protocol.Add("guid", _struct.guid);
            _protocol.Add("name", _struct.name);
            _protocol.Add("avatar", _struct.avatar);
            _protocol.Add("coin", _struct.coin);
            _protocol.Add("score", _struct.score);
            if (_struct.hero_list != null) {
                var _array_hero_list = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.hero_list){
                    _array_hero_list.Add((Int32)v_);
                }
                _protocol.Add("hero_list", new MsgPack.MessagePackObject(_array_hero_list));
            }
            if (_struct.skin_list != null) {
                var _array_skin_list = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.skin_list){
                    _array_skin_list.Add((Int32)v_);
                }
                _protocol.Add("skin_list", new MsgPack.MessagePackObject(_array_skin_list));
            }
            if (_struct.skill_list != null) {
                var _array_skill_list = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.skill_list){
                    _array_skill_list.Add((Int32)v_);
                }
                _protocol.Add("skill_list", new MsgPack.MessagePackObject(_array_skill_list));
            }
            if (_struct.playground_list != null) {
                var _array_playground_list = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.playground_list){
                    _array_playground_list.Add((Int32)v_);
                }
                _protocol.Add("playground_list", new MsgPack.MessagePackObject(_array_playground_list));
            }
            return _protocol;
        }
        public static player_inline_info protcol_to_player_inline_info(MsgPack.MessagePackObjectDictionary _protocol){
            var _structcdacc51b_f718_3ebb_ad22_096d86e7efee = new player_inline_info();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "uuid"){
                    _structcdacc51b_f718_3ebb_ad22_096d86e7efee.uuid = ((MsgPack.MessagePackObject)i.Value).AsString();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "guid"){
                    _structcdacc51b_f718_3ebb_ad22_096d86e7efee.guid = ((MsgPack.MessagePackObject)i.Value).AsInt64();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "name"){
                    _structcdacc51b_f718_3ebb_ad22_096d86e7efee.name = ((MsgPack.MessagePackObject)i.Value).AsString();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "avatar"){
                    _structcdacc51b_f718_3ebb_ad22_096d86e7efee.avatar = ((MsgPack.MessagePackObject)i.Value).AsString();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "coin"){
                    _structcdacc51b_f718_3ebb_ad22_096d86e7efee.coin = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "score"){
                    _structcdacc51b_f718_3ebb_ad22_096d86e7efee.score = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "hero_list"){
                    _structcdacc51b_f718_3ebb_ad22_096d86e7efee.hero_list = new();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _structcdacc51b_f718_3ebb_ad22_096d86e7efee.hero_list.Add((animal)((MsgPack.MessagePackObject)v_).AsInt32());
                    }
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "skin_list"){
                    _structcdacc51b_f718_3ebb_ad22_096d86e7efee.skin_list = new();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _structcdacc51b_f718_3ebb_ad22_096d86e7efee.skin_list.Add((skin)((MsgPack.MessagePackObject)v_).AsInt32());
                    }
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "skill_list"){
                    _structcdacc51b_f718_3ebb_ad22_096d86e7efee.skill_list = new();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _structcdacc51b_f718_3ebb_ad22_096d86e7efee.skill_list.Add((skill)((MsgPack.MessagePackObject)v_).AsInt32());
                    }
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "playground_list"){
                    _structcdacc51b_f718_3ebb_ad22_096d86e7efee.playground_list = new();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _structcdacc51b_f718_3ebb_ad22_096d86e7efee.playground_list.Add((playground)((MsgPack.MessagePackObject)v_).AsInt32());
                    }
                }
            }
            return _structcdacc51b_f718_3ebb_ad22_096d86e7efee;
        }
    }

    public class room_info
    {
        public string room_uuid;
        public Int64 room_owner_guid;
        public playground _playground;
        public List<player_inline_info> room_player_list;
        public static MsgPack.MessagePackObjectDictionary room_info_to_protcol(room_info _struct){
            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("room_uuid", _struct.room_uuid);
            _protocol.Add("room_owner_guid", _struct.room_owner_guid);
            _protocol.Add("_playground", (Int32)_struct._playground);
            if (_struct.room_player_list != null) {
                var _array_room_player_list = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.room_player_list){
                    _array_room_player_list.Add( new MsgPack.MessagePackObject(player_inline_info.player_inline_info_to_protcol(v_)));
                }
                _protocol.Add("room_player_list", new MsgPack.MessagePackObject(_array_room_player_list));
            }
            return _protocol;
        }
        public static room_info protcol_to_room_info(MsgPack.MessagePackObjectDictionary _protocol){
            var _struct6bdeecee_07e7_32d2_a4bc_6ebc8b13f116 = new room_info();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "room_uuid"){
                    _struct6bdeecee_07e7_32d2_a4bc_6ebc8b13f116.room_uuid = ((MsgPack.MessagePackObject)i.Value).AsString();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "room_owner_guid"){
                    _struct6bdeecee_07e7_32d2_a4bc_6ebc8b13f116.room_owner_guid = ((MsgPack.MessagePackObject)i.Value).AsInt64();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "_playground"){
                    _struct6bdeecee_07e7_32d2_a4bc_6ebc8b13f116._playground = (playground)((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "room_player_list"){
                    _struct6bdeecee_07e7_32d2_a4bc_6ebc8b13f116.room_player_list = new();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _struct6bdeecee_07e7_32d2_a4bc_6ebc8b13f116.room_player_list.Add(player_inline_info.protcol_to_player_inline_info(((MsgPack.MessagePackObject)v_).AsDictionary()));
                    }
                }
            }
            return _struct6bdeecee_07e7_32d2_a4bc_6ebc8b13f116;
        }
    }

    public class animal_game_info
    {
        public animal animal_id;
        public skin skin_id;
        public Int16 current_pos;
        public bool could_move = true;
        public Int32 unmovable_rounds = 0;
        public Int32 continuous_move_rounds = 0;
        public static MsgPack.MessagePackObjectDictionary animal_game_info_to_protcol(animal_game_info _struct){
            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("animal_id", (Int32)_struct.animal_id);
            _protocol.Add("skin_id", (Int32)_struct.skin_id);
            _protocol.Add("current_pos", _struct.current_pos);
            _protocol.Add("could_move", _struct.could_move);
            _protocol.Add("unmovable_rounds", _struct.unmovable_rounds);
            _protocol.Add("continuous_move_rounds", _struct.continuous_move_rounds);
            return _protocol;
        }
        public static animal_game_info protcol_to_animal_game_info(MsgPack.MessagePackObjectDictionary _protocol){
            var _struct0f490332_8543_30ad_92b2_6c49981b121d = new animal_game_info();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "animal_id"){
                    _struct0f490332_8543_30ad_92b2_6c49981b121d.animal_id = (animal)((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "skin_id"){
                    _struct0f490332_8543_30ad_92b2_6c49981b121d.skin_id = (skin)((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "current_pos"){
                    _struct0f490332_8543_30ad_92b2_6c49981b121d.current_pos = ((MsgPack.MessagePackObject)i.Value).AsInt16();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "could_move"){
                    _struct0f490332_8543_30ad_92b2_6c49981b121d.could_move = ((MsgPack.MessagePackObject)i.Value).AsBoolean();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "unmovable_rounds"){
                    _struct0f490332_8543_30ad_92b2_6c49981b121d.unmovable_rounds = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "continuous_move_rounds"){
                    _struct0f490332_8543_30ad_92b2_6c49981b121d.continuous_move_rounds = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
            }
            return _struct0f490332_8543_30ad_92b2_6c49981b121d;
        }
    }

    public class animal_play_active_state
    {
        public Int16 animal_index;
        public bool could_use_props;
        public Int16 use_props_count;
        public bool could_throw_dice;
        public bool is_step_lotus;
        public Int16 throw_dice_count;
        public float move_coefficient;
        public static MsgPack.MessagePackObjectDictionary animal_play_active_state_to_protcol(animal_play_active_state _struct){
            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("animal_index", _struct.animal_index);
            _protocol.Add("could_use_props", _struct.could_use_props);
            _protocol.Add("use_props_count", _struct.use_props_count);
            _protocol.Add("could_throw_dice", _struct.could_throw_dice);
            _protocol.Add("is_step_lotus", _struct.is_step_lotus);
            _protocol.Add("throw_dice_count", _struct.throw_dice_count);
            _protocol.Add("move_coefficient", _struct.move_coefficient);
            return _protocol;
        }
        public static animal_play_active_state protcol_to_animal_play_active_state(MsgPack.MessagePackObjectDictionary _protocol){
            var _struct5d41e71d_3b1f_324a_aad8_9cf02493fc21 = new animal_play_active_state();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "animal_index"){
                    _struct5d41e71d_3b1f_324a_aad8_9cf02493fc21.animal_index = ((MsgPack.MessagePackObject)i.Value).AsInt16();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "could_use_props"){
                    _struct5d41e71d_3b1f_324a_aad8_9cf02493fc21.could_use_props = ((MsgPack.MessagePackObject)i.Value).AsBoolean();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "use_props_count"){
                    _struct5d41e71d_3b1f_324a_aad8_9cf02493fc21.use_props_count = ((MsgPack.MessagePackObject)i.Value).AsInt16();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "could_throw_dice"){
                    _struct5d41e71d_3b1f_324a_aad8_9cf02493fc21.could_throw_dice = ((MsgPack.MessagePackObject)i.Value).AsBoolean();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "is_step_lotus"){
                    _struct5d41e71d_3b1f_324a_aad8_9cf02493fc21.is_step_lotus = ((MsgPack.MessagePackObject)i.Value).AsBoolean();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "throw_dice_count"){
                    _struct5d41e71d_3b1f_324a_aad8_9cf02493fc21.throw_dice_count = ((MsgPack.MessagePackObject)i.Value).AsInt16();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "move_coefficient"){
                    _struct5d41e71d_3b1f_324a_aad8_9cf02493fc21.move_coefficient = ((MsgPack.MessagePackObject)i.Value).AsSingle();
                }
            }
            return _struct5d41e71d_3b1f_324a_aad8_9cf02493fc21;
        }
    }

    public class play_active_state
    {
        public bool could_use_skill;
        public bool phantom_dice;
        public bool fake_dice;
        public float move_coefficient;
        public bool preemptive_strike;
        public Int16 round_active_num;
        public List<animal_play_active_state> animal_play_active_states;
        public static MsgPack.MessagePackObjectDictionary play_active_state_to_protcol(play_active_state _struct){
            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("could_use_skill", _struct.could_use_skill);
            _protocol.Add("phantom_dice", _struct.phantom_dice);
            _protocol.Add("fake_dice", _struct.fake_dice);
            _protocol.Add("move_coefficient", _struct.move_coefficient);
            _protocol.Add("preemptive_strike", _struct.preemptive_strike);
            _protocol.Add("round_active_num", _struct.round_active_num);
            if (_struct.animal_play_active_states != null) {
                var _array_animal_play_active_states = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.animal_play_active_states){
                    _array_animal_play_active_states.Add( new MsgPack.MessagePackObject(animal_play_active_state.animal_play_active_state_to_protcol(v_)));
                }
                _protocol.Add("animal_play_active_states", new MsgPack.MessagePackObject(_array_animal_play_active_states));
            }
            return _protocol;
        }
        public static play_active_state protcol_to_play_active_state(MsgPack.MessagePackObjectDictionary _protocol){
            var _struct795588a4_2c8d_392b_ad7b_796a9961d1a6 = new play_active_state();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "could_use_skill"){
                    _struct795588a4_2c8d_392b_ad7b_796a9961d1a6.could_use_skill = ((MsgPack.MessagePackObject)i.Value).AsBoolean();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "phantom_dice"){
                    _struct795588a4_2c8d_392b_ad7b_796a9961d1a6.phantom_dice = ((MsgPack.MessagePackObject)i.Value).AsBoolean();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "fake_dice"){
                    _struct795588a4_2c8d_392b_ad7b_796a9961d1a6.fake_dice = ((MsgPack.MessagePackObject)i.Value).AsBoolean();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "move_coefficient"){
                    _struct795588a4_2c8d_392b_ad7b_796a9961d1a6.move_coefficient = ((MsgPack.MessagePackObject)i.Value).AsSingle();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "preemptive_strike"){
                    _struct795588a4_2c8d_392b_ad7b_796a9961d1a6.preemptive_strike = ((MsgPack.MessagePackObject)i.Value).AsBoolean();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "round_active_num"){
                    _struct795588a4_2c8d_392b_ad7b_796a9961d1a6.round_active_num = ((MsgPack.MessagePackObject)i.Value).AsInt16();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "animal_play_active_states"){
                    _struct795588a4_2c8d_392b_ad7b_796a9961d1a6.animal_play_active_states = new();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _struct795588a4_2c8d_392b_ad7b_796a9961d1a6.animal_play_active_states.Add(animal_play_active_state.protcol_to_animal_play_active_state(((MsgPack.MessagePackObject)v_).AsDictionary()));
                    }
                }
            }
            return _struct795588a4_2c8d_392b_ad7b_796a9961d1a6;
        }
    }

    public class player_game_info
    {
        public string uuid;
        public Int64 guid;
        public string name;
        public string avatar;
        public skill skill_id;
        public bool skill_is_used;
        public List<animal_game_info> animal_info;
        public Int16 current_animal_index;
        public static MsgPack.MessagePackObjectDictionary player_game_info_to_protcol(player_game_info _struct){
            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("uuid", _struct.uuid);
            _protocol.Add("guid", _struct.guid);
            _protocol.Add("name", _struct.name);
            _protocol.Add("avatar", _struct.avatar);
            _protocol.Add("skill_id", (Int32)_struct.skill_id);
            _protocol.Add("skill_is_used", _struct.skill_is_used);
            if (_struct.animal_info != null) {
                var _array_animal_info = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.animal_info){
                    _array_animal_info.Add( new MsgPack.MessagePackObject(animal_game_info.animal_game_info_to_protcol(v_)));
                }
                _protocol.Add("animal_info", new MsgPack.MessagePackObject(_array_animal_info));
            }
            _protocol.Add("current_animal_index", _struct.current_animal_index);
            return _protocol;
        }
        public static player_game_info protcol_to_player_game_info(MsgPack.MessagePackObjectDictionary _protocol){
            var _structa9e105de_cbf5_3520_93fb_036b8466d4f5 = new player_game_info();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "uuid"){
                    _structa9e105de_cbf5_3520_93fb_036b8466d4f5.uuid = ((MsgPack.MessagePackObject)i.Value).AsString();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "guid"){
                    _structa9e105de_cbf5_3520_93fb_036b8466d4f5.guid = ((MsgPack.MessagePackObject)i.Value).AsInt64();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "name"){
                    _structa9e105de_cbf5_3520_93fb_036b8466d4f5.name = ((MsgPack.MessagePackObject)i.Value).AsString();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "avatar"){
                    _structa9e105de_cbf5_3520_93fb_036b8466d4f5.avatar = ((MsgPack.MessagePackObject)i.Value).AsString();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "skill_id"){
                    _structa9e105de_cbf5_3520_93fb_036b8466d4f5.skill_id = (skill)((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "skill_is_used"){
                    _structa9e105de_cbf5_3520_93fb_036b8466d4f5.skill_is_used = ((MsgPack.MessagePackObject)i.Value).AsBoolean();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "animal_info"){
                    _structa9e105de_cbf5_3520_93fb_036b8466d4f5.animal_info = new();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _structa9e105de_cbf5_3520_93fb_036b8466d4f5.animal_info.Add(animal_game_info.protcol_to_animal_game_info(((MsgPack.MessagePackObject)v_).AsDictionary()));
                    }
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "current_animal_index"){
                    _structa9e105de_cbf5_3520_93fb_036b8466d4f5.current_animal_index = ((MsgPack.MessagePackObject)i.Value).AsInt16();
                }
            }
            return _structa9e105de_cbf5_3520_93fb_036b8466d4f5;
        }
    }

    public class game_player_settle_info
    {
        public Int64 guid;
        public string name;
        public Int32 rank;
        public Int32 award_coin;
        public Int32 award_score;
        public static MsgPack.MessagePackObjectDictionary game_player_settle_info_to_protcol(game_player_settle_info _struct){
            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("guid", _struct.guid);
            _protocol.Add("name", _struct.name);
            _protocol.Add("rank", _struct.rank);
            _protocol.Add("award_coin", _struct.award_coin);
            _protocol.Add("award_score", _struct.award_score);
            return _protocol;
        }
        public static game_player_settle_info protcol_to_game_player_settle_info(MsgPack.MessagePackObjectDictionary _protocol){
            var _structeb1fe0ef_fca5_358c_91c2_45f20a7adbea = new game_player_settle_info();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "guid"){
                    _structeb1fe0ef_fca5_358c_91c2_45f20a7adbea.guid = ((MsgPack.MessagePackObject)i.Value).AsInt64();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "name"){
                    _structeb1fe0ef_fca5_358c_91c2_45f20a7adbea.name = ((MsgPack.MessagePackObject)i.Value).AsString();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "rank"){
                    _structeb1fe0ef_fca5_358c_91c2_45f20a7adbea.rank = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "award_coin"){
                    _structeb1fe0ef_fca5_358c_91c2_45f20a7adbea.award_coin = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "award_score"){
                    _structeb1fe0ef_fca5_358c_91c2_45f20a7adbea.award_score = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
            }
            return _structeb1fe0ef_fca5_358c_91c2_45f20a7adbea;
        }
    }

    public class game_settle_info
    {
        public List<game_player_settle_info> settle_info;
        public static MsgPack.MessagePackObjectDictionary game_settle_info_to_protcol(game_settle_info _struct){
            var _protocol = new MsgPack.MessagePackObjectDictionary();
            if (_struct.settle_info != null) {
                var _array_settle_info = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.settle_info){
                    _array_settle_info.Add( new MsgPack.MessagePackObject(game_player_settle_info.game_player_settle_info_to_protcol(v_)));
                }
                _protocol.Add("settle_info", new MsgPack.MessagePackObject(_array_settle_info));
            }
            return _protocol;
        }
        public static game_settle_info protcol_to_game_settle_info(MsgPack.MessagePackObjectDictionary _protocol){
            var _structc73167a1_d0f0_32a5_8b31_3928f54f36c2 = new game_settle_info();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "settle_info"){
                    _structc73167a1_d0f0_32a5_8b31_3928f54f36c2.settle_info = new();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _structc73167a1_d0f0_32a5_8b31_3928f54f36c2.settle_info.Add(game_player_settle_info.protcol_to_game_player_settle_info(((MsgPack.MessagePackObject)v_).AsDictionary()));
                    }
                }
            }
            return _structc73167a1_d0f0_32a5_8b31_3928f54f36c2;
        }
    }

    public class svr_info
    {
        public Int32 tick_time;
        public Int32 player_num;
        public static MsgPack.MessagePackObjectDictionary svr_info_to_protcol(svr_info _struct){
            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("tick_time", _struct.tick_time);
            _protocol.Add("player_num", _struct.player_num);
            return _protocol;
        }
        public static svr_info protcol_to_svr_info(MsgPack.MessagePackObjectDictionary _protocol){
            var _struct13f334ce_724e_3749_be0d_3222168d7a26 = new svr_info();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "tick_time"){
                    _struct13f334ce_724e_3749_be0d_3222168d7a26.tick_time = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "player_num"){
                    _struct13f334ce_724e_3749_be0d_3222168d7a26.player_num = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
            }
            return _struct13f334ce_724e_3749_be0d_3222168d7a26;
        }
    }

    public class player_rank_info
    {
        public Int64 guid;
        public string sdk_uuid;
        public string name;
        public string avatar;
        public Int32 coin;
        public Int32 score;
        public static MsgPack.MessagePackObjectDictionary player_rank_info_to_protcol(player_rank_info _struct){
            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("guid", _struct.guid);
            _protocol.Add("sdk_uuid", _struct.sdk_uuid);
            _protocol.Add("name", _struct.name);
            _protocol.Add("avatar", _struct.avatar);
            _protocol.Add("coin", _struct.coin);
            _protocol.Add("score", _struct.score);
            return _protocol;
        }
        public static player_rank_info protcol_to_player_rank_info(MsgPack.MessagePackObjectDictionary _protocol){
            var _structf51c92c0_ff99_3f1e_b93a_6053f400c8db = new player_rank_info();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "guid"){
                    _structf51c92c0_ff99_3f1e_b93a_6053f400c8db.guid = ((MsgPack.MessagePackObject)i.Value).AsInt64();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "sdk_uuid"){
                    _structf51c92c0_ff99_3f1e_b93a_6053f400c8db.sdk_uuid = ((MsgPack.MessagePackObject)i.Value).AsString();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "name"){
                    _structf51c92c0_ff99_3f1e_b93a_6053f400c8db.name = ((MsgPack.MessagePackObject)i.Value).AsString();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "avatar"){
                    _structf51c92c0_ff99_3f1e_b93a_6053f400c8db.avatar = ((MsgPack.MessagePackObject)i.Value).AsString();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "coin"){
                    _structf51c92c0_ff99_3f1e_b93a_6053f400c8db.coin = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "score"){
                    _structf51c92c0_ff99_3f1e_b93a_6053f400c8db.score = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
            }
            return _structf51c92c0_ff99_3f1e_b93a_6053f400c8db;
        }
    }

    public class rank_item
    {
        public Int64 guid;
        public Int64 score;
        public Int32 rank;
        public byte[] item;
        public static MsgPack.MessagePackObjectDictionary rank_item_to_protcol(rank_item _struct){
            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("guid", _struct.guid);
            _protocol.Add("score", _struct.score);
            _protocol.Add("rank", _struct.rank);
            _protocol.Add("item", _struct.item);
            return _protocol;
        }
        public static rank_item protcol_to_rank_item(MsgPack.MessagePackObjectDictionary _protocol){
            var _struct8e307fd3_8e06_3971_adaf_10e42d498ea0 = new rank_item();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "guid"){
                    _struct8e307fd3_8e06_3971_adaf_10e42d498ea0.guid = ((MsgPack.MessagePackObject)i.Value).AsInt64();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "score"){
                    _struct8e307fd3_8e06_3971_adaf_10e42d498ea0.score = ((MsgPack.MessagePackObject)i.Value).AsInt64();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "rank"){
                    _struct8e307fd3_8e06_3971_adaf_10e42d498ea0.rank = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "item"){
                    _struct8e307fd3_8e06_3971_adaf_10e42d498ea0.item = ((MsgPack.MessagePackObject)i.Value).AsBinary();
                }
            }
            return _struct8e307fd3_8e06_3971_adaf_10e42d498ea0;
        }
    }

/*this caller code is codegen by abelkhan codegen for c#*/
/*this module code is codegen by abelkhan codegen for c#*/

}
