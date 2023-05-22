import React from 'react';
import useSWR from 'swr';
import { Alert, Divider, Table, Tag, Typography } from 'antd';
import styles from '../Trades/Trades.module.css';
import fetcher from '../../lib/fetcher';

const { Title } = Typography;

interface DataType {
  key: React.Key;
  type: string;
  name: string;
  chain: string;
  price: string;
  balance: string;
}

const typeCheck = (type: string) => (type.includes('Testnet') ? 'volcano' : 'green');
const renderValue = (price: number, balance: number) =>
  price && balance ? `$${Number(price * balance).toFixed(2)}` : 'N/A';

const Assets = () => {
  const assetData = useSWR('/api/assets', fetcher, { refreshInterval: 60000 });

  const data: any = assetData?.data?.assets || [];

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      // @ts-ignore
      render: (_, { type }) => <Tag color={typeCheck(type)}>{type}</Tag>,
      filters: [
        {
          text: 'Testnet',
          value: 'Testnet'
        },
        {
          text: 'L1',
          value: 'L1'
        },
        {
          text: 'L2',
          value: 'L2'
        }
      ],
      filterMode: 'tree',
      filterSearch: true,
      // @ts-ignore
      onFilter: (value: string, { type }) => type.includes(value)
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Chain',
      dataIndex: 'chain',
      key: 'chain',
      sorter: (a: any, b: any) => a.chain - b.chain,
      sortDirections: ['descend', 'ascend'],
      filters: [
        {
          text: 'Polygon Mumbai',
          value: 'Polygon Mumbai'
        },
        {
          text: 'Goerli',
          value: 'Goerli'
        },
        {
          text: 'Ethereum Mainnet',
          value: 'Ethereum Mainnet'
        },
        {
          text: 'Arbitrum',
          value: 'Arbitrum'
        },
        {
          text: 'Polygon Mainnet',
          value: 'Polygon Mainnet'
        }
      ],
      filterMode: 'tree',
      filterSearch: true,
      // @ts-ignore
      onFilter: (value: string, { chain }) => chain.includes(value)
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance'
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      // @ts-ignore
      render: (_, { price }) => `$${price}`
    },
    {
      title: 'Total Value',
      dataIndex: 'price',
      key: 'price',
      // @ts-ignore
      render: (_, { price, balance }) => renderValue(price, balance)
    }
  ];

  return (
    <div className={styles.table}>
      <Title level={4}>Wallet Balances</Title>
      <div className={styles.alertContainer}>
        <Alert message="Only supported currencies are displayed" type="info" showIcon closable />
      </div>
      <Divider />
      <Table<DataType> columns={columns} dataSource={data} />
    </div>
  );
};

export default Assets;
