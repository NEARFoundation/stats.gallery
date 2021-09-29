import { connect, Contract, keyStores, WalletConnection } from 'near-api-js';

import { getConfig } from '../config';

const nearConfig = getConfig(process.env.NODE_ENV || 'development');

console.log(nearConfig);
export async function initContract() {
  // Initialize connection to the NEAR testnet
  const near = await connect(
    Object.assign(
      { deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } },
      nearConfig,
    ),
  );

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  (window as any).walletConnection = new WalletConnection(near, null);

  // Getting the Account ID. If still unauthorized, it's just empty string
  (window as any).accountId = (window as any).walletConnection.getAccountId();

  // Initializing our contract APIs by contract name and configuration
  (window as any).contract = await new Contract(
    (window as any).walletConnection.account(),
    nearConfig.contractName,
    {
      // View methods are read only. They don't modify the state, but usually return some value.
      viewMethods: ['getGreeting'],
      // Change methods can modify the state. But you don't receive the returned value when called.
      changeMethods: ['setGreeting'],
    },
  );
}

export function logout() {
  (window as any).walletConnection.signOut();
  // reload page
  (window as any).location.replace(
    window.location.origin + window.location.pathname,
  );
}

export function login() {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  (window as any).walletConnection.requestSignIn(nearConfig.contractName);
}
