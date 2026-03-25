'use client';

import React from 'react';
import { Layout } from 'antd';
import { useGlobalStore } from '@/store/globalStore';
import { SideMenu } from './SideMenu';
import { TopHeader } from './TopHeader';

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * 主布局组件
 */
export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { collapsed } = useGlobalStore();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SideMenu />
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
        <TopHeader />
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#fff',
            borderRadius: 8
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};