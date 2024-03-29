import { getConfig } from './getConfig';
import Logger from '../lib/logger';

require('dotenv').config();

/**
 * Sends a message to a Telegram chat using a bot.
 *
 * @param {string} msg - The message to be sent.
 * @returns {Promise<Object|undefined>} A promise that resolves to the Telegram API response object, or undefined if the Telegram bot token or chat ID are not set in the environment.
 */
export default async function sendTelegramAlert(msg: string) {
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;
  const config = getConfig();

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID || !config?.logs.telegram) {
    Logger.info(
      'Telegram bot token or chat ID not set in environment, or Telegram alerts are disabled in config. Skipping Telegram alert.'
    );
    return;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  let response;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: msg
      })
    });

    response = await res.json();
  } catch (e: any) {
    Logger.error(`Error sending Telegram alert: ${e.message}`);
  }

  return response;
}
