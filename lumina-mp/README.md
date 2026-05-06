# lumina-mp

Lumina Trip 微信小程序（uni-app + Vue 3 + Vite）。

## 快速开始

```bash
npm install
npm run dev:mp-weixin
```

产物在 `dist/dev/mp-weixin/`。打开微信开发者工具 → 导入项目 → 选这个目录。

## 启动前

1. 在 `mp.weixin.qq.com` 注册个人小程序，拿 AppID
2. 把 AppID 填到 `src/manifest.json` 的 `mp-weixin.appid`（替换占位 `wx0000000000000000`）
3. 后台「开发设置 → 服务器域名」加 `https://api.cuizhexiao.xyz`

## 目录

```
src/
├── App.vue
├── main.js
├── manifest.json          uni-app 清单（含 wx AppID）
├── pages.json             路由 + tabBar
├── pages/                 视图层
│   ├── index/             首页
│   ├── wishlist/          愿望编辑
│   ├── detail/            候选询价（W5）
│   ├── expense/           记账（W6）
│   ├── settle/            平账（W6）
│   ├── profile/           我的
│   └── admin/             异常推送（W7）
├── service/               业务层（未来三端复用）
│   ├── config.js          API_BASE
│   └── api.js             wx.request 封装 + JWT 注入
└── store/
    └── auth.js            pinia：登录态
```
