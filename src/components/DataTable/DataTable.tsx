// components/DataTable.tsx
import React from 'react';
import { Space, Table, Tag } from 'antd';
import styles from './DataTable.module.css';

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

interface DataTableProps {
  data: DataType[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
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
      title: 'Asset In',
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
            Transaction
          </a>
        </Space>
      )
    }
  ];

  return (
    <div className={styles.table}>
      <Table<DataType> columns={columns} dataSource={data} />
    </div>
  );
};

export default DataTable;
