import { IncomingMessage } from 'http';
import { NextPageContext } from 'next';
import useSWR, { SWRConfig } from 'swr';
import type { TabsProps } from 'antd';
import Head from 'next/head';
import { Tabs } from 'antd';

import styles from '../styles/Home.module.css';
import Header from '../components/Header';
import Trades from '../components/Trades';
import ControlPanel from '../components/ControlPanel';
import LogsTable from '../components/Logs';
import fetcher from '../lib/fetcher';
import Assets from '../components/Assets';
import { useRouter } from 'next/router';

interface MyIncomingMessage extends IncomingMessage {
  cookies: any;
}

interface MainContext extends NextPageContext {
  req: MyIncomingMessage;
}

export async function getServerSideProps(context: MainContext) {
  function returnUrl(context: MainContext) {
    if (process.env.NODE_ENV === 'production') {
      return `https://${context.req.rawHeaders[1]}`;
    } else {
      return 'http://localhost:80';
    }
  }

  let baseUrl = returnUrl(context);

  const trades = await fetcher(`${baseUrl}/api/trades`);
  const logs = await fetcher(`${baseUrl}/api/logs`);
  const config = await fetcher(`${baseUrl}/api/config`);
  const chain = await fetcher(`${baseUrl}/api/chain`);
  const assets = await fetcher(`${baseUrl}/api/assets`);

  const activeTab = context.query.tab || 'settings';

  return {
    props: {
      activeTab,
      fallback: {
        '/api/trades': trades,
        '/api/logs': logs,
        '/api/config': config,
        '/api/chain': chain,
        '/api/assets': assets
      }
    }
  };
}

export default function Home({ activeTab, fallback }: { activeTab: string; fallback: any }) {
  const router = useRouter();
  const config = useSWR('/api/config', fetcher, { refreshInterval: 1000 });

  const status = config?.data?.config?.status;

  const items: TabsProps['items'] = [
    {
      key: 'settings',
      label: `Control Panel`,
      children: <ControlPanel />
    },
    {
      key: 'trades',
      label: `Trades`,
      children: <Trades />
    },
    {
      key: 'logs',
      label: `Logs`,
      children: <LogsTable />
    },
    {
      key: 'assets',
      label: `Assets`,
      children: <Assets />
    }
  ];

  const handleTabChange = (activeKey: string) => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, tab: activeKey }
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Argilac</title>
        <meta name="description" content="Automated Cryptocurrency Trading Bot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SWRConfig value={{ fallback }}>
        <main className={styles.main}>
          <Header status={status} />

          <div className={styles.grid}>
            <Tabs
              defaultActiveKey={activeTab || 'settings'}
              items={items}
              className={styles.fullWidthTabs}
              style={{ width: '100%' }}
              onChange={handleTabChange}
            />
          </div>
        </main>

        <footer className={styles.footer}>
          Made with ❤️ by{' '}
          <a href="https://rennalabs.xyz" target="_blank" rel="noopener noreferrer">
            Renna Labs
          </a>
        </footer>
      </SWRConfig>
    </div>
  );
}
