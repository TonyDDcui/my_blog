# Project Plan — cuizhexiao.xyz（个人作品集 + 嵌入式 AI 助手）

> 本文用于让任何工程师/模型在**无上下文**情况下理解项目的目标、架构、业务逻辑与落地步骤。  
> 站点域名：`https://cuizhexiao.xyz`  
> 运行环境：阿里云 ECS（Ubuntu），Nginx，Docker Compose。  

---

## 1. 项目目标（Goals）

### 1.1 总目标
在同一台 ECS 上构建一个面向国内外用户的个人作品集与嵌入式 AI 产品雏形。项目定位优先级：
1) **个人作品集**：展示个人主页、技术能力、项目经历、博客内容与 AI 产品 Demo
2) **可商业化 AI 工具**：逐步发展成面向嵌入式学习和竞赛落地的垂直 AI 助手

系统需要满足：
- **内容**：WordPress 继续作为博客系统，挂载到 `/blog/`
- **产品/功能**：由 FastAPI 提供统一后端能力（鉴权、订阅、用量、AI 网关、管理后台 API）
- **前端**：根路径 `/` 使用当前静态页面原型 `code.html` 演进为个人主页与 AI 产品入口
- **AI 模型**：优先通过统一 AI 网关接入，ECS 本地 Ollama 可用于 Demo；由于当前 ECS 为 2 核 2G + 4G swap，必须保留后续切换云端模型或更强服务器的能力
- **垂直场景**：围绕嵌入式 AI、电子竞赛、单片机训练和项目快速落地，而不是做泛聊天产品

### 1.2 业务目标（MVP）
1) 登录（大厂逻辑）：
   - 第一版优先支持 **GitHub OAuth**
   - Google / WeChat 作为后续扩展
   - 开放注册：任何用户都可登录创建账号
   - 只有管理员可访问“订阅/用量/用户管理”等全业务面板
2) 嵌入式 AI 使用门槛：
   - **必须登录**才能使用 AI
   - 免费策略：**每天免费 5 次**（先按“请求次数”计费 A）
   - 超额后提示订阅（第一期不接真实支付，管理员手动开通订阅）
3) AI 产品能力：
   - 用户用自然语言描述想实现的电子/嵌入式/嵌入式 AI 项目
   - 系统输出硬件规划、购买链接、模块连接、电路连接、代码、调试步骤
   - 用户明确要“教我”时输出教学式解释；用户只要结果时输出可落地方案
   - 首批支持 STM32、ESP32、NXP RT1064
   - 首批测试集使用从蓝桥杯官网下载的历年单片机组省赛和国赛 `.doc` 题目
   - 硬件购买链接第一版由 AI 根据硬件名称生成淘宝搜索链接
   - 代码生成第一版：STM32 优先标准库，ESP32 优先 Arduino for ESP32，NXP RT1064 优先 MCUXpresso SDK
4) 订阅（第一期手动开通，后续可接支付）：
   - 用户达到免费额度后显示“需要订阅”
   - 管理员后台可为用户开通/停用订阅
   - 第一阶段订阅只是象征性控制，重点是证明产品闭环
5) 收益演进：
   - 面向大学生竞赛、课程设计、毕业设计等场景提供更强模型或服务
   - 后续和硬件商家合作，在推荐清单里优先展示合作商品链接
6) 计费演进：
   - **阶段 A（先做）**：按“请求次数”计费
   - **阶段 B（后做）**：按 token/字数计费（更接近商业化）

---

## 2. 站点分级与路由（Information Architecture）

### 2.1 路由分级（域名 → 一级路径）
`cuizhexiao.xyz` 下的一级分区：
- `/`：静态站（当前原型为 `code.html`，后续可合并 `Self_Introduction`）
- `/api/`：FastAPI（认证、订阅、用量、AI 网关、管理 API）
- `/blog/`：WordPress（Docker），Nginx 反代

### 2.2 关键约束
- 静态站不是 SPA：静态站 Nginx 建议 `try_files ... =404`（避免错误路径返回 200）
- `/api/` 为后端网关入口：OAuth 回调与 AI 调用都走 `/api/*`

---

## 3. 系统架构（Architecture）

### 3.1 组件
1) **Nginx（入口网关）**
   - 托管静态站（`/`）
   - 反代 FastAPI（`/api/`）
   - 反代 WordPress（`/blog/`）
