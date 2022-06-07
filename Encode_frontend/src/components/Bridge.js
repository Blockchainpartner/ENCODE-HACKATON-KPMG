import React, { useEffect } from "react";
import { getLorem } from "../../utils/utils"
import { useStarknet } from '@starknet-react/core';
import { useWeb3React } from "@web3-react/core";
import WalletsModal from "./modals/WalletsModal";
import Deposit_input from "./Deposit_input";
import Balance from "./Balance";
import ConnectStarknetWallet from "./ConnectStarknetWallet"
import { useBridgeContract } from '~/hooks/bridge'

const Bridge = () => {
    const { account: starknetAccount, connect, } = useStarknet()
    const context = useWeb3React();
    const { account, active } = context;

    return (
        <div className="w-full xl:w-5/6 m-auto my-16">
            <div className="flex justify-between items-start">
                <div className="flex flex-col items-start">
                    <h4 className="font-bold">{"BRIDGOOOR"}</h4>
                    <p className="font-semibold text-sm text-subtxt">
                        {
                            "Transfer to L2 while providing liquidity on L1 !"
                        }
                    </p>
                </div>
            </div>
            <div className="mt-10">
                <div className="flex justify-between">
                    <div className="shadow-lg flex flex-col items-start mr-32 p-4 bg-gradient-to-r from-brand1 to-brand2 rounded">
                        <h6 className="font-semibold mb-2">{"Ethereum"}</h6>
                        {active ? (
                            <span className="text-sm font-medium">
                                {account}
                            </span>
                        ) : (
                            <div className="flex flex-col justify-center">
                                <WalletsModal />
                            </div>
                        )}
                        <Deposit_input
                            L1={true}
                            balance={0} />
                    </div>
                    <div className="shadow-lg flex flex-col items-start bg-gradient-to-r p-4 from-brand1 to-brand2 rounded">
                        <h6 className="font-semibold mb-2">{"Starknet"}</h6>
                        {starknetAccount ? (
                            <span className="text-sm font-medium">
                                {starknetAccount}
                            </span>
                        ) : (
                            <div className="flex flex-col justify-center">
                                <ConnectStarknetWallet />
                            </div>
                        )}
                        <Deposit_input
                            L1={false}
                            balance={0} />
                    </div>
                </div>
                <div className="flex mt-20">

                    {/* <Balance /> */}
                </div>
            </div>

        </div>
    );
};

export default Bridge;
