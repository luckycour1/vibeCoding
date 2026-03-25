'use client';

import React from 'react';
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

const { Sider } = Layout;

const menuData = [
  {
    key: '/',
    icon: <HomeOutlined />,
    label: '首页',
  },
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: '仪表盘',
  },
  {
    key: 'user-management',
    icon: <UserOutlined />,
    label: '用户管理',
    children: [
      {
        key: '/users',
        icon: <TeamOutlined />,
        label: '用户列表',
      },
      {
        key: '/roles',
        icon: <SafetyCertificateOutlined />,
        label: '角色管理',
      },
    ],
  },
  {
    key: 'system',
    icon: <SettingOutlined />,
    label: '系统设置',
    children: [
      {
        key: '/settings',
        icon: <SettingOutlined />,
        label: '个人设置',
      },
    ],
  },
];

export const SideMenu: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  // 处理菜单点击
  const handleClick = ({ key }: { key: string }) => {
    if (key && !menuData.find(m => m.key === key)) {
      router.push(key);
    }
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
        defaultSelectedKeys={[pathname]}
        defaultOpenKeys={['user-management', 'system']}
        items={menuData}
        onClick={handleClick}
        style={{ 
          borderRight: 0,
          background: 'transparent',
        }}
      />
    </Sider>
  );
};
