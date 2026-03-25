'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, Table, Button, Space, Tag, Modal, Form, Input, Select,
  Checkbox, message, Tree, Row, Col, Statistic, Divider, Popconfirm 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  SafetyCertificateOutlined, KeyOutlined, SettingOutlined, ReloadOutlined
} from '@ant-design/icons';
import { roleApi } from '@/services/api/auth';

const { Option } = Select;

const permissionTreeData = [
  {
    title: '用户管理',
    key: 'user',
    children: [
      { title: '查看用户', key: 'user:view' },
      { title: '编辑用户', key: 'user:edit' },
      { title: '删除用户', key: 'user:delete' },
    ],
  },
  {
    title: '订单管理',
    key: 'order',
    children: [
      { title: '查看订单', key: 'order:view' },
      { title: '编辑订单', key: 'order:edit' },
      { title: '审核订单', key: 'order:audit' },
    ],
  },
  {
    title: '产品管理',
    key: 'product',
    children: [
      { title: '查看产品', key: 'product:view' },
      { title: '编辑产品', key: 'product:edit' },
      { title: '删除产品', key: 'product:delete' },
    ],
  },
  {
    title: '系统设置',
    key: 'system',
    children: [
      { title: '角色管理', key: 'system:role' },
      { title: '权限配置', key: 'system:permission' },
      { title: '日志查看', key: 'system:log' },
    ],
  },
];

export default function RolesPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [permModalVisible, setPermModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [form] = Form.useForm();

  // 加载角色列表
  const loadRoles = async () => {
    setLoading(true);
    try {
      const result = await roleApi.list();
      const roles = Array.isArray(result) ? result : [];
      setData(roles.map((r: any, index: number) => ({
        key: r.id || String(index),
        id: r.id,
        name: r.name || '未知',
        code: r.code || '',
        description: r.description || '',
        userCount: r.userCount || 0,
        permissions: r.permissions || [],
        status: r.status === 1 ? 'active' : 'disabled',
      })));
    } catch (error: any) {
      console.error('加载角色失败:', error);
      message.error(error.message || '加载角色失败');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const handleAdd = () => {
    setEditingRole(null);
    form.resetFields();
    setSelectedPermissions([]);
    setModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingRole(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handlePermission = (record: any) => {
    setEditingRole(record);
    setSelectedPermissions(record.permissions?.includes('*') 
      ? permissionTreeData.flatMap(t => t.children?.map(c => c.key) || [])
      : record.permissions || []);
    setPermModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await roleApi.delete(id);
      message.success('删除成功');
      loadRoles();
    } catch (error: any) {
      message.error(error.message || '删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingRole?.id) {
        await roleApi.update(editingRole.id, values);
        message.success('更新成功');
      } else {
        await roleApi.add(values);
        message.success('添加成功');
      }
      setModalVisible(false);
      loadRoles();
    } catch (error: any) {
      console.error('保存失败:', error);
      message.error(error.message || '保存失败');
    }
  };

  const handlePermSubmit = async () => {
    try {
      if (editingRole?.id) {
        await roleApi.setPermissions(editingRole.id, selectedPermissions);
        message.success('权限配置已更新');
      }
      setPermModalVisible(false);
      loadRoles();
    } catch (error: any) {
      message.error(error.message || '保存权限失败');
    }
  };

  const columns = [
    {
      title: '角色名称',
      key: 'name',
      render: (_: any, record: any) => (
        <Space>
          <SafetyCertificateOutlined style={{ fontSize: 18, color: '#1890ff' }} />
          <span style={{ fontWeight: 500 }}>{record.name}</span>
        </Space>
      ),
    },
    {
      title: '角色编码',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => <Tag>{code}</Tag>,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '用户数',
      dataIndex: 'userCount',
      key: 'userCount',
      render: (count: number) => <Tag color="blue">{count || 0} 人</Tag>,
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
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button type="text" icon={<KeyOutlined />} onClick={() => handlePermission(record)}>
            权限
          </Button>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title="确定删除?" onConfirm={() => record.id && handleDelete(record.id)}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={styles.container}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="角色总数" value={data.length} prefix={<SafetyCertificateOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="启用角色" value={data.filter(r => r.status === 'active').length} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="权限节点" value={12} prefix={<KeyOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="用户总数" value={22} prefix={<SafetyCertificateOutlined />} />
          </Card>
        </Col>
      </Row>

      <Card title="角色列表" extra={
        <Space>
          <Button icon={<ReloadOutlined />} onClick={loadRoles}>刷新</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加角色
          </Button>
        </Space>
      }>
        <Table columns={columns} dataSource={data} loading={loading} pagination={false} />
      </Card>

      <Modal
        title={editingRole ? '编辑角色' : '添加角色'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="角色名称" rules={[{ required: true }]}>
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item name="code" label="角色编码" rules={[{ required: true }]}>
            <Input placeholder="如: admin, manager" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} placeholder="请输入角色描述" />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue={1}>
            <Select>
              <Option value={1}>启用</Option>
              <Option value={0}>禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`权限配置 - ${editingRole?.name}`}
        open={permModalVisible}
        onOk={handlePermSubmit}
        onCancel={() => setPermModalVisible(false)}
        width={500}
      >
        <Tree
          checkable
          defaultExpandAll
          treeData={permissionTreeData}
          checkedKeys={selectedPermissions}
          onCheck={(keys: any) => setSelectedPermissions(keys)}
        />
      </Modal>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: 24,
  },
};
