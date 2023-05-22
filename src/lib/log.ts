import fs from 'fs';

import Logger from './logger';
import { generateRandomHash } from '../trading/utils';
import { getConfig } from '../services/getConfig';

interface Log {
  positionOpen: boolean;
  stablecoinBalance: number;
  tokenBalance: number;
  lastTrade?: string;
  lastTradeTime?: string;
  lastTradePrice?: string;
  PNL?: number;
}

export interface Trade {
  [key: string]: string | number | undefined;
  key: string;
  type: string;
  price: string;
  date: string;
  in: string;
  out: string;
  costBasis?: number;
  amountOut?: number;
  gasUsed: number;
  link: string;
  profit?: number;
  chain: string | undefined;
}

interface Error {
  key?: string;
  type: string;
  message: string;
  chain: string | undefined;
  time?: string;
}

/**
 * Reads and returns the contents of the log.json file.
 *
 * @returns {Log} An object containing the log data.
 *
 */

export function getLog(): Log {
  let log = {
    positionOpen: false,
    stablecoinBalance: 0,
    tokenBalance: 0
  };

  try {
    const logJSON = fs.readFileSync('./logs/log.json', 'utf-8');
    log = JSON.parse(logJSON);
  } catch (e) {
    Logger.error('Error reading log.json');
  }

  return log;
}

/**
 * Reads and returns the contents of the trades.json file.
 *
 * @returns {Trades} An object containing the trade data.
 *
 */
export function getTrades(): Trade[] {
  let trades = [];

  try {
    const logJSON = fs.readFileSync('./logs/trades.json', 'utf-8');
    trades = JSON.parse(logJSON);
  } catch (e) {
    Logger.error('Error reading trades.json');
  }

  return trades;
}

/**
 * Returns the most recent trade
 *
 * @returns {Trade} An object containing the trade data.
 *
 */
export function getLastTrade(): Trade {
  const trades = getTrades();

  if (!trades.length) return {} as Trade;

  return trades[0];
}

/**
 * Saves the provided log data to the log.json file.
 *
 * @param {Log} newLog - An object containing the log data to be saved.
 *
 */
export function saveLog(newLog: Log) {
  try {
    fs.writeFileSync(`./logs/log.json`, JSON.stringify(newLog, null, 2));
  } catch (e) {
    Logger.error('Error saving log.json');
  }
}

/**
 * Saves the provided trade data to the trades.json file.
 *
 * @param {Trade} newTrade - An object containing the trade data to be saved.
 *
 */
export function saveTrade(newTrade: Trade) {
  try {
    const trades = getTrades();
    trades.unshift(newTrade);

    fs.writeFileSync(`./logs/trades.json`, JSON.stringify(trades, null, 2));
  } catch (e) {
    Logger.error('Error saving trades.json');
  }
}

/**
 * Reads error-log.json and returns an array of error objects.
 * @returns {Error[]} An array of error objects.
 */
export function getErrorLog(): Error[] {
  let errors = [];

  try {
    const logJSON = fs.readFileSync('./logs/error-log.json', 'utf-8');
    errors = JSON.parse(logJSON);
  } catch (e) {
    Logger.error('Error reading error-log.json');
  }

  return errors;
}

/**
 * Adds an error object to error-log.json.
 * @param {Error} error - The error object to be added.
 */
export function trackError(error: Error) {
  try {
    const errors = getErrorLog();
    errors.unshift({
      ...error,
      time: new Date().toLocaleString(),
      key: generateRandomHash()
    });

    fs.writeFileSync(`./logs/error-log.json`, JSON.stringify(errors, null, 2));
  } catch (e) {
    Logger.error('Error saving log.json');
  }
}

/**
 * Reads status.json
 * @returns {boolean} The status of the bot.
 */
export function getStatus(): boolean {
  let status = false;

  try {
    const config = getConfig();
    status = config?.status || false;
  } catch (e) {
    Logger.error('Error reading status from config.json');
  }

  return status;
}
