import useSWR from 'swr';
import { useState } from 'react';
import { Draft, produce } from 'immer';
import { Button, Input, Space, Spin, Switch, Tag, notification } from 'antd';

import styles from './ControlPanel.module.css';

import fetcher from '../../lib/fetcher';
import ProjectSelect from '../ProjectSelect';
import updateConfig from '../../services/updateConfig';
import {
  chainOptions,
  exchangeOptions,
  sizeOptions,
  slippageOptions,
  stablecoinOptions,
  tokenOptions
} from './selectOptions';
import { Config } from '../../services/getConfig';
import { SupportedChains } from '../../lib/chainMap';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

const ControlPanel = () => {
  const config = useSWR('/api/config', fetcher, { refreshInterval: 1000 });
  const chainData = useSWR('/api/chain', fetcher);
  const [api, contextHolder] = notification.useNotification();

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

  const handleUpdateConfig = async (updatedConfig: any, log?: any) => {
    // update state optimistically
    setBotConfig(updatedConfig);

    setBotRpcUrl(updatedConfig?.activeChain.rpc);

    const res = await updateConfig(updatedConfig, log);

    // revert state if update failed
    if (!res?.success) {
      setBotConfig(config?.data?.config);
    }

    handleNotification(res.success);
  };

  const handleToggleStatus = async (checked: boolean) => {
    const updatedConfig = produce(config.data.config, (draft: Draft<Config>) => {
      draft.status = checked;
    });

    const log = {
      type: 'BOT_STATUS',
      message: checked ? 'Bot started via control panel' : 'Bot stopped via control panel',
      // @ts-ignore
      chain: updatedConfig.activeChain.displayName
    };

    await handleUpdateConfig(updatedConfig, log);
  };

  const handleStablecoinChange = async (value: string) => {
    const updatedConfig = produce(config.data.config, (draft: Draft<Config>) => {
      draft.tokens.stablecoin = value;
    });

    await handleUpdateConfig(updatedConfig);
  };

  const handleChainChange = async (value: SupportedChains) => {
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

  if (!botConfig || config.isLoading)
    return (
      <div className={styles.loadingContainer}>
        <Spin />
      </div>
    );

  return (
    <Space direction="vertical">
      {contextHolder}
      <Space direction="horizontal" align="center">
        <h1 className={styles.title}>Project Details</h1>
        <Tag color={botConfig.status ? 'geekblue' : 'volcano'}>
          {botConfig.status ? 'Running' : 'Halted'}
        </Tag>
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
            checked={botConfig.status}
            loading={config.isLoading}
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
