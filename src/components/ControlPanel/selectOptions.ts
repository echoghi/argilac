export const chainOptions = [
  { value: 'ETH_MAINNET', label: 'Ethereum', disabled: true },
  { value: 'POLYGON_MAINNET', label: 'Polygon', disabled: true },
  { value: 'POLYGON_MUMBAI', label: 'Polygon Mumbai' },
  { value: 'ETH_GOERLI', label: 'Ethereum Goerli' }
];

export const exchangeOptions = [
  { value: 'UNISWAP', label: 'Uniswap' },
  { value: 'sushiswap', label: 'Sushiswap', disabled: true },
  { value: '1inch', label: '1inch', disabled: true }
];

export const stablecoinOptions = [
  { value: 'USDC', label: 'USDC' },
  { value: 'DAI', label: 'DAI' },
  { value: 'TETHER', label: 'Tether', disabled: true }
];

export const tokenOptions = [
  { value: 'WETH', label: 'WETH' },
  { value: 'MATIC', label: 'MATIC' },
  { value: 'WBTC', label: 'WBTC', disabled: true }
];

export const slippageOptions = [
  { value: '0.1', label: '0.1%' },
  { value: '0.5', label: '0.5%' },
  { value: '1', label: '1%' },
  { value: '2', label: '2%' }
];

export const sizeOptions = [
  { value: '0.05', label: '5%' },
  { value: '0.10', label: '10%' },
  { value: '0.25', label: '25%' },
  { value: '0.5', label: '50%' },
  { value: '0.75', label: '75%' },
  { value: '1', label: '100%' }
];
