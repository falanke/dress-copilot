# DressCopilot 一键部署指南

快速将DressCopilot部署到云端，让你可以在任何地方访问测试。

## 🚀 推荐方案

- **前端** → [Vercel](https://vercel.com)（免费、快速、全球CDN）
- **后端** → [Railway](https://railway.app)（免费套餐$5/月额度，支持SQLite）

---

## 📦 部署步骤

### 第一步：部署后端到Railway

#### 1. 准备Railway账号

1. 访问 https://railway.app
2. 使用GitHub账号登录
3. 新用户有 $5/月 免费额度

#### 2. 创建新项目

1. 点击 "New Project"
2. 选择 "Deploy from GitHub repo"
3. 授权Railway访问你的GitHub仓库
4. 选择 `dress-copilot` 仓库
5. 选择分支: `claude/web-app-for-beginners-Jg5cz`

#### 3. 配置后端服务

1. Railway会自动检测到项目
2. 点击 "Add variables" 添加环境变量：
   ```
   ZHIPU_API_KEY=你的智谱API密钥
   JWT_SECRET=随机生成的安全密钥（如：your-super-secret-jwt-key-change-this）
   ```

3. 点击项目名称，进入项目设置
4. 在 "Settings" → "Root Directory" 设置为: `backend`
5. 在 "Settings" → "Start Command" 设置为: `npm run start`

#### 4. 部署

1. Railway会自动开始构建和部署
2. 等待部署完成（约1-2分钟）
3. 点击 "Generate Domain" 生成公开访问域名
4. 记下你的后端URL，例如: `https://dress-copilot-backend.up.railway.app`

#### 5. 验证后端

访问你的后端URL，应该看到：
```json
{
  "status": "ok",
  "service": "DressCopilot API",
  "version": "0.2.0"
}
```

---

### 第二步：部署前端到Vercel

#### 1. 准备Vercel账号

1. 访问 https://vercel.com
2. 使用GitHub账号登录
3. 完全免费，无限流量

#### 2. 导入项目

1. 点击 "Add New..." → "Project"
2. 找到 `dress-copilot` 仓库，点击 "Import"
3. 在配置页面：
   - **Framework Preset**: Vite
   - **Root Directory**: 点击 "Edit"，选择 `webapp`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### 3. 配置环境变量

在 "Environment Variables" 部分添加：

```
Name: VITE_API_URL
Value: https://你的Railway后端域名
```

例如：
```
VITE_API_URL=https://dress-copilot-backend.up.railway.app
```

#### 4. 部署

1. 点击 "Deploy"
2. 等待构建和部署完成（约1-2分钟）
3. 部署成功后会显示你的应用URL

#### 5. 访问应用

Vercel会生成一个域名，例如：
```
https://dress-copilot.vercel.app
```

🎉 **完成！** 现在你可以在任何地方访问你的应用了！

---

## 🔧 后续配置

### 绑定自定义域名（可选）

**Vercel**:
1. 在项目设置 → Domains
2. 添加你的域名
3. 按照指引配置DNS

**Railway**:
1. 在项目设置 → Settings → Networking
2. 添加自定义域名
3. 配置CNAME记录

### 更新部署

**自动部署**（推荐）:
- 当你推送代码到GitHub时，Vercel和Railway会自动重新部署

**手动部署**:
- Vercel: 在项目页面点击 "Redeploy"
- Railway: 在项目页面点击 "Deploy"

---

## 📊 监控和日志

### 查看Railway后端日志

1. 进入Railway项目
2. 点击 "Deployments"
3. 选择最新的部署
4. 点击 "View Logs"

### 查看Vercel前端日志

1. 进入Vercel项目
2. 点击 "Deployments"
3. 选择部署查看详情

---

## 💰 费用说明

### Railway免费额度
- 每月 $5 免费额度
- 够运行一个小型后端服务
- 超额后会暂停服务（可升级付费计划）

### Vercel免费套餐
- 无限带宽
- 100GB存储
- 自动HTTPS
- 全球CDN
- 完全免费（个人项目）

---

## 🐛 常见问题

### Q: Railway部署失败？

**检查清单**:
1. Root Directory 是否设置为 `backend`
2. 环境变量是否配置正确（ZHIPU_API_KEY, JWT_SECRET）
3. 查看部署日志找到错误信息

**常见错误**:
```
Error: Cannot find module
```
解决：检查package.json是否在backend目录下

### Q: Vercel部署成功但页面空白？

**检查清单**:
1. Root Directory 是否设置为 `webapp`
2. VITE_API_URL 环境变量是否正确配置
3. 打开浏览器控制台查看错误

**解决方法**:
1. 检查环境变量（必须以 VITE_ 开头）
2. 重新部署：Settings → Redeploy

### Q: API调用失败，CORS错误？

**原因**: 后端URL配置错误

**解决**:
1. 确认 Railway 后端已生成域名
2. 在 Vercel 的环境变量中更新 VITE_API_URL
3. 重新部署前端

### Q: 后端数据库不持久化？

Railway的文件系统是持久化的，但如果你更改了部署或重新部署，数据可能会丢失。

**建议**:
- 生产环境使用PostgreSQL（Railway提供）
- 或者使用外部数据库服务

---

## 🔐 安全建议

1. **定期更新JWT_SECRET**: 在Railway环境变量中更改
2. **保护API密钥**: 不要在代码中硬编码
3. **使用HTTPS**: Vercel和Railway都默认提供
4. **启用认证**: 应用已内置JWT认证

---

## 📞 需要帮助？

如果遇到问题：
1. 查看部署日志
2. 检查环境变量配置
3. 确认分支和根目录设置正确

---

## 🎯 下一步

部署完成后，你可以：
- ✅ 在任何设备上访问应用
- ✅ 分享链接给朋友测试
- ✅ 绑定自定义域名
- ✅ 配置自动化CI/CD

**快乐部署！** 🚀
