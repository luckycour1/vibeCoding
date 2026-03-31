'use client';

import React from 'react';
import AuthGuard from '@/components/common/AuthGuard';
import { MainLayout } from '@/components/layout/MainLayout';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <MainLayout>{children}</MainLayout>
    </AuthGuard>
  );
}