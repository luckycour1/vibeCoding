// ==================== 环境配置 ====================

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Enterprise React Scaffold',
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api',
  API_TIMEOUT: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000,
  ENCRYPT_KEY: process.env.NEXT_PUBLIC_ENCRYPT_KEY || 'your-secret-key',
  TOKEN_EXPIRE: Number(process.env.NEXT_PUBLIC_TOKEN_EXPIRE) || 7200,
  REFRESH_TOKEN_EXPIRE: Number(process.env.NEXT_PUBLIC_REFRESH_TOKEN_EXPIRE) || 604800
};

// ==================== 路由白名单 ====================

export const WHITE_LIST = ['/login', '/register', '/forgot-password', '/404', '/500'];

// ==================== 存储键名 ====================

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_INFO: 'user_info',
  THEME: 'theme',
  COLLAPSED: 'collapsed',
  REMEMBER_ME: 'remember_me'
};

// ==================== 响应码 ====================

export const RESPONSE_CODE = {
  SUCCESS: 200,
  ERROR: 500,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 408,
  TOKEN_EXPIRED: 10001,
  TOKEN_INVALID: 10002
};

// ==================== 菜单配置 ====================

export const MENU_CONFIG = {
  homePath: '/dashboard',
  loginPath: '/login',
  errorPath: '/404'
};

// ==================== 分页配置 ====================

export const PAGINATION = {
  defaultPage: 1,
  defaultPageSize: 10,
  pageSizeOptions: ['10', '20', '50', '100']
};