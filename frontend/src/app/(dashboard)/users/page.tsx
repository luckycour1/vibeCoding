'use client';

import React, { useState, useEffect } from 'react';
import {
  Table, Button, Space, Tag, Modal, Form, Input, Select,
  Avatar, message, Popconfirm, Card, Row, Col, Statistic
} from 'antd';
import {
  UserAddOutlined, EditOutlined, DeleteOutlined,
  SearchOutlined, ExportOutlined, ReloadOutlined
} from '@ant-design/icons';
import { userApi, roleApi, departmentApi } from '@/services/api/auth';
import { useAuthStore } from '@/store/authStore';

const { Option } = Select;

export default function UsersPage() {
  const [data, setData] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();
  const { user } = useAuthStore();
  const userRoles = user?.roles || [];
  const canAdd = userRoles.includes('admin') || userRoles.includes('developer');
  const canEdit = userRoles.includes('admin') || userRoles.includes('developer');
  const canDelete = userRoles.includes('admin');

  // 加载用户列表
  const loadUsers = async () => {
    setLoading(true);
    try {
      const result = await userApi.queryAll();
      console.log('用户列表API响应:', result);
      if (result.code === 200) {
        const users = Array.isArray(result.data) ? result.data : [];
        console.log('解析后的用户数组:', users);
        const mappedUsers = users.map((u: any, index: number) => {
          const userObj = {
            key: u.id || String(index),
            id: u.id,
            // 前端显示字段
            name: u.nickname || u.username || '未知',
            email: u.email || '',
            department: u.department || '',
            role: u.position || '普通用户',
            status: u.status === 1 ? 'active' : 'inactive',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`,
            createdAt: u.createdAt || new Date().toISOString().split('T')[0],
            // 保留原始字段供编辑使用
            username: u.username,
            nickname: u.nickname,
            phone: u.phone,
            position: u.position,
            roles: u.roles || [], // 用户角色编码数组
            rawStatus: u.status, // 原始状态值
          };
          console.log(`用户 ${u.id} 映射结果:`, userObj);
          return userObj;
        });
        setData(mappedUsers);
      } else {
        message.error(result.message || '加载用户失败');
        setData([]);
      }
    } catch (error: any) {
      console.error('加载用户失败:', error);
      message.error(error.message || '加载用户失败');
      // 使用空数据
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // 加载部门和角色数据
  const loadReferenceData = async () => {
    try {
      // 加载部门数据
      console.log('正在加载部门数据...');
      const deptResult = await departmentApi.enabled();
      console.log('部门API响应:', deptResult);
      if (deptResult.code === 200) {
        const deptData = Array.isArray(deptResult.data) ? deptResult.data : [];
        console.log('部门数据:', deptData);
        setDepartments(deptData);
      } else {
        console.warn('部门API返回非200状态码:', deptResult.code, deptResult.message);
        setDepartments([]);
      }

      // 加载角色数据
      console.log('正在加载角色数据...');
      const roleResult = await roleApi.list();
      console.log('角色API响应:', roleResult);
      if (roleResult.code === 200) {
        const roleData = Array.isArray(roleResult.data) ? roleResult.data : [];
        console.log('角色数据:', roleData);
        setRoles(roleData);
      } else {
        console.warn('角色API返回非200状态码:', roleResult.code, roleResult.message);
        setRoles([]);
      }
    } catch (error: any) {
      console.error('加载参考数据失败:', error);
      message.error('加载部门或角色数据失败');
      // 确保设置为空数组
      setDepartments([]);
      setRoles([]);
    }
  };

  useEffect(() => {
    loadUsers();
    loadReferenceData();
  }, []);

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.email.toLowerCase().includes(searchText.toLowerCase()) ||
    item.department.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: any) => {
    console.log('编辑用户record对象:', record);
    setEditingUser(record);
    // 映射字段：前端显示字段 -> 后端表单字段
    const formValues = {
      username: record.username,
      nickname: record.nickname,
      email: record.email,
      phone: record.phone,
      department: record.department,
      position: record.position || record.role, // 优先使用原始position字段
      roles: record.roles || [], // 用户角色编码数组
      status: record.rawStatus || (record.status === 'active' ? 1 : 0)
    };
    console.log('编辑用户表单值:', formValues);
    form.setFieldsValue(formValues);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await userApi.delete(id);
      message.success('删除成功');
      loadUsers();
    } catch (error: any) {
      message.error(error.message || '删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser?.id) {
        await userApi.update(editingUser.id, values);
        message.success('更新成功');
      } else {
        await userApi.create(values);
        message.success('添加成功');
      }
      setModalVisible(false);
      form.resetFields();
      loadUsers();
    } catch (error: any) {
      console.error('保存失败:', error);
      message.error(error.message || '保存失败');
    }
  };

  const columns = [
    {
      title: '用户',
      key: 'user',
      render: (_: any, record: any) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserAddOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <div style={{ fontSize: 12, color: '#999' }}>ID: {record.id}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      render: (dept: string) => <Tag color="blue">{dept || '-'}</Tag>,
    },
    {
      title: '角色',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: string[]) => {
        if (!roles || roles.length === 0) {
          return <Tag color="default">无角色</Tag>;
        }
        const colorMap: Record<string, string> = {
          'admin': 'red',
          'product_manager': 'purple',
          'developer': 'green',
          'auditor': 'cyan',
          'user': 'default',
        };
        return (
          <>
            {roles.map((roleCode) => (
              <Tag key={roleCode} color={colorMap[roleCode] || 'default'} style={{ marginBottom: 4 }}>
                {roleCode}
              </Tag>
            ))}
          </>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          {canEdit && (
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          )}
          {canDelete && (
            <Popconfirm
              title="确定要删除这个用户吗？"
              onConfirm={() => record.id && handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={styles.container}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="总用户数" value={data.length} prefix={<UserAddOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃用户"
              value={data.filter(u => u.status === 'active').length}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="部门数量" value={departments.length} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="角色数量" value={roles.length} />
          </Card>
        </Col>
      </Row>

      {/* 用户列表 */}
      <Card title="用户列表" extra={
        <Space>
          <Input 
            placeholder="搜索用户..." 
            prefix={<SearchOutlined />} 
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Button icon={<ReloadOutlined />} onClick={loadUsers}>刷新</Button>
          <Button icon={<ExportOutlined />}>导出</Button>
          {canAdd && (
            <Button type="primary" icon={<UserAddOutlined />} onClick={handleAdd}>
              添加用户
            </Button>
          )}
        </Space>
      }>
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* 添加/编辑弹窗 */}
      <Modal
        title={editingUser ? '编辑用户' : '添加用户'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            name="username" 
            label="用户名" 
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" disabled={!!editingUser} />
          </Form.Item>
          {!editingUser && (
            <Form.Item 
              name="password" 
              label="密码" 
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          )}
          <Form.Item 
            name="nickname" 
            label="昵称"
          >
            <Input placeholder="请输入昵称" />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { type: 'email', message: '请输入正确的邮箱格式' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="手机号"
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="department" label="部门">
                <Select placeholder="请选择部门">
                  {departments.map((d: any) => (
                    <Option key={d.id} value={d.name}>{d.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="position" label="职位">
                <Input placeholder="请输入职位" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="roles" label="角色">
            <Select mode="multiple" placeholder="请选择角色">
              {roles.map((r: any) => (
                <Option key={r.id} value={r.code}>{r.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue={1}>
            <Select>
              <Option value={1}>启用</Option>
              <Option value={0}>禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: 24,
  },
};
