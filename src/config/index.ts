import { Token } from '@uniswap/sdk-core';

require('dotenv').config();

export enum Environment {
  LOCAL,
  MAINNET
}

export interface ExampleConfig {
  rpc: {
    testnet: string | undefined;
    mainnet: string | undefined;
  };
  tokens: {
    in: Token; // Token to buy and speculate on
    amountIn: number; // Percentage of equity to use for trade
    out: Token; // Token to hold in between trades
    poolFee: number; // Gas fee for the trade
  };
  strategy: {
    size: number; // fraction of equity to use for trade
    min: number; // minimum amount of USDC to hold (trading will halt if balance is below this)
    max: number | undefined; // maximum amount of USDC to hold (trading will halt if balance is above this)
  };
}
