import React from 'react';
import { usePermissionStore } from '@/store/permissionStore';

interface AuthComponentProps {
  code: string; // 权限标识
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * 权限组件
 * 根据权限码判断是否渲染子组件
 */
export const AuthComponent: React.FC<AuthComponentProps> = ({
  code,
  children,
  fallback = null
}) => {
  const { hasPermission } = usePermissionStore();

  if (!hasPermission(code)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};