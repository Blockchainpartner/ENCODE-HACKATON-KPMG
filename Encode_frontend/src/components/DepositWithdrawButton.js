import { useStarknet, useStarknetInvoke } from "@starknet-react/core";
import React, { useState } from "react";
import { useBridgeContract } from "~/hooks/bridge";
import useVaultContract from "~/hooks/vault";
import useL1TokenContract from "~/hooks/token_l1";
import { useL2TokenContract } from "~/hooks/token_l2";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { number } from "starknet";
const { toFelt } = number;
import { bnToUint256, uint256ToBN } from "starknet/dist/utils/uint256";

async function withdrawTokenFromL1(rawAmount, provider) {
  const contract = useVaultContract(provider);
  const signer = provider.getSigner();
  const contractWithSigner = contract.connect(signer);
  const amount = ethers.utils.parseUnits(rawAmount, 18);
  try {
    const tx = await contractWithSigner.withdrawTokenL2(amount);
  } catch (error) {
    console.log(error);
  }
}

export default function DepositWithdrawButton({ amount, L1 }) {
  const { account } = useStarknet();
  const context = useWeb3React();
  const { account: l1Account, active, library } = context;
  const { contract: bridge } = useBridgeContract();
  const { contract: l2Token } = useL2TokenContract();
  const { invoke, loading: loadingWithdraw } = useStarknetInvoke({
    contract: bridge,
    method: "withdraw",
  });
  const { invoke: invokeApproval, loading: loadingApproval } =
    useStarknetInvoke({ contract: l2Token, method: "approve" });

  const [l1Loading, setLoading] = useState(false);
  const [l2Loading, setL2Loading] = useState(false);

  const isL1 = L1;

  const amountToWithdraw = isL1 ? null : amount;
  const amountToDeposit = isL1 ? amount : null;

  const handleDeposit = async (rawAmount, l2_user, provider) => {
    const vaultContract = useVaultContract(provider);
    const tokenContract = useL1TokenContract(provider);

    const signer = provider.getSigner();
    const vaultContractWithSigner = vaultContract.connect(signer);
    const tokenContractWithSigner = tokenContract.connect(signer);
    const amount = ethers.utils.parseUnits(rawAmount, 18);
    const spenderOnL1 = process.env.L1_VAULT_ADDRESS;
    try {
      setLoading(true);
      const tx = await tokenContractWithSigner
        .approve(spenderOnL1, amount)
        .then(async (res) => {
          vaultContractWithSigner
            .depositTokenL2(amount, l2_user)
            .then((res) => setLoading(false));
        });
      return tx;
    } catch (error) {
      console.log(error);
    }
  };

  const handleWithdrawal = async (rawAmount, l1_user, provider) => {
    const signer = provider.getSigner();
    const contract = useVaultContract(provider);
    const contractWithSigner = contract.connect(signer);
    const spenderOnL2 = toFelt(process.env.L2_BRIDGE_ADDRESS);

    const amountToWithdrawFormated = bnToUint256(rawAmount);
    const amount = ethers.utils.parseUnits(rawAmount, 18);

    try {
      setL2Loading(true);
      invokeApproval({ args: [spenderOnL2, amountToWithdrawFormated] }).then(
        (res) => console.log(res),
        async (res) => {
          invoke({ args: [l1_user, amountToWithdrawFormated] }).then(
            async (res) => {
              contractWithSigner
                .withdrawTokenL2(amount)
                .then((res) => setL2Loading(false));
            }
          );
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const l1Account_felt = toFelt(l1Account);
  const l2Account_felt = toFelt(account);

  if ((!isL1 && !account) || (isL1 && !active)) {
    return null;
  }

  return (
    <div>
      {isL1 ? (
        account ? (
          <div className="flex justify-start items-center">
            <button
              className="border border-mm p-3 flex items-center justify-between rounded cursor-pointer hover:bg-mm-100 w-auto"
              onClick={() =>
                handleDeposit(amountToDeposit, l2Account_felt, library)
              }
            >
              {l1Loading ? (
                <div>
                  <div className="donutSpinner" />
                  <div className="text-sm font-medium">
                    {`Transaction pending...`}
                  </div>
                </div>
              ) : (
                "Approve and Bridge"
              )}
            </button>
          </div>
        ) : (
          <div>{`Please connect your L2 wallet`}</div>
        )
      ) : l1Account ? (
        <div className="flex justify-start items-center">
          <button
            className="border border-mm p-3 flex justify-center rounded cursor-pointer hover:bg-mm-100 w-full"
            onClick={() =>
              handleWithdrawal(amountToWithdraw, l1Account_felt, library)
            }
          >
            {l2Loading ? (
              <div>
                <div className="donutSpinner" />
                <div className="text-sm font-medium p-2">
                  {`Transaction is pending...`}
                </div>
              </div>
            ) : (
              "Approve and Withdraw from L2"
            )}
          </button>
        </div>
      ) : (
        <div>{`Please connect your L1 wallet`}</div>
      )}
    </div>
  );
}
