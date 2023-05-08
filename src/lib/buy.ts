import { CurrentConfig } from '../config';
import { ERC20_ABI, USDC_TOKEN, WETH_TOKEN } from '../constants';
import { getLog, saveLog, saveTrade, trackError } from './log';
import Logger from './logger';
import { walletAddress } from './provider';
import { executeRoute, generateRoute } from './routing';
import sendTelegramAlert from './sendTelegramAlert';
import { formatBalance, getBuyAmount, getTokenBalance, getTokenBalances } from '../utils';
import { ethers } from 'ethers';

/**
 * Executes a buy order by swapping USDC for WETH, updates the log, and sends an alert with the result.
 *
 * @param {string} price - The price at which the position is being opened.
 * @throws Will throw an error if the buy order fails or the trade is cancelled.
 */

export async function buy(price: string) {
  const usdcBalance = await getTokenBalance(walletAddress, USDC_TOKEN.address, ERC20_ABI);
  const formattedBalance = await formatBalance(usdcBalance, USDC_TOKEN.decimals);
  const hasBalance = formattedBalance > CurrentConfig.strategy.min;
  const log = getLog();

  if (log?.positionOpen) {
    Logger.error('Position already open, skipping buy order');
  } else if (!hasBalance) {
    Logger.error('Insufficient USDC balance');
  }

  const tradeAmount = getBuyAmount(formattedBalance);

  const route = await generateRoute(USDC_TOKEN, WETH_TOKEN, tradeAmount);

  if (route && hasBalance && !log.positionOpen) {
    try {
      const res = await executeRoute(route, USDC_TOKEN, tradeAmount);

      const { formattedUSDCBalance, formattedWETHBalance } = await getTokenBalances();

      saveLog({
        ...log,
        positionOpen: formattedWETHBalance > 0,
        usdcBalance: formattedUSDCBalance,
        wethBalance: formattedWETHBalance,
        lastTrade: `Position opened at ${price}`,
        lastTradeTime: `[${new Date().toLocaleString()}]`,
        lastTradePrice: price
      });

      // Generate a random byte array of length 32
      const randomBytes = ethers.utils.randomBytes(32);

      // Create a hash using the keccak256 function
      const randomHash = ethers.utils.keccak256(randomBytes);

      saveTrade({
        key: randomHash,
        type: 'Buy',
        price,
        date: new Date().toLocaleString(),
        in: `${formattedWETHBalance} ${WETH_TOKEN.symbol}`,
        out: `${tradeAmount} ${USDC_TOKEN.symbol}`,
        link: `https://mumbai.polygonscan.com/tx/${res.hash}`
      });

      sendTelegramAlert(`Position opened at ${price} (${formattedWETHBalance.toFixed(5)} WETH)`);

      Logger.success('Buy order executed');
    } catch (e: any) {
      Logger.error('Buy order failed');

      sendTelegramAlert('Buy order failed');

      trackError({
        type: 'BUY',
        message: e.message
      });
    }
  } else {
    Logger.error('Trade cancelled');
  }
}
