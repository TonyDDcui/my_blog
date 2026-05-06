import axios from 'axios';

const APPID = process.env.WX_APPID;
const SECRET = process.env.WX_APP_SECRET;

const WX_API = 'https://api.weixin.qq.com';

let cachedAccessToken = null;
let accessTokenExpireAt = 0;

export async function code2session(code) {
  if (!APPID || !SECRET) {
    throw new Error('WX_APPID / WX_APP_SECRET 未配置');
  }
  const url = `${WX_API}/sns/jscode2session`;
  const { data } = await axios.get(url, {
    params: {
      appid: APPID,
      secret: SECRET,
      js_code: code,
      grant_type: 'authorization_code',
    },
    timeout: 5000,
  });
  if (data.errcode) {
    const err = new Error(`微信 code2session 失败: ${data.errcode} ${data.errmsg}`);
    err.wxCode = data.errcode;
    throw err;
  }
  return {
    openid: data.openid,
    sessionKey: data.session_key,
    unionid: data.unionid,
  };
}

export async function getAccessToken() {
  const now = Date.now();
  if (cachedAccessToken && now < accessTokenExpireAt) {
    return cachedAccessToken;
  }
  const { data } = await axios.get(`${WX_API}/cgi-bin/token`, {
    params: { grant_type: 'client_credential', appid: APPID, secret: SECRET },
    timeout: 5000,
  });
  if (data.errcode) {
    throw new Error(`微信 token 获取失败: ${data.errcode} ${data.errmsg}`);
  }
  cachedAccessToken = data.access_token;
  accessTokenExpireAt = now + (data.expires_in - 300) * 1000;
  return cachedAccessToken;
}

export async function msgSecCheck(content, openid) {
  const token = await getAccessToken();
  const { data } = await axios.post(
    `${WX_API}/wxa/msg_sec_check?access_token=${token}`,
    { version: 2, scene: 1, openid, content },
    { timeout: 5000 }
  );
  return data.errcode === 0;
}

export async function sendSubscribeMessage({ openid, templateId, page, data }) {
  const token = await getAccessToken();
  const { data: res } = await axios.post(
    `${WX_API}/cgi-bin/message/subscribe/send?access_token=${token}`,
    {
      touser: openid,
      template_id: templateId,
      page,
      data,
      miniprogram_state: process.env.NODE_ENV === 'production' ? 'formal' : 'developer',
    },
    { timeout: 5000 }
  );
  return res;
}
