start ./bin/debug/center_svr.exe ./config/config_node.txt center
sleep 10

start ./bin/debug/dbproxy_svr.exe ./config/config_node.txt dbproxy
sleep 2

start ./bin/debug/gate_svr.exe ./config/config_node.txt gate
sleep 2

start ./bin/debug/login.exe ./config/config_node.txt login
start ./bin/debug/player.exe ./config/config_node.txt player
start ./bin/debug/rank.exe ./config/config_node.txt rank
start ./bin/debug/match.exe ./config/config_node.txt match
start ./bin/debug/room.exe ./config/config_node.txt room
start ./bin/debug/game.exe ./config/config_node.txt game