2) **FastAPI（统一后端服务）**
   - OAuth 登录（第一版 GitHub；后续 Google/WeChat）
   - 会话管理（HttpOnly Cookie + Access/Refresh）
   - 用户体系（user/identity）
   - 用量限制（每日免费 5 次）
   - 订阅权益（手动开通）
   - 嵌入式 AI 网关（模式识别 + 方案生成 + 代码生成 + 调试建议 + 审计）
   - 硬件推荐与购买链接管理（后续接商家合作）
   - 管理后台 API（仅 admin）
3) **Postgres（业务数据库）**
   - 存用户、身份绑定、refresh token、订阅状态、用量数据、AI 请求、测试题目、推荐商品等
4) **AI 模型服务**
   - MVP 可用 Ollama 做本地 Demo
   - 通过 OpenAI 兼容接口抽象模型供应商
   - 受当前 ECS 资源限制，第一版应使用小模型或外部模型兜底
5) **WordPress（内容系统）**
   - 继续使用 docker compose 的 WordPress + DB
   - 挂载在 `/blog/`（与主站功能解耦）
   - 后续接入 AI 做内容管理：历史博客整理、摘要、标签、推送建议、知识库问答

### 3.2 核心链路（请求流）
**登录：**
静态站 → `/api/auth/{provider}/login` → 第三方授权 → `/api/auth/{provider}/callback` → FastAPI 建立会话（cookie）→ 静态站调用 `/api/me` 获取用户态

**嵌入式 AI 调用：**
静态站 → `/api/ai/embedded/project-plan` → FastAPI（鉴权/订阅/额度/限流）→ 识别用户意图与回答模式 → 组合竞赛/硬件/代码上下文 → 调用模型 → 返回项目方案

**调试辅助：**
静态站 → `/api/ai/embedded/debug` → FastAPI → 模型根据现象、报错、接线和代码片段输出排查顺序

**博客 AI 管理（后续）：**
WordPress 内容 → `/api/blog-ai/*` → FastAPI → 摘要、标签、重发建议、知识库检索

---

## 4. 身份认证与权限（Auth & RBAC）

### 4.1 登录方式（Providers）
- MVP：GitHub OAuth
- 后续：Google OAuth
- 后续：WeChat OAuth（微信开放平台：网站应用扫码）

### 4.2 账号体系（大厂“统一账号 + 多身份绑定”）
一个用户（user）可绑定多个第三方身份（identity）：
- user：站内账户
- identity：第三方账号（github/google/wechat）映射到同一个 user

### 4.3 管理员识别规则（Admin）
管理员判定采用“白名单”最稳：  
- 当 GitHub 登录用户名命中 `TonyDDcui` 时，赋予 `role=admin`
- 其余用户默认 `role=user`

> 备注：后续可扩展 Google 邮箱白名单、微信 openid 白名单，但 MVP 优先以 GitHub 用户名为准。

### 4.4 会话策略（你已选）
使用 **HttpOnly Cookie + Access/Refresh**：
- Access Token：短期（例如 15 分钟）
- Refresh Token：长期（例如 30 天），落库可吊销
- 支持能力：退出登录、吊销 refresh、（后续）退出所有设备

---

## 5. 订阅与用量（Subscription & Usage）

### 5.1 免费额度（阶段 A）
- 规则：登录用户 **每天免费 5 次**
- 计数维度：`user_id + date(YYYY-MM-DD)`
- 超额：返回明确错误（建议 HTTP 402 + `{code:"SUBSCRIPTION_REQUIRED"}`）

### 5.2 订阅逻辑（第一期手动开通）
订阅的最小闭环：
- 用户超额后看到订阅引导页面（静态页 + 调 API）
- 管理员在管理后台为用户开通订阅（`status=active`）
- 订阅 active 用户：更高额度或无限（MVP 可先设为无限）

### 5.3 计费演进（阶段 B）
后续升级为 token/字数计费：
- 记录每次请求的 prompt/completion tokens（若模型接口支持）
- 用量表升级为事件表（usage_events）
- 支持月度额度、套餐差异、精细化限流

---

## 6. 嵌入式 AI 产品与模型服务（Embedded AI Gateway）

