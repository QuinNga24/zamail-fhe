"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { LandingPage } from "@/components/landing-page"
import { Dashboard } from "@/components/dashboard"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { ZAMAIL_CONTRACT } from "@/lib/contracts"

const SEPOLIA_CHAIN_ID = ZAMAIL_CONTRACT.NETWORK.chainId

export default function Home() {
  const [account, setAccount] = useState<string | null>(null)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    void checkConnection()
  }, [])

  const checkConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await provider.listAccounts()

        if (accounts.length > 0) {
          const network = await provider.getNetwork()
          setProvider(provider)
          setAccount(accounts[0].address)
          setIsCorrectNetwork(Number(network.chainId) === SEPOLIA_CHAIN_ID)
        }
      } catch (error) {
        console.error("[v0] Error checking connection:", error)
      }
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      toast({
        title: "Wallet Not Found",
        description: "Please install MetaMask or OKX Wallet",
        variant: "destructive",
      })
      return
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send("eth_requestAccounts", [])
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      const network = await provider.getNetwork()

      setProvider(provider)
      setAccount(address)
      setIsCorrectNetwork(Number(network.chainId) === SEPOLIA_CHAIN_ID)

      toast({
        title: "Connected Successfully",
        description: `Address: ${address.slice(0, 6)}...${address.slice(-4)}`,
      })
    } catch (error) {
      console.error("[v0] Error connecting wallet:", error)
      toast({
        title: "Connection Failed",
        description: "Unable to connect wallet",
        variant: "destructive",
      })
    }
  }

  const switchToSepolia = async () => {
    if (!window.ethereum) return

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }], // Sepolia chainId in hex
      })

      const provider = new ethers.BrowserProvider(window.ethereum)
      const network = await provider.getNetwork()
      setIsCorrectNetwork(Number(network.chainId) === SEPOLIA_CHAIN_ID)

      toast({
        title: "Network Switched",
        description: "Switched to Sepolia",
      })
    } catch (error: unknown) {
      console.error("[v0] Error switching network:", error)

      // If network doesn't exist, add it
      if (error && typeof error === 'object' && 'code' in error && error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0xaa36a7",
                chainName: "Sepolia",
                nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
                rpcUrls: ["https://rpc.sepolia.org"],
                blockExplorerUrls: ["https://sepolia.etherscan.io"],
              },
            ],
          })
        } catch (addError) {
          console.error("[v0] Error adding network:", addError)
        }
      }
    }
  }

  const disconnectWallet = () => {
    setAccount(null)
    setProvider(null)
    setIsCorrectNetwork(false)

    toast({
      title: "Disconnected",
      description: "Wallet has been disconnected",
    })
  }

  if (!account) {
    return <LandingPage onConnect={connectWallet} />
  }

  if (!isCorrectNetwork) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="text-center space-y-6 p-8">
          <h2 className="text-3xl font-serif text-ink">Wrong Network</h2>
          <p className="text-muted-ink">Please switch to Sepolia network to continue</p>
          <button
            onClick={switchToSepolia}
            className="px-8 py-3 bg-vermillion text-white rounded-lg hover:bg-vermillion/90 transition-colors font-serif"
          >
            Switch to Sepolia
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Dashboard account={account} provider={provider!} onDisconnect={disconnectWallet} />
      <Toaster />
    </>
  )
}
