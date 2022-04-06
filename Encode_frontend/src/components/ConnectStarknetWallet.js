import React from "react";
import { useStarknet, InjectedConnector } from '@starknet-react/core'

export default function ConnectStarknetWallet() {
  const { account, connect, } = useStarknet()

  return (
    <div className="btn p-1 flex items-center justify-between rounded cursor-pointer hover:bg-mm-100"
      onClick={() => connect(new InjectedConnector())} >
      <span className="flex items-center justify-start">
        <img
          src="/icons/argentx.jpg"
          alt="Metamask"
          className="rounded-full h-8"
        />
        <p className="ml-3 font-semibold">Connect Argent X Wallet</p>
      </span>
    </div>
  )
}