### 6.1 模型服务选择
- 本地模型：**Ollama**，用于低成本 Demo 和可展示闭环
- 接入协议：优先 **OpenAI 兼容接口**（对接成本最低、生态最成熟）
- 资源约束：当前 ECS 为 2 核 2G + 4G swap + 3M 带宽，不适合运行大模型；第一版应选小模型或预留云端模型切换能力
- 产品优先级：先让流程能用、能展示，再追求模型质量和商业化能力

### 6.2 AI API 形态
阶段 A（先做）：
- 非流式：`POST /api/ai/embedded/project-plan`
- 非流式：`POST /api/ai/embedded/code`
- 非流式：`POST /api/ai/embedded/debug`

阶段 B（后做）：
- 流式 SSE：`POST /api/ai/embedded/project-plan/stream`
- 博客内容管理：`/api/blog-ai/*`

### 6.3 网关职责（FastAPI）
每次 AI 请求必须经过：
1) 登录校验（无登录直接拒绝）
2) 订阅/额度校验（免费 5 次/天 or 订阅 active）
3) 限流（例如每分钟请求数、并发限制）
4) 判断用户回答模式：
   - `teaching`：用户说“教我”“讲一下”“我不会”等，输出教学式步骤
   - `delivery`：用户说“直接给方案”“我要结果”“帮我落地”等，输出可执行方案
   - `auto`：默认根据上下文自动判断
5) 识别项目场景：蓝桥杯单片机组、电子设计竞赛、智能车、课程设计、毕业设计等
6) 识别硬件生态：STM32、ESP32、NXP RT1064
7) 生成结构化结果：硬件清单、购买链接、接线、电路注意事项、代码、调试步骤
8) 记录审计（user_id、时间、场景、模型、耗时、状态码、错误原因）
9) 调用模型并返回

### 6.4 首批支持范围
- **主控**：STM32、ESP32、NXP RT1064
- **竞赛**：蓝桥杯单片机组、全国大学生电子设计竞赛、智能车训练
- **输出代码**：第一版必须生成代码，可先从示例代码、关键函数、工程骨架开始
- **代码风格**：STM32 第一版优先标准库，ESP32 第一版优先 Arduino for ESP32，NXP RT1064 第一版优先 MCUXpresso SDK；STM32 HAL 放到后续扩展
- **测试集**：蓝桥杯官网下载的历年单片机组省赛和国赛 `.doc` 题目
- **购买链接**：第一版由 AI 根据硬件名称生成淘宝搜索链接，后续再接商家合作或商品库

### 6.5 推荐输出格式
```json
{
  "mode": "teaching | delivery",
  "scenario": "lanqiao_mcu | electronic_design | smart_car | general",
  "mcu_family": "STM32 | ESP32 | NXP_RT1064",
  "summary": "项目方案摘要",
  "hardware_plan": [],
  "purchase_links": [
    {
      "source": "taobao",
      "keyword": "模块搜索关键词",
      "url": "https://s.taobao.com/search?q=..."
    }
  ],
  "wiring_plan": [],
  "circuit_notes": [],
  "code": [],
  "debug_steps": [],
  "risks": []
}
```

### 6.6 商业化方向
- 大学生为竞赛、课程设计、毕业设计购买更强的嵌入式 AI 模型或服务
- 与硬件商家合作，在硬件推荐清单中优先展示合作商品
- 第一阶段只做象征性订阅控制，不接真实支付

---

## 7. 管理后台（Admin Console）

### 7.1 形态
第一期：管理后台网页（仅管理员可见）
- 页面：`/admin`（静态站提供 UI）
- 数据：通过调用 `/api/admin/*` 获取与操作

### 7.2 功能清单（MVP）
- 用户列表：注册时间、绑定 provider、最后登录
- 订阅管理：为指定 user 开通/停用订阅
- 用量查看：按天查看某用户已使用次数（阶段 A）
- AI 请求审计：查看用户输入、场景、模式、模型、耗时、状态
- 测试集管理：导入和查看蓝桥杯等竞赛题目测试结果

---

## 8. 数据模型（Postgres）（MVP 建议表）

> 具体字段可在实现阶段细化，MVP 最少需要以下实体。

1) `users`
   - `id` (pk)
   - `role` (`admin|user`)
   - `created_at`, `last_login_at`
