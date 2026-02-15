# DressCopilot Web 应用

一个为小白用户设计的AI穿搭助手Web应用，帮助用户在电商平台上快速找到符合自己风格的商品。

## ✨ 主要特性

- 🎨 **风格参考上传**：上传最多5张你喜欢的穿搭风格照片
- 🔍 **智能推荐**：AI结合你的风格偏好和需求描述，从电商页面推荐商品
- 🌐 **内嵌浏览器**：在应用内直接浏览唯品会等电商网站
- 👤 **用户系统**：保存你的搜索历史和偏好设置
- 🔐 **开箱即用**：平台统一管理API Key，无需技术配置

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm 或 yarn

### 1. 安装依赖

```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../webapp
npm install
```

### 2. 配置环境变量

**后端配置** (`backend/.env`)：

```bash
# 复制示例配置
cd backend
cp .env.example .env

# 编辑 .env 文件，添加你的智谱API Key
ZHIPU_API_KEY=你的智谱API密钥
JWT_SECRET=随机生成的密钥
```

**前端配置** (`webapp/.env`)：

```bash
# 复制示例配置
cd webapp
cp .env.example .env

# 默认配置指向本地后端
VITE_API_URL=http://localhost:3000
```

### 3. 启动应用

**启动后端服务**：

```bash
cd backend
npm run dev
# 服务运行在 http://localhost:3000
```

**启动前端应用**（新终端窗口）：

```bash
cd webapp
npm run dev
# 应用运行在 http://localhost:5173
```

### 4. 使用应用

1. 打开浏览器访问 `http://localhost:5173`
2. 注册一个新账户或登录
3. 进入主界面后：
   - 左侧是内嵌浏览器，默认打开唯品会
   - 右侧是AI助手聊天框
4. 使用步骤：
   - 上传1-5张你喜欢的穿搭风格照片
   - 在需求描述框输入你的具体需求（如"春季外套，休闲风格，500元以内"）
   - 点击"开始分析"按钮
   - AI会分析当前浏览器页面的商品，推荐最符合你风格的商品

## 📁 项目结构

```
dress-copilot/
├── backend/              # 后端服务
│   ├── src/
│   │   ├── index.ts     # 主入口，路由定义
│   │   ├── auth.ts      # 用户认证
│   │   ├── db.ts        # 数据库配置
│   │   ├── types.ts     # TypeScript类型
│   │   └── services/
│   │       └── ai.ts    # AI视觉分析服务
│   ├── data/            # SQLite数据库文件
│   └── package.json
│
├── webapp/              # 前端应用
│   ├── src/
│   │   ├── components/  # React组件
│   │   │   ├── BrowserPanel.tsx  # 内嵌浏览器
│   │   │   └── ChatBox.tsx       # 聊天框
│   │   ├── pages/       # 页面组件
│   │   │   ├── Auth.tsx          # 登录/注册
│   │   │   └── Main.tsx          # 主应用
│   │   ├── lib/
│   │   │   └── api.ts   # API客户端
│   │   ├── types/       # TypeScript类型
│   │   └── App.tsx      # 根组件
│   └── package.json
│
└── extension/           # Chrome插件（原有功能）
```

## 🔧 技术栈

### 前端
- **React 18** + **TypeScript** - UI框架
- **Vite** - 构建工具
- **React Router** - 路由管理
- **Tailwind CSS** - 样式框架
- **Axios** - HTTP客户端

### 后端
- **Hono** - 轻量级Web框架
- **Node.js** - 运行时
- **Better-SQLite3** - 数据库
- **JWT** - 用户认证
- **Bcrypt** - 密码加密

### AI服务
- **智谱GLM-4.6V** - 多模态视觉理解模型

## 💡 使用技巧

1. **风格照片选择**：上传清晰、有代表性的穿搭照片，越能体现你的风格越好
2. **需求描述**：尽量详细描述你的需求，包括：
   - 商品类型（外套、裤子、鞋子等）
   - 风格偏好（休闲、正式、街头等）
   - 价格区间
   - 使用场景（通勤、运动、约会等）
3. **浏览器使用**：在左侧浏览器中先浏览到商品列表页面，再进行AI分析
4. **登录唯品会**：建议在左侧浏览器登录唯品会账户，方便后续收藏推荐的商品

## 🔐 安全说明

- 所有密码使用bcrypt加密存储
- JWT token有效期为7天
- API Key由平台统一管理，用户无需关心
- 数据库存储在本地，仅你可见

## 🤝 常见问题

**Q: 为什么推荐结果不准确？**
A: 请确保：
1. 上传的风格照片能代表你的真实喜好
2. 需求描述足够详细
3. 当前浏览的页面有相关商品

**Q: 如何更换电商平台？**
A: 在内嵌浏览器的地址栏输入其他电商网站URL即可

**Q: API调用失败怎么办？**
A: 检查后端.env文件中的ZHIPU_API_KEY是否配置正确

## 📝 开发计划

- [ ] 支持更多电商平台
- [ ] 添加商品收藏功能
- [ ] 优化AI推荐算法
- [ ] 添加用户风格偏好学习
- [ ] 移动端适配

## 📄 许可证

MIT License

---

**开发者**: DressCopilot Team
**反馈**: 欢迎提Issue或PR
