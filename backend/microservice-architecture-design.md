# 微服务后端架构设计文档

## 1. 架构概述

本架构采用Spring Cloud微服务架构，为React前端项目提供后端支持，实现用户管理、角色管理、权限控制等功能。架构遵循高可用、可扩展、易维护原则，包含服务注册与发现、API网关、配置中心、消息队列等核心组件。

## 2. 技术栈

- **核心框架**: Spring Boot 2.7.x + Spring Cloud 2021.x
- **服务注册与发现**: Nacos 2.2.x
- **API网关**: Spring Cloud Gateway
- **配置中心**: Nacos Config
- **服务通信**: OpenFeign
- **熔断器**: Resilience4j
- **消息队列**: RabbitMQ 3.11.x
- **数据库**: MySQL 8.0.x
- **缓存**: Redis 6.2.x
- **监控**: Prometheus + Grafana
- **日志**: ELK Stack

## 3. 微服务组件

### 3.1 服务注册中心
- **组件**: Nacos
- **职责**: 服务注册、发现、健康检查
- **部署**: 集群部署，保证高可用

### 3.2 API网关
- **组件**: Spring Cloud Gateway
- **职责**: 路由转发、请求过滤、限流、认证授权
- **核心功能**: JWT认证、跨域处理、请求日志

### 3.3 配置中心
- **组件**: Nacos Config
- **职责**: 集中管理配置文件，支持动态刷新
- **配置**: 按环境（dev/test/prod）隔离

### 3.4 微服务模块

#### 3.4.1 用户服务（user-service）
- **职责**: 用户CRUD、登录认证、权限分配
- **数据库**: user、user_role、role_permission表
- **API**: /api/user/**

#### 3.4.2 角色服务（role-service）
- **职责**: 角色CRUD、权限管理
- **数据库**: role、permission表
- **API**: /api/role/**

#### 3.4.3 配置服务（config-service）
- **职责**: 系统配置管理
- **数据库**: system_config表
- **API**: /api/config/**

#### 3.4.4 网关服务（gateway-service）
- **职责**: 路由转发、认证授权
- **依赖**: Spring Cloud Gateway + JWT

## 4. 数据库设计

### 4.1 用户表（user）
| 字段 | 类型 | 描述 |
|------|------|------|
| id | bigint | 主键 |
| username | varchar(50) | 用户名 |
| password | varchar(100) | 加密密码 |
| nickname | varchar(50) | 昵称 |
| email | varchar(100) | 邮箱 |
| phone | varchar(20) | 手机号 |
| department | varchar(50) | 部门 |
| status | tinyint | 状态（0:禁用,1:启用） |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

### 4.2 角色表（role）
| 字段 | 类型 | 描述 |
|------|------|------|
| id | bigint | 主键 |
| name | varchar(50) | 角色名称 |
| code | varchar(50) | 角色编码 |
| description | varchar(200) | 描述 |
| status | tinyint | 状态 |

### 4.3 权限表（permission）
| 字段 | 类型 | 描述 |
|------|------|------|
| id | bigint | 主键 |
| name | varchar(50) | 权限名称 |
| code | varchar(50) | 权限编码 |
| type | tinyint | 类型（1:菜单,2:按钮） |
| path | varchar(100) | 路径 |

## 5. API接口设计

### 5.1 用户接口
- POST /api/user/login: 登录
- GET /api/user/list: 用户列表
- POST /api/user/add: 添加用户
- PUT /api/user/update: 更新用户
- DELETE /api/user/delete: 删除用户

### 5.2 角色接口
- GET /api/role/list: 角色列表
- POST /api/role/add: 添加角色
- PUT /api/role/update: 更新角色
- POST /api/role/permission: 分配权限

## 6. 部署方案

### 6.1 本地开发环境
- Docker Compose部署Nacos、MySQL、Redis、RabbitMQ
- 微服务本地启动

### 6.2 生产环境
- Kubernetes集群部署
- 服务水平扩展
- 数据库主从复制

## 7. 与前端对接说明

- **接口文档**: 使用Swagger/OpenAPI
- **认证方式**: JWT Token
- **数据格式**: JSON
- **跨域处理**: 网关配置CORS

## 8. 中间件配置

### 8.1 MySQL部署
- 容器化部署
- 初始化脚本: 创建数据库和表
- 连接池: HikariCP

### 8.2 Redis部署
- 集群部署
- 缓存用户信息、权限数据

### 8.3 RabbitMQ部署
- 集群部署
- 用于异步任务、消息通知

---
**版本**: v1.0
**日期**: 2026-03-25
**作者**: 罗超的助手