'use client';

import React, { useState } from 'react';
import { 
  Card, Tabs, Form, Input, Button, Switch, Select, 
  message, Row, Col, Divider, Avatar, Upload, Space, List, Tag 
} from 'antd';
import { 
  UserOutlined, LockOutlined, BellOutlined, 
  GlobalOutlined, SaveOutlined, UploadOutlined,
  QqOutlined, WechatOutlined, MailOutlined 
} from '@ant-design/icons';

const { Option } = Select;

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      message.success('设置已保存');
      setLoading(false);
    }, 1000);
  };

  const tabItems = [
    {
      key: 'profile',
      label: <span><UserOutlined /> 个人资料</span>,
      children: (
        <div style={styles.tabContent}>
          <Row gutter={24}>
            <Col span={16}>
              <Form layout="vertical" initialValues={{
                name: '罗超',
                nickname: '小罗',
                email: 'luchao@xiaopeng.com',
                phone: '138****8888',
                department: '技术研发部',
                position: '高级开发工程师',
              }}>
                <Form.Item name="name" label="用户名">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="nickname" label="昵称">
                  <Input placeholder="请输入昵称" />
                </Form.Item>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="email" label="邮箱">
                      <Input type="email" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="phone" label="手机号">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="department" label="部门">
                      <Select>
                        <Option value="技术研发部">技术研发部</Option>
                        <Option value="产品设计部">产品设计部</Option>
                        <Option value="生产制造部">生产制造部</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="position" label="职位">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSave}>
                  保存修改
                </Button>
              </Form>
            </Col>
            <Col span={8}>
              <Card title="头像" style={{ textAlign: 'center' }}>
                <Avatar size={120} icon={<UserOutlined />} src="https://api.dicebear.com/7.x/avataaars/svg?seed=LuoChao" />
                <Divider />
                <Upload showUploadList={false}>
                  <Button icon={<UploadOutlined />}>更换头像</Button>
                </Upload>
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: 'security',
      label: <span><LockOutlined /> 安全设置</span>,
      children: (
        <div style={styles.tabContent}>
          <List
            dataSource={[
              {
                title: '登录密码',
                description: '定期修改密码可以提高账号安全性',
                action: <Button size="small">修改</Button>,
              },
              {
                title: '两步验证',
                description: '开启后登录时需要额外验证',
                action: <Switch defaultChecked />,
              },
              {
                title: '登录设备',
                description: '查看和管理登录设备',
                action: <Button size="small">查看</Button>,
              },
              {
                title: '操作日志',
                description: '查看账号操作记录',
                action: <Button size="small">查看</Button>,
              },
            ]}
            renderItem={(item: any) => (
              <List.Item actions={[item.action]}>
                <List.Item.Meta
                  title={item.title}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </div>
      ),
    },
    {
      key: 'notifications',
      label: <span><BellOutlined /> 通知设置</span>,
      children: (
        <div style={styles.tabContent}>
          <List
            header={<h3>通知偏好</h3>}
            dataSource={[
              { title: '邮件通知', desc: '接收系统邮件通知', key: 'email_notif' },
              { title: '短信通知', desc: '接收重要短信提醒', key: 'sms_notif' },
              { title: '订单提醒', desc: '新订单自动推送', key: 'order_notif' },
              { title: '系统公告', desc: '系统更新和维护通知', key: 'sys_notif' },
            ]}
            renderItem={(item: any) => (
              <List.Item>
                <List.Item.Meta
                  title={item.title}
                  description={item.desc}
                />
                <Switch defaultChecked={item.key !== 'sms_notif'} />
              </List.Item>
            )}
          />
        </div>
      ),
    },
    {
      key: 'connection',
      label: <span><GlobalOutlined /> 关联账号</span>,
      children: (
        <div style={styles.tabContent}>
          <List
            dataSource={[
              { icon: <QqOutlined />, name: 'QQ', status: '已绑定', color: '#12b7f5' },
              { icon: <WechatOutlined />, name: '微信', status: '未绑定', color: '#07c160' },
              { icon: <MailOutlined />, name: '钉钉', status: '已绑定', color: '#1694e9' },
            ]}
            renderItem={(item: any) => (
              <List.Item
                actions={[
                  <Button key="bind" size="small" type={item.status === '已绑定' ? 'default' : 'primary'}>
                    {item.status === '已绑定' ? '解绑' : '绑定'}
                  </Button>
                ]}
              >
                <Space>
                  <span style={{ color: item.color, fontSize: 24 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontWeight: 500 }}>{item.name}</div>
                    <Tag color={item.status === '已绑定' ? 'success' : 'default'}>{item.status}</Tag>
                  </div>
                </Space>
              </List.Item>
            )}
          />
        </div>
      ),
    },
  ];

  return (
    <div style={styles.container}>
      <Card>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={tabItems}
        />
      </Card>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: 24,
  },
  tabContent: {
    padding: '24px 0',
  },
};
