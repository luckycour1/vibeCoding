
import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vibe Coding - AI 开发平台',
  description: 'AI 驱动的开发平台'
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
            50% { transform: translateY(-20px) scale(1.1); opacity: 1; }
          }
          body { margin: 0; padding: 0; }
          .login-orb:nth-child(odd) { left: calc(var(--i) * 5% + 10%); top: calc(var(--i) * 8% + 5%); width: calc(80px + var(--i) * 10px); height: calc(80px + var(--i) * 10px); }
          .login-orb:nth-child(even) { right: calc(var(--i) * 5% + 10%); bottom: calc(var(--i) * 8% + 5%); width: calc(60px + var(--i) * 8px); height: calc(60px + var(--i) * 8px); }
        `}</style>
      </head>
      <body>
        <AntdRegistry>
          {children}
        </AntdRegistry>
      </body>
    </html>
  );
}