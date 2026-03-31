'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Layout, Menu } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  FileOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';
import { usePermissionStore } from '@/store/permissionStore';

const { Sider } = Layout;

// 图标名称到Ant Design图标组件的映射
const iconMap: Record<string, React.ReactNode> = {
  home: <HomeOutlined />,
  dashboard: <DashboardOutlined />,
  user: <UserOutlined />,
  team: <TeamOutlined />,
  'safety-certificate': <SafetyCertificateOutlined />,
  setting: <SettingOutlined />,
  file: <FileOutlined />,
};


export const SideMenu: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { menus } = usePermissionStore();

  // 将后端返回的菜单数据转换为Ant Design Menu需要的格式
  const menuItems = useMemo(() => {
    const convert = (items: any[]): any[] => {
      return items
        .map(item => ({
          key: item.path && item.path.trim() !== '' ? item.path : (item.id ? String(item.id) : `menu-${item.name}`),
          icon: item.icon ? iconMap[item.icon] || null : null,
          label: item.name,
          children: item.children ? convert(item.children) : undefined
        }));
    };
    return convert(menus);
  }, [menus]);

  // 根据路径获取应该展开的父菜单项
  const getOpenKeysFromPath = (path: string, menuItems: any[]): string[] => {
    const openKeys: string[] = [];
    // 检查每个有子菜单的菜单项
    menuItems.forEach(item => {
      if (item.children) {
        // 检查当前路径是否是该子菜单项下的路径
        const childMatch = item.children.find(child => child.key === path);
        if (childMatch) {
          openKeys.push(item.key);
        }
      }
    });
    return openKeys;
  };

  // 初始展开项根据当前路径计算
  const [openKeys, setOpenKeys] = useState<string[]>(() => {
    const initialOpenKeys = getOpenKeysFromPath(pathname, menuItems);
    return initialOpenKeys;
  });

  // 当菜单数据变化时，更新展开的父菜单项
  useEffect(() => {
    const newOpenKeys = getOpenKeysFromPath(pathname, menuItems);
    if (newOpenKeys.length > 0) {
      setOpenKeys(newOpenKeys);
    }
  }, [menuItems]); // 仅依赖 menuItems

  // 当路径变化时，更新展开的父菜单项
  useEffect(() => {
    const newOpenKeys = getOpenKeysFromPath(pathname, menuItems);
    if (newOpenKeys.length > 0) {
      // 合并现有展开项，确保父菜单项展开
      setOpenKeys(prevKeys => {
        const combined = [...prevKeys];
        newOpenKeys.forEach(key => {
          if (!combined.includes(key)) {
            combined.push(key);
          }
        });
        return combined;
      });
    }
  }, [pathname, menuItems]);

  // 处理菜单点击
  const handleClick = ({ key }: { key: string }) => {
    if (key && key.startsWith('/')) {
      router.push(key);
    }
  };

  // 处理父菜单展开/收起
  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  return (
    <Sider
      trigger={null}
      collapsible
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        background: 'linear-gradient(180deg, #001529 0%, #001529 100%)',
      }}
    >
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 20,
          fontWeight: 'bold',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          letterSpacing: 2,
        }}
      >
        🦞 Vibe
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[pathname]}
        openKeys={openKeys}
        items={menuItems}
        onClick={handleClick}
        onOpenChange={handleOpenChange}
        style={{
          borderRight: 0,
          background: 'transparent',
        }}
      />
    </Sider>
  );
};
