
import { ethers } from 'ethers';

import L1TokenAbi from '../abi/L1_token.json'

export default function useL1TokenContract(provider) {
  const ERC20Contract = new ethers.Contract(process.env.L1_TOKEN_ADDRESS, L1TokenAbi, provider);
  return ERC20Contract
}
