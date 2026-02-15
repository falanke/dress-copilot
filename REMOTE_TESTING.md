# 远程测试指南

在另一台电脑上测试DressCopilot Web应用的完整指南。

## 方案一：局域网访问（推荐）⭐

适用于：两台电脑在同一个WiFi网络下

### 步骤 1：在开发机上获取IP地址

**Linux/Mac**:
```bash
# 获取本机IP地址
ip addr show | grep "inet " | grep -v 127.0.0.1
# 或
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows**:
```bash
ipconfig
# 找到 "IPv4 地址"
```

假设你的IP是 `192.168.1.100`

### 步骤 2：启动后端服务（允许远程访问）

在开发机上：

```bash
cd backend

# 创建.env文件（如果还没创建）
cp .env.example .env

# 编辑.env，添加你的智谱API Key
# ZHIPU_API_KEY=your_api_key_here

# 安装依赖
npm install

# 启动后端（监听所有网络接口）
HOST=0.0.0.0 npm run dev
```

后端会运行在 `http://0.0.0.0:3000`（可从局域网访问）

### 步骤 3：启动前端应用

在开发机上，新开一个终端：

```bash
cd webapp

# 创建.env文件，使用开发机的IP地址
cat > .env << EOF
VITE_API_URL=http://192.168.1.100:3000
EOF

# 安装依赖（如果还没安装）
npm install

# 启动前端（已配置为0.0.0.0）
npm run dev
```

前端会显示：
```
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.1.100:5173/
```

### 步骤 4：在测试机上访问

在另一台电脑的浏览器中打开：
```
http://192.168.1.100:5173
```

✅ 完成！你现在可以在测试机上使用Web应用了。

---

## 方案二：使用ngrok内网穿透

适用于：两台电脑不在同一网络，或需要通过互联网访问

### 步骤 1：安装ngrok

访问 https://ngrok.com/ 注册并下载ngrok

**Linux**:
```bash
# 下载并安装
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
tar -xvzf ngrok-v3-stable-linux-amd64.tgz
sudo mv ngrok /usr/local/bin/
```

**Mac**:
```bash
brew install ngrok/ngrok/ngrok
```

**配置认证**:
```bash
ngrok config add-authtoken YOUR_AUTHTOKEN
```

### 步骤 2：启动服务

**终端1 - 启动后端**:
```bash
cd backend
npm run dev
# 后端运行在 localhost:3000
```

**终端2 - 启动后端ngrok隧道**:
```bash
ngrok http 3000
# 会得到一个公网URL，如: https://abc123.ngrok.io
```

**终端3 - 启动前端**:
```bash
cd webapp

# 使用ngrok提供的后端URL
cat > .env << EOF
VITE_API_URL=https://abc123.ngrok.io
EOF

npm run dev
# 前端运行在 localhost:5173
```

**终端4 - 启动前端ngrok隧道**:
```bash
ngrok http 5173
# 会得到一个公网URL，如: https://xyz789.ngrok.io
```

### 步骤 3：在测试机访问

在任何地方打开浏览器，访问前端的ngrok URL：
```
https://xyz789.ngrok.io
```

⚠️ **注意**：
- ngrok免费版会有随机URL，每次重启都会变化
- 免费版有带宽和连接数限制
- 生产环境不建议使用

---

## 方案三：部署到云服务器

适用于：长期测试或演示

### 选择云服务商

推荐：
- **阿里云ECS** (国内速度快)
- **腾讯云** (国内速度快)
- **AWS EC2** (国际化)
- **DigitalOcean** (简单易用)

### 基本部署流程

1. **购买服务器**（推荐配置：2核4G，Ubuntu 22.04）

2. **安装环境**:
```bash
# SSH登录服务器
ssh root@your_server_ip

# 安装Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装PM2（进程管理）
npm install -g pm2
```

3. **部署代码**:
```bash
# 上传代码到服务器
scp -r dress-copilot root@your_server_ip:/opt/

# 或使用git
git clone your_repo_url /opt/dress-copilot
```

4. **配置环境变量**:
```bash
cd /opt/dress-copilot/backend
cp .env.example .env
nano .env  # 编辑配置

cd /opt/dress-copilot/webapp
cat > .env << EOF
VITE_API_URL=http://your_server_ip:3000
EOF
```

5. **启动后端**:
```bash
cd /opt/dress-copilot/backend
npm install
pm2 start npm --name "dress-backend" -- run start
pm2 save
```

6. **构建并启动前端**:
```bash
cd /opt/dress-copilot/webapp
npm install
npm run build

# 使用nginx提供静态文件服务
sudo apt install nginx

# 配置nginx
sudo nano /etc/nginx/sites-available/dress-copilot
```

**Nginx配置示例**:
```nginx
server {
    listen 80;
    server_name your_domain.com;  # 或使用IP

    # 前端静态文件
    location / {
        root /opt/dress-copilot/webapp/dist;
        try_files $uri $uri/ /index.html;
    }

    # 代理后端API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 启用配置
sudo ln -s /etc/nginx/sites-available/dress-copilot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

7. **配置防火墙**:
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

8. **访问应用**:
```
http://your_server_ip
```

---

## 常见问题

### Q: 局域网访问提示"无法连接"？

A: 检查防火墙设置：

**Linux**:
```bash
# 允许端口
sudo ufw allow 3000
sudo ufw allow 5173
```

**Mac**:
```bash
# 系统偏好设置 -> 安全性与隐私 -> 防火墙 -> 防火墙选项
# 允许Node.js接收传入连接
```

**Windows**:
```
控制面板 -> Windows Defender 防火墙 -> 高级设置 -> 入站规则
添加端口 3000 和 5173
```

### Q: 后端API调用失败，提示CORS错误？

A: 确保后端已配置CORS（代码中已包含）。如果还有问题，检查.env中的API_URL是否正确。

### Q: 前端能访问，但API请求404？

A: 检查webapp/.env中的VITE_API_URL是否指向正确的后端地址。记得修改后需要重启前端服务。

### Q: 使用ngrok时速度很慢？

A: ngrok免费版服务器在国外，国内访问会较慢。可以考虑：
1. 使用国内的内网穿透工具（花生壳、natapp等）
2. 升级ngrok付费版
3. 使用局域网访问或云服务器

---

## 快速测试脚本

创建便捷的启动脚本：

**start-dev.sh** (开发机使用):
```bash
#!/bin/bash

# 获取本机IP
HOST_IP=$(ip addr show | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | cut -d/ -f1 | head -1)

echo "🚀 启动DressCopilot开发环境"
echo "📍 本机IP: $HOST_IP"
echo ""

# 启动后端
echo "▶️  启动后端..."
cd backend
HOST=0.0.0.0 npm run dev &
BACKEND_PID=$!

# 等待后端启动
sleep 3

# 创建前端.env
cd ../webapp
cat > .env << EOF
VITE_API_URL=http://$HOST_IP:3000
EOF

# 启动前端
echo "▶️  启动前端..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ 服务已启动！"
echo "📱 在测试机上访问: http://$HOST_IP:5173"
echo ""
echo "按 Ctrl+C 停止服务"

# 等待中断信号
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
```

使用方法：
```bash
chmod +x start-dev.sh
./start-dev.sh
```

---

**祝测试顺利！** 🎉
