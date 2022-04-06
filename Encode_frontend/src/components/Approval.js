import { useStarknet, useStarknetInvoke, useStarknetCall } from '@starknet-react/core'
import React from 'react'
import { useL2TokenContract } from '~/hooks/token_l2'
import useL1TokenContract from '~/hooks/token_l1'
import { ethers } from 'ethers';
import { number } from 'starknet'

const { toFelt } = number


async function approveL1Tokens(spender, rawAmount, provider) {
    const contract = useL1TokenContract(provider)
    const signer = provider.getSigner()
    const contractWithSigner = contract.connect(signer)
    const amount = ethers.utils.parseUnits(rawAmount, 18)
    try {
        const tx = await contractWithSigner.approve(spender, amount);
        return tx
    } catch (error) {
        console.log(error);
    }
}

// function isApproved(isL1, amount) {
//     const { account } = useStarknet()
//     const { contract } = useL2TokenContract()
//     const spender = process.env.L2_BRIDGE_ADDRESS
//     const { data, loading, error } = useStarknetCall({
//         contract,
//         method: 'allowance',
//         args: account ? [account, spender] : undefined,
//     })
//     const content = useMemo(() => {

//         if (loading || !data?.length) {

//             return <div>Approving</div>
//         }

//         if (error) {
//             return <div>Error: {error}</div>
//         }

//         const balance = uint256ToBN(data[0])
//         const isApproved = (data[0] == amount)
//         return isApproved
//     }, [data, loading, error])

//     return (
//         <div>
//             {account ? <div>{content}</div> : null}
//         </div>
//     )
// }

// APPROVE INTERFACE IS approve(address spender, uint256 amount) 
// HERE SPENDER IS THE BRIDGE/VAULT CONTRACT

export default function Approve({ isL1, amount, provider }) {
    const { account } = useStarknet()
    const { contract: l2Token } = useL2TokenContract()
    // const { loading, invoke } = useStarknetInvoke({ contract: l2Token, method: 'approve' })
    const { invoke } = useStarknetInvoke({ contract: l2Token, method: 'approve' })


    const spenderOnL1 = process.env.L1_VAULT_ADDRESS
    const spenderOnL2 = toFelt(process.env.L2_BRIDGE_ADDRESS)

    // FOR FUTURE WORK, DISPLAY OR HIDE APPROVAL BUTTON IF APPROVED/NOT APPROVED
    const isApprovedL1 = false
    const isApprovedL2 = false

    // const formatedAmount = bnToUint256(amount)
    return (
        <div>
            {isL1 ? (isApprovedL1 ? (null) : (
                <button className="border border-mm p-3 flex items-center justify-between rounded cursor-pointer hover:bg-mm-100"
                    onClick={() => approveL1Tokens(spenderOnL1, amount, provider)}>
                    {
                        "Approve"
                    }
                </button>)
            ) : (
                isApprovedL2 ? (null) : (
                    <button className="border border-mm p-3 flex items-center justify-between rounded cursor-pointer hover:bg-mm-100"
                        onClick={() => invoke({ args: [spenderOnL2, amount] })}
                    >
                        {"Approve"}</button>)
            )}
        </div >
    )
}


