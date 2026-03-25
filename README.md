# Vibe Coding

AI 驱动的全栈开发平台

## 项目介绍

Vibe Coding 是一个基于微服务架构的全栈项目，包含前端 React 应用和后端 Spring Cloud 微服务。

## 技术栈

### 前端
- React 18 + TypeScript
- Next.js 14
- Ant Design 5
- Zustand 状态管理

### 后端
- Spring Boot 2.7
- Spring Cloud 2021
- Nacos 服务注册/配置中心
- MySQL 8.0
- Redis 6.2
- RabbitMQ 3.11

## 项目结构

```
vibeCoding/
├── frontend/           # 前端 React 项目
│   ├── src/
│   ├── package.json
│   └── ...
│
├── backend/           # 后端微服务项目
│   ├── user-service/    # 用户服务
│   ├── gateway-service/ # 网关服务
│   ├── docker-compose.yml
│   ├── init.sql
│   └── ...
│
└── README.md
```

## 快速开始

### 前端启动

```bash
cd frontend
npm install
npm run dev
```

访问 http://localhost:3000

### 后端启动

```bash
# 1. 启动中间件
cd backend
docker-compose up -d

# 2. 初始化数据库
# MySQL会自动执行init.sql

# 3. 启动用户服务
cd backend/user-service
mvn spring-boot:run

# 4. 启动网关服务
cd backend/gateway-service
mvn spring-boot:run
```

## 服务地址

| 服务 | 地址 |
|------|------|
| 前端 | http://localhost:3000 |
| 后端API | http://localhost:8080 |
| Nacos | http://localhost:8848 |
| RabbitMQ | http://localhost:15672 |

## 默认账号

- 用户名: admin
- 密码: admin123

## API 接口

### 用户接口
- POST /api/user/login - 登录
- GET /api/user/list - 用户列表
- POST /api/user/add - 添加用户
- PUT /api/user/update/{id} - 更新用户
- DELETE /api/user/delete/{id} - 删除用户

### 角色接口
- GET /api/role/list - 角色列表
- POST /api/role/add - 添加角色
- PUT /api/role/update/{id} - 更新角色
- DELETE /api/role/delete/{id} - 删除角色
- POST /api/role/permission/{id} - 配置权限

## GitHub

https://github.com/luckycour1/vibeCoding

---
**版本**: v1.0
**日期**: 2026-03-25
