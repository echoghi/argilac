// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import Logger from '../../lib/logger';
import { buy } from '../../trading/buy';
import { sell } from '../../trading/sell';
import { hasGasMoney } from '../../trading/utils';
import sendTelegramAlert from '../../services/sendTelegramAlert';
import { getStatus } from '../../lib/log';

type Data = {
  success: boolean;
  message?: string;
};

/**
 * Processes buy or sell orders based on the given type, provided there are sufficient gas funds.
 *
 * @param {'BUY' | 'SELL'} type - The type of order, either 'BUY' or 'SELL'.
 * @param {string} price - The price at which the order is being executed.
 */

export const run = async (type: 'BUY' | 'SELL', price: string) => {
  const hasGas = await hasGasMoney();
  const status = getStatus();

  if (!hasGas) {
    Logger.error('Insufficient gas funds');
    sendTelegramAlert('Insufficient gas funds');

    return;
  }

  if (!status) {
    Logger.error('Bot is not running, skipping trade');

    return;
  }

  if (type === 'BUY') {
    Logger.info('Processing buy order...');

    await buy(price);
  }

  if (type === 'SELL') {
    Logger.info('Processing sell order...');

    await sell(price);
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  // Check for API key in the body of the request
  const apiKey = req.body.apiKey;

  // Check if the API key is valid
  if (apiKey !== process.env.API_KEY) {
    // If not valid, return 403 Forbidden
    res.status(403).json({ success: false, message: 'Forbidden' });
    Logger.error('Invalid API key');
    return;
  }

  // If valid, continue with the request
  // Remove or obfuscate the apiKey from the body before further processing
  delete req.body.apiKey;

  const type = req?.body?.type;
  const price = req?.body?.price;

  Logger.success(`Received trade signal: ${type} at ${price}`);

  run(type, price);

  res.status(200).json({ success: true });
}
