import path from 'path';
import { promises as fs } from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import { getStats } from '../../lib/stats';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  //Find the absolute path of the json directory
  const jsonDirectory = path.join(process.cwd(), 'src', 'logs');
  //Read the json data file data.json
  const fileContents = await fs.readFile(jsonDirectory + '/trades.json', 'utf8');

  const trades = JSON.parse(fileContents);

  const stats = getStats(trades);

  res.status(200).json({ trades, stats });
}
