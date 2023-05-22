// components/Trades.tsx
import React from 'react';
import useSWR from 'swr';
import { LinkOutlined } from '@ant-design/icons';
import { Alert, Card, Col, Divider, Row, Space, Statistic, Table, Tag, Typography } from 'antd';

const { Title } = Typography;

import styles from './Trades.module.css';
import fetcher from '../../lib/fetcher';

interface DataType {
  key: React.Key;
  type: string;
  price: string;
  date: string;
  in: string;
  out: string;
  link: string;
  chain: string;
}

const Trades = () => {
  const { data } = useSWR('/api/trades', fetcher, { refreshInterval: 60000 });
  const trades = data?.trades || [];
  const stats = data?.stats || {};

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      // @ts-ignore
      render: (_, { type }) => <Tag color={type === 'Buy' ? 'green' : 'volcano'}>{type}</Tag>
    },
    {
      title: 'Chain',
      dataIndex: 'chain',
      key: 'chain'
    },
    {
      title: 'Asset Received',
      dataIndex: 'in',
      key: 'in'
    },
    {
      title: 'Asset Out',
      dataIndex: 'out',
      key: 'out'
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      // @ts-ignore
      render: (_, { price }) => `$${price}`
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      sortDirections: ['descend', 'ascend']
    },
    {
      title: 'Transaction',
      dataIndex: 'link',
      key: 'link',
      // @ts-ignore
      render: (_, { link }) => (
        <Space size="middle">
          <a
            href={link}
            target="_blank"
            rel="noreferrer noopener"
            className={link === '' ? styles.disabledTxLink : styles.txLink}
          >
            <LinkOutlined style={{ fontSize: 18 }} />
          </a>
        </Space>
      )
    }
  ];

  return (
    <div className={styles.table}>
      <Title level={4}>Trade History</Title>
      <Row gutter={16}>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Total Trades"
              value={trades.length}
              precision={0}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Total Profit"
              value={stats.totalProfit}
              precision={2}
              valueStyle={{ color: stats.totalProfit > 0 ? '#3f8600' : '#cf1322' }}
              prefix="$"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Average Profit"
              value={stats.averageProfit}
              precision={2}
              valueStyle={{ color: stats.averageProfit > 0 ? '#3f8600' : '#cf1322' }}
              prefix="$"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Most Used Chain"
              value={stats.mostFrequentChain}
              precision={2}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
      </Row>
      <div className={styles.alertContainer}>
        <Alert
          message="Every trade listed was created using Argilac. Other transactions from your wallet are not included."
          type="info"
          showIcon
          closable
        />
      </div>
      <Divider />
      <Table<DataType> columns={columns} dataSource={trades} />
    </div>
  );
};

export default Trades;
