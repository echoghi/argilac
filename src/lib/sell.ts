import { ERC20_ABI } from '../constants';
import { getLog, saveLog, saveTrade, trackError } from './log';
import Logger from './logger';
import { getConfig, walletAddress } from './provider';
import { executeRoute, generateRoute } from './routing';
import sendTelegramAlert from './sendTelegramAlert';
import {
  formatBalance,
  formatUSD,
  generateRandomHash,
  getTokenBalance,
  getTokenBalances
} from '../utils';
import { ethers } from 'ethers';
import { getToken } from './token';

/**
 * Executes a sell order by swapping WETH for USDC, updates the log, and sends an alert with the result.
 *
 * @param {string} price - The price at which the position is being closed.
 * @throws Will throw an error if the sell order fails or the trade is cancelled.
 */

export async function sell(price: string) {
  const config = getConfig();
  const chain = config?.activeChain.displayName;
  // @ts-ignore
  const stablecoin = getToken(config?.tokens.stablecoin);
  // @ts-ignore
  const token = getToken(config?.tokens.token);

  const wethBalance = await getTokenBalance(walletAddress, token.address, ERC20_ABI);
  const usdcBalance = await getTokenBalance(walletAddress, stablecoin.address, ERC20_ABI);

  const formattedOldStableBalance = await formatBalance(usdcBalance, stablecoin.decimals);
  const formattedBalance = await formatBalance(wethBalance, token.decimals);
  const hasBalance = formattedBalance > 0;
  const log = getLog();

  if (!log?.positionOpen) {
    Logger.error('No position currently open, skipping sell order');

    trackError({
      type: 'ORDER_CONFLICT',
      message: 'Sell order recieved, but no position is currently open',
      chain
    });
  } else if (!hasBalance) {
    Logger.error('Insufficient WETH balance');
  }

  const route = await generateRoute(token, stablecoin, formattedBalance);

  if (route && hasBalance && log.positionOpen) {
    try {
      // Sell all WETH for USDC
      const res = await executeRoute(route, token, formattedBalance);

      if (!res.hash) return;

      const { formattedStablecoinBalance, formattedTokenBalance } = await getTokenBalances();

      // USDC balance after trade - cost basis - USDC balance before trade
      const lastTradePNL = formattedStablecoinBalance - 10 - formattedOldStableBalance;

      const formattedTradePNL = formatUSD(lastTradePNL);
      const PNL = log.PNL ? log.PNL + lastTradePNL : lastTradePNL;

      const lastTradeTime = new Date().toLocaleString();

      saveLog({
        positionOpen: formattedTokenBalance > 0,
        stablecoinBalance: formattedStablecoinBalance,
        tokenBalance: formattedTokenBalance,
        lastTrade: `Position closed at ${price}`,
        lastTradeTime: `[${lastTradeTime}]`,
        lastTradePrice: price,
        PNL
      });

      const randomHash = generateRandomHash();

      saveTrade({
        key: randomHash,
        type: 'Sell',
        price,
        date: lastTradeTime,
        in: `${formattedStablecoinBalance - formattedOldStableBalance} ${stablecoin.symbol}`,
        out: `${formattedBalance} ${token.symbol}`,
        link: `${config?.activeChain.explorer}tx/${res.hash}`,
        chain
      });

      if (lastTradePNL > 0) {
        const message = `Position closed at ${price} for a gain of ${formattedTradePNL} - Total P&L: ${formatUSD(
          PNL
        )}`;
        sendTelegramAlert(message);
        Logger.success(message);
      } else {
        const message = `Position closed at ${price} for a loss of ${formattedTradePNL} - Total P&L: ${formatUSD(
          PNL
        )}`;
        sendTelegramAlert(message);
        Logger.error(message);
      }
    } catch (e: any) {
      Logger.error('Sell order failed');

      sendTelegramAlert('Sell order failed');

      trackError({
        type: 'SELL',
        message: e.message,
        chain
      });
    }
  } else {
    Logger.error('Trade cancelled');
  }
}
