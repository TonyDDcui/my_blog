# lumina-bff

Lumina Trip BFF（Backend-for-Frontend）：微信小程序 ↔ AI / Supabase / 微信 OpenAPI 中转层。

## 快速开始

```bash
cp .env.example .env
# 编辑 .env，填 JWT_SECRET / WX_APPID / WX_APP_SECRET / SUPABASE_* / DEEPSEEK_KEY ...
npm install
npm run dev   # 本地开发，文件改动自动重启
```

健康检查：

```bash
curl http://localhost:3000/api/health
```

## 路由（W1 阶段）

- `GET  /api/health` 健康检查
- `POST /api/wx/login` `{code, nickname?, avatar_url?}` → `{token, user}`，code 来自 wx.login
- `GET  /api/me` 需 `Authorization: Bearer <token>`

W2 起逐步增加：trip / item / expense / ai / research / weather / poi 等。

## 部署到 ECS（pm2）

```bash
ssh root@cuizhexiao.xyz -p 2222
cd /opt/lumina-bff
npm ci --omit=dev
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

nginx 反代见仓库根目录 `infra/nginx-api.conf`。
