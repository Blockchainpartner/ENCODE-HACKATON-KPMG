import { useContract } from '@starknet-react/core'
import { Abi } from 'starknet'
import { ethers } from 'ethers';
import Bridgor from "../abi/L2_bridge.json"

export function useBridgeContract() {
  return useContract({
    abi: Bridgor,
    address: `${process.env.L2_BRIDGE_ADDRESS}`,
  })
}
