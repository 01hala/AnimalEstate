using abelkhan;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace player
{
    class rank_proxy
    {
        private readonly rank_svr_service_caller player_rank_Caller = new();
        private readonly hub.hubproxy _proxy;

        public string name
        {
            get { return _proxy.name; }
        }

        public rank_proxy(hub.hubproxy proxy)
        {

            _proxy = proxy;
        }

        public void update_rank_item(string rank_name, rank_item item)
        {
            player_rank_Caller.get_hub(name).update_rank_item(rank_name, item);
        }
    }
}
