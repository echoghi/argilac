import React, { useState } from 'react';

import useSWR from 'swr';
import { CloseCircleOutlined } from '@ant-design/icons';
import {
  Alert,
  Button,
  Descriptions,
  Radio,
  Divider,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
  Badge,
  Row,
  Col,
  Card,
  Statistic
} from 'antd';

import styles from './LogsTable.module.css';
import clearErrorLogs from '../../lib/clearErrorLogs';
import fetcher from '../../lib/fetcher';

const { Title } = Typography;

interface DataType {
  key: React.Key;
  type: string;
  operation: string;
  chain: string;
  date: string;
  message: string;
}

const ErrorMessage = ({ msg }: { msg: string }) => {
  msg = msg.length > 90 ? `${msg.substring(0, 90)}...` : msg;

  return <div>{msg}</div>;
};

const LogsTable = () => {
  const errorLogs = useSWR('/api/logs', fetcher, { refreshInterval: 60000 });
  const data: DataType[] = errorLogs?.data?.logs || [];
  const stats: any = errorLogs?.data?.stats || {};

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    setIsModalOpen(false);
    await clearErrorLogs();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      // @ts-ignore
      render: (_, { type }) => (
        <Tag
          icon={type !== 'BOT_STATUS' ? <CloseCircleOutlined /> : null}
          color={type === 'BOT_STATUS' ? 'blue' : 'volcano'}
        >
          {type}
        </Tag>
      )
    },
    {
      title: 'Chain',
      dataIndex: 'chain',
      key: 'chain'
    },
    {
      title: 'Date',
      dataIndex: 'time',
      key: 'date',
      sorter: (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      sortDirections: ['descend', 'ascend']
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      // @ts-ignore
      render: (_, { type, message }) => (
        <>
          <span
            className={styles.errorMessage}
            onClick={() => Modal.error({ title: type, content: message, width: 800 })}
          >
            <ErrorMessage msg={message} />
          </span>
        </>
      )
    }
  ];

  return (
    <div className={styles.table}>
      <Space
        direction="horizontal"
        align="center"
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'baseline'
        }}
      >
        <Title level={4}>Bot Logs</Title>
        <Button size="small" danger onClick={showModal} disabled={!data.length}>
          Clear Logs
        </Button>
      </Space>

      <Row gutter={16}>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Total Errors"
              value={data.length}
              precision={0}
              valueStyle={{ color: data.length === 0 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Order Conflicts"
              value={stats?.ORDER_CONFLICT || 0}
              precision={0}
              valueStyle={{ color: stats?.ORDER_CONFLICT === 0 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Routing Errors"
              value={stats?.ROUTING || 0}
              precision={0}
              valueStyle={{ color: stats?.ROUTING === 0 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Network Errors"
              value={stats?.NETWORK || 0}
              precision={0}
              valueStyle={{ color: stats?.NETWORK === 0 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title="Delete Logs?"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to permanently delete all current log items?</p>
      </Modal>

      <div className={styles.alertContainer}>
        <Alert
          message="Log items are the result of errors and events that occured during the bot's operation. Click on a row to see the full error message."
          type="info"
          showIcon
          closable
        />
      </div>

      <Divider />
      <Table<DataType> columns={columns} dataSource={data} />
    </div>
  );
};

export default LogsTable;
