import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

const POLLING_INTERVAL = 12000;
const RPC_URLS = {
  // 4: "https://rinkeby-light.eth.linkpool.io/",
  5: "https://goerli-light.eth.linkpool.io/",
};

export const injected = new InjectedConnector({
  supportedChainIds: [5],
});

export const walletconnect = new WalletConnectConnector({
  rpc: { 5: RPC_URLS[5] },
  qrcode: true,
});

export const connectorsByName = {
  Injected: injected,
  WalletConnect: walletconnect,
};
