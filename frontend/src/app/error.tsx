"use client";
import React from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1>500 - 服务器内部错误</h1>
      <p>{error?.message || '抱歉，发生了未知错误。'}</p>
      <button onClick={reset} style={{ marginTop: 20 }}>重试</button>
    </div>
  );
}
