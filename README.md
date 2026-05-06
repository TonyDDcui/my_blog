# my_blog

`my_blog` 是 `cuizhexiao.xyz` 的个人作品集与嵌入式 AI 产品规划仓库。

项目第一优先级是个人作品集和技术展示，第二优先级是逐步发展成可商业化的嵌入式 AI 工具。产品面向大学生、嵌入式初学者、电子竞赛参与者，以及主业不在嵌入式但需要快速落地项目的人群。

详细落地方案见 [`Project Plan.md`](./Project%20Plan.md)。

## 项目定位

- 个人作品集：展示个人主页、技术能力、项目经历和博客内容。
- 嵌入式 AI 助手：用户用自然语言描述项目目标，系统输出可落地的嵌入式方案。
- 竞赛辅助：优先服务蓝桥杯单片机组、全国大学生电子设计竞赛和智能车相关训练。
- 内容管理：WordPress 继续作为博客系统，后续接入 AI 做历史博客整理、摘要、标签和推送辅助。

## AI 产品能力

第一版 AI 不做泛聊天，重点做“嵌入式项目落地”：

- 根据用户需求判断回答模式：用户说“教我”时输出教学式步骤；用户只要结果时直接输出落地方案。
- 输出硬件规划：推荐主控、传感器、执行器、通信模块、电源和辅助模块。
- 输出购买清单：给出后期需要用到的硬件购买链接或可搜索的购买关键词。
- 输出连接方案：说明模块怎么接、引脚怎么连、电路注意事项是什么。
- 输出代码：第一版需要生成 STM32、ESP32、NXP RT1064 相关示例代码或工程骨架。
- 协助调试：根据报错、现象、波形或接线描述，给出排查顺序和修复建议。

首批支持方向：

- 主控生态：`STM32`、`ESP32`、`NXP RT1064`
- 竞赛场景：蓝桥杯单片机组、省赛/国赛题目训练、电子设计竞赛、智能车训练
- 测试集：从蓝桥杯官网下载的历年单片机组省赛和国赛 `.doc` 题目
- 购买来源：第一版由 AI 根据硬件名称生成淘宝搜索链接
- 代码生成：STM32 第一版优先标准库，ESP32 第一版优先 Arduino for ESP32，NXP RT1064 第一版优先 MCUXpresso SDK

## 目标架构

```text
User
  |
  v
Nginx on ECS
  |-- /       -> static site
  |-- /api/   -> FastAPI
  |-- /blog/  -> WordPress

FastAPI
  |-- Postgres: users, sessions, subscriptions, usage, project plans
  |-- AI Gateway: embedded project planning, code generation, debugging
  |-- Ollama or remote model provider

WordPress
  |-- MySQL/MariaDB
  |-- AI-assisted content management
```

## 仓库文件

- [`Project Plan.md`](./Project%20Plan.md)：项目目标、架构、API、部署、里程碑和验收标准。
- [`Product Plan.md`](./Product%20Plan.md)：产品定位、市场判断、商业化路径和 90 天路线图。
- [`MVP Architecture.md`](./MVP%20Architecture.md)：MVP 技术架构、模块划分和请求流。
- [`Embedded AI Flow.md`](./Embedded%20AI%20Flow.md)：嵌入式 AI 输入输出协议和结构化结果格式。
- [`Lanqiao Dataset.md`](./Lanqiao%20Dataset.md)：蓝桥杯单片机组测试集整理、标注和评测规范。
- [`Lanqiao Test Cases Template.csv`](./Lanqiao%20Test%20Cases%20Template.csv)：蓝桥杯测试集清单模板。
- [`Demo Cases.md`](./Demo%20Cases.md)：STM32、ESP32、NXP RT1064 三个 MVP 演示案例。
- [`Security Baseline.md`](./Security%20Baseline.md)：敏感文件、ECS、证书和环境变量安全基线。
- [`DESIGN.md`](./DESIGN.md)：站点视觉系统与 UI 风格说明。
- [`code.html`](./code.html)：当前静态页面原型。
- `SSL/`：本地证书资料目录，注意不要公开提交私钥。
- `ECS config.md`：本地 ECS 连接信息，包含敏感信息，不应提交到公开仓库。

