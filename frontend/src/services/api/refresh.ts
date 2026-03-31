// 刷新 token 接口实现
import request from '../request';
import { ApiResponse, LoginResult } from '@/types';

/**
 * 刷新 token
 * POST /user/refresh-token
 * @param refreshToken - refresh token 字符串
 */
export function refreshTokenApi(refreshToken: string): Promise<ApiResponse<LoginResult>> {
  return request.post('/user/refresh-token', { refreshToken });
}
