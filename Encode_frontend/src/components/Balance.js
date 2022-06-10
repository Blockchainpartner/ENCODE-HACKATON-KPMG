import useL1TokenContract from '~/hooks/token_l1'
import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import useVaultContract from '~/hooks/vault';
import { ethers } from 'ethers';
import { truncateNumber } from "../../utils/utils"

const calcPercentage = (reward, deposit) => {
    if (reward == 0) {
        return 0;
    }
    const product = reward.div(deposit);
    return 100 * product;
}

const Balance = () => {

    const context = useWeb3React();
    const [Deposit, setDeposit] = useState(0)
    const [Reward, setReward] = useState(0)
    const [Percentage, setPercentage] = useState(0);

    const { account, library } = context

    useEffect(() => {
        // declare the async data fetching function
        async function get(user, provider) {
            const contract = useVaultContract(provider)
            try {
                const userBalance = await contract.getUserDeposit(user);
                const userReward = await contract.getUserReward(user);
                setReward(userReward);
                setDeposit(userBalance);
                setPercentage(calcPercentage(userReward, userBalance));
            } catch (error) {
                //  console.log(error);
                setDeposit(ethers.BigNumber.from(0));
                setReward(ethers.BigNumber.from(0));
                setPercentage(ethers.BigNumber.from(0));
            }
        }
        // call the function
        get(account, library)
            // make sure to catch any error
            .catch(console.error);
    }, [Deposit, Reward, Percentage])

    return (
        <div className=" shadow-lg rounded-2xl p-4 bg-gradient-to-r from-pink-300 to-yellow-300 ">
            <div className='flex justify-between items-center'>
                <div className=''>
                    <div className="flex items-center justify-start gap-2 ">
                        <img
                            src="/logo-icon.png"
                            alt="Vaulti - Home"
                            className="h-8"
                        />
                        <p className="text-md text-black dark:text-white ml-2">Deposit Balance</p>
                    </div>
                    <div className="text-gray-700 dark:text-gray-100 text-4xl text-left font-bold my-4">
                        {`${truncateNumber(Deposit)}`}
                    </div>
                </div>
                <div className='flex flex-col items-center'>
                    <div className="flex items-center text-green-500 text-lg">
                        <svg className="flex" width="40" height="40" fill="currentColor" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1408 1216q0 26-19 45t-45 19h-896q-26 0-45-19t-19-45 19-45l448-448q19-19 45-19t45 19l448 448q19 19 19 45z">
                            </path>
                        </svg>
                        <span className="flex text-gray-700 ml-1">Staking Reward </span>
                    </div>
                    <span className="flex text-lg">{`${truncateNumber(Percentage)}`} </span>
                </div>

            </div>

        </div>
    )
}

export default Balance;

{/* <div className=" shadow-lg rounded-2xl p-4 bg-gradient-to-r mt-20 mr-80 from-pink-300 to-yellow-300 ">
            <div>
                
            </div>
            <div className="flex items-center">
                <span className="rounded-xl relative p-4">
                    <img
                        src="/logo-icon.png"
                        alt="Vaulti - Home"
                        className="h-10"
                    />
                </span>
                <p className="text-md text-black dark:text-white ml-2">Deposit Balance</p>
            </div>
            <div className="flex flex-col justify-start">
                <div className="text-gray-700 dark:text-gray-100 text-4xl text-left font-bold my-4">
                    {`${truncateNumber(Deposit)}`}
                </div>
                <div className="flex items-center text-green-500 text-lg">
                    <svg width="40" height="40" fill="currentColor" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1408 1216q0 26-19 45t-45 19h-896q-26 0-45-19t-19-45 19-45l448-448q19-19 45-19t45 19l448 448q19 19 19 45z">
                        </path>
                    </svg>
                    <div>
                        <span className="text-lg">{`${truncateNumber(Percentage)}`} </span>
                    </div>
                    <span className="text-gray-700 ml-5">Staking Reward </span>
                </div>
            </div>
        </div> */}