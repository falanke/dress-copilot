#!/bin/bash

# DressCopilot 开发环境启动脚本

echo "🚀 DressCopilot 开发环境启动"
echo "================================"
echo ""

# 获取本机IP地址（Linux）
HOST_IP=$(ip addr show 2>/dev/null | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | cut -d/ -f1 | head -1)

# 如果上面的命令失败，尝试ifconfig（Mac）
if [ -z "$HOST_IP" ]; then
    HOST_IP=$(ifconfig 2>/dev/null | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
fi

# 如果还是失败，使用localhost
if [ -z "$HOST_IP" ]; then
    HOST_IP="localhost"
    echo "⚠️  无法自动获取IP地址，使用localhost"
else
    echo "📍 本机IP地址: $HOST_IP"
fi

echo ""

# 检查backend目录
if [ ! -d "backend" ]; then
    echo "❌ 错误: 找不到backend目录"
    exit 1
fi

# 检查webapp目录
if [ ! -d "webapp" ]; then
    echo "❌ 错误: 找不到webapp目录"
    exit 1
fi

# 检查backend/.env
if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env 不存在"
    echo "📝 从示例文件创建..."
    cp backend/.env.example backend/.env
    echo "⚠️  请编辑 backend/.env 添加你的智谱API Key:"
    echo "   nano backend/.env"
    echo ""
    read -p "按回车继续（或 Ctrl+C 退出去配置）..."
fi

# 创建webapp/.env
echo "📝 配置前端环境变量..."
cat > webapp/.env << EOF
VITE_API_URL=http://$HOST_IP:3000
EOF

# 检查依赖
echo ""
echo "📦 检查依赖..."

if [ ! -d "backend/node_modules" ]; then
    echo "▶️  安装后端依赖..."
    cd backend
    npm install
    cd ..
fi

if [ ! -d "webapp/node_modules" ]; then
    echo "▶️  安装前端依赖..."
    cd webapp
    npm install
    cd ..
fi

echo ""
echo "✨ 准备就绪！启动服务..."
echo ""

# 启动后端
echo "▶️  启动后端服务 (端口 3000)..."
cd backend
HOST=0.0.0.0 npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# 等待后端启动
echo "   等待后端启动..."
sleep 3

# 启动前端
echo "▶️  启动前端应用 (端口 5173)..."
cd webapp
npm run dev > ../webapp.log 2>&1 &
FRONTEND_PID=$!
cd ..

# 等待前端启动
sleep 2

echo ""
echo "================================"
echo "✅ DressCopilot 已启动！"
echo "================================"
echo ""
echo "📱 本机访问:"
echo "   http://localhost:5173"
echo ""
echo "🌐 局域网访问 (在其他设备上):"
echo "   http://$HOST_IP:5173"
echo ""
echo "📊 后端API:"
echo "   http://$HOST_IP:3000"
echo ""
echo "📄 查看日志:"
echo "   tail -f backend.log"
echo "   tail -f webapp.log"
echo ""
echo "🛑 停止服务: 按 Ctrl+C"
echo ""

# 创建停止函数
cleanup() {
    echo ""
    echo "🛑 正在停止服务..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ 服务已停止"
    exit 0
}

# 捕获中断信号
trap cleanup INT TERM

# 等待
wait
