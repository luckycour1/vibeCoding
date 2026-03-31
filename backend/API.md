# Vibe Coding API 接口文档

## 概述

本文档描述了 Vibe Coding 后端微服务的所有 RESTful API 接口。所有接口通过 Spring Cloud Gateway 网关转发，基础路径为 `http://localhost:8080/api`。

### 统一响应格式

```json
{
  "code": 200,
  "message": "成功",
  "data": {...}
}
```

### 状态码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 401 | 未授权，Token无效或过期 |
| 403 | 禁止访问，权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

### 认证方式

在请求头中添加 Authorization 头：
```
Authorization: Bearer <access_token>
```

---

## 认证接口 (AuthController)

### 用户登录

**POST** `/user/login`

登录系统，获取访问令牌和刷新令牌。

**请求体：**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**响应：**
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": 1,
    "username": "admin",
    "nickname": "管理员",
    "roles": ["admin"]
  }
}
```

### 刷新令牌

**POST** `/user/refresh-token`

使用刷新令牌获取新的访问令牌。

**请求体：**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**响应：**
与登录响应相同，返回新的 token 和 refreshToken。

### 用户登出

**POST** `/user/logout`

用户登出系统（服务端可添加令牌黑名单逻辑）。

**响应：**
```json
{
  "code": 200,
  "message": "登出成功",
  "data": null
}
```

---

## 用户管理接口 (UserController)

用户控制器继承 `BaseController`，提供标准 CRUD 操作。

### 根据ID查询用户

**GET** `/user/find`

**查询参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | Long | 是 | 用户ID |

**响应：**
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "id": 1,
    "username": "admin",
    "nickname": "管理员",
    "email": "admin@example.com",
    "phone": "13800138000",
    "department": "技术部",
    "departmentId": 1,
    "position": "系统管理员",
    "status": 1,
    "createdAt": "2026-03-25 10:00:00",
    "roles": ["admin"]
  }
}
```

### 分页查询用户

**POST** `/user/page`

**请求体：** `UserQueryDto`
```json
{
  "page": 1,
  "pageSize": 10,
  "sort": "id",
  "order": "desc",
  "username": "",
  "nickname": "",
  "department": "",
  "status": null
}
```

**响应：**
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "list": [
      {
        "id": 1,
        "username": "admin",
        "nickname": "管理员",
        "email": "admin@example.com",
        "phone": "13800138000",
        "department": "技术部",
        "position": "系统管理员",
        "status": 1,
        "createdAt": "2026-03-25 10:00:00"
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 10
  }
}
```

### 分页查询用户DTO

**POST** `/user/pageForDto`

与 `/user/page` 类似，但返回 `UserDto` 类型数据。

### 创建用户

**POST** `/user/create`

**请求体：** `UserDto`
```json
{
  "username": "newuser",
  "password": "password123",
  "nickname": "新用户",
  "email": "new@example.com",
  "phone": "13800138001",
  "department": "技术部",
  "departmentId": 1,
  "position": "开发工程师",
  "status": 1,
  "roles": ["user"]
}
```

**响应：**
返回创建的用户实体。

### 更新用户

**PUT** `/user/update`

**查询参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | Long | 是 | 用户ID |

**请求体：** `UserDto`（更新字段）

**响应：**
返回更新后的用户实体。

### 删除用户

**DELETE** `/user/delete`

**查询参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | Long | 是 | 用户ID |

**响应：**
```json
{
  "code": 200,
  "message": "删除成功",
  "data": 1
}
```

### 查询所有用户

**GET** `/user/query`

**响应：**
返回所有用户的列表。

---

## 角色管理接口 (RoleController)

角色控制器继承 `BaseController`，提供标准 CRUD 操作及扩展接口。

### 根据ID查询角色

**GET** `/role/find`

**查询参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | Long | 是 | 角色ID |

**响应：**
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "id": 1,
    "name": "管理员",
    "code": "admin",
    "description": "系统管理员",
    "status": 1,
    "createdAt": "2026-03-25 10:00:00"
  }
}
```

### 分页查询角色

**POST** `/role/page`

**请求体：** `RoleQueryDto`
```json
{
  "page": 1,
  "pageSize": 10,
  "sort": "id",
  "order": "desc",
  "name": "",
  "code": "",
  "status": null
}
```

### 创建角色

**POST** `/role/create`

**请求体：** `RoleDto`
```json
{
  "name": "测试角色",
  "code": "test",
  "description": "测试角色描述",
  "status": 1
}
```

### 更新角色

**PUT** `/role/update`

**查询参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | Long | 是 | 角色ID |

**请求体：** `RoleDto`

### 删除角色

**DELETE** `/role/delete`

**查询参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | Long | 是 | 角色ID |

### 查询所有角色

**GET** `/role/query`

### 获取角色列表（含用户统计）

**GET** `/role/list`

**响应：**
返回角色列表，每个角色包含用户数量统计。

### 获取用户总数

**GET** `/role/stats/user-count`

**响应：**
```json
{
  "code": 200,
  "message": "成功",
  "data": 100
}
```

---

## 部门管理接口 (DepartmentController)

部门控制器继承 `BaseController`，提供标准 CRUD 操作及扩展接口。

