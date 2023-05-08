import Head from 'next/head';
import useSWR from 'swr';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';

import styles from '../styles/Home.module.css';
import Header from '../components/Header/Header';
import DataTable from '../components/DataTable/DataTable';
import ControlPanel from '../components/ControlPanel';

export default function Home() {
  // @ts-ignore
  const fetcher = (...args: any) => fetch(...args).then((res) => res.json());
  const { data, error, isLoading } = useSWR('/api/data', fetcher, { refreshInterval: 30000 });
  const trades = data?.trades || [];

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `Control Panel`,
      children: <ControlPanel />
    },
    {
      key: '2',
      label: `Events`,
      children: <DataTable data={trades} />
    },
    {
      key: '3',
      label: `Assets`,
      children: `Content of Tab Pane 3`
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Argilac</title>
        <meta name="description" content="Automated Cryptocurrency Trading Bot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
    </div>
  );
}