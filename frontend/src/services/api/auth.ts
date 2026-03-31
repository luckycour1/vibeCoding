import request from '../request';
import { LoginParams, LoginResult, UserInfo, ApiResponse, PageResult, PageParams } from '@/types';

/**
 * 认证 API
 */
export const authApi = {
  /**
   * 用户登录
   * POST /user/login
   */
  login: (params: LoginParams): Promise<ApiResponse<LoginResult>> => {
    return request.post('/user/login', params);
  },

  /**
   * 用户注册
   * POST /user/register
   */
  register: (params: any): Promise<ApiResponse<any>> => {
    return request.post('/user/register', params);
  },

  /**
   * 刷新 token
   * POST /user/refresh-token
   */
  refreshToken: (refreshToken: string): Promise<ApiResponse<LoginResult>> => {
    return request.post('/user/refresh-token', { refreshToken });
  },

  /**
   * 退出登录
   * POST /user/logout
   */
  logout: (): Promise<ApiResponse<void>> => {
    return request.post('/user/logout');
  }
};

/**
 * 用户管理 API
 */
export const userApi = {
  /**
   * 根据ID查询用户
   * GET /user/find?id={id}
   */
  getById: (id: number): Promise<ApiResponse<UserInfo>> => {
    return request.get('/user/find', { params: { id } });
  },

  /**
   * 分页查询用户
   * POST /user/page
   */
  page: (params: any): Promise<ApiResponse<PageResult<any>>> => {
    return request.post('/user/page', params);
  },

  /**
   * 创建用户
   * POST /user/create
   */
  create: (data: {
    username: string;
    password: string;
    nickname?: string;
    email?: string;
    phone?: string;
    department?: string;
    departmentId?: number;
    position?: string;
    status?: number;
    roles?: string[];
  }): Promise<ApiResponse<any>> => {
    return request.post('/user/create', data);
  },

  /**
   * 更新用户
   * PUT /user/update?id={id}
   */
  update: (id: number, data: {
    nickname?: string;
    email?: string;
    phone?: string;
    department?: string;
    departmentId?: number;
    position?: string;
    status?: number;
    roles?: string[];
  }): Promise<ApiResponse<any>> => {
    return request.put('/user/update', data, { params: { id } });
  },

  /**
   * 删除用户
   * DELETE /user/delete?id={id}
   */
  delete: (id: number): Promise<ApiResponse<number>> => {
    return request.delete('/user/delete', { params: { id } });
  },

  /**
   * 查询所有用户
   * GET /user/query
   */
  queryAll: (): Promise<ApiResponse<any[]>> => {
    return request.get('/user/query');
  }
};

/**
 * 角色管理 API
 */
export const roleApi = {
  /**
   * 根据ID查询角色
   * GET /role/find?id={id}
   */
  getById: (id: number): Promise<ApiResponse<any>> => {
    return request.get('/role/find', { params: { id } });
  },

  /**
   * 分页查询角色
   * POST /role/page
   */
  page: (params: any): Promise<ApiResponse<PageResult<any>>> => {
    return request.post('/role/page', params);
  },

  /**
   * 创建角色
   * POST /role/create
   */
  create: (data: {
    name: string;
    code: string;
    description?: string;
    status?: number;
  }): Promise<ApiResponse<any>> => {
    return request.post('/role/create', data);
  },

  /**
   * 更新角色
   * PUT /role/update?id={id}
   */
  update: (id: number, data: {
    name?: string;
    code?: string;
    description?: string;
    status?: number;
  }): Promise<ApiResponse<any>> => {
    return request.put('/role/update', data, { params: { id } });
  },

  /**
   * 删除角色
   * DELETE /role/delete?id={id}
   */
  delete: (id: number): Promise<ApiResponse<number>> => {
    return request.delete('/role/delete', { params: { id } });
  },

  /**
   * 查询所有角色
   * GET /role/query
   */
  queryAll: (): Promise<ApiResponse<any[]>> => {
    return request.get('/role/query');
  },

  /**
   * 获取角色列表（含用户统计）
   * GET /role/list
   */
  list: (): Promise<ApiResponse<any[]>> => {
    return request.get('/role/list');
  },

  /**
   * 获取用户总数
   * GET /role/stats/user-count
   */
  userCount: (): Promise<ApiResponse<number>> => {
    return request.get('/role/stats/user-count');
  }
};

/**
 * 部门管理 API
 */
export const departmentApi = {
  /**
   * 根据ID查询部门
   * GET /department/find?id={id}
   */
  getById: (id: number): Promise<ApiResponse<any>> => {
    return request.get('/department/find', { params: { id } });
  },

  /**
   * 分页查询部门
   * POST /department/page
   */
  page: (params: any): Promise<ApiResponse<PageResult<any>>> => {
    return request.post('/department/page', params);
  },

  /**
   * 创建部门
   * POST /department/create
   */
  create: (data: {
    name: string;
    code: string;
    description?: string;
    status?: number;
  }): Promise<ApiResponse<any>> => {
    return request.post('/department/create', data);
  },

  /**
   * 更新部门
   * PUT /department/update?id={id}
   */
  update: (id: number, data: {
    name?: string;
    code?: string;
    description?: string;
    status?: number;
  }): Promise<ApiResponse<any>> => {
    return request.put('/department/update', data, { params: { id } });
  },

  /**
   * 删除部门
   * DELETE /department/delete?id={id}
   */
  delete: (id: number): Promise<ApiResponse<number>> => {
    return request.delete('/department/delete', { params: { id } });
  },

  /**
   * 查询所有部门
   * GET /department/query
   */
  queryAll: (): Promise<ApiResponse<any[]>> => {
    return request.get('/department/query');
  },

  /**
   * 获取启用的部门列表
   * GET /department/enabled
   */
  enabled: (): Promise<ApiResponse<any[]>> => {
    return request.get('/department/enabled');
  },

  /**
   * 获取部门员工总数
   * GET /department/stats/employee-count
   */
  employeeCount: (): Promise<ApiResponse<number>> => {
    return request.get('/department/stats/employee-count');
  }
};

/**
 * 权限管理 API
 */
export const permissionApi = {
  /**
   * 获取所有权限树
   * GET /permission/tree
   */
  tree: (): Promise<ApiResponse<any[]>> => {
    return request.get('/permission/tree');
  },

  /**
   * 获取角色权限树（包含选中状态）
   * GET /permission/role/{roleId}
   */
  rolePermissions: (roleId: number): Promise<ApiResponse<any[]>> => {
    return request.get(`/permission/role/${roleId}`);
  },

  /**
   * 保存角色权限
   * POST /permission/role/{roleId}
   */
  saveRolePermissions: (roleId: number, permissionIds: number[]): Promise<ApiResponse<void>> => {
    return request.post(`/permission/role/${roleId}`, permissionIds);
  },

  /**
   * 获取当前用户的菜单权限树
   * GET /permission/user/menu
   */
  userMenu: (): Promise<ApiResponse<any[]>> => {
    return request.get('/permission/user/menu');
  },

  /**
   * 获取当前用户的所有权限编码
   * GET /permission/user/codes
   */
  userCodes: (): Promise<ApiResponse<string[]>> => {
    return request.get('/permission/user/codes');
  }
};