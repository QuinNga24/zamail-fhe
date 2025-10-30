import { useState, useCallback } from "react"
import { ethers } from "ethers"
import { ZAMAIL_CONTRACT } from "@/lib/contracts"

export const useZamailContract = (provider: ethers.BrowserProvider | null) => {
  const [contract, setContract] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initializeContract = useCallback(async () => {
    if (!provider) return

    try {
      setLoading(true)
      setError(null)

      // Fetch ABI
      const abiResponse = await fetch(ZAMAIL_CONTRACT.ABI_PATH)
      const abi = await abiResponse.json()

      // Get signer
      const signer = await provider.getSigner()

      // Create contract instance
      const contractInstance = new ethers.Contract(
        ZAMAIL_CONTRACT.ADDRESS,
        abi,
        signer
      )

      setContract(contractInstance)

      return contractInstance
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to initialize contract"
      setError(errorMessage)
      console.error("[useZamailContract] Error:", err)
    } finally {
      setLoading(false)
    }
  }, [provider])

  return {
    contract,
    loading,
    error,
    initializeContract,
  }
}
