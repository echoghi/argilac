// components/LogsTable.tsx
import React from 'react';
import { Modal, Table, Tag } from 'antd';
import styles from './LogsTable.module.css';
import { CloseCircleOutlined } from '@ant-design/icons';

interface DataType {
  key: React.Key;
  type: string;
  operation: string;
  chain: string;
  date: string;
  message: string;
}

interface DataTableProps {
  data: DataType[];
}

const ErrorMessage = ({ msg }: { msg: string }) => {
  msg = msg.length > 90 ? `${msg.substring(0, 90)}...` : msg;

  return <div>{msg}</div>;
};

const LogsTable: React.FC<DataTableProps> = ({ data }) => {
  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      // @ts-ignore
      render: (_, { type, message }) => (
        <Tag
          icon={type !== 'BOT_STATUS' ? <CloseCircleOutlined /> : null}
          color={message === 'Bot started via control panel' ? 'green' : 'volcano'}
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
      <Table<DataType> columns={columns} dataSource={data} />
    </div>
  );
};

export default LogsTable;
