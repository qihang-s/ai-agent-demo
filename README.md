# 前端 + LangChain Agent（Vivgrid）

这个项目是当前主流的一种架构：

- 前端：Next.js App Router（React 19）
- 后端：Next.js Route Handler（`/api/agent`）
- Agent：LangChain `createAgent` + 工具调用
- 模型供应商：Vivgrid（兼容 OpenAI 的接口端点）

## 1) 安装依赖

```bash
npm install
```

## 2) 配置环境变量

复制示例文件：

```bash
cp .env.example .env.local
```

然后编辑 `.env.local`：

```env
VIVGRID_BASE_URL=https://api.vivgrid.com/v1
VIVGRID_API_KEY=你的_api_key
VIVGRID_MODEL=gpt-4o-mini
```

> 注意：不要把 `.env.local` 提交到仓库。

## 3) 启动项目

```bash
npm run dev
```

打开 `http://localhost:3000`。

## 4) 你会看到什么

- 一个聊天前端页面（`src/app/page.tsx`）
- 请求发送到 `POST /api/agent`
- 后端使用 `src/lib/agent.ts` 中定义的 LangChain Agent
- Agent 会按需调用工具（当前内置：时区时间、数学计算）

## 5) 核心代码位置

- `src/lib/agent.ts`：模型配置、工具定义、`createAgent`
- `src/app/api/agent/route.ts`：接收消息、调用 agent、返回文本
- `src/app/page.tsx`：聊天界面与消息状态管理

## 6) 如何扩展成生产形态

1. 接入真实工具（数据库检索、业务 API、RAG 检索工具）
2. 加入鉴权（NextAuth 或自定义 JWT）
3. 增加可观测性（LangSmith 链路追踪 / 请求日志）
4. 做流式输出（SSE）提升交互体验
5. 加入限流和配额（防刷与成本控制）

## 7) 常见问题

- **401/403**：检查 `VIVGRID_API_KEY` 是否正确
- **404/模型不可用**：更换 `VIVGRID_MODEL`
- **请求超时**：先降低上下文长度，再做流式返回
