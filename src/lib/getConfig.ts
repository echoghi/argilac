import fs from 'fs';

import Logger from './logger';

export interface Config {
  exchange: string;
  activeChain: {
    name: string;
    rpc: string;
    explorer: string;
    displayName: string;
    currency: string;
    id: number;
  };
  tokens: {
    stablecoin: string;
    amountIn: number;
    token: string;
  };
  strategy: {
    size: number;
    slippage: number;
    min: number;
    max: boolean;
  };
  logs: {
    telegram: boolean;
  };
  status: boolean;
}

function fetchJSONFile(path: string) {
  let json;

  try {
    const rawJSON = fs.readFileSync(path, 'utf-8');
    json = JSON.parse(rawJSON);
  } catch (e) {
    Logger.error('Error reading json file');
  }

  return json;
}

/**
 * Reads config.json
 * @returns {config} user config
 */
export function getConfig(): Config | undefined {
  let config = fetchJSONFile('./src/config/config.json');

  if (!config) {
    Logger.error('Error reading config.json');

    config = fetchJSONFile('./src/config/config.default.json');
  }

  return config;
}

/**
 * Reads chainData.json
 * @returns {chainData}
 */
export function getChainData(): any {
  let data = fetchJSONFile('./src/config/chainData.json');

  if (!data) {
    Logger.error('Error reading chainData.json');

    data = fetchJSONFile('./src/config/chainData.default.json');
  }

  return data;
}
