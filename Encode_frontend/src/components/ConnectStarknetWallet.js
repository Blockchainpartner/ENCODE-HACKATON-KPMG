import React from "react";
import { useStarknet, InjectedConnector } from '@starknet-react/core'

export default function ConnectStarknetWallet() {
  const { account, connect, } = useStarknet()

  return (
    <button className="btn" onClick={() => connect(new InjectedConnector())}>
      <img
        src="/icons/argentx.jpg"
        alt="ArgentX"
        className="rounded-full h-6 mr-2"
      />
      {"Connect Argent X Wallet"}
    </button>
  )
}

