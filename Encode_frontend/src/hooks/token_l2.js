import { useContract } from '@starknet-react/core'
import L2TokenAbi from '../abi/L2_token.json'

export function useL2TokenContract() {
  return useContract({
    abi: L2TokenAbi,
    address: `${process.env.L2_TOKEN_ADDRESS}`,
  })
}
