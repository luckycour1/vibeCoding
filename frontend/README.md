# 前端项目文档

## 目录结构

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── (auth)/             # 认证相关页面（无需登录）
│   │   │   └── login/          # 登录页
│   │   ├── (dashboard)/         # 需要登录的页面
│   │   │   ├── dashboard/      # 首页/仪表盘
│   │   │   ├── users/          # 用户管理
│   │   │   ├── roles/          # 角色管理
│   │   │   └── settings/       # 系统设置
│   │   ├── layout.tsx          # 根布局
│   │   └── page.tsx            # 根页面（重定向到登录或首页）
│   │
│   ├── components/             # React 组件
│   │   ├── common/             # 通用组件
│   │   │   ├── AuthComponent.tsx   # 权限组件
│   │   │   └── AuthButton.tsx      # 权限按钮
│   │   └── layout/             # 布局组件
│   │       ├── MainLayout.tsx      # 主布局
│   │       ├── SideMenu.tsx        # 侧边菜单
│   │       └── TopHeader.tsx       # 顶部导航
│   │
│   ├── config/                 # 配置文件
│   │   └── index.ts            # 全局配置（API地址、存储键名等）
│   │
│   ├── hooks/                  # 自定义 Hooks
│   │   └── useAuth.ts         # 认证相关 Hook
│   │
│   ├── services/               # API 服务
│   │   ├── api/
│   │   │   └── auth.ts        # 认证/用户 API
│   │   └── request.ts         # axios 请求封装
│   │
│   ├── store/                  # Zustand 状态管理
│   │   ├── authStore.ts       # 认证状态（用户、Token）
│   │   ├── globalStore.ts     # 全局状态（加载中、主题）
│   │   └── permissionStore.ts # 权限状态
│   │
│   ├── types/                  # TypeScript 类型定义
│   │   └── index.ts           # 全局类型
│   │
│   └── utils/                  # 工具函数
│       ├── storage.ts          # 本地存储封装
│       ├── format.ts           # 格式化工具
│       └── crypto.ts           # 加密工具
│
├── package.json                # 项目依赖
├── next.config.mjs            # Next.js 配置
├── tsconfig.json              # TypeScript 配置
└── commitlint.config.js      # Git 提交规范配置
```

## 登录接口对接说明

### 登录API对接后端返回200+业务code的处理

后端登录接口返回格式如下：

```
HTTP/1.1 200 OK
Content-Type: application/json
{
	"code": 400,
	"message": "用户名或密码错误"
}
```

前端需在登录逻辑中主动判断`result.code !== 200`，并用`message.error(result.message)`提示用户。

示例代码：

```ts
const result = await authApi.login({ username, password });
if (result.code !== 200) {
	message.error(result.message || '用户名或密码错误');
	return;
}
// 登录成功逻辑...
```

如后端改为标准REST（登录失败直接返回401/400），前端可直接用catch分支处理。

---

## 运维命令

### 开发环境
```bash
# 安装依赖
npm install

# 启动开发服务器（热更新）
npm run dev

# 启动开发服务器（指定端口）
npm run dev -- -p 3001
```

### 生产环境
```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 启动生产服务器（指定端口）
npm start -p 3001
```

### 代码检查
```bash
# TypeScript 类型检查
npm run lint

# 代码格式化
npm run format
```

### 其他
```bash
# 查看项目依赖
npm list

# 更新依赖
npm update
```

## 核心功能说明

### 1. 页面路由
- `(auth)/login` - 登录页（无需登录即可访问）
- `(dashboard)/dashboard` - 首页
- `(dashboard)/users` - 用户管理
- `(dashboard)/roles` - 角色管理
- `(dashboard)/settings` - 系统设置

### 2. 状态管理（Zustand）
- **authStore** - 用户登录信息、Token 存取
- **globalStore** - 全局加载状态、主题
- **permissionStore** - 权限菜单

### 3. API 请求
- 基于 axios 封装
- 请求拦截器：自动添加 Token
- 响应拦截器：统一错误处理、Token 过期处理

### 4. 配置说明（config/index.ts）
- `API_BASE_URL` - 后端 API 地址
- `STORAGE_KEYS` - 本地存储键名
- `RESPONSE_CODE` - 响应码定义

## 环境变量

在 `.env.local` 中配置：
```bash
# API 地址
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api

# 超时时间（毫秒）
NEXT_PUBLIC_API_TIMEOUT=30000
```
