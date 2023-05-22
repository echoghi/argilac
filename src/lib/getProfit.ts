import { SupportedChains } from './chainMap';
import { getPriceAtTxTime } from '../services/getTokenPrices';
import { getLastTrade } from './log';
import Logger from './logger';

export async function getProfit(
  tx: string,
  gasUsed: number,
  amountIn: number,
  chain: SupportedChains | undefined
) {
  let profit = 0;

  if (!chain) return 0;

  try {
    const nativeTokenPrice = await getPriceAtTxTime(chain, tx);
    const lastTrade = getLastTrade();
    const feeAmount = gasUsed * nativeTokenPrice;

    if (!lastTrade.costBasis || !lastTrade.amountOut || lastTrade.type !== 'Buy') return undefined;

    const costBasis = feeAmount + lastTrade?.costBasis;

    profit = amountIn - costBasis;
  } catch (e: any) {
    Logger.error('Error calculating profit ' + e.message);
  }

  return profit;
}

export async function getCostBasis(
  tx: string,
  gasUsed: number,
  buyAmount: number,
  chain: SupportedChains | undefined
) {
  if (!chain) return 0;
  const nativeTokenPrice = await getPriceAtTxTime(chain, tx);
  const feeAmount = gasUsed * nativeTokenPrice;

  return feeAmount + buyAmount;
}
