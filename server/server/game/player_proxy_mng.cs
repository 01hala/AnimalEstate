using abelkhan;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace game
{
    public class player_proxy
    {
        private readonly game_player_caller _game_player_caller;
        private readonly hub.hubproxy _proxy;

        public string name
        {
            get
            {
                return _proxy.name;
            }
        }

        public player_proxy(game_player_caller caller, hub.hubproxy proxy)
        {
            _game_player_caller = caller;
            _proxy = proxy;
        }

        public void settle(game_settle_info settle_info)
        {
            try
            {
                _game_player_caller.get_hub(_proxy.name).settle(settle_info);
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }
    }

    public class player_proxy_mng
    {
        private readonly game_player_caller _game_player_caller = new ();
        private readonly Dictionary<string, player_proxy> player_proxys = new ();

        public player_proxy_mng()
        {
        }

        public void reg_player_proxy(hub.hubproxy _proxy)
        {
            try
            {
                player_proxys[_proxy.name] = new player_proxy(_game_player_caller, _proxy);
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
        }

        public player_proxy get_player(string player_hub_name)
        {
            player_proxy proxy = null;
            try
            {
                if (string.IsNullOrEmpty(player_hub_name))
                {
                    player_hub_name = player_proxys.Keys.ToArray()[RandomHelper.RandomInt(player_proxys.Count)];
                }
                player_proxys.TryGetValue(player_hub_name, out proxy);
            }
            catch (System.Exception e)
            {
                log.log.err(e.Message);
            }
            return proxy;
        }
    }
}
