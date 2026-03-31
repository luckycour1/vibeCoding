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
- **消息队列**: Kafka 3.5.x
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
- **职责**: 用户管理、角色管理、权限管理、部门管理
- **数据库**: user, role, permission, department, user_role, role_permission 表
- **API**: /api/user/**, /api/role/**, /api/department/**, /api/permission/**
- **说明**: 整合了用户、角色、权限、部门管理功能

#### 3.4.2 网关服务（gateway-service）
- **职责**: 路由转发、认证授权、跨域处理、请求过滤
- **依赖**: Spring Cloud Gateway + JWT
- **路由配置**: 将 /api/user/** 等请求转发到 user-service

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

所有接口通过网关转发，基础路径：`http://localhost:8080/api`

### 5.1 认证接口
- POST `/user/login` - 用户登录
- POST `/user/refresh-token` - 刷新Token
- POST `/user/logout` - 用户登出

### 5.2 用户管理接口 (BaseController标准CRUD)
- GET `/user/find` - 根据ID查询用户
- POST `/user/page` - 分页查询用户
- POST `/user/pageForDto` - 分页查询DTO
- POST `/user/create` - 创建用户
- PUT `/user/update` - 更新用户
- DELETE `/user/delete` - 删除用户
- GET `/user/query` - 查询所有用户

### 5.3 角色管理接口 (BaseController标准CRUD + 扩展)
- GET `/role/find` - 根据ID查询角色
- POST `/role/page` - 分页查询角色
- POST `/role/pageForDto` - 分页查询DTO
- POST `/role/create` - 创建角色
- PUT `/role/update` - 更新角色
- DELETE `/role/delete` - 删除角色
- GET `/role/query` - 查询所有角色
- GET `/role/list` - 获取角色列表（含用户统计）
- GET `/role/stats/user-count` - 获取用户总数

### 5.4 部门管理接口 (BaseController标准CRUD + 扩展)
- GET `/department/find` - 根据ID查询部门
- POST `/department/page` - 分页查询部门
- POST `/department/pageForDto` - 分页查询DTO
- POST `/department/create` - 创建部门
- PUT `/department/update` - 更新部门
- DELETE `/department/delete` - 删除部门
- GET `/department/query` - 查询所有部门
- GET `/department/enabled` - 获取启用的部门列表
- GET `/department/stats/employee-count` - 获取部门员工总数

### 5.5 权限管理接口
- GET `/permission/tree` - 获取所有权限树
- GET `/permission/role/{roleId}` - 获取角色权限树（含选中状态）
- POST `/permission/role/{roleId}` - 保存角色权限
- GET `/permission/user/menu` - 获取当前用户的菜单权限树
- GET `/permission/user/codes` - 获取当前用户的所有权限编码

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