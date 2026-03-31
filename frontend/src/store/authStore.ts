import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserInfo, LoginParams, LoginResult, ApiResponse } from '@/types';

interface AuthState {
  // 状态
  user: UserInfo | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // 方法
  setUser: (user: UserInfo | null) => void;
  setTokens: (tokens: Partial<LoginResult>) => void;
  login: (params: LoginParams) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      setTokens: (tokens) => {
        const accessToken = tokens.token || '';
        set({
          accessToken,
          refreshToken: tokens.refreshToken || '',
          isAuthenticated: true
        });
        // 只用 user_token 明文 localStorage
        localStorage.setItem('user_token', accessToken);
        if (tokens.refreshToken) {
          localStorage.setItem('refresh_token', tokens.refreshToken);
        }
      },

      login: async (params: LoginParams) => {
        const { authApi } = await import('@/services/api/auth');
        const result: ApiResponse<LoginResult> = await authApi.login(params);
        if (result.code === 200) {
          set({
            user: {
              userId: result.data.userId || 1,
              username: result.data.username || params.username,
              nickname: result.data.nickname || params.username,
              roles: result.data.roles || ['user']
            },
            accessToken: result.data.token || '',
            refreshToken: result.data.refreshToken || '',
            isAuthenticated: true
          });
          // 保存 token 到 localStorage
          localStorage.setItem('user_token', result.data.token || '');
          if (result.data.refreshToken) {
            localStorage.setItem('refresh_token', result.data.refreshToken);
          }
        }
      },

      logout: async () => {
        get().clearAuth();
      },

      refreshAccessToken: async () => {
        // 企业级自动续签逻辑
        try {
          const refreshToken = localStorage.getItem('refresh_token');
          if (!refreshToken) return false;
          // 动态引入刷新接口，避免循环 dependency
          const { refreshTokenApi } = await import('@/services/api/refresh');
          const res = await refreshTokenApi(refreshToken);
          // res 是 business data, not AxiosResponse
          if (res.code === 200 && res.data?.token) {
            set({
              accessToken: res.data.token,
              refreshToken: res.data.refreshToken || refreshToken,
              isAuthenticated: true
            });
            localStorage.setItem('user_token', res.data.token);
            if (res.data.refreshToken) {
              localStorage.setItem('refresh_token', res.data.refreshToken);
            }
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },

      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false
        });
        localStorage.removeItem('user_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_info');
      }
    }),
    {
      name: 'auth-storage',
      // 只持久化 user and isAuthenticated, token only go to localStorage
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);