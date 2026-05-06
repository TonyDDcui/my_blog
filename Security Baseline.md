# Security Baseline

本文记录 `cuizhexiao.xyz` 项目的安全基线，目标是在 MVP 阶段避免把 ECS 密码、证书私钥、环境变量和数据库备份提交到公开仓库。

## 已知敏感文件

- `ECS config.md`：包含 ECS 连接信息和明文密码。
- `ECS文件`：历史 ECS 相关本地文件。
- `SSL/*.key`：TLS 私钥。
- `SSL/*.pem`：证书文件，公开仓库中也建议避免提交。
- `.env` / `.env.*`：生产环境密钥、数据库密码、OAuth Secret、JWT Secret。

## 仓库排除策略

`.gitignore` 已覆盖：

- ECS 本地配置文件
- SSL 私钥与证书文件
- `.env` 环境变量文件
- 数据库备份
- 日志和运行目录
- Python / Node 常见构建产物
- 编辑器和系统临时文件

## 必做安全动作

1. 将 `ECS config.md` 中的密码迁移到本地密码管理器。
2. ECS 优先改为 SSH Key 登录。
3. 若暂时保留密码登录，安全组中 `2222` 端口只允许可信来源 IP。
4. 生产 `.env` 只放在服务器，例如 `/opt/cuizhexiao/.env`。
5. `SSL/*.key` 不提交公开仓库，只保存在服务器或本地安全目录。
6. 如果敏感文件已经进入 Git 历史，需要后续单独做历史清理和密钥轮换。

## ECS 最小暴露面

- `80`：HTTP，建议只用于 HTTPS 跳转。
- `443`：HTTPS，对公网开放。
- `2222`：SSH，只允许可信 IP。
- FastAPI、Postgres、WordPress DB、Ollama 不直接暴露公网。

## 应用安全要求

- Cookie 必须设置 `HttpOnly`、`Secure`、`SameSite=Lax`。
- 管理接口必须校验 `role=admin`。
- AI 接口必须先鉴权，再检查额度。
- 所有 AI 请求需要记录用户、时间、模式、场景、主控类型、模型、耗时和错误信息。
- 生产日志不得输出 OAuth Secret、JWT Secret、数据库密码和用户 Cookie。

## 后续增强

- 增加 `.env.example`，只保留变量名和占位值。
- 增加部署前检查脚本，扫描 `.env`、私钥、密码和数据库备份。
- 为 ECS 配置 fail2ban 或等效 SSH 防护。
- 定期轮换 JWT Secret、OAuth Secret 和数据库密码。
