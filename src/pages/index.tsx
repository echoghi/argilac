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
import LogsTable from '../components/LogsTable';
import fetcher from '../lib/fetcher';
import Assets from '../components/Assets';

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
  // `getStaticProps` is executed on the server side.
  const data = await fetcher(`${baseUrl}/api/data`);
  const logs = await fetcher(`${baseUrl}/api/logs`);
  const config = await fetcher(`${baseUrl}/api/config`);
  const chain = await fetcher(`${baseUrl}/api/chain`);
  const assets = await fetcher(`${baseUrl}/api/assets`);

  return {
    props: {
      fallback: {
        '/api/data': data,
        '/api/logs': logs,
        '/api/config': config,
        '/api/chain': chain,
        '/api/assets': assets
      }
    }
  };
}

export default function Home({ fallback }: { fallback: any }) {
  const { data } = useSWR('/api/data', fetcher, { refreshInterval: 60000 });
  const assetData = useSWR('/api/assets', fetcher, { refreshInterval: 60000 });
  const errorLogs = useSWR('/api/logs', fetcher, { refreshInterval: 60000 });
  const trades = data?.trades || [];
  const logs: any = errorLogs?.data?.logs || [];
  const assets: any = assetData?.data?.assets || [];

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `Control Panel`,
      children: <ControlPanel />
    },
    {
      key: '2',
      label: `Trades`,
      children: <Trades data={trades} />
    },
    {
      key: '3',
      label: `Logs`,
      children: <LogsTable data={logs} />
    },
    {
      key: '4',
      label: `Assets`,
      children: <Assets data={assets} />
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Argilac</title>
        <meta name="description" content="Automated Cryptocurrency Trading Bot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SWRConfig value={{ fallback }}>
        <main className={styles.main}>
          <Header />

          <div className={styles.grid}>
            <Tabs
              defaultActiveKey="1"
              items={items}
              className={styles.fullWidthTabs}
              style={{ width: '100%' }}
            />
          </div>
        </main>

        <footer className={styles.footer}>
          Made with love by{' '}
          <a href="https://rennalabs.xyz" target="_blank" rel="noopener noreferrer">
            Renna Labs
          </a>
        </footer>
      </SWRConfig>
    </div>
  );
}
