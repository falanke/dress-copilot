# DressCopilot - 程序员穿搭助手

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/falanke/dress-copilot)

一句话描述需求，AI 帮你挑好衣服。

## 📖 项目简介

DressCopilot 是一款面向程序员群体的 AI 穿搭助手 Chrome 插件。通过自然语言描述购物需求，AI 会自动在电商平台为你筛选和推荐合适的商品。

### 核心功能

- 🤖 **AI 理解需求**：用自然语言描述"春季外套，休闲风格，500 以内"
- 👁️ **视觉 Agent**：截图识别页面商品，自动判断匹配度
- 🎯 **精准推荐**：基于风格、价格、品牌智能筛选
- 🔧 **灵活配置**：支持智谱 GLM、阿里 Qwen 等多种模型

### 技术架构

```
Chrome Extension (React)
    ↕
Backend API (Bun + Hono)
    ↕
LLM (Zhipu GLM-4V)
```

## 🚀 快速开始

### 安装插件

1. 克隆仓库并构建
```bash
git clone https://github.com/falanke/dress-copilot.git
cd dress-copilot/extension
npm install
npm run build
```

2. 加载到 Chrome
   - 打开 `chrome://extensions/`
   - 启用"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择 `dist` 目录

### 配置 API Key

1. 获取智谱 API Key: https://open.bigmodel.cn/
2. 在插件设置中填入 Key
3. 保存配置

### 使用方法

1. 打开唯品会 (vip.com)
2. 点击插件图标
3. 输入你的需求（如"帮我挑几件春季外套，休闲风格，500 以内"）
4. 点击"开始挑选"
5. AI 自动分析并推荐商品

## 🛠️ 开发

### 项目结构

```
dress-copilot/
├── extension/           # Chrome 插件
│   ├── src/
│   │   ├── popup/     # 弹窗界面
│   │   ├── content/    # Content Script
│   │   └── lib/        # 工具函数
│   └── manifest.json
├── backend/            # 后端 API
│   └── src/
│       └── services/    # LLM 调用
└── docs/              # 文档
```

### 运行开发环境

```bash
# 插件开发
cd extension
npm install
npm run dev

# 后端开发
cd backend
bun install
bun run dev
```

## 📝 文档

- [产品需求文档 (PRD)](./docs/PRD.md)
- [技术架构设计](./docs/STRUCTURE.md)
- [AI 模型配置](./docs/AI-CONFIG.md)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

Made with ❤️ by [FuhanL](https://github.com/falanke)
