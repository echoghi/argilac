import { SupportedChains, chainSwitch } from './chainMap';
import Logger from './logger';
import { web3 } from './provider';

export async function getNativeBalance(
  address: string,
  chain: SupportedChains
): Promise<number | undefined> {
  const { key, api } = chainSwitch(chain);

  const balanceUrl = `${api}/api?module=account&action=balance&address=${address}&tag=latest&apikey=${key}`;

  let nativeToken;

  try {
    const res = await fetch(balanceUrl, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET'
    });

    const response = await res.json();

    if (response.result) {
      nativeToken = Number(web3.utils.fromWei(response.result, 'ether'));
    }
  } catch (err: any) {
    Logger.error(`ERROR FETCHING ${chain.toUpperCase()} BALANCE: ${err.message}`);
  }

  return nativeToken;
}
