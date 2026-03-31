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
import { roleApi, userApi, permissionApi } from '@/services/api/auth';

const { Option } = Select;


export default function RolesPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userCount, setUserCount] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [permModalVisible, setPermModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [permissionTreeData, setPermissionTreeData] = useState<any[]>([]);
  const [permissionCount, setPermissionCount] = useState<number>(0);

  // 加载角色列表
  const loadRoles = async () => {
    setLoading(true);
    try {
      console.log('正在加载角色列表...');
      const result = await roleApi.list();
      console.log('角色列表API响应:', result);

      if (result.code !== 200) {
        message.error(result.message || '加载角色失败');
        setData([]);
        return;
      }

      const roles = Array.isArray(result.data) ? result.data : [];
      console.log('角色数据:', roles);

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

  const loadUserCount = async () => {
    try {
      console.log('正在加载用户总数...');
      const result = await roleApi.userCount();
      console.log('用户总数API响应:', result);

      if (result.code === 200) {
        setUserCount(result.data || 0);
      } else {
        console.warn('用户总数API返回非200状态码:', result.code, result.message);
        setUserCount(0);
      }
    } catch (error: any) {
      console.error('加载用户总数失败:', error);
      setUserCount(0);
    }
  };

  // 加载权限树
  const loadPermissionTree = async () => {
    try {
      console.log('正在加载权限树...');
      const result = await permissionApi.tree();
      console.log('权限树API响应:', result);

      if (result.code === 200) {
        // 转换后端权限数据为Tree组件格式
        const convert = (permissions: any[]): any[] => {
          return permissions.map(perm => ({
            title: perm.name,
            key: String(perm.id), // 使用id作为key
            children: perm.children ? convert(perm.children) : undefined
          }));
        };
        const treeData = convert(result.data);
        console.log('转换后的权限树数据:', treeData);
        setPermissionTreeData(treeData);

        // 计算叶子节点数量（权限节点数）
        const countLeafNodes = (nodes: any[]): number => {
          let count = 0;
          nodes.forEach(node => {
            if (node.children && node.children.length > 0) {
              count += countLeafNodes(node.children);
            } else {
              count++;
            }
          });
          return count;
        };
        const leafCount = countLeafNodes(treeData);
        console.log('权限叶子节点数量:', leafCount);
        setPermissionCount(leafCount);
      } else {
        console.warn('权限树API返回非200状态码:', result.code, result.message);
        setPermissionTreeData([]);
        setPermissionCount(0);
      }
    } catch (error: any) {
      console.error('加载权限树失败:', error);
      setPermissionTreeData([]);
      setPermissionCount(0);
    }
  };

  useEffect(() => {
    loadRoles();
    loadUserCount();
    loadPermissionTree();
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
    // 如果权限包含'*'，选择所有权限（递归获取所有叶子节点的key）
    if (record.permissions?.includes('*')) {
      const getAllLeafKeys = (tree: any[]): string[] => {
        let keys: string[] = [];
        tree.forEach(node => {
          if (node.children && node.children.length > 0) {
            keys.push(...getAllLeafKeys(node.children));
          } else {
            keys.push(node.key);
          }
        });
        return keys;
      };
      setSelectedPermissions(getAllLeafKeys(permissionTreeData));
    } else {
      // 假设record.permissions是权限ID数组（数字），转换为字符串
      setSelectedPermissions((record.permissions || []).map((p: any) => String(p)));
    }
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
        await roleApi.create(values);
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
        // 将字符串key转换为数字ID
        const permissionIds = selectedPermissions.map(p => Number(p));
        await permissionApi.saveRolePermissions(editingRole.id, permissionIds);
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

  const filteredData = data.filter(item =>
    item.name?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.code?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchText.toLowerCase())
  );

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
            <Statistic title="权限节点" value={permissionCount} prefix={<KeyOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="用户总数" value={userCount} prefix={<SafetyCertificateOutlined />} />
          </Card>
        </Col>
      </Row>

      <Card title="角色列表" extra={
        <Space>
          <Input.Search
            placeholder="搜索角色名称、编码、描述"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Button icon={<ReloadOutlined />} onClick={loadRoles}>刷新</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加角色
          </Button>
        </Space>
      }>
        <Table columns={columns} dataSource={filteredData} loading={loading} pagination={false} />
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
          onCheck={(checkedKeys: any) => {
            // Tree组件的onCheck返回{checked: [], halfChecked: []}或数组
            const keys = Array.isArray(checkedKeys) ? checkedKeys : checkedKeys.checked;
            setSelectedPermissions(keys || []);
          }}
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
