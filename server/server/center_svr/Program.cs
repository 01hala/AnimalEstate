using Microsoft.AspNetCore.Http;
using service;
using System;
using System.Threading;

namespace center_svr
{
    class Program
    {
        static void Main(string[] args)
        {
            var _center = new abelkhan.center(args[0], args[1]);
            _center.on_svr_disconnect += (abelkhan.svrproxy _proxy) =>
            {
                log.log.err("svr:{0},{1} exception!", _proxy.type, _proxy.name);
            };

            var _httpservice = new service.HttpService(8081);
            HttpService.get("/test", async (req) => {
                await req.Response(StatusCodes.Status200OK, HttpService.buildCrossHeaders(), System.Text.Encoding.UTF8.GetBytes("test ok!"));
            });
            _httpservice.run();

            log.log.trace("Center start ok");

            _center.run();
        }
    }
}
