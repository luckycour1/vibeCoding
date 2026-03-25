# Vibe Coding 微服务后端

## 项目简介
基于Spring Cloud的微服务架构，为React前端提供后端API支持。

## 技术栈
- Spring Boot 2.7.18
- Spring Cloud 2021.0.8
- Nacos 2.2.3 (服务注册/配置中心)
- MySQL 8.0
- Redis 6.2
- RabbitMQ 3.11

## 快速开始

### 1. 启动中间件
```bash
# 安装Docker后执行
docker-compose up -d

# 验证服务
docker ps
# 应看到: mysql, redis, nacos, rabbitmq 四个容器
```

### 2. 初始化数据库
```bash
# MySQL会通过docker-compose自动执行init.sql
# 默认账号: admin / admin123
```

### 3. 启动微服务
```bash
# 启动用户服务
cd user-service
mvn spring-boot:run

# 启动网关 (新终端)
cd gateway-service
mvn spring-boot:run
```

### 4. 访问服务
- 网关: http://localhost:8080
- Nacos控制台: http://localhost:8848/nacos (nacos/nacos)
- RabbitMQ管理: http://localhost:15672 (guest/guest)

## API接口

### 用户接口
| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/user/login | 登录 |
| GET | /api/user/list | 用户列表 |
| POST | /api/user/add | 添加用户 |
| PUT | /api/user/update/{id} | 更新用户 |
| DELETE | /api/user/delete/{id} | 删除用户 |

### 认证
- 登录后获取Token
- 请求头添加: `Authorization: Bearer <token>`

## 项目结构
```
microservice-backend/
├── docker-compose.yml     # 中间件部署
├── init.sql              # 数据库初始化
├── user-service/         # 用户服务
│   ├── pom.xml
│   └── src/
├── gateway-service/      # 网关服务
│   ├── pom.xml
│   └── src/
└── README.md
```

## 前端对接
修改前端API地址为: http://localhost:8080

---
**版本**: v1.0
**日期**: 2026-03-25
