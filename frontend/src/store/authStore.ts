import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserInfo, LoginParams, LoginResult } from '@/types';
import { storage } from '@/utils/storage';
import { STORAGE_KEYS } from '@/config';

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
        storage.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        if (tokens.refreshToken) {
          storage.set(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
        }
      },

      login: async () => {
        // 登录逻辑由页面组件处理
      },

      logout: async () => {
        get().clearAuth();
      },

      refreshAccessToken: async () => {
        // 暂时不实现刷新 token 功能
        return false;
      },

      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false
        });
        storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
        storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
        storage.remove(STORAGE_KEYS.USER_INFO);
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
