'use client';

import React, { useState, useEffect } from 'react';
import {
  Card, Table, Button, Space, Tag, Modal, Form, Input, Select,
  message, Row, Col, Statistic, Divider, Popconfirm
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  TeamOutlined, ReloadOutlined
} from '@ant-design/icons';
import { departmentApi } from '@/services/api/auth';

const { Option } = Select;

export default function DepartmentsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [employeeCount, setEmployeeCount] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  // 加载部门列表
  const loadDepartments = async () => {
    setLoading(true);
    try {
      const result = await departmentApi.queryAll();
      const departments = Array.isArray(result?.data) ? result.data : [];
      setData(departments.map((d: any, index: number) => ({
        key: d.id || String(index),
        id: d.id,
        name: d.name || '未知',
        code: d.code || '',
        description: d.description || '',
        status: d.status === 1 ? 'active' : 'disabled',
      })));
    } catch (error: any) {
      console.error('加载部门失败:', error);
      message.error(error.message || '加载部门失败');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployeeCount = async () => {
    try {
      const result = await departmentApi.employeeCount();
      if (result.code === 200) {
        setEmployeeCount(result.data || 0);
      }
    } catch (error: any) {
      console.error('加载员工总数失败:', error);
      // 失败时保持默认值0
    }
  };

  useEffect(() => {
    loadDepartments();
    loadEmployeeCount();
  }, []);

  const handleAdd = () => {
    setEditingDepartment(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingDepartment(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await departmentApi.delete(id);
      message.success('删除成功');
      loadDepartments();
    } catch (error: any) {
      message.error(error.message || '删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingDepartment?.id) {
        await departmentApi.update(editingDepartment.id, values);
        message.success('更新成功');
      } else {
        await departmentApi.create(values);
        message.success('添加成功');
      }
      setModalVisible(false);
      loadDepartments();
    } catch (error: any) {
      console.error('保存失败:', error);
      message.error(error.message || '保存失败');
    }
  };

  const columns = [
    {
      title: '部门名称',
      key: 'name',
      render: (_: any, record: any) => (
        <Space>
          <TeamOutlined style={{ fontSize: 18, color: '#1890ff' }} />
          <span style={{ fontWeight: 500 }}>{record.name}</span>
        </Space>
      ),
    },
    {
      title: '部门编码',
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
            <Statistic title="部门总数" value={data.length} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="启用部门" value={data.filter(d => d.status === 'active').length} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="员工总数" value={employeeCount} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="组织层级" value={1} prefix={<TeamOutlined />} />
          </Card>
        </Col>
      </Row>

      <Card title="部门列表" extra={
        <Space>
          <Input.Search
            placeholder="搜索部门名称、编码、描述"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Button icon={<ReloadOutlined />} onClick={loadDepartments}>刷新</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加部门
          </Button>
        </Space>
      }>
        <Table columns={columns} dataSource={filteredData} loading={loading} pagination={false} />
      </Card>

      <Modal
        title={editingDepartment ? '编辑部门' : '添加部门'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="部门名称" rules={[{ required: true }]}>
            <Input placeholder="请输入部门名称" />
          </Form.Item>
          <Form.Item name="code" label="部门编码" rules={[{ required: true }]}>
            <Input placeholder="如: tech, product" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} placeholder="请输入部门描述" />
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