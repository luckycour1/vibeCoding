import React from 'react';
import { Button, ButtonProps } from 'antd';
import { usePermissionStore } from '@/store/permissionStore';

interface AuthButtonProps extends ButtonProps {
  code: string; // 权限标识
  children: React.ReactNode;
}

/**
 * 权限按钮组件
 * 根据权限码判断是否显示按钮
 */
export const AuthButton: React.FC<AuthButtonProps> = ({ code, children, ...props }) => {
  const { hasPermission } = usePermissionStore();

  if (!hasPermission(code)) {
    return null;
  }

  return <Button {...props}>{children}</Button>;
};