### 根据ID查询部门

**GET** `/department/find`

**查询参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | Long | 是 | 部门ID |

**响应：**
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "id": 1,
    "name": "技术部",
    "code": "tech",
    "description": "技术研发部门",
    "status": 1,
    "createdAt": "2026-03-25 10:00:00"
  }
}
```

### 分页查询部门

**POST** `/department/page`

**请求体：** `DepartmentQueryDto`
```json
{
  "page": 1,
  "pageSize": 10,
  "sort": "id",
  "order": "desc",
  "name": "",
  "code": "",
  "status": null
}
```

### 创建部门

**POST** `/department/create`

**请求体：** `DepartmentDto`
```json
{
  "name": "市场部",
  "code": "market",
  "description": "市场推广部门",
  "status": 1
}
```

### 更新部门

**PUT** `/department/update`

**查询参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | Long | 是 | 部门ID |

**请求体：** `DepartmentDto`

### 删除部门

**DELETE** `/department/delete`

**查询参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | Long | 是 | 部门ID |

### 查询所有部门

**GET** `/department/query`

### 获取启用的部门列表

**GET** `/department/enabled`

**响应：**
仅返回状态为启用（status=1）的部门列表。

### 获取部门员工总数

**GET** `/department/stats/employee-count`

**响应：**
返回所有部门的员工总数。

---

## 权限管理接口 (PermissionController)

### 获取所有权限树

**GET** `/permission/tree`

**响应：**
```json
{
  "code": 200,
  "message": "成功",
  "data": [
    {
      "id": 1,
      "name": "系统管理",
      "code": "system",
      "type": 1,
      "path": "/system",
      "children": [
        {
          "id": 2,
          "name": "用户管理",
          "code": "user:manage",
          "type": 1,
          "path": "/system/user"
        }
      ]
    }
  ]
}
```

### 获取角色权限树（含选中状态）

**GET** `/permission/role/{roleId}`

**路径参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| roleId | Long | 是 | 角色ID |

**响应：**
返回权限树，已分配给该角色的权限会标记为选中状态。

### 保存角色权限

**POST** `/permission/role/{roleId}`

**路径参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| roleId | Long | 是 | 角色ID |

**请求体：**
```json
[1, 2, 3, 4]
```

权限ID数组。

**响应：**
```json
{
  "code": 200,
  "message": "保存成功",
  "data": null
}
```

### 获取当前用户的菜单权限树

**GET** `/permission/user/menu`

**请求头：** 需要有效的 Authorization 令牌。

**响应：**
返回当前用户有权限访问的菜单树，用于前端动态生成菜单。

### 获取当前用户的所有权限编码

**GET** `/permission/user/codes`

**请求头：** 需要有效的 Authorization 令牌。

**响应：**
```json
{
  "code": 200,
  "message": "成功",
  "data": ["user:view", "user:add", "role:manage"]
}
```

返回当前用户的所有权限编码集合，用于前端按钮级权限控制。

---

## DTO 结构说明

### UserDto
| 字段 | 类型 | 说明 |
|------|------|------|
| id | Long | 用户ID（更新时使用） |
| username | String | 用户名 |
| password | String | 密码（创建时必填） |
| nickname | String | 昵称 |
| email | String | 邮箱 |
| phone | String | 手机号 |
| department | String | 部门名称 |
| departmentId | Long | 部门ID |
| position | String | 职位 |
| status | Integer | 状态（0:禁用,1:启用） |
| createdAt | String | 创建时间（只读） |
| roles | List<String> | 角色编码列表 |

### RoleDto
| 字段 | 类型 | 说明 |
|------|------|------|
| id | Long | 角色ID |
| name | String | 角色名称 |
| code | String | 角色编码 |
| description | String | 描述 |
| status | Integer | 状态 |
| createdAt | String | 创建时间 |

### DepartmentDto
| 字段 | 类型 | 说明 |
|------|------|------|
| id | Long | 部门ID |
| name | String | 部门名称 |
| code | String | 部门编码 |
| description | String | 描述 |
| status | Integer | 状态 |
| createdAt | String | 创建时间 |

### 分页查询DTO (SearchPagedDto)
| 字段 | 类型 | 说明 |
|------|------|------|
| page | Integer | 页码，从1开始 |
| pageSize | Integer | 每页大小 |
| sort | String | 排序字段 |
| order | String | 排序方向（asc/desc） |

所有具体查询DTO（UserQueryDto、RoleQueryDto、DepartmentQueryDto）都继承 SearchPagedDto，并添加各自的条件字段。

---

## 错误处理

### 常见错误码

| 错误码 | 说明 | 处理建议 |
|--------|------|----------|
| 10001 | Token过期 | 调用刷新令牌接口或重新登录 |
| 10002 | Token无效 | 检查Token格式或重新登录 |
| 40001 | 参数验证失败 | 检查请求参数格式 |
| 50001 | 服务器内部错误 | 联系系统管理员 |

### 错误响应示例
```json
{
  "code": 401,
  "message": "登录已过期，请重新登录",
  "data": null
}
```

---

**文档版本**: v2.0  
**最后更新**: 2026-03-31  
**维护者**: Vibe Coding 团队