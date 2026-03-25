'use client';

import React from 'react';
import { Layout, Dropdown, Avatar, Badge, Space, theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useGlobalStore } from '@/store/globalStore';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

const { Header } = Layout;

/**
 * 顶部头部组件
 */
export const TopHeader: React.FC = () => {
  const router = useRouter();
  const { collapsed, toggleCollapsed } = useGlobalStore();
  const { user, logout } = useAuthStore();
  const {
    token: { colorBgContainer }
  } = theme.useToken();

  // 用户下拉菜单
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置'
    },
    {
      type: 'divider' as const
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录'
    }
  ];

  // 处理用户菜单点击
  const handleUserMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'profile':
        router.push('/profile');
        break;
      case 'settings':
        router.push('/settings');
        break;
      case 'logout':
        logout();
        router.push('/login');
        break;
    }
  };

  return (
    <Header
      style={{
        padding: '0 24px',
        background: colorBgContainer,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0,21,41,0.08)'
      }}
    >
      <div style={{ fontSize: 18, cursor: 'pointer' }} onClick={toggleCollapsed}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </div>

      <Space size={24}>
        {/* 通知 */}
        <Badge count={5} size="small">
          <BellOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
        </Badge>

        {/* 用户 */}
        <Dropdown
          menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
          placement="bottomRight"
        >
          <Space style={{ cursor: 'pointer' }}>
            <Avatar src={user?.avatar} icon={<UserOutlined />} />
            <span>{user?.nickname || user?.username || '用户'}</span>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
};