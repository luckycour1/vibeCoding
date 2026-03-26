# User Service API 接口文档

## 基础信息

- **Base URL**: `http://localhost:8080/api/user`
- **认证方式**: Bearer Token (JWT)

---

## 响应格式

### 成功响应
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {}
}
```

### 失败响应
```json
{
  "code": 401,
  "message": "用户名或密码错误",
  "data": null
}
```

### 响应码说明
| code | 说明 |
|------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权（登录失败） |
| 500 | 服务器内部错误 |

---

## 接口列表

### 1. 用户登录

**POST** `/login`

**请求体:**
```json
{
  "username": "admin",
  "password": "123456"
}
```

**响应:**
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "tokenType": "Bearer",
    "expiresIn": 7200,
    "user": {
      "userId": 1,
      "username": "admin",
      "nickname": "管理员",
      "roles": ["admin"]
    }
  }
}
```

**失败响应 (401):**
```json
{
  "code": 401,
  "message": "用户名或密码错误",
  "data": null
}
```

---

### 2. 获取用户列表

**GET** `/list`

**请求头:**
```
Authorization: Bearer <token>
```

**响应:**
```json
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": 1,
      "username": "admin",
      "nickname": "管理员",
      "email": "admin@example.com",
      "phone": "13800138000",
      "department": "技术部",
      "position": "开发工程师",
      "status": 1,
      "createdAt": "2024-01-01T00:00:00",
      "updatedAt": "2024-01-01T00:00:00"
    }
  ]
}
```

---

### 3. 获取用户详情

**GET** `/{id}`

**路径参数:**
| 参数 | 类型 | 说明 |
|------|------|------|
| id | Long | 用户ID |

**响应:**
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": 1,
    "username": "admin",
    "nickname": "管理员",
    "email": "admin@example.com",
    "phone": "13800138000",
    "department": "技术部",
    "position": "开发工程师",
    "status": 1,
    "createdAt": "2024-01-01T00:00:00",
    "updatedAt": "2024-01-01T00:00:00"
  }
}
```

---

### 4. 创建用户

**POST** `/add`

**请求体:**
```json
{
  "username": "newuser",
  "password": "123456",
  "nickname": "新用户",
  "email": "newuser@example.com",
  "phone": "13900139000",
  "department": "技术部",
  "position": "测试工程师",
  "status": 1
}
```

**响应:**
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": 2,
    "username": "newuser",
    "nickname": "新用户",
    "email": "newuser@example.com",
    "phone": "13900139000",
    "department": "技术部",
    "position": "测试工程师",
    "status": 1,
    "createdAt": "2024-01-01T00:00:00",
    "updatedAt": "2024-01-01T00:00:00"
  }
}
```

---

### 5. 更新用户

**PUT** `/update/{id}`

**路径参数:**
| 参数 | 类型 | 说明 |
|------|------|------|
| id | Long | 用户ID |

**请求体:**
```json
{
  "nickname": "超级管理员",
  "email": "admin_new@example.com",
  "phone": "13800138001",
  "department": "技术部",
  "position": "技术总监",
  "status": 1
}
```

**响应:**
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": 1,
    "username": "admin",
    "nickname": "超级管理员",
    "email": "admin_new@example.com",
    "phone": "13800138001",
    "department": "技术部",
    "position": "技术总监",
    "status": 1,
    "createdAt": "2024-01-01T00:00:00",
    "updatedAt": "2024-01-02T00:00:00"
  }
}
```

---

### 6. 删除用户

**DELETE** `/delete/{id}`

**路径参数:**
| 参数 | 类型 | 说明 |
|------|------|------|
| id | Long | 用户ID |

**响应:**
```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

---

## 字段说明

### User 实体字段
| 字段 | 类型 | 说明 |
|------|------|------|
| id | Long | 用户ID |
| username | String | 用户名（唯一） |
| password | String | 密码（加密存储） |
| nickname | String | 昵称 |
| email | String | 邮箱 |
| phone | String | 手机号 |
| department | String | 部门 |
| position | String | 职位 |
| status | Integer | 状态（1:正常, 0:禁用） |
| createdAt | LocalDateTime | 创建时间 |
| updatedAt | LocalDateTime | 更新时间 |

---

## 错误码说明

| code | message | 说明 |
|------|---------|------|
| 400 | 用户名已存在 | 创建用户时用户名重复 |
| 400 | 用户不存在 | 更新/删除用户时用户不存在 |
| 401 | 用户名或密码错误 | 登录失败 |
| 401 | 账号已被禁用 | 用户被禁用无法登录 |
| 500 | 服务器繁忙，请稍后重试 | 服务器内部错误 |
