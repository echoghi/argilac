import { Token } from '@uniswap/sdk-core';
import { getChainData, getConfig } from './getConfig';

export const getToken = (symbol: string) => {
  const config = getConfig();
  const chainData = getChainData();

  // @ts-ignore
  const chain = chainData[config?.activeChain.name];

  const token = chain.TOKENS[symbol];

  return new Token(
    // @ts-ignore
    config?.activeChain.id,
    token.CONTRACT,
    token.DECIMALS,
    token.SYMBOL,
    token.NAME
  );
};
