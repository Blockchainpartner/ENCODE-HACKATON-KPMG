import { useStarknet, useStarknetInvoke } from '@starknet-react/core'
import React, { useState } from 'react'
import { useBridgeContract } from '~/hooks/bridge'
import useVaultContract from '~/hooks/vault'
import { useWeb3React } from "@web3-react/core";
import { ethers } from 'ethers';
import { number } from 'starknet'
import Approve from "./Approval"
const { toFelt } = number
import { bnToUint256, uint256ToBN } from 'starknet/dist/utils/uint256'


async function depositToL2(rawAmount, l2_user, provider) {
    const contract = useVaultContract(provider)
    const signer = provider.getSigner()
    const contractWithSigner = contract.connect(signer)
    const amount = ethers.utils.parseUnits(rawAmount, 18)
    try {
        const tx = await contractWithSigner.depositTokenL2(amount, l2_user);
    } catch (error) {
        console.log(error);
    }
}

async function withdrawTokenFromL1(rawAmount, provider) {
    const contract = useVaultContract(provider)
    const signer = provider.getSigner()
    const contractWithSigner = contract.connect(signer)
    const amount = ethers.utils.parseUnits(rawAmount, 18)
    try {
        const tx = await contractWithSigner.withdrawTokenL2(amount);
    } catch (error) {
        console.log(error);
    }
}

export default function DepositWithdrawButton({ amount, L1 }) {
    const { account } = useStarknet()
    const context = useWeb3React();
    const { account: l1Account, active, library } = context;
    const { contract: bridge } = useBridgeContract()
    const { invoke } = useStarknetInvoke({ contract: bridge, method: 'withdraw' })

    const [l1Loading, setLoading] = useState(false);

    const isL1 = L1

    const amountToWithdraw = isL1 ? null : amount
    const amountToDeposit = isL1 ? amount : null
    const amountToWithdrawFormated = bnToUint256(amountToWithdraw)


    const l1Account_felt = toFelt(l1Account)
    const l2Account_felt = toFelt(account)

    if (!isL1 && !account || isL1 && !active) {
        return null
    }

    return (
        <div>
            {isL1 ? (
                <div className='flex justify-start items-center'>
                    <Approve isL1={isL1} amount={amountToDeposit} provider={library} />
                    <button className="border border-mm p-3 flex items-center justify-between rounded cursor-pointer hover:bg-mm-100 ml-5"
                        onClick={() => depositToL2(amountToDeposit, l2Account_felt, library)}>
                        {l1Loading ? (
                            <div className="donutSpinner" />
                        ) : ("Bridge")}
                    </button>
                </div >
            ) : (
                <div className='flex justify-start items-center'>
                    <Approve isL1={isL1} amount={amountToWithdrawFormated} provider={library} />
                    <button className="border border-mm p-3 flex items-center justify-between rounded cursor-pointer hover:bg-mm-100 ml-5"
                        onClick={() => invoke({ args: [l1Account_felt, amountToWithdrawFormated] })}>{"Withdraw on L2"}
                    </button>
                    <button className="border border-mm p-3 flex items-center justify-between rounded cursor-pointer hover:bg-mm-100 ml-5"
                        onClick={() => withdrawTokenFromL1(amountToWithdraw, library)}>{"Withdraw on L1"}
                    </button>

                </div>
            )
            }
        </div >
    )
}

{/* <button onClick={() => invoke({ args: ['0x1'] })}></button> */ }
