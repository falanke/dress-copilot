# DressCopilot - 程序员穿搭助手

> 一句话描述需求，AI 帮你挑好衣服

## 项目概述

DressCopilot 是一个 Chrome 浏览器插件，帮助不擅长购物的男性程序员群体在电商平台自动挑选合适的衣服。

**核心价值：** 省时间、不出错、得体就好

## 技术栈

| 组件 | 技术选择 |
|------|---------|
| 插件框架 | Chrome Extension (Manifest V3) |
| 前端 | React 19 + TypeScript + Tailwind CSS |
| 构建 | Vite |
| 后端 | Bun + Hono |
| AI 模型 | 智谱 GLM-4V (默认) |
| 部署 | Vercel (后端) + Chrome Web Store (插件) |

## 项目结构

```
dress-copilot/
├── extension/           # Chrome 插件
│   ├── src/
│   │   ├── popup/     # 弹窗 UI (Agent, Settings)
│   │   ├── content/   # Content Script (注入页面脚本)
│   │   ├── background/ # Service Worker
│   │   └── lib/       # 工具库 (api, storage, types)
│   └── public/
│       └── icons/     # 图标资源
│
├── backend/            # 后端服务
│   └── src/
│       ├── services/   # AI 服务
│       └── index.ts    # Hono 入口
│
└── docs/               # 文档
    ├── PRD.md
    ├── API.md
    └── STRUCTURE.md
```

## 快速开始

### 1. 安装依赖

```bash
# 后端
cd backend
bun install

# 插件
cd ../extension
bun install
```

### 2. 配置环境变量

创建 `.env` 文件在 `backend/` 目录：

```bash
# 可选：如果需要服务端配置 API Key
ZHIPU_API_KEY=your_api_key_here
PORT=3000
```

### 3. 启动后端服务

```bash
cd backend
bun run dev
# 或生产环境
bun run start
```

后端将在 `http://localhost:3000` 运行

### 4. 开发插件

```bash
cd extension
bun run dev
```

然后：
1. 打开 Chrome，访问 `chrome://extensions/`
2. 开启"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择 `extension/dist` 目录

### 5. 配置插件

1. 点击插件图标，打开弹窗
2. 点击"设置"
3. 输入你的 API Key（智谱 AI 在 https://open.bigmodel.cn 获取）
4. 后端 API 地址：本地开发填 `http://localhost:3000`
5. 点击"测试连接"验证
6. 点击"保存"

### 6. 使用插件

1. 打开支持的电商网站（如唯品会 https://www.vip.com）
2. 点击插件图标
3. 输入你的需求，例如：
   > "帮我挑几件春季外套，休闲风格，FILA 品牌，500 以内"
4. 点击"开始挑选"
5. AI 会分析当前页面并推荐匹配的商品

## 开发指南

### 后端 API

#### POST /api/analyze

分析截图并返回推荐

**请求：**
```json
{
  "image": "data:image/png;base64,...",
  "prompt": "用户需求描述",
  "config": {
    "apiKey": "...",
    "provider": "zhipu"
  }
}
```

**响应：**
```json
{
  "success": true,
  "data": {
    "content": "{ \"recommendations\": [...] }",
    "usage": { "total_tokens": 1234 }
  }
}
```

### 插件开发

**主要模块：**

| 文件 | 说明 |
|------|------|
| `src/popup/Agent.tsx` | 主界面：输入需求、显示结果 |
| `src/popup/Settings.tsx` | 设置页面：配置 API Key |
| `src/lib/api.ts` | 后端 API 调用 |
| `src/lib/storage.ts` | Chrome Storage 封装 |
| `src/content/index.ts` | 注入电商页面的脚本 |
| `src/background/index.ts` | Service Worker |

**构建命令：**
```bash
# 开发模式（热更新）
bun run dev

# 生产构建
bun run build
```

## 部署

### 后端部署到 Vercel

1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 选择 `backend` 目录作为根目录
4. 配置环境变量
5. 部署完成后，获取 API URL

### 插件发布到 Chrome Web Store

1. 构建生产版本：`bun run build`
2. 打包 `extension/dist` 目录
3. 访问 [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
4. 上传 zip 包
5. 填写商店信息
6. 提交审核

## 支持的电商网站

目前支持：
- 唯品会 (vip.com)

计划支持：
- 淘宝
- 京东
- 拼多多

## 贡献

欢迎贡献！请查看 [PRD.md](docs/PRD.md) 了解产品规划。

## License

MIT

---

**DressCopilot** - 让程序员穿得更体体面 🎯
