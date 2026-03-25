import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeMode, MessageItem } from '@/types';

interface GlobalState {
  // 状态
  loading: boolean;
  theme: ThemeMode;
  collapsed: boolean;
  message: MessageItem | null;

  // 方法
  setLoading: (loading: boolean) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
  showMessage: (message: MessageItem) => void;
  clearMessage: () => void;
  reset: () => void;
}

const initialState = {
  loading: false,
  theme: 'light' as ThemeMode,
  collapsed: false,
  message: null
};

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setLoading: (loading) => {
        set({ loading });
      },

      setTheme: (theme) => {
        set({ theme });
      },

      toggleTheme: () => {
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' }));
      },

      setCollapsed: (collapsed) => {
        set({ collapsed });
      },

      toggleCollapsed: () => {
        set((state) => ({ collapsed: !state.collapsed }));
      },

      showMessage: (message) => {
        set({ message });
        // 自动清除
        setTimeout(() => {
          get().clearMessage();
        }, message.duration || 3000);
      },

      clearMessage: () => {
        set({ message: null });
      },

      reset: () => {
        set(initialState);
      }
    }),
    {
      name: 'global-storage',
      partialize: (state) => ({
        theme: state.theme,
        collapsed: state.collapsed
      })
    }
  )
);