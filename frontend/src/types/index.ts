// ==================== 用户相关类型 ====================

export interface UserInfo {
  userId: number | string;
  username: string;
  nickname?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  roles: string[];
  permissions?: PermissionItem[];
}

export interface PermissionItem {
  menuId: string;
  path: string;
  name: string;
  icon?: string;
  buttons: string[];
  children?: PermissionItem[];
}

// ==================== Token 相关类型 ====================

export interface TokenData {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType?: string;
}

// ==================== 登录相关类型 ====================

export interface LoginParams {
  username: string;
  password: string;
  captcha?: string;
  remember?: boolean;
}

// 后端登录响应
export interface LoginResponse {
  token: string;
  tokenType?: string;
  expiresIn?: number;
  user: UserInfo;
}

// 前端使用
export interface LoginResult extends LoginResponse {}

// ==================== API 响应类型 ====================

export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
  success?: boolean;
}

export interface PageParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: 'ascend' | 'descend';
}

export interface PageResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ==================== 路由相关类型 ====================

export interface RouteItem {
  path: string;
  name: string;
  icon?: string;
  hideInMenu?: boolean;
  children?: RouteItem[];
}

// ==================== 全局状态类型 ====================

export type ThemeMode = 'light' | 'dark';

export interface GlobalState {
  loading: boolean;
  theme: ThemeMode;
  collapsed: boolean;
  message: MessageItem | null;
}

export interface MessageItem {
  type: 'success' | 'error' | 'warning' | 'info';
  content: string;
  duration?: number;
}
