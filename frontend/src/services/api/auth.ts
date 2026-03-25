import request from '../request';
import { LoginParams, LoginResult, ApiResponse, UserInfo, TokenData } from '@/types';

/**
 * 登录 API - 对接后端
 */
export const authApi = {
  /**
   * 用户登录
   */
  login: (params: LoginParams): Promise<LoginResult> => {
    return request.post('/user/login', params);
  },

  /**
   * 用户登出
   */
  logout: (): Promise<void> => {
    return request.post('/user/logout');
  },

  /**
   * 获取当前用户信息
   */
  getUserInfo: (): Promise<UserInfo> => {
    return request.get('/user/info');
  },

  /**
   * 修改密码
   */
  changePassword: (data: {
    oldPassword: string;
    newPassword: string;
  }): Promise<void> => {
    return request.post('/user/password', data);
  }
};

/**
 * 用户管理 API
 */
export const userApi = {
  /**
   * 获取用户列表
   */
  list: () => {
    return request.get('/user/list');
  },

  /**
   * 添加用户
   */
  add: (data: any) => {
    return request.post('/user/add', data);
  },

  /**
   * 更新用户
   */
  update: (id: number, data: any) => {
    return request.put(`/user/update/${id}`, data);
  },

  /**
   * 删除用户
   */
  delete: (id: number) => {
    return request.delete(`/user/delete/${id}`);
  },

  /**
   * 获取用户详情
   */
  getById: (id: number) => {
    return request.get(`/user/${id}`);
  }
};

/**
 * 角色管理 API
 */
export const roleApi = {
  /**
   * 获取角色列表
   */
  list: () => {
    return request.get('/role/list');
  },

  /**
   * 添加角色
   */
  add: (data: any) => {
    return request.post('/role/add', data);
  },

  /**
   * 更新角色
   */
  update: (id: number, data: any) => {
    return request.put(`/role/update/${id}`, data);
  },

  /**
   * 删除角色
   */
  delete: (id: number) => {
    return request.delete(`/role/delete/${id}`);
  },

  /**
   * 获取角色权限
   */
  getPermissions: (id: number) => {
    return request.get(`/role/permission/${id}`);
  },

  /**
   * 设置角色权限
   */
  setPermissions: (id: number, permissions: string[]) => {
    return request.post(`/role/permission/${id}`, { permissions });
  }
};
