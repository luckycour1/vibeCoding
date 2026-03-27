/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // API路由代理 - 将 /api/* 请求转发到网关
  async rewrites() {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

    return [
      {
        // 匹配 /api/user/* -> 转发到网关的 /api/user/*
        source: '/api/user/:path*',
        destination: `${API_BASE_URL}/user/:path*`,
      },
      {
        // 通用匹配，兜底所有 /api/* 请求
        source: '/api/:path*',
        destination: `${API_BASE_URL}/:path*`,
      },
    ];
  },

  // 确保跨域请求正确处理
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

export default nextConfig;
