import { NextApiRequest, NextApiResponse } from 'next';
import { getChainData } from '../../services/getConfig';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const chainData = getChainData();

  res.status(200).json({ chainData });
}
