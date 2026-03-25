#!/bin/bash
set -e

echo "🚀 开始上传项目到 GitHub..."

cd /home/gem/workspace/react-scaffold

echo "📦 1. 初始化 Git 仓库..."
git init

echo "⚙️  2. 配置 Git 用户信息..."
git config user.email "dev@example.com"
git config user.name "Developer"

echo "📁 3. 添加文件到暂存区..."
git add .

echo "💾 4. 创建初始提交..."
git commit -m "Initial commit: React + Next.js scaffold"

echo "🔗 5. 关联远程仓库..."
git remote add origin https://github.com/luckycour1/react-scaffold.git

echo "🌿 6. 设置分支名..."
git branch -M main

echo "📤 7. 推送到 GitHub..."
git push -u origin main

echo "✅ 上传完成！请访问: https://github.com/luckycour1/react-scaffold"
