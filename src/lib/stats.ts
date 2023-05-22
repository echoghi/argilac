import { Trade } from './log';

export function getStats(trades: Trade[]) {
  let chainCount: any = {};
  let maxCount = 0;
  let mostFrequentChain = null;
  let totalProfit = 0;
  let count = 0;

  for (const trade of trades) {
    let chain = trade.chain;

    if (chain) {
      chainCount[chain] = (chainCount[chain] || 0) + 1;
      if (chainCount[chain] > maxCount) {
        maxCount = chainCount[chain];
        mostFrequentChain = chain;
      }
    }

    if (trade.profit) {
      totalProfit += trade.profit;
      count++;
    }
  }

  const averageProfit = count > 0 ? totalProfit / count : 0;

  return { mostFrequentChain, totalProfit, averageProfit };
}
