import path from 'path';
import { promises as fs } from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

import Logger from '../../lib/logger';
import { trackError } from '../../lib/log';
import { getConfig } from '../../lib/provider';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const isFetch = req?.method === 'GET';
  let currentStatus: any;

  const config = getConfig();
  const chain = config?.activeChain?.displayName;

  try {
    const jsonDirectory = path.join(process.cwd(), 'public/logs');
    const fileContents = await fs.readFile(jsonDirectory + '/status.json', 'utf8');
    currentStatus = JSON.parse(fileContents);
  } catch (e: any) {
    Logger.error('Failed to retrieve status from file');
  }

  if (isFetch) {
    res.status(200).json({ success: true, status: currentStatus.status });
  } else {
    const status = req?.body?.status;

    let success: boolean = false;

    try {
      currentStatus.status = status.status;

      const jsonDirectory = path.join(process.cwd(), 'public/logs');

      await fs.writeFile(jsonDirectory + '/status.json', JSON.stringify(currentStatus, null, 2));

      success = true;

      if (status.status) {
        trackError({
          type: 'BOT_STATUS',
          message: 'Bot started via control panel',
          chain
        });
        Logger.success('Bot started via control panel');
      } else {
        trackError({
          type: 'BOT_STATUS',
          message: 'Bot stopped via control panel',
          chain
        });
        Logger.error('Bot stopped via control panel');
      }
    } catch (e: any) {
      Logger.error('Status update failed');
    }

    res.status(200).json({ success, status: currentStatus?.status });
  }
}