## ECS 信息

- 服务商：阿里云 ECS
- 公网 IP：`47.116.97.18`
- SSH 端口：`2222`
- 目标域名：`cuizhexiao.xyz`
- 规格：`2 核 2G`，带宽 `3M`
- Swap：已扩展 `4G`
- 推荐 SSH 方式：使用密钥登录，关闭密码登录或至少限制来源 IP。

> 安全提醒：不要把 ECS 密码、私钥、数据库密码、OAuth Secret、JWT Secret 写入 README、代码或公开仓库。已经存在的敏感文件建议迁移到本地安全位置，并通过 `.gitignore` 排除。

## MVP 功能

1. 静态主页可通过 HTTPS 访问。
2. WordPress 可通过 `https://cuizhexiao.xyz/blog/` 访问。
3. FastAPI 暴露 `/api/me`、GitHub 登录、退出登录和嵌入式 AI 接口。
4. 用户输入项目目标后，AI 能生成硬件清单、接线说明、代码和调试建议。
5. 系统支持“教学模式”和“落地模式”两种回答风格。
6. 登录用户每天免费调用 AI 5 次，超额后提示订阅。
7. 管理员可查看用户、用量，并手动开通或停用订阅。

## 推荐部署方式

生产环境建议使用 Nginx + Docker Compose：

- Nginx 安装在 ECS 主机，负责 HTTPS、静态资源和路径分流。
- FastAPI、Postgres、Ollama、WordPress、MySQL/MariaDB 使用 Docker Compose 管理。
- FastAPI 与 WordPress 不直接暴露公网端口，只由 Nginx 反代访问。

建议目录结构：

```text
/opt/cuizhexiao/
  static/
  backend/
  compose.yaml
  .env
  nginx/
```

## 环境变量

实际变量以实现阶段代码为准，MVP 至少需要：

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
HARDWARE_PURCHASE_SOURCE=taobao
HARDWARE_LINK_MODE=ai_generated_search_url
LANQIAO_TEST_CASE_FORMAT=doc
STM32_CODE_STYLE=standard_peripheral_library
ESP32_CODE_STYLE=arduino_for_esp32
NXP_RT1064_CODE_STYLE=mcuxpresso_sdk
```

## 开发与落地顺序

1. 先完成 Nginx 对 `/`、`/api/`、`/blog/` 的路径分流。
2. 再搭建 FastAPI、Postgres 和基础用户表。
3. 优先接入 GitHub OAuth，跑通管理员登录和 `/api/me`。
4. 实现嵌入式 AI 方案生成接口，优先支持 STM32、ESP32、NXP RT1064。
5. 用蓝桥杯官网下载的历年单片机组省赛和国赛 `.doc` 题目做第一批测试集。
6. 接入每日 5 次免费额度、管理后台和手动订阅。
7. 后续补 Google、WeChat、SSE 流式输出、token 计费和商家商品链接推荐。

## 验收标准

- `https://cuizhexiao.xyz/` 返回静态主页。
- `https://cuizhexiao.xyz/blog/wp-login.php` 可访问。
- 未登录访问 `/api/ai/*` 被拒绝。
- 输入蓝桥杯单片机组题目后，AI 能输出硬件方案、接线说明、代码和调试步骤。
- 用户要求“教我”时返回教学式解释，用户要求“直接给方案”时返回落地方案。
- 登录用户每天可免费调用 AI 5 次。
- 超额后返回订阅提示，管理员开通订阅后恢复可用。
- 非管理员无法访问 `/admin` 和 `/api/admin/*`。

## 安全清单

- 迁移 `ECS config.md` 中的密码到本地密码管理器。
- 不公开提交 `SSL/*.key`、`.env`、数据库备份和 OAuth Secret。
- ECS 安全组只开放 `80`、`443` 和受限来源的 `2222`。
- Nginx 开启 HTTPS，Cookie 使用 `HttpOnly`、`Secure`、`SameSite=Lax`。
- FastAPI 管理接口必须做 `role=admin` 校验。