2) `identities`
   - `id` (pk)
   - `user_id` (fk)
   - `provider` (`github|google|wechat`)
   - `provider_user_id`（github id / google sub / wechat openid）
   - `email`（可空）, `username`（可空）, `avatar_url`（可空）
3) `refresh_tokens`
   - `id` (pk)
   - `user_id` (fk)
   - `token_hash`
   - `expires_at`
   - `revoked_at`（可空）
4) `subscriptions`
   - `user_id` (pk/fk)
   - `plan` (`free|pro`)
   - `status` (`none|active|expired|canceled`)
   - `started_at`, `expires_at`
5) `usage_daily`
   - `user_id`
   - `date`
   - `count`
   - unique(`user_id`, `date`)
6) `ai_requests`
   - `id` (pk)
   - `user_id` (fk)
   - `mode` (`teaching|delivery|auto`)
   - `scenario` (`lanqiao_mcu|electronic_design|smart_car|general`)
   - `mcu_family` (`STM32|ESP32|NXP_RT1064|unknown`)
   - `prompt`
   - `response_summary`
   - `model`
   - `latency_ms`
   - `status` (`success|failed`)
   - `created_at`
7) `hardware_products`（后续商家合作）
   - `id` (pk)
   - `name`
   - `category`
   - `mcu_family`（可空）
   - `source` (`taobao`)
   - `purchase_url`
   - `partner`（可空）
   - `priority`
8) `contest_test_cases`
   - `id` (pk)
   - `contest` (`lanqiao_mcu|electronic_design|smart_car`)
   - `level` (`provincial|national|training`)
   - `year`
   - `title`
   - `source_url`
   - `source_format` (`doc`)
   - `problem_text`
   - `expected_capabilities`
9) `blog_ai_tasks`（后续）
   - `id` (pk)
   - `post_id`
   - `task_type` (`summary|tags|rewrite|publish_plan|knowledge_index`)
   - `status`
   - `result`
   - `created_at`

---

## 9. 接口清单（API Surface）（MVP）

### 9.1 公共接口
- `GET /api/me`：获取当前登录用户
- `POST /api/auth/logout`：退出

### 9.2 OAuth
- `GET /api/auth/github/login`
- `GET /api/auth/github/callback`
- `GET /api/auth/google/login`（阶段 B）
- `GET /api/auth/google/callback`（阶段 B）
- `GET /api/auth/wechat/login`（阶段 B）
- `GET /api/auth/wechat/callback`（阶段 B）

### 9.3 AI
- `POST /api/ai/embedded/project-plan`：根据自然语言需求生成嵌入式项目方案
- `POST /api/ai/embedded/code`：生成 STM32/ESP32/NXP RT1064 代码或工程骨架
- `POST /api/ai/embedded/debug`：根据报错、现象、接线、代码片段输出调试建议
- `POST /api/ai/embedded/project-plan/stream`（流式 SSE，阶段 B）

### 9.4 硬件推荐（后续商家合作）
- `GET /api/hardware/products`：查询可推荐硬件
- `POST /api/admin/hardware/products`：管理员维护商品与购买链接

### 9.5 订阅（用户侧）
- `GET /api/billing/status`：订阅状态 + 今日剩余免费次数

### 9.6 博客 AI（阶段 B）
- `POST /api/blog-ai/posts/{post_id}/summary`：生成博客摘要
- `POST /api/blog-ai/posts/{post_id}/tags`：生成标签
- `POST /api/blog-ai/posts/{post_id}/publish-plan`：生成重发/推送建议

### 9.7 管理接口（仅 admin）
- `GET /api/admin/users`
- `POST /api/admin/users/{user_id}/subscription`（开通/停用/设置过期时间）
- `GET /api/admin/users/{user_id}/usage`（查看用量）
- `GET /api/admin/ai-requests`（查看 AI 请求审计）
- `POST /api/admin/contest-test-cases`（导入蓝桥杯等测试题）

---

## 10. 部署拓扑（ECS）

### 10.1 Docker Compose（建议）
- `postgres`（业务库）
- `fastapi`（后端）
- `ollama`（本地 Demo 模型服务，可选）
- `wordpress` + `mysql`（现有博客）

### 10.2 Nginx（核心分流）
- `/` → 静态站目录
- `/api/` → fastapi:8000（建议只监听 127.0.0.1）
- `/blog/` → wordpress:80（通过 127.0.0.1:8080 映射）

