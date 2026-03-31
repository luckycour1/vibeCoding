# Vibe Coding

AI 驱动的全栈开发平台

## 项目介绍

Vibe Coding 是一个基于微服务架构的全栈项目，包含前端 React 应用和后端 Spring Cloud 微服务。项目采用模块化设计，前后端分离，支持用户管理、角色权限、部门管理等企业级功能。

## 技术栈

### 前端
- React 18 + TypeScript
- Next.js 14
- Ant Design 5
- Zustand 状态管理
- Axios HTTP客户端

### 后端
- Spring Boot 2.7 + Spring Cloud 2021
- Nacos 服务注册/配置中心
- MySQL 8.0 数据库
- Redis 6.2 缓存
- Kafka 消息队列
- Spring Cloud Gateway API网关
- JWT 认证授权

## 项目结构

```
vibeCoding/
├── frontend/                 # 前端 Next.js 项目
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   ├── components/      # 公共组件
│   │   ├── services/        # API服务层
│   │   ├── store/           # Zustand状态管理
│   │   ├── types/           # TypeScript类型定义
│   │   └── utils/           # 工具函数
│   ├── package.json
│   └── ...
│
├── backend/                 # 后端微服务项目
│   ├── comm/                # 公共模块
│   │   ├── src/main/java/com/vibecoding/comm/
│   │   │   ├── config/      # 公共配置
│   │   │   ├── controller/  # 基础控制器
│   │   │   ├── dto/         # 公共DTO
│   │   │   ├── entity/      # 基础实体
│   │   │   ├── security/    # 安全相关
│   │   │   └── service/     # 基础服务
│   │   └── pom.xml
│   ├── user-service/        # 用户服务
│   │   ├── src/main/java/com/vibecoding/userservice/
│   │   │   ├── controller/  # 控制器层
│   │   │   ├── dto/         # DTO层
│   │   │   ├── entity/      # 实体层
│   │   │   ├── mapper/      # MyBatis Mapper
│   │   │   └── service/     # 业务服务层
│   │   └── pom.xml
│   ├── gateway-service/     # 网关服务
│   │   ├── src/main/java/com/vibecoding/gateway/
│   │   │   ├── config/      # 网关配置
│   │   │   └── filter/      # 过滤器
│   │   └── pom.xml
│   ├── docker-compose.yml   # Docker编排
│   ├── init.sql             # 数据库初始化脚本
│   └── ...
│
└── README.md
```

## 快速开始

### 环境要求
- Node.js 18+ 
- Java 17+
- Maven 3.8+
- Docker & Docker Compose

### 前端启动

```bash
cd frontend
npm install
npm run dev:win  # Windows环境，使用set命令设置环境变量
# 或
npm run dev      # macOS/Linux环境
```

访问 http://localhost:3001

### 后端启动

1. **启动基础设施**
```bash
cd backend
# 创建网络（首次运行需要）
docker network create spring-cloud-net
# 启动所有中间件（Nacos、MySQL、Redis、Kafka等）
docker-compose --profile infra up -d
```

2. **验证服务**
```bash
# 检查容器运行状态
docker ps
# 访问Nacos控制台: http://localhost:8848 (nacos/nacos)
# 访问MySQL: localhost:3306 (root/root)
# 访问Redis: localhost:6379
```

3. **启动业务服务**
```bash
# 启动用户服务
cd backend/user-service
mvn spring-boot:run

# 启动网关服务（新终端）
cd backend/gateway-service
mvn spring-boot:run
```

或者使用Docker启动业务服务：
```bash
cd backend
docker-compose --profile business up -d
```

## 服务地址

| 服务 | 地址 | 说明 |
|------|------|------|
| 前端 | http://localhost:3001 | Next.js开发服务器 |
| 后端API | http://localhost:8080 | Spring Cloud Gateway网关 |
| Nacos | http://localhost:8848 | 服务注册与配置中心 (nacos/nacos) |
| MySQL | localhost:3306 | 数据库 (root/root) |
| Redis | localhost:6379 | 缓存服务 |
| Kafka | localhost:9092 | 消息队列 |
| Kafka UI | http://localhost:8088 | Kafka管理界面 |
| Prometheus | http://localhost:9090 | 指标监控 |
| Grafana | http://localhost:3000 | 数据可视化 (admin/admin) |

