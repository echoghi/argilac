import Logger from './logger';
import { web3 } from './provider';

type supportedChains = 'eth' | 'bsc' | 'polygon' | 'op' | 'arb' | 'goerli-eth' | 'polygon-mumbai';

function chainApiSwitch(address: string, chain: supportedChains) {
  switch (chain) {
    case 'eth':
      return `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.etherscanKey}`;
    case 'goerli-eth':
      return `https://api-goerli.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.etherscanKey}`;
    case 'polygon':
      return `https://api.polygonscan.com/api?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.polygonscanKey}`;
    case 'polygon-mumbai':
      return `https://api-mumbai.polygonscan.com/api?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.polygonscanKey}`;
    case 'op':
      return `https://api-optimistic.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.optimismKey}`;
    case 'arb':
      return `https://api.arbiscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.arbiscanKey}`;
    default:
      return `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.etherscanKey}`;
  }
}

export async function getNativeBalance(
  address: string,
  chain: supportedChains
): Promise<number | undefined> {
  const balanceUrl = chainApiSwitch(address, chain);

  let nativeToken;

  try {
    const res = await fetch(balanceUrl, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET'
    });

    const response = await res.json();

    if (response.result) {
      nativeToken = Number(web3.utils.fromWei(response.result, 'ether'));
    }
  } catch (err: any) {
    Logger.error(`ERROR FETCHING ${chain.toUpperCase()} BALANCE: ${err.message}`);
  }

  return nativeToken;
}
