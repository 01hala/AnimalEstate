﻿using abelkhan;

namespace match
{
    class match
    {
        public static redis_handle _redis_handle;
        public static player_proxy_mng _player_proxy_mng = new ();
        public static room_proxy_mng _room_proxy_mng = new ();
        public static game_proxy_mng _game_proxy_mng = new ();

        public static match_mng match_Mng = new ();

        static void Main(string[] args)
		{
            var _hub = new hub.hub(args[0], args[1], "match");
            _redis_handle = new redis_handle(hub.hub._root_config.get_value_string("redis_for_cache"));

            var _player_msg_handle = new player_msg_handle();
            var _room_msg_handle = new room_msg_handle();

            _hub.on_hubproxy += on_hubproxy;
            _hub.on_hubproxy_reconn += on_hubproxy;

            _hub.onCloseServer += () => {
                _hub.closeSvr();
            };

            log.log.trace("login start ok");

            _hub.run();
        }

        private static void on_hubproxy(hub.hubproxy _proxy)
        {
            if (_proxy.type == "player")
            {
                _player_proxy_mng.reg_player_proxy(_proxy);
            }
            else if (_proxy.type == "room")
            {
                _room_proxy_mng.reg_room_proxy(_proxy);
            }
            else if (_proxy.type == "game")
            {
                _game_proxy_mng.reg_game_proxy(_proxy);
            }
        }
    }
}
