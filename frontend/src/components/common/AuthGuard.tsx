'use client';
import { useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { checkLoginStatus, clearLoginStatus, getToken } from '@/utils/auth';
import request from '@/services/request';

// 不需要认证的页面路径
const PUBLIC_PATHS = ['/login', '/register'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, setTokens } = useAuthStore();

  const handleUnauthorized = useCallback(() => {
    clearLoginStatus();
    // 重置 zustand 状态
    localStorage.removeItem('auth-storage');
    router.replace('/login');
  }, [router]);

  const checkAuth = useCallback(async () => {
    // 白名单路径直接放行
    if (PUBLIC_PATHS.some(path => pathname === path || pathname?.startsWith(path + '/'))) {
      return;
    }

    // 检查登录状态
    if (!checkLoginStatus()) {
      handleUnauthorized();
      return;
    }

    // token 有效但 zustand 未同步时自动同步
    const token = getToken();
    if (token) {
      // 直接设置 token，不调用 profile 接口验证
      setTokens({ token });
    } else {
      handleUnauthorized();
    }
  }, [isAuthenticated, setTokens, handleUnauthorized, pathname]);

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pathname) {
      checkAuth();
    }
  }, [pathname, checkAuth]);

  return <>{children}</>;
}
