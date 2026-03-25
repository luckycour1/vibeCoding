import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PermissionItem, RouteItem } from '@/types';

interface PermissionState {
  // 状态
  permissions: PermissionItem[];
  menus: RouteItem[];
  flatPermissions: Set<string>;

  // 方法
  setPermissions: (permissions: PermissionItem[]) => void;
  setMenus: (menus: RouteItem[]) => void;
  hasPermission: (code: string) => boolean;
  hasRoutePermission: (path: string) => boolean;
  generateMenus: (permissions: PermissionItem[]) => RouteItem[];
  clearPermissions: () => void;
}

export const usePermissionStore = create<PermissionState>()(
  persist(
    (set, get) => ({
      permissions: [],
      menus: [],
      flatPermissions: new Set(),

      setPermissions: (permissions) => {
        const flatPerms = new Set<string>();

        const flatten = (items: PermissionItem[]) => {
          items.forEach((item) => {
            flatPerms.add(item.path);
            item.buttons.forEach((btn) => flatPerms.add(`${item.path}:${btn}`));
            if (item.children) {
              flatten(item.children);
            }
          });
        };

        flatten(permissions);

        set({
          permissions,
          flatPermissions: flatPerms
        });

        // 自动生成菜单
        const menus = get().generateMenus(permissions);
        set({ menus });
      },

      setMenus: (menus) => {
        set({ menus });
      },

      hasPermission: (code) => {
        return get().flatPermissions.has(code);
      },

      hasRoutePermission: (path) => {
        const { flatPermissions } = get();
        // 精确匹配或前缀匹配
        for (const perm of Array.from(flatPermissions)) {
          if (path === perm || path.startsWith(`${perm}/`)) {
            return true;
          }
        }
        return false;
      },

      generateMenus: (permissions) => {
        const convert = (items: PermissionItem[]): RouteItem[] => {
          return items
            .filter((item) => !item.path.includes(':')) // 过滤动态路由
            .map((item) => ({
              path: item.path,
              name: item.name,
              icon: item.icon,
              children: item.children ? convert(item.children) : undefined
            }));
        };

        return convert(permissions);
      },

      clearPermissions: () => {
        set({
          permissions: [],
          menus: [],
          flatPermissions: new Set()
        });
      }
    }),
    {
      name: 'permission-storage',
      partialize: (state) => ({
        permissions: state.permissions,
        menus: state.menus
      })
    }
  )
);