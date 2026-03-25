import { useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { usePermissionStore } from '@/store/permissionStore';
import { LoginParams } from '@/types';
import { WHITE_LIST } from '@/config';

/**
 * 认证相关 Hook
 */
export function useAuth() {
  const authStore = useAuthStore();
  const permissionStore = usePermissionStore();

  /**
   * 登录
   */
  const login = useCallback(
    async (params: LoginParams) => {
      await authStore.login(params);
      // 登录成功后加载权限
      if (authStore.user?.permissions) {
        permissionStore.setPermissions(authStore.user.permissions);
      }
    },
    [authStore, permissionStore]
  );

  /**
   * 登出
   */
  const logout = useCallback(async () => {
    await authStore.logout();
    permissionStore.clearPermissions();
  }, [authStore, permissionStore]);

  /**
   * 检查路径是否需要认证
   */
  const checkNeedAuth = useCallback((path: string) => {
    return !WHITE_LIST.some((white) => path === white || path.startsWith(`${white}/`));
  }, []);

  /**
   * 检查是否有权限
   */
  const checkPermission = useCallback(
    (code: string) => {
      return permissionStore.hasPermission(code);
    },
    [permissionStore]
  );

  /**
   * 检查路由权限
   */
  const checkRoutePermission = useCallback(
    (path: string) => {
      // 白名单直接放行
      if (!checkNeedAuth(path)) {
        return true;
      }
      // 已登录且有权访问
      if (authStore.isAuthenticated) {
        return permissionStore.hasRoutePermission(path);
      }
      return false;
    },
    [authStore.isAuthenticated, permissionStore, checkNeedAuth]
  );

  return {
    // 状态
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading,
    permissions: permissionStore.permissions,
    menus: permissionStore.menus,

    // 方法
    login,
    logout,
    checkNeedAuth,
    checkPermission,
    checkRoutePermission,
    refreshToken: authStore.refreshAccessToken
  };
}