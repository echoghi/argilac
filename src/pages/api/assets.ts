import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';

import { ERC20_ABI } from '../../constants';
import { walletAddress } from '../../lib/provider';
import { getChainData } from '../../services/getConfig';
import { getTokenBalance, formatBalance } from '../../trading/utils';
import { getNativeBalance } from '../../services/getNativeBalance';
import { getEthPrice, getMaticPrice } from '../../services/getTokenPrices';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const chainData = getChainData();
  const mumbaiProvider = new ethers.providers.JsonRpcProvider(chainData?.POLYGON_MUMBAI.RPC);
  const goerliProvider = new ethers.providers.JsonRpcProvider(chainData?.ETH_GOERLI.RPC);

  // Native balances
  const mumbaiBalance = await getNativeBalance(walletAddress, 'POLYGON_MUMBAI');
  const goerliBalance = await getNativeBalance(walletAddress, 'ETH_GOERLI');

  // Token balances
  const goerliUsdcBalance = await getTokenBalance(
    walletAddress,
    '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
    ERC20_ABI,
    goerliProvider
  );
  const goerliWethBalance = await getTokenBalance(
    walletAddress,
    '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
    ERC20_ABI,
    goerliProvider
  );

  const formattedGoerliUsdcBalance = await formatBalance(goerliUsdcBalance, 6);
  const formattedGoerliWethBalance = await formatBalance(goerliWethBalance, 18);

  const mumbaiUsdcBalance = await getTokenBalance(
    walletAddress,
    '0xE097d6B3100777DC31B34dC2c58fB524C2e76921',
    ERC20_ABI,
    mumbaiProvider
  );
  const mumbaiWethBalance = await getTokenBalance(
    walletAddress,
    '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
    ERC20_ABI,
    mumbaiProvider
  );

  const formattedMumbaiUsdcBalance = await formatBalance(mumbaiUsdcBalance, 6);
  const formattedMumbaiWethBalance = await formatBalance(mumbaiWethBalance, 18);

  // Token prices
  const ethPrice = await getEthPrice();
  const maticPrice = await getMaticPrice();

  const assets = [
    {
      name: 'Matic',
      type: 'Testnet L1',
      key: 'matic-mumbai',
      symbol: 'MATIC',
      chain: 'Polygon Mumbai',
      balance: mumbaiBalance,
      price: maticPrice
    },
    {
      name: 'Mumbai USDC',
      type: 'Testnet L1',
      key: 'usdc-mumbai',
      symbol: 'USDC',
      chain: 'Polygon Mumbai',
      balance: formattedMumbaiUsdcBalance,
      price: 1
    },
    {
      name: 'Mumbai wETH',
      type: 'Testnet L1',
      key: 'weth-mumbai',
      symbol: 'WETH',
      chain: 'Polygon Mumbai',
      balance: formattedMumbaiWethBalance,
      price: ethPrice
    },
    {
      name: 'Eth',
      type: 'Testnet L1',
      key: 'eth-goerli',
      symbol: 'ETH',
      chain: 'Goerli',
      balance: goerliBalance,
      price: ethPrice
    },
    {
      name: 'Goerli USDC',
      type: 'Testnet L1',
      key: 'usdc-goerli',
      symbol: 'gUSDC',
      chain: 'Goerli',
      balance: formattedGoerliUsdcBalance,
      price: 1
    },
    {
      name: 'Goerli wETH',
      type: 'Testnet L1',
      key: 'weth-goerli',
      symbol: 'gWETH',
      chain: 'Goerli',
      balance: formattedGoerliWethBalance,
      price: ethPrice
    }
  ];

  res.status(200).json({ assets });
}