## 默认账号

- 用户名: admin
- 密码: admin123

## API 接口

所有接口通过网关转发，基础路径：`http://localhost:8080/api`

### 认证接口 (AuthController)
| 方法 | 路径 | 描述 | 请求体 |
|------|------|------|------|
| POST | `/user/login` | 用户登录 | `{"username":"","password":""}` |
| POST | `/user/refresh-token` | 刷新Token | `{"refreshToken":""}` |
| POST | `/user/logout` | 用户登出 | 无 |

### 用户管理 (UserController - 继承BaseController)
| 方法 | 路径 | 描述 | 参数 |
|------|------|------|------|
| GET | `/user/find` | 根据ID查询用户 | `id` (query) |
| POST | `/user/page` | 分页查询用户 | `UserQueryDto` (body) |
| POST | `/user/pageForDto` | 分页查询DTO | `UserQueryDto` (body) |
| POST | `/user/create` | 创建用户 | `UserDto` (body) |
| PUT | `/user/update` | 更新用户 | `id` (query), `UserDto` (body) |
| DELETE | `/user/delete` | 删除用户 | `id` (query) |
| GET | `/user/query` | 查询所有用户 | 无 |

### 角色管理 (RoleController - 继承BaseController)
| 方法 | 路径 | 描述 | 参数 |
|------|------|------|------|
| GET | `/role/find` | 根据ID查询角色 | `id` (query) |
| POST | `/role/page` | 分页查询角色 | `RoleQueryDto` (body) |
| POST | `/role/pageForDto` | 分页查询DTO | `RoleQueryDto` (body) |
| POST | `/role/create` | 创建角色 | `RoleDto` (body) |
| PUT | `/role/update` | 更新角色 | `id` (query), `RoleDto` (body) |
| DELETE | `/role/delete` | 删除角色 | `id` (query) |
| GET | `/role/query` | 查询所有角色 | 无 |
| GET | `/role/list` | 获取角色列表（含用户统计） | 无 |
| GET | `/role/stats/user-count` | 获取用户总数 | 无 |

### 部门管理 (DepartmentController - 继承BaseController)
| 方法 | 路径 | 描述 | 参数 |
|------|------|------|------|
| GET | `/department/find` | 根据ID查询部门 | `id` (query) |
| POST | `/department/page` | 分页查询部门 | `DepartmentQueryDto` (body) |
| POST | `/department/pageForDto` | 分页查询DTO | `DepartmentQueryDto` (body) |
| POST | `/department/create` | 创建部门 | `DepartmentDto` (body) |
| PUT | `/department/update` | 更新部门 | `id` (query), `DepartmentDto` (body) |
| DELETE | `/department/delete` | 删除部门 | `id` (query) |
| GET | `/department/query` | 查询所有部门 | 无 |
| GET | `/department/enabled` | 获取启用的部门列表 | 无 |
| GET | `/department/stats/employee-count` | 获取部门员工总数 | 无 |

### 权限管理 (PermissionController)
| 方法 | 路径 | 描述 | 参数 |
|------|------|------|------|
| GET | `/permission/tree` | 获取所有权限树 | 无 |
| GET | `/permission/role/{roleId}` | 获取角色权限树（含选中状态） | `roleId` (path) |
| POST | `/permission/role/{roleId}` | 保存角色权限 | `roleId` (path), `List<Long>` permissionIds (body) |
| GET | `/permission/user/menu` | 获取当前用户的菜单权限树 | 需要认证头 |
| GET | `/permission/user/codes` | 获取当前用户的所有权限编码 | 需要认证头 |

### 响应格式
```json
{
  "code": 200,
  "message": "成功",
  "data": {...}
}
```

## GitHub

https://github.com/luckycour1/vibeCoding

---
**版本**: v2.0
**日期**: 2026-03-31