### 10.3 当前 ECS 信息（来自本地配置）
- 服务商：阿里云 ECS
- 公网 IP：`47.116.97.18`
- SSH 端口：`2222`
- 目标域名：`cuizhexiao.xyz`
- ECS 规格：`2 核 2G`
- 带宽：`3M`
- Swap：已扩展 `4G`

> 安全约束：`ECS config.md` 中包含明文密码，不能写入 README、部署脚本、环境变量示例或公开提交记录。后续建议改为 SSH Key 登录，并将敏感文件移出仓库或加入 `.gitignore`。

### 10.4 推荐服务器目录
```text
/opt/cuizhexiao/
  static/          # Self_Introduction 静态站构建产物
  backend/         # FastAPI 项目代码
  compose.yaml     # FastAPI/Postgres/Ollama/WordPress/MySQL
  .env             # 生产环境密钥，不提交
  nginx/
    cuizhexiao.xyz.conf
```

### 10.5 生产环境变量清单
```env
APP_ENV=production
APP_BASE_URL=https://cuizhexiao.xyz
DATABASE_URL=postgresql+asyncpg://app_user:change_me@postgres:5432/my_blog
JWT_SECRET=change_me
COOKIE_DOMAIN=cuizhexiao.xyz

GITHUB_CLIENT_ID=change_me
GITHUB_CLIENT_SECRET=change_me
OLLAMA_BASE_URL=http://ollama:11434/v1
OLLAMA_MODEL=qwen2.5:1.5b
FREE_DAILY_AI_REQUESTS=5
ADMIN_GITHUB_USERNAME=TonyDDcui

SUPPORTED_MCU_FAMILIES=STM32,ESP32,NXP_RT1064
FIRST_STAGE_CONTESTS=lanqiao_mcu,electronic_design,smart_car
DEFAULT_AI_MODE=auto
HARDWARE_PURCHASE_SOURCE=taobao
HARDWARE_LINK_MODE=ai_generated_search_url
LANQIAO_TEST_CASE_FORMAT=doc
STM32_CODE_STYLE=standard_peripheral_library
ESP32_CODE_STYLE=arduino_for_esp32
NXP_RT1064_CODE_STYLE=mcuxpresso_sdk
```

