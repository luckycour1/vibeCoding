'use client';

import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { authApi } from '@/services/api/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: any) => {
    // 调试输出，查看表单实际提交的值
    console.log('register submit values:', values);
    setLoading(true);
    try {
      const result = await authApi.register({
        username: values.username,
        password: values.password,
        nickname: values.nickname
      }) as unknown as { code: number; message: string; data: any };
      if (result.code !== 200) {
        message.error(result.message || '注册失败');
        return;
      }
      message.success('注册成功，请登录！');
      router.push('/login');
    } catch (error: any) {
      message.error(error?.response?.data?.message || error?.message || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <div style={{ width: 420, padding: 48, background: 'rgba(255,255,255,0.95)', borderRadius: 24, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <SafetyOutlined style={{ fontSize: 48, color: '#1890ff' }} />
          <h1 style={{ margin: '16px 0 8px' }}>用户注册</h1>
          <p style={{ color: '#888' }}>创建你的账号</p>
        </div>
        <Form form={form} name="register" onFinish={onFinish} autoComplete="off" size="large">
          <Form.Item 
            name="username" 
            rules={[{ required: true, message: '请输入用户名' }]} 
            normalize={value => (value ? value.trim() : '')}
          >
            <Input prefix={<UserOutlined style={{ color: '#1890ff' }} />} placeholder="用户名" />
          </Form.Item>
          <Form.Item 
            name="nickname" 
            rules={[{ required: true, message: '请输入昵称' }]} 
            normalize={value => (value ? value.trim() : '')}
          >
            <Input prefix={<UserOutlined style={{ color: '#1890ff' }} />} placeholder="昵称" />
          </Form.Item>
          <Form.Item 
            name="password" 
            rules={[{ required: true, message: '请输入密码' }]} 
            normalize={value => (value ? value.trim() : '')}
          >
            <Input.Password prefix={<LockOutlined style={{ color: '#1890ff' }} />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>注册</Button>
          </Form.Item>
          <Form.Item>
            <a href="/login">已有账号？去登录</a>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
