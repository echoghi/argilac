import path from 'path';
import { promises as fs } from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import { generateRandomHash } from '../../utils';
import Logger from '../../lib/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const jsonDirectory = path.join(process.cwd(), 'src', 'logs');
  const isFetch = req?.method === 'GET';

  if (isFetch) {
    const fileContents = await fs.readFile(jsonDirectory + '/error-log.json', 'utf8');
    const logs = JSON.parse(fileContents);

    // Initialize an empty stats object
    let stats: any = {};

    // Assign a key property to each log for table rendering
    logs.map((log: any) => {
      if (!log.key) {
        log.key = generateRandomHash();
      }

      // If the log type exists in the stats object, increment its count
      // Otherwise, initialize it to 1
      if (log.type) {
        stats[log.type] = (stats[log.type] || 0) + 1;
      }

      // Add a manual type 'NETWORK' if the log message includes 'code=NETWORK_ERROR'
      if (log.message && log.message.includes('code=NETWORK_ERROR')) {
        stats['NETWORK'] = (stats['NETWORK'] || 0) + 1;
      }

      // Add a manual type 'ROUTING' if the log type is 'EXEC_ROUTE' or 'GEN_ROUTE'
      if (log.type === 'EXEC_ROUTE' || log.type === 'GEN_ROUTE') {
        stats['ROUTING'] = (stats['ROUTING'] || 0) + 1;
      }
    });

    //Return the content of the data file in json format
    res.status(200).json({ logs, stats });
  } else {
    const clearLogs = req?.body?.action === 'delete';

    if (!clearLogs) return res.status(400).json({ success: false });

    let success: boolean = false;

    try {
      await fs.writeFile(jsonDirectory + '/error-log.json', JSON.stringify([], null, 2));

      success = true;
    } catch (e: any) {
      Logger.error('Error logs delete failed');
    }

    res.status(200).json({ success });
  }
}
