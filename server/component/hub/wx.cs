using abelkhan;
using System.Threading.Tasks;

namespace wx
{
    public class code2Session
    {
        public string openid;
        public string session_key;
        public string unionid;
        public int errcode;
        public string errmsg;
    }

    public class wxSdk
    {
        public static async Task<code2Session> code2Session(string appid, string secret, string code)
        {
            try
            {
                var url = $"https://api.weixin.qq.com/sns/jscode2session?appid={appid}&secret={secret}&js_code={code}&grant_type=authorization_code";
                log.log.trace("on_player_login:{0}", url);
                var result = await HttpClientWrapper.GetRspAsync(url);

                if (result != null && result.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    var ret = await result.Content.ReadAsStringAsync();
                    log.log.trace("jscode2session:{0}", ret);
                    var ret_obj = Newtonsoft.Json.JsonConvert.DeserializeObject<code2Session>(ret);
                    return ret_obj;
                }
            }
            catch (System.Exception ex)
            {
                log.log.err($"{ex}");
                throw;
            }

            return null;
        }
    }
}
