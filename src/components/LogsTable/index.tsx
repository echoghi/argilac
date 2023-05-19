// components/LogsTable.tsx
import React, { useState } from 'react';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Alert, Button, Divider, Modal, Space, Table, Tag, Typography } from 'antd';

import styles from './LogsTable.module.css';
import clearErrorLogs from '../../lib/clearErrorLogs';

const { Title } = Typography;

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
      <Title level={4}>Bot Logs</Title>
      <div>
        <Alert
          message="Listed log items are the result of errors and events that occured during the bot's operation. Click on a row to see the full error message."
          type="info"
          showIcon
          closable
          action={
            <Space direction="horizontal">
              <Button size="small" danger onClick={showModal} disabled={!data.length}>
                Clear Logs
              </Button>
              <Modal
                title="Delete Logs?"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Delete"
                cancelText="Cancel"
              >
                <p>Are you sure you want to permanently delete all logs?</p>
              </Modal>
            </Space>
          }
        />
      </div>
      <Divider />
      <Table<DataType> columns={columns} dataSource={data} />
    </div>
  );
};

export default LogsTable;
