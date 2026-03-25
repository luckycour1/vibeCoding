'use client';

import React from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { usePermissionStore } from '@/store/permissionStore';
import { STORAGE_KEYS } from '@/config';
import { storage } from '@/utils/storage';
import { authApi } from '@/services/api/auth';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setTokens } = useAuthStore();
  const { setPermissions } = usePermissionStore();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // 调用真实后端API
      const result = await authApi.login({
        username: values.username,
        password: values.password
      });

      // 保存用户信息
      setUser({
        userId: result.user?.userId || 1,
        username: result.user?.username || values.username,
        nickname: result.user?.nickname || values.username,
        roles: result.user?.roles || ['admin']
      });

      // 保存Token
      setTokens({
        accessToken: result.token,
        refreshToken: '',
        expiresIn: result.expiresIn || 7200,
        tokenType: result.tokenType || 'Bearer'
      });

      // 记住我
      storage.set(STORAGE_KEYS.REMEMBER_ME, values.remember);

      // 设置权限
      setPermissions([]);

      message.success('登录成功！');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('登录失败:', error);
      message.error(error.message || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.background}>
        {[...Array(20)].map((_, i) => (
          <div key={i} style={{ ...styles.orb, ...{ '--i': i } as any }} />
        ))}
      </div>
      
      <div style={styles.loginBox}>
        <div style={styles.header}>
          <div style={styles.logo}>
            <SafetyOutlined style={{ fontSize: 48, color: '#1890ff' }} />
          </div>
          <h1 style={styles.title}>Vibe Coding</h1>
          <p style={styles.subtitle}>AI 驱动的开发平台</p>
        </div>

        <Form
          form={form}
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          size="large"
          style={styles.form}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: '#1890ff' }} />} 
              placeholder="用户名 / Username"
              style={styles.input}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password 
              prefix={<LockOutlined style={{ color: '#1890ff' }} />} 
              placeholder="密码 / Password"
              style={styles.input}
            />
          </Form.Item>

          <Form.Item>
            <div style={styles.row}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#666' }}>记住我</Checkbox>
              </Form.Item>
              <a style={styles.link} href="/forgot-password">
                忘记密码？
              </a>
            </div>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block
              style={styles.button}
            >
              {loading ? '登录中...' : '登 录'}
            </Button>
          </Form.Item>
        </Form>

        <div style={styles.footer}>
          <span style={{ color: '#999' }}>还没有账号？</span>
          <a style={styles.link} href="/register">立即注册</a>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  },
  background: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(24,144,255,0.3) 0%, transparent 70%)',
    animation: 'float 6s ease-in-out infinite',
    animationDelay: 'calc(var(--i) * 0.3s)',
  },
  loginBox: {
    position: 'relative',
    width: 420,
    padding: 48,
    background: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
    backdropFilter: 'blur(10px)',
  },
  header: {
    textAlign: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    margin: '0 auto 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
    borderRadius: 20,
    boxShadow: '0 8px 24px rgba(24,144,255,0.2)',
  },
  title: {
    margin: 0,
    fontSize: 28,
    fontWeight: 700,
    color: '#1a1a2e',
    letterSpacing: 2,
  },
  subtitle: {
    margin: '8px 0 0',
    fontSize: 14,
    color: '#666',
  },
  form: {
    marginTop: 32,
  },
  input: {
    height: 48,
    borderRadius: 12,
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  link: {
    color: '#1890ff',
    fontSize: 14,
    transition: 'color 0.3s',
  },
  button: {
    height: 48,
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 600,
    background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
    border: 'none',
    boxShadow: '0 4px 16px rgba(24,144,255,0.4)',
    transition: 'all 0.3s',
  },
  footer: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 14,
  },
};
