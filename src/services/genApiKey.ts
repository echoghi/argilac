import { generateRandomHash } from '../trading/utils';
import Logger from '../lib/logger';

function genApiKey() {
  const hash = generateRandomHash();

  return hash.slice(2);
}

const apiKey = genApiKey();

Logger.info(`API Key: ${apiKey}`);
