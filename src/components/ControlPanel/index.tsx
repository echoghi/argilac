import { Button, Checkbox, Modal, Space, Tag, notification } from 'antd';
import useSWR from 'swr';
import { produce } from 'immer';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

import styles from './ControlPanel.module.css';
import ProjectSelect from '../ProjectSelect';

import updateStatus from '../../lib/updateStatus';
import fetcher from '../../lib/fetcher';
import { useState } from 'react';
import updateConfig from '../../lib/updateConfig';
import {
  chainOptions,
  exchangeOptions,
  sizeOptions,
  slippageOptions,
  stablecoinOptions,
  tokenOptions
} from './selectOptions';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

const ControlPanel = () => {
  const { data, isLoading } = useSWR('/api/status', fetcher, { refreshInterval: 1000 });
  const config = useSWR('/api/config', fetcher, { refreshInterval: 1000 });
  const chainData = useSWR('/api/chain', fetcher);
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (type: NotificationType, title: string, description: string) => {
    api[type]({
      message: title,
      description,
      placement: 'topRight'
    });
  };

  const showError = () =>
    openNotification('error', 'Error', 'Something went wrong. Please try again.');
  const showSuccess = () =>
    openNotification('success', 'Success', 'Your settings have been saved.');

  const handleNotification = (status: boolean) => {
    if (status) {
      showSuccess();
    } else {
      showError();
    }
  };

  const handleUpdateConfig = async (updatedConfig: any) => {
    const res = await updateConfig(updatedConfig);

    handleNotification(res.success);
  };

  const [showModal, setShowModal] = useState(false);

  const onStartClick = async () => {
    const res = await updateStatus({ status: true });

    handleNotification(res?.success);
  };

  const onStopClick = async () => {
    setShowModal(false);
    const res = await updateStatus({ status: false });

    handleNotification(res?.success);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const hideModal = () => {
    setShowModal(false);
  };

  const handleStablecoinChange = async (value: string) => {
    const updatedConfig = produce(config.data.config, (draft: any) => {
      draft.tokens.stablecoin = value;
    });

    await updateConfig(updatedConfig);
  };

  const handleChainChange = async (value: string) => {
    let chainInfo = chainData?.data?.chainData;

    const updatedConfig = produce(config.data.config, (draft: any) => {
      draft.activeChain.id = chainInfo[value].ID;
      draft.activeChain.rpc = chainInfo[value].RPC;
      draft.activeChain.currency = chainInfo[value].SYMBOL;
      draft.activeChain.explorer = chainInfo[value].EXPLORER;
      draft.activeChain.displayName = chainInfo[value].DISPLAY_NAME;
      draft.activeChain.name = value;
    });

    await handleUpdateConfig(updatedConfig);
  };

  const handleSlippageChange = async (value: string) => {
    const updatedConfig = produce(config.data.config, (draft: any) => {
      draft.strategy.slippage = parseFloat(value);
    });

    await handleUpdateConfig(updatedConfig);
  };

  const handleSizeChange = async (value: string) => {
    const updatedConfig = produce(config.data.config, (draft: any) => {
      draft.strategy.size = parseFloat(value);
    });

    await handleUpdateConfig(updatedConfig);
  };

  const handleTokenChange = async (value: string) => {
    const updatedConfig = produce(config.data.config, (draft: any) => {
      draft.tokens.token = value;
    });

    await handleUpdateConfig(updatedConfig);
  };

  const handleLogsChange = async (e: CheckboxChangeEvent) => {
    const updatedConfig = produce(config.data.config, (draft: any) => {
      draft.logs.telegram = !!e.target.checked;
    });

    await handleUpdateConfig(updatedConfig);
  };

  if (config.isLoading || isLoading) return <div>Loading...</div>;

  return (
    <Space direction="vertical">
      {contextHolder}
      <Space direction="horizontal" align="center">
        <h1 className={styles.title}>Project Details</h1>
        <Tag color={data?.status ? 'green' : 'volcano'}>{data?.status ? 'Active' : 'Halted'}</Tag>
      </Space>
      <Space direction="horizontal" size="large">
        <Space wrap direction="vertical">
          <h3 className={styles.secondaryText}>Environment</h3>
          <ProjectSelect
            options={chainOptions}
            defaultValue={config?.data?.config?.activeChain?.name}
            onChange={handleChainChange}
          />
        </Space>
        <Space wrap direction="vertical">
          <h3 className={styles.secondaryText}>Exchange</h3>
          <ProjectSelect options={exchangeOptions} defaultValue={config?.data?.config?.exchange} />
        </Space>
      </Space>
      <Space direction="horizontal" size="large">
        <Space wrap direction="vertical">
          <h3 className={styles.secondaryText}>Stablecoin</h3>
          <ProjectSelect
            options={stablecoinOptions}
            onChange={handleStablecoinChange}
            defaultValue={config?.data?.config?.tokens.stablecoin}
          />
        </Space>
        <Space wrap direction="vertical">
          <h3 className={styles.secondaryText}>Trading Pair</h3>
          <ProjectSelect
            options={tokenOptions}
            defaultValue={config?.data?.config?.tokens.token}
            onChange={handleTokenChange}
          />
        </Space>
      </Space>
      <Space direction="horizontal" size="large">
        <Space wrap direction="vertical">
          <h3 className={styles.secondaryText}>Slippage</h3>
          <ProjectSelect
            options={slippageOptions}
            defaultValue={config?.data?.config?.strategy.slippage}
            onChange={handleSlippageChange}
          />
        </Space>
        <Space wrap direction="vertical">
          <h3 className={styles.secondaryText}>Trade Size</h3>
          <ProjectSelect
            options={sizeOptions}
            defaultValue={config?.data?.config?.strategy.size}
            onChange={handleSizeChange}
          />
        </Space>
      </Space>
      <Space direction="vertical" size="large">
        <h3 className={styles.secondaryText}>Logs</h3>
        <Checkbox checked={config?.data?.config?.logs?.telegram} onChange={handleLogsChange}>
          {config?.data?.config?.logs?.telegram
            ? 'Telegram Logging Enabled'
            : 'Telegram Logging Disabled'}
        </Checkbox>
      </Space>
      <Space direction="horizontal">
        <Space wrap direction="vertical">
          <h3 className={styles.secondaryText}>Controls</h3>

          {data?.status ? (
            <Button
              type="primary"
              danger
              size="large"
              onClick={openModal}
              loading={isLoading}
              disabled={isLoading}
            >
              Stop
            </Button>
          ) : (
            <Button
              type="primary"
              size="large"
              onClick={onStartClick}
              loading={isLoading}
              disabled={isLoading}
            >
              Start
            </Button>
          )}

          <Modal
            title="Stop Bot?"
            open={showModal}
            onOk={onStopClick}
            onCancel={hideModal}
            okText="Confirm"
            cancelText="Cancel"
          >
            <p>Are you sure you want to shut down the bot?</p>
          </Modal>
        </Space>
      </Space>
    </Space>
  );
};

export default ControlPanel;
