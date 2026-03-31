'use client';

import React from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { usePermissionStore } from '@/store/permissionStore';
import { STORAGE_KEYS } from '@/config';
import { storage } from '@/utils/storage';
import { setLoginStatus } from '@/utils/auth';
import { authApi } from '@/services/api/auth';
import { permissionApi } from '@/services/api/auth';
import { LoginResult, PermissionItem } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setTokens } = useAuthStore();
  const { setPermissions, setPermissionCodes } = usePermissionStore();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // 调用后端API
      const result = await authApi.login({
        username: values.username,
        password: values.password
      });

      // 检查业务错误码
      if (result.code !== 200) {
        message.error(result.message || '登录失败');
        return;
      }

      // 保存用户信息
      setUser({
        userId: result.data.userId || 1,
        username: result.data.username || values.username,
        nickname: result.data.nickname || values.username,
        roles: result.data.roles || ['admin']
      });

      // 保存Token
      setTokens({
        token: result.data.token,
        refreshToken: result.data.refreshToken || '',
        expiresIn: 7200,
        tokenType: 'Bearer'
      });
      setLoginStatus(result.data.token);

      // 记住我
      storage.set(STORAGE_KEYS.REMEMBER_ME, values.remember);

      // 转换后端权限数据为前端格式
      const convertPermissions = (permissions: any[]): PermissionItem[] => {
        return permissions
          .map(perm => ({
            menuId: String(perm.id),
            path: perm.path || '',
            name: perm.name || '',
            icon: perm.icon || '',
            buttons: [], // 菜单权限没有按钮，按钮权限通过user/codes获取
            children: perm.children ? convertPermissions(perm.children) : undefined
          }));
      };

      // 获取并设置权限
      try {
        // 并行获取菜单权限和权限编码
        const [menuRes, codesRes] = await Promise.all([
          permissionApi.userMenu(),
          permissionApi.userCodes()
        ]);

        let finalPermissions: PermissionItem[] = [];
        let hasMenuPermissions = false;
        let hasPermissionCodes = false;
        let permissionCodes: string[] = [];

        // 处理菜单权限
        if (menuRes.code === 200 && menuRes.data && menuRes.data.length > 0) {
          // 转换后端权限数据为前端格式
          const convertedPermissions = convertPermissions(menuRes.data);
          finalPermissions = convertedPermissions;
          hasMenuPermissions = true;
          console.log('获取到菜单权限:', menuRes.data.length, '项');
        } else if (menuRes.code !== 200) {
          console.error('获取菜单权限失败:', menuRes.message);
        }

        // 处理权限编码
        if (codesRes.code === 200 && codesRes.data && codesRes.data.length > 0) {
          setPermissionCodes(codesRes.data);
          permissionCodes = codesRes.data;
          hasPermissionCodes = true;
          console.log('权限编码已存储:', codesRes.data.length, '项');
        } else if (codesRes.code !== 200) {
          console.error('获取权限编码失败:', codesRes.message);
        }

        // 判断权限是否为空：既没有菜单权限也没有权限编码
        const isEmptyPermissions = !hasMenuPermissions && !hasPermissionCodes;

        if (isEmptyPermissions) {
          // 权限为空，只显示首页和仪表盘
          console.log('权限为空，生成默认菜单（首页和仪表盘）');
          finalPermissions = generateDefaultMenu();
        } else if (!hasMenuPermissions && hasPermissionCodes) {
          // 有权限编码但没有菜单权限，根据权限编码生成菜单
          console.log('有权限编码但无菜单权限，根据权限编码生成菜单');
          finalPermissions = generateMenuFromCodes(permissionCodes);
        }
        // 如果有菜单权限，已经使用菜单权限（无需额外处理）

        // 设置最终的权限数据
        if (finalPermissions.length > 0) {
          setPermissions(finalPermissions);
          console.log('设置权限菜单:', finalPermissions.length, '项');
        } else {
          console.warn('没有设置任何权限菜单');
        }
      } catch (error) {
        console.error('获取权限失败:', error);
      }

      message.success('登录成功！');
      router.push('/dashboard');
    } catch (error: any) {
      // 错误已在拦截器中处理，这里只记录日志
      console.error('登录失败:', error);
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

// 编码到菜单项的映射（用于当后端菜单为空时生成默认菜单）
const codeToMenuItem: Record<string, { path: string; name: string; icon?: string }> = {
  dashboard: { path: '/dashboard/dashboard', name: '仪表盘', icon: 'DashboardOutlined' },
  user: { path: '/dashboard/users', name: '用户管理', icon: 'UserOutlined' },
  role: { path: '/dashboard/roles', name: '角色管理', icon: 'SafetyCertificateOutlined' },
  department: { path: '/dashboard/departments', name: '部门管理', icon: 'TeamOutlined' },
  settings: { path: '/dashboard/settings', name: '系统设置', icon: 'SettingOutlined' },
  system: { path: '/dashboard/system', name: '系统管理', icon: 'SettingOutlined' },
  home: { path: '/dashboard', name: '首页', icon: 'HomeOutlined' },
  'user-management': { path: '/dashboard/users', name: '用户管理', icon: 'UserOutlined' },
};

/**
 * 根据权限编码数组生成菜单权限项
 */
function generateMenuFromCodes(codes: string[]): PermissionItem[] {
  const menuItems: PermissionItem[] = [];
  const processed = new Set<string>();

  codes.forEach(code => {
    // 跳过按钮权限（包含冒号）
    if (code.includes(':')) return;

    // 如果已经有映射项，使用映射项
    if (codeToMenuItem[code]) {
      const item = codeToMenuItem[code];
      // 避免重复添加相同路径的菜单
      if (!processed.has(item.path)) {
        menuItems.push({
          menuId: `generated-${code}`,
          path: item.path,
          name: item.name,
          icon: item.icon || '',
          buttons: [],
          children: undefined
        });
        processed.add(item.path);
      }
    } else {
      // 默认生成：路径为 /dashboard/{code}，名称为 code
      const path = `/dashboard/${code.toLowerCase()}`;
      if (!processed.has(path)) {
        menuItems.push({
          menuId: `generated-${code}`,
          path,
          name: code,
          icon: '',
          buttons: [],
          children: undefined
        });
        processed.add(path);
      }
    }
  });

  return menuItems;
}

/**
 * 生成默认菜单（当权限为空时）：只显示首页和仪表盘
 */
function generateDefaultMenu(): PermissionItem[] {
  return [
    {
      menuId: 'default-home',
      path: '/dashboard',
      name: '首页',
      icon: 'HomeOutlined',
      buttons: [],
      children: undefined
    },
    {
      menuId: 'default-dashboard',
      path: '/dashboard/dashboard',
      name: '仪表盘',
      icon: 'DashboardOutlined',
      buttons: [],
      children: undefined
    }
  ];
}
