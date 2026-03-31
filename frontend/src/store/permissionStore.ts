import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PermissionItem, RouteItem } from '@/types';

interface PermissionState {
  // 状态
  permissions: PermissionItem[];
  menus: RouteItem[];
  flatPermissions: Set<string>;
  permissionCodes: Set<string>; // 存储后端返回的权限编码字符串

  // 方法
  setPermissions: (permissions: PermissionItem[]) => void;
  setPermissionCodes: (codes: string[]) => void; // 设置权限编码
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
      permissionCodes: new Set(),

      setPermissions: (permissions) => {
        const flatPerms = new Set<string>();

        // 确保每个权限项都有buttons数组
        const processPermissions = (items: PermissionItem[]): PermissionItem[] => {
          return items.map(item => ({
            ...item,
            buttons: item.buttons || [],
            children: item.children ? processPermissions(item.children) : undefined
          }));
        };

        const processedPermissions = processPermissions(permissions);

        const flatten = (items: PermissionItem[]) => {
          items.forEach((item) => {
            flatPerms.add(item.path);
            item.buttons.forEach((btn) => flatPerms.add(`${item.path}:${btn}`));
            if (item.children) {
              flatten(item.children);
            }
          });
        };

        flatten(processedPermissions);

        set({
          permissions: processedPermissions,
          flatPermissions: flatPerms
        });

        // 自动生成菜单
        const menus = get().generateMenus(processedPermissions);
        set({ menus });
      },

      setPermissionCodes: (codes) => {
        const permissionCodes = new Set(codes);
        set({ permissionCodes });
      },

      setMenus: (menus) => {
        set({ menus });
      },

      hasPermission: (code) => {
        const { flatPermissions, permissionCodes } = get();
        return flatPermissions.has(code) || permissionCodes.has(code);
      },

      hasRoutePermission: (path) => {
        const { flatPermissions, permissionCodes } = get();

        // 检查 flatPermissions（菜单路径）
        for (const perm of Array.from(flatPermissions)) {
          if (path === perm || path.startsWith(`${perm}/`)) {
            return true;
          }
        }

        // 检查 permissionCodes（权限编码）
        // 路径可能以斜杠开头，而编码可能没有，所以需要转换
        const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
        for (const code of Array.from(permissionCodes)) {
          // 如果编码包含冒号（如 "user:view"），则是按钮权限，不是路由权限
          if (code.includes(':')) continue;

          // 检查编码是否匹配路径（忽略前导斜杠）
          if (normalizedPath === code || normalizedPath.startsWith(`${code}/`)) {
            return true;
          }
          // 检查编码是否等于路径（带斜杠）
          if (path === `/${code}` || path.startsWith(`/${code}/`)) {
            return true;
          }
          // 检查路径是否包含编码作为路径段（例如编码"user"匹配路径"/dashboard/users"）
          // 将路径按斜杠分割，检查编码是否等于任何路径段（忽略大小写和复数）
          const pathSegments = path.toLowerCase().split('/').filter(Boolean);
          const codeLower = code.toLowerCase();
          if (pathSegments.some(segment => segment === codeLower ||
                                         segment.startsWith(codeLower) ||
                                         codeLower.startsWith(segment))) {
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
              id: item.menuId,
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
          flatPermissions: new Set(),
          permissionCodes: new Set()
        });
      }
    }),
    {
      name: 'permission-storage',
      partialize: (state) => ({
        permissions: state.permissions,
        menus: state.menus,
        permissionCodes: Array.from(state.permissionCodes) // 将 Set 转换为数组以便序列化
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // 将数组转换回 Set
          state.permissionCodes = new Set(state.permissionCodes || []);
        }
      }
    }
  )
);