### 10.6 Nginx 配置要点
```nginx
server {
    listen 443 ssl http2;
    server_name cuizhexiao.xyz www.cuizhexiao.xyz;

    root /opt/cuizhexiao/static;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /blog/ {
        proxy_pass http://127.0.0.1:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 10.7 首次部署步骤
1. 域名解析：将 `cuizhexiao.xyz` 和 `www.cuizhexiao.xyz` A 记录指向 `47.116.97.18`
2. ECS 安全组：开放 `80`、`443`，`2222` 仅允许可信来源 IP
3. 安装基础软件：Docker、Docker Compose、Nginx、Certbot
4. 上传静态站到 `/opt/cuizhexiao/static`
5. 创建 `/opt/cuizhexiao/.env`，填入数据库、OAuth、JWT、Ollama 等密钥
6. 启动 Docker Compose，确认 Postgres、FastAPI、Ollama、WordPress 正常
7. 配置 Nginx 并申请 HTTPS 证书
8. 验证 `/`、`/api/me`、`/blog/wp-login.php`

---

## 11. 风险与降低出错率策略（Ops Strategy）

1) **故障隔离**
   - WordPress 与 FastAPI/AI 分离，互不影响
2) **统一入口**
   - 所有业务 API 都走 `/api/`，便于日志与排错
3) **稳定优先**
   - 先做“次数计费 A”，后做“token 计费 B”
4) **可回滚**
   - 所有配置与服务用 compose 管理，版本可控
5) **可观测**
   - FastAPI 记录关键日志：登录、AI 调用、订阅变更
   - AI 请求需记录模式、场景、主控类型和生成质量评测结果
   - 后续可加 Prometheus/Grafana（非 MVP）

---

## 12. 里程碑（Milestones）

### M0：安全与仓库整理
- 将 `ECS config.md`、`SSL/*.key`、`.env` 从公开提交范围移除
- 新增 `.gitignore`，排除密钥、证书私钥、数据库备份、运行日志
- ECS 改用 SSH Key 登录，密码登录至少限制来源 IP

### M1：基础网关与路由打通
- Nginx `/` + `/api/` + `/blog/` 正常
- 静态站通过 HTTPS 可访问
- WordPress 登录页 `/blog/wp-login.php` 正常
- FastAPI 健康检查接口可访问
- Postgres 跑通，FastAPI 可连接数据库

### M2：后端骨架与数据模型
- FastAPI 项目结构完成：config、db、auth、users、billing、ai、admin
- 数据库迁移工具完成（建议 Alembic）
- 创建 `users`、`identities`、`refresh_tokens`、`subscriptions`、`usage_daily`、`ai_requests`
- 完成基础日志、错误码和统一响应格式

### M3：GitHub 登录 + 会话
- GitHub OAuth 跑通
- GitHub 用户名 `TonyDDcui` 自动识别为管理员
- `/api/me` 可返回当前用户、角色、订阅状态
- `POST /api/auth/logout` 可吊销 refresh token

### M4：嵌入式 AI 方案生成（阶段 A：可展示闭环）
- AI 网关可通过 OpenAI 兼容接口调用模型
- 登录后可调用 `POST /api/ai/embedded/project-plan`
- 支持 `teaching` 和 `delivery` 两种模式
- 支持 STM32、ESP32、NXP RT1064 的基础方案生成
- 输入蓝桥杯单片机组题目后可输出硬件清单、购买链接、接线说明、代码和调试步骤
- 未登录访问 `/api/ai/*` 必须被拒绝
- 普通用户每日免费 5 次
- 超额返回 `402` 与 `{code:"SUBSCRIPTION_REQUIRED"}`
- 记录 AI 调用审计日志：用户、场景、模式、模型、耗时、成功/失败

### M5：测试集 + 订阅（手动开通）+ 管理后台
- 导入历年蓝桥杯单片机组省赛和国赛题目作为测试集
- 管理员可查看 AI 请求记录和测试结果
- `/admin` 仅管理员可见
- `GET /api/admin/users` 返回用户列表
- 管理员可为用户开通、停用、设置订阅过期时间
- `GET /api/admin/users/{user_id}/usage` 可查看按日用量
- 用户侧 `GET /api/billing/status` 返回订阅状态与今日剩余额度

### M6：阶段 B（博客 AI + 商品合作 + token 计费）
- 增加 `/api/ai/embedded/project-plan/stream`
- 增加 WordPress AI 内容管理能力：摘要、标签、重发建议、知识库
- 增加硬件商品库和商家合作推荐
- Google OAuth 与 WeChat OAuth 接入
- 增加 `usage_events`，记录请求级明细
- 支持 token/字数统计
- 支持按月额度、套餐差异和更细限流

---

## 13. 实施任务拆解（Implementation Backlog）

### 13.1 仓库与部署基线
- [ ] 新增 `.gitignore`
- [ ] 拆分生产密钥到 `.env`
- [ ] 准备 `compose.yaml`
- [ ] 准备 Nginx 站点配置
- [ ] 准备一键部署说明或脚本

### 13.2 FastAPI 后端
- [ ] 建立项目结构
- [ ] 接入配置管理（建议 Pydantic Settings）
- [ ] 接入 Postgres 和迁移
- [ ] 实现统一错误码
- [ ] 实现健康检查接口

### 13.3 Auth
- [ ] GitHub OAuth
- [ ] HttpOnly Cookie 会话
- [ ] Refresh Token 落库和吊销
- [ ] 管理员白名单
- [ ] Google OAuth（阶段 B）
- [ ] WeChat OAuth（阶段 B）

### 13.4 Billing & Usage
- [ ] `usage_daily` 计数
- [ ] 免费额度校验
- [ ] 订阅状态校验
- [ ] 超额错误响应
- [ ] 管理员手动开通订阅

### 13.5 Embedded AI Gateway
- [ ] Ollama 本地部署或云端模型接入
- [ ] OpenAI 兼容接口连通
- [ ] AI 请求鉴权
- [ ] 次数扣减与审计
- [ ] 回答模式识别：`teaching` / `delivery`
- [ ] STM32 方案生成
- [ ] ESP32 方案生成
- [ ] NXP RT1064 方案生成
- [ ] 硬件清单和购买链接输出
- [ ] AI 生成淘宝搜索链接
- [ ] 接线和电路说明输出
- [ ] 代码生成接口
- [ ] STM32 标准库代码生成
- [ ] ESP32 Arduino 代码生成
- [ ] NXP RT1064 MCUXpresso SDK 代码生成
- [ ] 调试建议接口
- [ ] 流式方案生成接口（阶段 B）

### 13.6 测试集与评测
- [ ] 从蓝桥杯官网下载历年单片机组省赛 `.doc` 题目
- [ ] 从蓝桥杯官网下载历年单片机组国赛 `.doc` 题目
- [ ] 建立 `.doc` 测试题导入和文本提取格式
- [ ] 设计方案质量评分维度：可落地性、硬件完整性、接线正确性、代码可用性、调试价值
- [ ] 管理员后台查看测试结果

### 13.7 前端与管理后台
- [ ] 静态站登录入口
- [ ] 用户态展示
- [ ] 嵌入式 AI 项目需求输入页
- [ ] 教学模式/落地模式切换
- [ ] 方案结果展示：硬件、购买链接、接线、代码、调试
- [ ] 订阅提示页面
- [ ] 管理后台用户列表
- [ ] 管理后台订阅操作

---

## 14. 配置清单（需要准备的 Key/回调地址）

> 回调 URL 都建议使用：`https://cuizhexiao.xyz/api/auth/<provider>/callback`

- GitHub OAuth：Client ID / Client Secret
- Google OAuth：Client ID / Client Secret（阶段 B）
- 微信开放平台（网站应用）：AppID / AppSecret + 回调域名配置（阶段 B）
- JWT Secret：至少 32 字节随机字符串
- 数据库账号与密码：仅写入服务器 `.env`
- Ollama 模型名：根据 2 核 2G + 4G swap 规格选择小模型，或切换云端模型
- 蓝桥杯单片机组历年省赛/国赛 `.doc` 题目：从官网下载
- 硬件购买链接来源：第一版由 AI 生成淘宝搜索链接，后续接商家合作
- STM32 代码生成风格：第一版使用标准库，后续再考虑 HAL
- ESP32 代码生成风格：第一版使用 Arduino for ESP32
- NXP RT1064 代码生成风格：第一版使用 MCUXpresso SDK

---

## 15. 测试与验收标准（Acceptance Criteria）

### 15.1 路由验收
- `/` 正常返回静态站
- `/blog/wp-login.php` 正常（WordPress 不受影响）
- `/api/me` 未登录返回未认证，登录后返回用户信息

### 15.2 权限验收
- 未登录访问 `/api/ai/*` 必须被拒绝
- 普通用户访问 `/api/admin/*` 必须被拒绝
- 管理员登录后可访问 `/admin` 和 `/api/admin/*`

### 15.3 嵌入式 AI 验收
- 输入蓝桥杯单片机组题目后，系统能输出硬件清单、购买链接、接线说明、代码和调试步骤
- 用户要求“教我”时，系统输出教学式解释和学习路径
- 用户要求“直接给方案”时，系统输出可落地方案，减少背景讲解
- 对 STM32、ESP32、NXP RT1064 至少各有一个可演示案例
- STM32 代码第一版优先输出标准库示例代码或工程骨架
- ESP32 代码第一版优先输出 Arduino for ESP32 示例
- NXP RT1064 代码第一版优先输出 MCUXpresso SDK 示例
- 调试输出包含可执行的排查顺序，而不是泛泛建议

### 15.4 用量与订阅验收
- 登录用户每日免费 5 次可正常使用 AI
- 第 6 次返回订阅提示
- 管理员开通订阅后用户恢复可用
- 管理员停用订阅后用户重新受免费额度限制

### 15.5 运维验收
- Docker Compose 重启后服务可恢复
- Nginx reload 不影响已有 Docker 服务
- FastAPI 日志能定位登录、AI 调用、订阅变更
- `.env`、证书私钥、ECS 密码未进入公开仓库

---

## 16. 当前待确认问题
- WordPress 当前是否已经在 ECS 上运行？如果已运行，需要确认容器名、端口和数据库位置
- `code.html` 是否就是第一版主页的最终原型，还是还要合并 `Self_Introduction` 仓库
- 蓝桥杯官网 `.doc` 题目是否已经下载到本地；如果已下载，需要确认存放目录

