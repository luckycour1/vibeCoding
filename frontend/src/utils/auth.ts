/**
 * 登录状态30天持久化工具类
 * 存储Token+过期时间，校验登录状态
 */

const TOKEN_KEY = 'user_token';
const EXPIRE_KEY = 'token_expire_time';
const EXPIRE_DAYS = 30;

// 登录成功：存储Token和30天过期时间戳
export const setLoginStatus = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  const expireTime = new Date().getTime() + EXPIRE_DAYS * 24 * 60 * 60 * 1000;
  localStorage.setItem(EXPIRE_KEY, expireTime.toString());
};

// 校验当前是否处于有效登录状态
export const checkLoginStatus = (): boolean => {
  const token = localStorage.getItem(TOKEN_KEY);
  const expireTime = localStorage.getItem(EXPIRE_KEY);
  if (!token) return false;
  if (!expireTime || new Date().getTime() > Number(expireTime)) {
    clearLoginStatus();
    return false;
  }
  return true;
};

// 退出登录：清除本地所有登录相关数据
export const clearLoginStatus = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRE_KEY);
};

// 获取Token（供请求拦截器使用）
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};
