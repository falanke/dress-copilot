#!/bin/bash

# DressCopilot 部署检查脚本
# 确保所有配置都正确，可以顺利部署

echo "🔍 DressCopilot 部署前检查"
echo "================================"
echo ""

ERRORS=0
WARNINGS=0

# 检查Git仓库
echo "📦 检查Git配置..."
if [ ! -d ".git" ]; then
    echo "❌ 错误: 不是Git仓库"
    ERRORS=$((ERRORS + 1))
else
    echo "✅ Git仓库正常"

    # 检查是否有未提交的更改
    if [ -n "$(git status --porcelain)" ]; then
        echo "⚠️  警告: 有未提交的更改"
        WARNINGS=$((WARNINGS + 1))
        git status --short
    fi
fi

echo ""

# 检查后端配置
echo "🔧 检查后端配置..."
if [ ! -d "backend" ]; then
    echo "❌ 错误: 找不到backend目录"
    ERRORS=$((ERRORS + 1))
else
    # 检查package.json
    if [ ! -f "backend/package.json" ]; then
        echo "❌ 错误: 找不到backend/package.json"
        ERRORS=$((ERRORS + 1))
    else
        echo "✅ backend/package.json 存在"
    fi

    # 检查.env示例
    if [ ! -f "backend/.env.example" ]; then
        echo "⚠️  警告: 找不到backend/.env.example"
        WARNINGS=$((WARNINGS + 1))
    else
        echo "✅ backend/.env.example 存在"
    fi

    # 检查Railway配置
    if [ ! -f "backend/railway.json" ]; then
        echo "⚠️  警告: 找不到backend/railway.json"
        WARNINGS=$((WARNINGS + 1))
    else
        echo "✅ backend/railway.json 存在"
    fi
fi

echo ""

# 检查前端配置
echo "🎨 检查前端配置..."
if [ ! -d "webapp" ]; then
    echo "❌ 错误: 找不到webapp目录"
    ERRORS=$((ERRORS + 1))
else
    # 检查package.json
    if [ ! -f "webapp/package.json" ]; then
        echo "❌ 错误: 找不到webapp/package.json"
        ERRORS=$((ERRORS + 1))
    else
        echo "✅ webapp/package.json 存在"
    fi

    # 检查Vercel配置
    if [ ! -f "webapp/vercel.json" ]; then
        echo "⚠️  警告: 找不到webapp/vercel.json"
        WARNINGS=$((WARNINGS + 1))
    else
        echo "✅ webapp/vercel.json 存在"
    fi

    # 检查.env示例
    if [ ! -f "webapp/.env.example" ]; then
        echo "⚠️  警告: 找不到webapp/.env.example"
        WARNINGS=$((WARNINGS + 1))
    else
        echo "✅ webapp/.env.example 存在"
    fi
fi

echo ""

# 检查文档
echo "📚 检查文档..."
if [ ! -f "DEPLOYMENT.md" ]; then
    echo "⚠️  警告: 找不到DEPLOYMENT.md"
    WARNINGS=$((WARNINGS + 1))
else
    echo "✅ DEPLOYMENT.md 存在"
fi

echo ""
echo "================================"
echo "📊 检查结果汇总"
echo "================================"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo "✅ 所有检查通过！可以开始部署了"
    echo ""
    echo "📝 下一步："
    echo "1. 确保代码已推送到GitHub"
    echo "2. 访问 https://railway.app 部署后端"
    echo "3. 访问 https://vercel.com 部署前端"
    echo "4. 查看 DEPLOYMENT.md 获取详细步骤"
    echo ""
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo "⚠️  有 $WARNINGS 个警告，但可以继续部署"
    echo ""
    echo "📝 建议："
    echo "- 检查并解决警告项"
    echo "- 提交所有更改到Git"
    echo ""
    exit 0
else
    echo "❌ 发现 $ERRORS 个错误，$WARNINGS 个警告"
    echo ""
    echo "🔧 请先修复错误再部署"
    echo ""
    exit 1
fi
