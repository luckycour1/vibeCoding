import React from "react";

export default function NotFound() {
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1>404 - 页面未找到</h1>
      <p>您访问的页面不存在。</p>
      <a href="/" style={{ color: '#1890ff' }}>返回首页</a>
    </div>
  );
}
