import { Button, Input, Space, Switch, Tag, notification } from 'antd';
import useSWR from 'swr';
import { Draft, produce } from 'immer';

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
import { Config } from '../../lib/provider';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

const ControlPanel = () => {
  const { data, isLoading } = useSWR('/api/status', fetcher, { refreshInterval: 1000 });
  const config = useSWR('/api/config', fetcher, { refreshInterval: 1000 });
  const chainData = useSWR('/api/chain', fetcher);
  const [api, contextHolder] = notification.useNotification();

  const [botStatus, setBotStatus] = useState(data?.status);
  const [botConfig, setBotConfig] = useState(config?.data?.config);
  const [botRpcUrl, setBotRpcUrl] = useState(config?.data?.config?.activeChain?.rpc);

  const handleRpcUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBotRpcUrl(e.target.value);
  };

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
    // update state optimistically
    setBotConfig(updatedConfig);

    setBotRpcUrl(updatedConfig?.activeChain.rpc);

    const res = await updateConfig(updatedConfig);

    // revert state if update failed
    if (!res?.success) {
      setBotConfig(config?.data?.config);
    }

    handleNotification(res.success);
  };

  const handleToggleStatus = async (checked: boolean) => {
    // update status optimistically
    setBotStatus(checked);
    // update status in db
    const res = await updateStatus({ status: checked });

    // revert status if update failed
    if (!res?.success) setBotStatus(!checked);
    // trigger notification
    handleNotification(res?.success);
  };

  const handleStablecoinChange = async (value: string) => {
    const updatedConfig = produce(config.data.config, (draft: Draft<Config>) => {
      draft.tokens.stablecoin = value;
    });

    await handleUpdateConfig(updatedConfig);
  };

  const handleChainChange = async (value: string) => {
    let chainInfo = chainData?.data?.chainData;

    const updatedConfig = produce(config.data.config, (draft: Draft<Config>) => {
      draft.activeChain.id = chainInfo[value].ID;
      draft.activeChain.rpc = chainInfo[value].RPC;
      draft.activeChain.currency = chainInfo[value].SYMBOL;
      draft.activeChain.explorer = chainInfo[value].EXPLORER;
      draft.activeChain.displayName = chainInfo[value].DISPLAY_NAME;
      draft.activeChain.name = value;
    });

    await handleUpdateConfig(updatedConfig);
  };

  const handleExchangeChange = async (value: string) => {
    const updatedConfig = produce(config.data.config, (draft: Draft<Config>) => {
      draft.exchange = value;
    });

    await handleUpdateConfig(updatedConfig);
  };

  const handleSaveRpc = async () => {
    const updatedConfig = produce(config.data.config, (draft: Draft<Config>) => {
      draft.activeChain.rpc = botRpcUrl;
    });

    await handleUpdateConfig(updatedConfig);
  };

  const handleSlippageChange = async (value: string) => {
    const updatedConfig = produce(config.data.config, (draft: Draft<Config>) => {
      draft.strategy.slippage = parseFloat(value);
    });

    await handleUpdateConfig(updatedConfig);
  };

  const handleSizeChange = async (value: string) => {
    const updatedConfig = produce(config.data.config, (draft: Draft<Config>) => {
      draft.strategy.size = parseFloat(value);
    });

    await handleUpdateConfig(updatedConfig);
  };

  const handleTokenChange = async (value: string) => {
    const updatedConfig = produce(config.data.config, (draft: Draft<Config>) => {
      draft.tokens.token = value;
    });

    await handleUpdateConfig(updatedConfig);
  };

  const handleLogsChange = async (checked: boolean) => {
    const updatedConfig = produce(config.data.config, (draft: Draft<Config>) => {
      draft.logs.telegram = checked;
    });

    await handleUpdateConfig(updatedConfig);
  };

  if (!botConfig || isLoading) return <div>Loading...</div>;

  return (
    <Space direction="vertical">
      {contextHolder}
      <Space direction="horizontal" align="center">
        <h1 className={styles.title}>Project Details</h1>
        <Tag color={botStatus ? 'green' : 'volcano'}>{botStatus ? 'Active' : 'Halted'}</Tag>
      </Space>
      <Space direction="horizontal" size="large">
        <Space direction="vertical">
          <h3 className={styles.secondaryText}>Environment</h3>
          <ProjectSelect
            options={chainOptions}
            defaultValue={botConfig?.activeChain?.name}
            onChange={handleChainChange}
          />
        </Space>
        <Space direction="vertical">
          <h3 className={styles.secondaryText}>Exchange</h3>
          <ProjectSelect
            options={exchangeOptions}
            defaultValue={botConfig?.exchange}
            onChange={handleExchangeChange}
          />
        </Space>
      </Space>
      <Space direction="horizontal" size="large" align="center">
        <Space direction="vertical">
          <h3 className={styles.secondaryText}>{botConfig.activeChain.displayName} RPC</h3>

          <Space direction="horizontal">
            <Input
              defaultValue={botRpcUrl}
              value={botRpcUrl}
              onChange={handleRpcUrlChange}
              style={{ width: '450px' }}
              size="large"
            />
            <Button type="primary" onClick={handleSaveRpc} size="large">
              Save
            </Button>
          </Space>
        </Space>
      </Space>
      <Space direction="horizontal" size="large">
        <Space wrap direction="vertical">
          <h3 className={styles.secondaryText}>Stablecoin</h3>
          <ProjectSelect
            options={stablecoinOptions}
            onChange={handleStablecoinChange}
            defaultValue={botConfig?.tokens.stablecoin}
          />
        </Space>
        <Space wrap direction="vertical">
          <h3 className={styles.secondaryText}>Trading Pair</h3>
          <ProjectSelect
            options={tokenOptions}
            defaultValue={botConfig?.tokens.token}
            onChange={handleTokenChange}
          />
        </Space>
      </Space>
      <Space direction="horizontal" size="large">
        <Space wrap direction="vertical">
          <h3 className={styles.secondaryText}>Slippage</h3>
          <ProjectSelect
            options={slippageOptions}
            defaultValue={String(botConfig?.strategy.slippage)}
            onChange={handleSlippageChange}
          />
        </Space>
        <Space wrap direction="vertical">
          <h3 className={styles.secondaryText}>Trade Size</h3>
          <ProjectSelect
            options={sizeOptions}
            defaultValue={String(botConfig?.strategy.size)}
            onChange={handleSizeChange}
          />
        </Space>
      </Space>
      <Space direction="vertical" size="large">
        <h3 className={styles.secondaryText}>Telegram Logs</h3>
        <Switch
          disabled={!process.env.telegramToken || !process.env.telegramChatId}
          checked={botConfig?.logs?.telegram}
          onChange={handleLogsChange}
          checkedChildren="ON"
          unCheckedChildren="OFF"
        />
      </Space>
      <Space direction="horizontal">
        <Space wrap direction="vertical">
          <h3 className={styles.secondaryText}>Controls</h3>

          <Switch
            disabled={!botConfig.activeChain.rpc}
            checked={botStatus}
            loading={isLoading}
            onChange={handleToggleStatus}
            checkedChildren="ON"
            unCheckedChildren="OFF"
          />
        </Space>
      </Space>
    </Space>
  );
};

export default ControlPanel;
