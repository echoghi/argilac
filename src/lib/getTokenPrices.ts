import Logger from './logger';

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
