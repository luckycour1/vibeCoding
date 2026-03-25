import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserInfo, TokenData, LoginParams, LoginResult } from '@/types';
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
  setTokens: (tokens: TokenData) => void;
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
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isAuthenticated: true
        });
        storage.set(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
        storage.set(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
      },

      login: async (params) => {
        set({ isLoading: true });
        try {
          // TODO: 调用登录接口
          // const result: LoginResult = await authApi.login(params);
          // get().setUser(result.user);
          // get().setTokens(result.token);
          console.log('Login params:', params);
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          // TODO: 调用登出接口
          // await authApi.logout();
          get().clearAuth();
        } finally {
          set({ isLoading: false });
        }
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          get().clearAuth();
          return false;
        }
        try {
          // TODO: 调用刷新 Token 接口
          // const result: TokenData = await authApi.refreshToken(refreshToken);
          // get().setTokens(result);
          return true;
        } catch {
          get().clearAuth();
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