import request from '../request';
import { LoginParams, LoginResult, UserInfo } from '@/types';

/**
 * 登录 API
 */
export const authApi = {
  /**
   * 用户登录
   * POST /api/user/login
   */
  login: (params: LoginParams): Promise<LoginResult> => {
    return request.post('/user/login', params);
  }
};

/**
 * 用户管理 API
 * 基础路径: /api/user
 */
export const userApi = {
  /**
   * 获取用户列表
   * GET /api/user/list
   */
  list: () => {
    return request.get('/user/list');
  },

  /**
   * 获取用户详情
   * GET /api/user/{id}
   */
  getById: (id: number) => {
    return request.get(`/user/${id}`);
  },

  /**
   * 创建用户
   * POST /api/user/add
   */
  add: (data: {
    username: string;
    password: string;
    nickname?: string;
    email?: string;
    phone?: string;
    department?: string;
    position?: string;
    status?: number;
  }) => {
    return request.post('/user/add', data);
  },

  /**
   * 更新用户
   * PUT /api/user/update/{id}
   */
  update: (id: number, data: {
    nickname?: string;
    email?: string;
    phone?: string;
    department?: string;
    position?: string;
    status?: number;
  }) => {
    return request.put(`/user/update/${id}`, data);
  },

  /**
   * 删除用户
   * DELETE /api/user/delete/{id}
   */
  delete: (id: number) => {
    return request.delete(`/user/delete/${id}`);
  }
};

/**
 * 角色管理 API (预留)
 */
export const roleApi = {
  list: () => {
    return request.get('/role/list');
  },

  add: (data: any) => {
    return request.post('/role/add', data);
  },

  update: (id: number, data: any) => {
    return request.put(`/role/update/${id}`, data);
  },

  delete: (id: number) => {
    return request.delete(`/role/delete/${id}`);
  }
};
