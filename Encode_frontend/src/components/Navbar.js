import React from "react";
import { useWeb3React } from "@web3-react/core";
import Link from "next/link";
import { MdBolt, MdOutlineAccountBalanceWallet } from "react-icons/md";
import { useStarknet } from '@starknet-react/core';
import { ConnectStarknetWallet } from './ConnectStarknetWallet';

const Navbar = () => {
  const context = useWeb3React();
  const { account: starknetAccount, } = useStarknet()
  const { account, chainId } = context;

  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center justify-start">
        <Link href="/">
          <img
            src="/logo.png"
            alt="Vaulti - Home"
            className="h-10 cursor-pointer"
          />
        </Link>
        <div className="grid grid-rows-1 grid-cols-3 xl:gap-10 gap-6 ml-8 xl:ml-14">
          <a href="/tech">How it works</a>
          <a href="/about">About</a>
        </div>
      </div>
      {starknetAccount ? (
        <div className="flex items-center justify-end gap-2 ml-32">
          <div className="box px-4 py-2 h-9 flex items-center justify-center">
            <MdOutlineAccountBalanceWallet size={20} />
            <span className="ml-2 text-sm font-medium">
              {`${starknetAccount.substring(0, 6)}...${starknetAccount.substring(
                starknetAccount.length - 4
              )}`}
            </span>
          </div>
          {chainId === 5 ? (
            <div className="box px-4 py-2 h-9 flex items-center justify-center">
              <span className="flex items-center justify-between">
                <MdBolt size={20} />
                <p className="ml-1 font-medium text-sm">{"Goerli on L2"}</p>
              </span>
            </div>
          ) : null
          }
        </div>
      ) : null}
      {account ? (
        <div className="flex items-center justify-end gap-2">
          <div className="box px-4 py-2 h-9 flex items-center justify-center">
            <MdOutlineAccountBalanceWallet size={20} />
            <span className="ml-2 text-sm font-medium">
              {`${account.substring(0, 6)}...${account.substring(
                account.length - 4
              )}`}
            </span>
          </div>
          {chainId === 5 ? (
            <div className="box px-4 py-2 h-9 flex items-center justify-center">
              <span className="flex items-center justify-between">
                <MdBolt size={20} />
                <p className="ml-1 font-medium text-sm">{"Goerli"}</p>
              </span>
            </div>
          ) : (
            <div className="box px-4 py-2 h-9 flex items-center justify-center bg-danger">
              <span className="flex items-center justify-between">
                <MdBolt className="text-white" size={20} />
                <p className="text-white ml-1 font-semibold text-sm">
                  {"Wrong Network!"}
                </p>
              </span>
            </div>
          )}
          <div>
            {/* <ConnectStarknetWallet /> */}
          </div>
        </div>
      ) : null}

    </div>
  );
};

export default Navbar;
