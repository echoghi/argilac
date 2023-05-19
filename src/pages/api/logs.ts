import path from 'path';
import { promises as fs } from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import { generateRandomHash } from '../../utils';
import Logger from '../../lib/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const isFetch = req?.method === 'GET';

  if (isFetch) {
    //Find the absolute path of the json directory
    const jsonDirectory = path.join(process.cwd(), 'public/logs');
    //Read the json data file data.json
    const fileContents = await fs.readFile(jsonDirectory + '/error-log.json', 'utf8');
    const logs = JSON.parse(fileContents);

    // assign a key property to each log for table rendering
    logs.map((log: any) => {
      if (!log.key) {
        log.key = generateRandomHash();
      }
    });

    //Return the content of the data file in json format
    res.status(200).json({ logs });
  } else {
    const clearLogs = req?.body?.action === 'delete';

    if (!clearLogs) return res.status(400).json({ success: false });

    let success: boolean = false;

    try {
      const jsonDirectory = path.join(process.cwd(), 'public/logs');

      await fs.writeFile(jsonDirectory + '/error-log.json', JSON.stringify([], null, 2));

      success = true;
    } catch (e: any) {
      Logger.error('Error logs delete failed');
    }

    res.status(200).json({ success });
  }
}
