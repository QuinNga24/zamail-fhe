"use client"

import { useState, useEffect } from "react"
import type { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { getZamailContract, registerEmail as registerEmailOnContract, getMyEmail } from "@/lib/zamail-utils"
import { getWelcomeEmail, saveMockMailToInbox } from "@/lib/mock-mails"

interface RegisterEmailProps {
  provider: ethers.BrowserProvider
  account: string
  onEmailRegistered: (email: string) => void
}

export function RegisterEmail({ provider, account, onEmailRegistered }: RegisterEmailProps) {
  const [emailPrefix, setEmailPrefix] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasRegistered, setHasRegistered] = useState(false)
  const [existingEmail, setExistingEmail] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    void checkExistingEmail()
  }, [account])

  const checkExistingEmail = async () => {
    try {
      const signer = await provider.getSigner()
      const contract = await getZamailContract(signer)
      const email = await getMyEmail(contract)
      
      if (email && email.length > 0) {
        setHasRegistered(true)
        setExistingEmail(email)
        onEmailRegistered(email)
      }
    } catch (error) {
      console.error("Error checking existing email:", error)
    }
  }

  const handleRegister = async () => {
    if (!emailPrefix.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email name",
        variant: "destructive",
      })
      return
    }

    const fullEmail = `${emailPrefix}@zamail.com`
    setIsLoading(true)

    try {
      const signer = await provider.getSigner()
      const contract = await getZamailContract(signer)
      
      // Register email on contract
      await registerEmailOnContract(contract, fullEmail)
      
      // Send welcome email to user's inbox
      const welcomeMail = getWelcomeEmail(fullEmail)
      saveMockMailToInbox(fullEmail, welcomeMail)
      
      setHasRegistered(true)
      setExistingEmail(fullEmail)
      onEmailRegistered(fullEmail)

      toast({
        title: "Registration Successful",
        description: `Email ${fullEmail} has been registered`,
      })
    } catch (error: unknown) {
      console.error("Error registering email:", error)
      const errorMessage = error && typeof error === 'object' && 'message' in error && typeof error.message === 'string' && error.message.includes("0x8c379a") 
        ? "Email already taken or wallet already has an email"
        : (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string' ? error.message : "Unable to register email")
      
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (hasRegistered && existingEmail) {
    return (
      <Card className="max-w-2xl mx-auto border-2 border-muted-ink/20 bg-paper shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-serif text-ink">Email Already Registered</CardTitle>
          <CardDescription className="text-muted-ink font-serif">
            This wallet has already registered an email address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-vermillion/10 border-2 border-vermillion/30 rounded-lg p-6 text-center">
            <p className="text-sm text-muted-ink font-serif mb-2">Your registered email:</p>
            <p className="text-2xl font-bold text-vermillion font-serif">{existingEmail}</p>
          </div>

          <p className="text-sm text-muted-ink text-center font-serif italic">
            Each wallet can only register one email address. To register a different email, please use another wallet.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto border-2 border-muted-ink/20 bg-paper shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-serif text-ink">Register Email</CardTitle>
        <CardDescription className="text-muted-ink font-serif">Create your @zamail.com email address</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-serif text-ink">Email name</label>
          <div className="flex items-center gap-2">
            <Input
              value={emailPrefix}
              onChange={(e) => setEmailPrefix(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""))}
              placeholder="yourname"
              className="font-serif border-2 border-muted-ink/30 focus:border-vermillion"
            />
            <span className="text-ink font-serif whitespace-nowrap">@zamail.com</span>
          </div>
        </div>

        <div className="bg-vermillion/10 border-2 border-vermillion/30 rounded-lg p-4">
          <p className="text-sm text-ink font-serif text-center">
            Registration fee: <span className="font-bold text-vermillion">0.001 ETH</span> (Sepolia)
          </p>
        </div>

        <Button
          onClick={handleRegister}
          disabled={isLoading || !emailPrefix}
          className="w-full bg-vermillion hover:bg-vermillion/90 text-white font-serif text-lg py-6"
        >
          {isLoading ? "Registering..." : "Register Now"}
        </Button>

        <p className="text-xs text-muted-ink text-center font-serif italic">
          Each wallet can only register one email address
        </p>
      </CardContent>
    </Card>
  )
}
