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
import { userApi } from '@/services/api/auth';

const { Option } = Select;

const departments = ['技术研发部', '产品设计部', '生产制造部', '质量管理部', '市场运营部'];
const roles = ['管理员', '产品经理', '开发工程师', '测试工程师', '审核员', '普通用户'];

export default function UsersPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  // 加载用户列表
  const loadUsers = async () => {
    setLoading(true);
    try {
      const result = await userApi.list();
      const users = Array.isArray(result) ? result : [];
      setData(users.map((u: any, index: number) => ({
        key: u.id || String(index),
        id: u.id,
        name: u.nickname || u.username || '未知',
        email: u.email || '',
        department: u.department || '',
        role: u.position || '普通用户',
        status: u.status === 1 ? 'active' : 'inactive',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`,
        createdAt: u.createdAt || new Date().toISOString().split('T')[0],
      })));
    } catch (error: any) {
      console.error('加载用户失败:', error);
      message.error(error.message || '加载用户失败');
      // 使用空数据
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
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
    setEditingUser(record);
    form.setFieldsValue(record);
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
        await userApi.add(values);
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
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        const colorMap: Record<string, string> = {
          '管理员': 'red',
          '产品经理': 'purple',
          '开发工程师': 'green',
          '测试工程师': 'orange',
          '审核员': 'cyan',
          '普通用户': 'default',
        };
        return <Tag color={colorMap[role] || 'default'}>{role}</Tag>;
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
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="确定要删除这个用户吗？"
            onConfirm={() => record.id && handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
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
          <Button type="primary" icon={<UserAddOutlined />} onClick={handleAdd}>
            添加用户
          </Button>
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
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="department" label="部门">
                <Select placeholder="请选择部门">
                  {departments.map(d => <Option key={d} value={d}>{d}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="role" label="角色">
                <Select placeholder="请选择角色">
                  {roles.map(r => <Option key={r} value={r}>{r}</Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>
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
