# Vibe Coding 微服务后端

## 项目简介
基于Spring Cloud的微服务架构，为React前端提供后端API支持。

## 技术栈
- Spring Boot 2.7.18
- Spring Cloud 2021.0.8
- Nacos 2.2.3 (服务注册/配置中心)
- MySQL 8.0
- Redis 6.2
- Kafka 3.11

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
- Kafka管理: http://localhost:15672 (guest/guest)

## API接口

所有接口通过网关转发，基础路径：`http://localhost:8080/api`

### 认证接口
| 方法 | 路径 | 描述 | 请求体 |
|------|------|------|------|
| POST | `/user/login` | 用户登录 | `{"username":"","password":""}` |
| POST | `/user/refresh-token` | 刷新Token | `{"refreshToken":""}` |
| POST | `/user/logout` | 用户登出 | 无 |

### 用户管理 (BaseController标准CRUD)
| 方法 | 路径 | 描述 | 参数 |
|------|------|------|------|
| GET | `/user/find` | 根据ID查询用户 | `id` (query) |
| POST | `/user/page` | 分页查询用户 | `UserQueryDto` (body) |
| POST | `/user/pageForDto` | 分页查询DTO | `UserQueryDto` (body) |
| POST | `/user/create` | 创建用户 | `UserDto` (body) |
| PUT | `/user/update` | 更新用户 | `id` (query), `UserDto` (body) |
| DELETE | `/user/delete` | 删除用户 | `id` (query) |
| GET | `/user/query` | 查询所有用户 | 无 |

### 角色管理 (BaseController标准CRUD + 扩展)
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

### 部门管理 (BaseController标准CRUD + 扩展)
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

### 权限管理
| 方法 | 路径 | 描述 | 参数 |
|------|------|------|------|
| GET | `/permission/tree` | 获取所有权限树 | 无 |
| GET | `/permission/role/{roleId}` | 获取角色权限树（含选中状态） | `roleId` (path) |
| POST | `/permission/role/{roleId}` | 保存角色权限 | `roleId` (path), `List<Long>` permissionIds (body) |
| GET | `/permission/user/menu` | 获取当前用户的菜单权限树 | 需要认证头 |
| GET | `/permission/user/codes` | 获取当前用户的所有权限编码 | 需要认证头 |

### 认证
- 登录后获取Token
- 请求头添加: `Authorization: Bearer <token>`

## 项目结构
```
microservice-backend/
├── docker-compose.yml      # 中间件部署
├── init.sql               # 数据库初始化
├── comm/                  # 公共模块
│   ├── pom.xml
│   └── src/main/java/com/vibecoding/comm/
│       ├── config/       # 公共配置
│       ├── controller/   # 基础控制器
│       ├── dto/          # 公共DTO
│       ├── entity/       # 基础实体
│       ├── security/     # 安全相关
│       └── service/      # 基础服务
├── user-service/          # 用户服务
│   ├── pom.xml
│   └── src/main/java/com/vibecoding/userservice/
│       ├── controller/   # 控制器层
│       ├── dto/          # DTO层
│       ├── entity/       # 实体层
│       ├── mapper/       # MyBatis Mapper
│       └── service/      # 业务服务层
├── gateway-service/       # 网关服务
│   ├── pom.xml
│   └── src/main/java/com/vibecoding/gateway/
│       ├── config/       # 网关配置
│       └── filter/       # 过滤器
└── README.md
```

## 前端对接
修改前端API地址为: http://localhost:8080

---
**版本**: v2.0
**日期**: 2026-03-31
