import path from 'path';
import { promises as fs } from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

import Logger from '../../lib/logger';
import { trackError } from '../../lib/log';
import { getConfig } from '../../lib/getConfig';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const jsonDirectory = path.join(process.cwd(), 'src', 'config');
  const isFetch = req?.method === 'GET';
  let config = getConfig();

  if (isFetch) {
    res.status(200).json({ success: true, config });
  } else {
    const newConfig = req?.body?.config;
    const log = req?.body?.log;

    let success: boolean = false;

    try {
      await fs.writeFile(jsonDirectory + '/config.json', JSON.stringify(newConfig, null, 2));

      if (log) {
        trackError({
          ...log
        });

        Logger.info(log.message);
      }

      success = true;
    } catch (e: any) {
      Logger.error('config update failed');
    }

    res.status(200).json({ success, config });
  }
}
