// components/Trades.tsx
import React from 'react';
import { LinkOutlined } from '@ant-design/icons';
import { Alert, Divider, Space, Table, Tag, Typography } from 'antd';

const { Title } = Typography;

import styles from './Trades.module.css';

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

interface TradesProps {
  data: DataType[];
}

const Trades: React.FC<TradesProps> = ({ data }) => {
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
      title: 'Link',
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
      <div>
        <Alert
          message="Every trade listed was created using Argilac. Other transactions from your wallet are not included."
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

export default Trades;
