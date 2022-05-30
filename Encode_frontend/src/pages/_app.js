import "../../styles/style.css";
import Head from "next/head";
import Navbar from "../components/Navbar";
import {
  Web3ReactProvider,
  UnsupportedChainIdError,
  useWeb3React,
} from "@web3-react/core";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from "@web3-react/walletconnect-connector";
import { Web3Provider } from "@ethersproject/providers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { StarknetProvider } from '@starknet-react/core';

function getErrorMessage(error) {
  const handleNetworkSwitch = async (networkName) => {
    await changeNetwork({ networkName });
  };

  if (error instanceof NoEthereumProviderError) {
    return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
  } else if (error instanceof UnsupportedChainIdError) {
    return (<button onClick={() => handleNetworkSwitch("goerli")}>
      "Wrong network. Switch to Goerli Network."
    </button>);
  } else if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect
  ) {
    return "Please authorize this website to access your account.";
  } else {
    console.error(error);
    return "An unknown error occurred. Check the console for more details.";
  }
}

// {"name":"Görli","title":"Ethereum Testnet Görli","chain":"ETH","network":"testnet","rpc":["https://goerli.infura.io/v3/${INFURA_API_KEY}","wss://goerli.infura.io/v3/${INFURA_API_KEY}","https://rpc.goerli.mudit.blog/"],"faucets":["http://fauceth.komputing.org?chain=5&address=${ADDRESS}","https://goerli-faucet.slock.it?address=${ADDRESS}","https://faucet.goerli.mudit.blog"],"nativeCurrency":{"name":"Görli Ether","symbol":"GOR","decimals":18},"infoURL":"https://goerli.net/#about","shortName":"gor","chainId":5,"networkId":5,"ens":{"registry":"0x112234455c3a32fd11230c42e7bccd4a84e02010"},"explorers":[{"name":"etherscan-goerli","url":"https://goerli.etherscan.io","standard":"EIP3091"}]}
const networks = {
  goerli: {
    chainId: `0x${Number(5).toString(16)}`,
    chainName: "Görli",
    nativeCurrency: {
      name: "Görli Ether",
      symbol: "GOR",
      decimals: 18
    },
    rpcUrls: ["https://rpc.goerli.mudit.blog/"],
    blockExplorerUrls: ["https://goerli.etherscan.io"]
  }
}
const changeNetwork = async ({ networkName }) => {
  try {
    if (!window.ethereum) throw new Error("No crypto wallet found");
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${Number(5).toString(16)}` }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                ...networks[networkName]
              }
            ]
          });
        } catch (addError) {
          // handle "add" error
          console.log(addError)
        }
      }
      // handle other "switch" errors
    }
  } catch (err) {
    console.log(err);
  }
};

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

const AppWrapper = ({ Component, pageProps }) => {
  const context = useWeb3React();
  const { error, connector, provider } = context;

  useEffect(() => {
    if (error) {
      toast.error(getErrorMessage(error));
    }
  }, [error]);

  return (
    <main
      className="w-5/6 pt-10 m-auto flex flex-col"
      style={{ minHeight: "100vh" }}
    >
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
      />
      <Navbar />
      <Component {...pageProps} />
    </main>
  );
};

function MyApp({ Component, pageProps }) {

  return (
    <>
      <Web3ReactProvider getLibrary={getLibrary}>
        <StarknetProvider>
          <Head>
            <title>Vaulti</title>
            <meta
              name="viewport"
              content="initial-scale=1.0, width=device-width"
            />
            <link rel="shortcut icon" href="/logo-icon.png" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
              rel="preconnect"
              href="https://fonts.gstatic.com"
              crossOrigin="true"
            />
            <link
              href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
              rel="stylesheet"
            />
          </Head>
          <AppWrapper Component={Component} pageProps={pageProps} />
        </StarknetProvider>
      </Web3ReactProvider>
    </>
  );
}

export default MyApp;
