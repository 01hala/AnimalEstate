using Microsoft.IO;

namespace constant
{
    public class constant
    {
        public static readonly string player_db_name = "AnimalEstate";

        public static readonly string player_db_collection = "player";

        public static readonly string player_db_offline_msg_collection = "offline_msg";

        public static readonly string player_db_guid_collection = "guid";

        public static readonly string player_db_rank_collection = "rank";

        public static readonly RecyclableMemoryStreamManager rcStMgr = new();

        public const long RedisMQTickTime = 33;
    }

}
