export type SupportedChains =
  | 'ETH_MAINNET'
  | 'BSC_MAINNET'
  | 'POLYGON_MAINNET'
  | 'OPTIMISM'
  | 'ARBITRUM'
  | 'ETH_GOERLI'
  | 'POLYGON_MUMBAI';

export function chainSwitch(chain: SupportedChains) {
  let api, key, name;

  switch (chain) {
    case 'ETH_MAINNET':
      api = `https://api.etherscan.io/`;
      key = process.env.etherscanKey;
      name = 'ethereum';
      break;
    case 'ETH_GOERLI':
      api = `https://api-goerli.etherscan.io/`;
      key = process.env.etherscanKey;
      name = 'ethereum';
      break;
    case 'POLYGON_MAINNET':
      api = `https://api.polygonscan.com/`;
      key = process.env.polygonscanKey;
      name = 'matic-network';
      break;
    case 'POLYGON_MUMBAI':
      api = `https://api-mumbai.polygonscan.com/`;
      key = process.env.polygonscanKey;
      name = 'matic-network';
      break;
    case 'OPTIMISM':
      api = `https://api-optimistic.etherscan.io/`;
      key = process.env.optimismKey;
      name = 'optimism';
      break;
    case 'ARBITRUM':
      api = `https://api.arbiscan.io/`;
      key = process.env.arbiscanKey;
      name = 'arbitrum';
      break;
    default:
      api = `https://api.etherscan.io/`;
      key = process.env.etherscanKey;
      name = 'ethereum';
  }

  return { api, key, name };
}
