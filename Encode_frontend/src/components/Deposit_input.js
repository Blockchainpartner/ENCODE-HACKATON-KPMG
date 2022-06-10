import React, { useEffect, useState, useMemo } from "react";
import { BiBitcoin, BiTimer } from "react-icons/bi";
import { getLorem } from "../../utils/utils"
import { useStarknet, useStarknetCall } from '@starknet-react/core';
import { useWeb3React } from "@web3-react/core";
import DepositWithdrawButton from "./DepositWithdrawButton"
import { useL2TokenContract } from '~/hooks/token_l2'
import useL1TokenContract from '~/hooks/token_l1'
import { ethers } from 'ethers';
import { bnToUint256, uint256ToBN } from 'starknet/dist/utils/uint256'
import { truncateNumber } from "../../utils/utils"

function UserBalanceStarknet() {
    const { account } = useStarknet()
    const { contract } = useL2TokenContract()

    const { data, loading, error } = useStarknetCall({
        contract,
        method: 'balanceOf',
        args: account ? [account] : undefined,
    })
    const content = useMemo(() => {

        if (loading || !data?.length) {

            return <div>Loading balance</div>
        }

        if (error) {
            return <div>Error: {error}</div>
        }

        const balance = uint256ToBN(data[0])
        return <p className={`text-sm font-light mb-4`}>{`Balance: ${truncateNumber(balance)}`}</p>
    }, [data, loading, error])

    return (
        <div>
            {account ? <div>{content}</div> : null}
        </div>
    )
}

function UserBalanceEthereum() {
    const context = useWeb3React();
    const [balance, setBalance] = useState(0)

    const { account, library } = context

    useEffect(() => {
        // declare the async data fetching function
        async function getBalance(user, provider) {
            const contract = useL1TokenContract(provider)
            try {
                const userBalance = await contract.balanceOf(user);
                setBalance(userBalance);
            } catch (error) {
                console.log(error);
                setBalance(ethers.BigNumber.from(0));
            }
        }
        // call the function
        getBalance(account, library)
            // make sure to catch any error
            .catch(console.error);;
    }, [])

    return (
        <div>
            <p className={`text-sm font-light mb-4`}>{`Balance: ${truncateNumber(balance)}`}</p>
        </div>
    )
}

const SelectMenu = ({ L1 }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [l1Token, setL1Token] = useState({ value: "BCPT" })
    const [l2Token, setL2Token] = useState({ value: "bBCPT" })

    const isL1 = L1

    return (
        <div>
            <div className="mt-1 ml-3 relative">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    type="button"
                    className="rounded hover:bg-gray-100 cursor-pointer relative bg-white border-b-2 border-gray-700 pr-8 p-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    <span className="flex items-center">
                        <div className="flex-shrink-0 h-6 w-6">
                            <BiBitcoin />
                        </div>
                        <span className="ml-3 block truncate">{isL1 ? l1Token.value : l2Token.value}</span>
                    </span>
                    <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-gray-500">
                        <svg
                            className="h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                        >
                            <path d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" />
                        </svg>
                    </span>
                </button>

                {/*SELECT MENU LIST*/}
                {menuOpen && (
                    <div className="rounded p-1 absolute mt-1 w-36 bg-white shadow-lg z-10">
                        {isL1 ? (
                            <ul className="max-h-56 py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                <li className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        setMenuOpen(false);
                                    }}>
                                    {l1Token.value}
                                </li>
                            </ul>
                        ) : (
                            <ul className="max-h-56 py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                <li className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        setMenuOpen(false);
                                    }}>
                                    {l2Token.value}
                                </li>
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};


const Deposit_input = ({ L1 }) => {
    const [depositAmount, setDepositAmount] = useState(0.0)
    const [withdrawAmount, setWithdrawAmount] = useState(0.0)

    const isL1 = L1
    return (
        <div className={`flex flex-col justify-between p-4`}>
            <div className={`flex justify-between items-center w-100`}>
                <p className={`mb-4`}>{isL1 ? `Deposit to L2` : `Withdraw to L1`}</p>
                {isL1 ? <UserBalanceEthereum /> : <UserBalanceStarknet />}
            </div>
            <div className={`flex justify-between items-center w-100`}>
                {isL1 ? (
                    <input
                        className={`disabled:text-purple-400 disabled:bg-white disabled:cursor-not-allowed text-2xl font-semibold text-brand-500 focus:outline-none text-left pr-4 w-2/3 overflow-scroll rounded p-1`}
                        value={depositAmount}
                        onChange={e => setDepositAmount(e.target.value)}
                        inputMode="decimal"
                        title="Token Amount"
                        type="text"
                        placeholder={'Amount' || '0.0'}
                        minLength={1}
                        maxLength={60}
                    />
                ) :
                    <input
                        className={`disabled:text-purple-400 disabled:bg-white disabled:cursor-not-allowed text-2xl font-semibold text-brand-500 focus:outline-none text-left pr-4 w-2/3 overflow-scroll rounded p-1`}
                        value={withdrawAmount}
                        onChange={e => setWithdrawAmount(e.target.value)}
                        inputMode="decimal"
                        title="Token Amount"
                        type="text"
                        placeholder={'Amount' || '0.0'}
                        minLength={1}
                        maxLength={60}
                    />}
                <span className={`flex justify-end items-center`}>
                    <SelectMenu L1={isL1} />
                </span>
            </div>
            <div className="mt-4">
                {isL1 ? (<DepositWithdrawButton amount={depositAmount} L1={isL1} />) : (
                    <div>
                        {/* <p className="text-sm font-medium mb-2">{`You need to call the withdraw function on L2 first and wait a bit before calling the L1 withdraw function !`}</p> */}
                        <DepositWithdrawButton amount={withdrawAmount} L1={false} />
                    </div>

                )}
            </div>
        </div>
    );
};

export default Deposit_input;
