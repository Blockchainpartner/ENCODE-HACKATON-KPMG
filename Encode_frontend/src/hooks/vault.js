import L1VaultAbi from "../abi/L1_vault.json"
import { ethers } from 'ethers';

export default function useVaultContract(provider) {
  const vaultContract = new ethers.Contract(process.env.L1_VAULT_ADDRESS, L1VaultAbi, provider);
  return vaultContract
}