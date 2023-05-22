import { chainSwitch, SupportedChains } from '../lib/chainMap';
import Logger from '../lib/logger';

export async function getTokenPrices(addresses: string[], network = 'ethereum') {
  const tokenPriceUrl = `https://api.coingecko.com/api/v3/simple/token_price/${network}?contract_addresses=${addresses.join(
    ','
  )}&vs_currencies=usd
`;

  let priceData;

  try {
    // get price of all tokens transacted with
    const priceRes = await fetch(tokenPriceUrl, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET'
    });

    priceData = await priceRes.json();
  } catch (err: any) {
    console.log('COINGECKO TOKEN PRICES ERROR', err.message);
  }

  return priceData;
}

export async function getEthPrice() {
  const priceUrl = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`;
  let ethPrice;

  try {
    const ethPriceRes = await fetch(priceUrl, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET'
    });

    ethPrice = await ethPriceRes.json();
  } catch (err: any) {
    Logger.error(`COINGECKO ETH PRICE ERROR: ${err.message}`);
  }

  return ethPrice?.ethereum?.usd;
}

export async function getMaticPrice() {
  const tokenPriceUrl = `https://api.coingecko.com/api/v3/simple/price/?ids=matic-network&vs_currencies=usd`;

  let priceData;

  try {
    const priceRes = await fetch(tokenPriceUrl, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET'
    });

    const result = await priceRes.json();
    priceData = result['matic-network'];
  } catch (err: any) {
    console.log('COINGECKO MATIC PRICE ERROR', err.message);
  }

  return priceData?.usd;
}

export async function getPriceAtTxTime(chain: SupportedChains, txHash: string): Promise<number> {
  let price = 0;
  let url;
  let data;
  try {
    const { api, key, name } = chainSwitch(chain);

    // Get the transaction details from Etherscan
    const txResponse = await fetch(
      `${api}/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${key}`
    );
    const txData = await txResponse.json();
    const blockNumber = txData.result.blockNumber;

    // Get the block details from Etherscan
    const blockResponse = await fetch(
      `${api}/api?module=proxy&action=eth_getBlockByNumber&tag=${blockNumber}&boolean=true&apikey=${key}`
    );
    const blockData = await blockResponse.json();
    const timestamp = blockData.result.timestamp;

    // Get the price of the native token at the timestamp from Coingecko
    const date = new Date(parseInt(timestamp, 16) * 1000)
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
      .replace(/\//g, '-');

    const priceResponse = await fetch(
      `https://api.coingecko.com/api/v3/coins/${name}/history?date=${date}`
    );
    url = `https://api.coingecko.com/api/v3/coins/${name}/history?date=${date}`;
    const priceData = await priceResponse.json();
    const nativePrice = priceData.market_data.current_price.usd;
    data = priceData;
    price = Number(nativePrice);
  } catch (e: any) {
    Logger.error(`TX PRICE ERROR: ${e.message}`);
    console.log(url, data);
  }

  return price;
}
