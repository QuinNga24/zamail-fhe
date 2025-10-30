"use client"

import { useState, useEffect } from "react"
import type { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { getZamailContract, sendMail as sendMailOnContract } from "@/lib/zamail-utils"
import {
  encryptMailContent,
  saveEncryptedMail,
} from "@/lib/offchain-storage"

interface ComposeMailProps {
  provider: ethers.BrowserProvider
  account: string
  userEmail: string | null
}

export function ComposeMail({ provider, userEmail }: ComposeMailProps) {
  const [to, setTo] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEncrypting, setIsEncrypting] = useState(false)
  const [isCheckingRecipient, setIsCheckingRecipient] = useState(false)
  const [recipientExists, setRecipientExists] = useState<boolean | null>(null)
  const { toast } = useToast()

  // Check if recipient exists when email changes
  useEffect(() => {
    const checkRecipient = async () => {
      if (!to || !to.endsWith('@zamail.com') || to.length < 5) {
        setRecipientExists(null)
        return
      }

      setIsCheckingRecipient(true)
      try {
        const signer = await provider.getSigner()
        const contract = await getZamailContract(signer)
        const recipientAddress = await contract.emailOwner(to)
        const exists = recipientAddress !== '0x0000000000000000000000000000000000000000'
        setRecipientExists(exists)
        console.log(`Recipient ${to} exists:`, exists, 'address:', recipientAddress)
      } catch (error) {
        console.error('Error checking recipient:', error)
        setRecipientExists(null)
      } finally {
        setIsCheckingRecipient(false)
      }
    }

    const timeoutId = setTimeout(checkRecipient, 500) // Debounce
    return () => clearTimeout(timeoutId)
  }, [to, provider])

  const handleSend = async () => {
    if (!userEmail) {
      toast({
        title: "Email Not Registered",
        description: "Please register an email before sending mail",
        variant: "destructive",
      })
      return
    }

    if (!to || !subject || !message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    // Validate email format
    if (!to.endsWith('@zamail.com')) {
      toast({
        title: "Invalid Email Format",
        description: "Recipient must have a @zamail.com address",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setIsEncrypting(true)

    try {
      const signer = await provider.getSigner()
      const contract = await getZamailContract(signer)
      const userAddress = await signer.getAddress()
      
      // Check if recipient email is registered
      try {
        const recipientAddress = await contract.emailOwner(to)
        if (recipientAddress === '0x0000000000000000000000000000000000000000') {
          throw new Error('Recipient email not registered')
        }
      } catch (checkError) {
        toast({
          title: "Recipient Not Found",
          description: `The email ${to} is not registered on Zamail`,
          variant: "destructive",
        })
        setIsLoading(false)
        setIsEncrypting(false)
        return
      }
      
      // Encrypt and store off-chain ONLY (no contract call)
      toast({
        title: "Encrypting...",
        description: "Creating encrypted content for off-chain storage",
      })
      
      const { hash, ciphertext } = await encryptMailContent(
        subject,
        message,
        userEmail,
        to
      )
      
      // Save to localStorage
      saveEncryptedMail({
        hash,
        ciphertext,
        timestamp: Date.now(),
        from: userEmail,
        to,
      })
      
      setIsEncrypting(false)
      
      toast({
        title: "Saving...",
        description: "Storing encrypted mail off-chain",
      })
      
      // Save without blockchain call (avoid FHE validation error)
      await sendMailOnContract(contract, to, hash)
      
      toast({
        title: "Sent Successfully",
        description: `Mail sent to ${to} (stored in localStorage)`,
      })

      setTo("")
      setSubject("")
      setMessage("")
    } catch (error: unknown) {
      console.error("Error sending mail:", error)
      
      let errorMessage = "Unable to send mail"
      
      if (error && typeof error === 'object') {
        if ('message' in error && typeof error.message === 'string') {
          if (error.message.includes('0xb9688461')) {
            errorMessage = "Transaction rejected by contract. Please check recipient email is registered."
          } else if (error.message.includes('insufficient funds')) {
            errorMessage = "Insufficient ETH balance. Need at least 0.0001 ETH + gas fees."
          } else if (error.message.includes('user rejected')) {
            errorMessage = "Transaction cancelled by user"
          } else {
            errorMessage = error.message
          }
        }
      }
      
      toast({
        title: "Send Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsEncrypting(false)
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto bg-paper border-2 border-muted-ink/20 rounded-lg shadow-xl">
        <div className="border-b-2 border-muted-ink/20 px-6 py-4 flex items-center justify-between bg-vermillion/5">
          <h2 className="text-xl font-serif text-ink font-semibold">New Message</h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-muted-ink/20 pb-3">
            <label className="text-sm font-serif text-muted-ink w-16">To</label>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Input
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="recipient@zamail.com"
                  className="border-0 focus-visible:ring-0 font-serif flex-1"
                />
                {isCheckingRecipient && (
                  <span className="text-xs text-muted-ink">Checking...</span>
                )}
                {!isCheckingRecipient && recipientExists === true && (
                  <span className="text-xs text-green-600 font-semibold">✓ Exists</span>
                )}
                {!isCheckingRecipient && recipientExists === false && (
                  <span className="text-xs text-vermillion font-semibold">✗ Not Found</span>
                )}
              </div>
              {to && !to.endsWith('@zamail.com') && (
                <p className="text-xs text-vermillion mt-1">Email must end with @zamail.com</p>
              )}
              {recipientExists === false && to.endsWith('@zamail.com') && (
                <p className="text-xs text-vermillion mt-1">This email address is not registered on Zamail</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 border-b border-muted-ink/20 pb-3">
            <label className="text-sm font-serif text-muted-ink w-16">Subject</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject..."
              className="flex-1 border-0 focus-visible:ring-0 font-serif"
            />
          </div>

          <div className="pt-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message..."
              rows={14}
              className="border-0 focus-visible:ring-0 font-serif resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-muted-ink/20">
            <div className="bg-vermillion/10 border border-vermillion/30 rounded px-3 py-1.5">
              <p className="text-xs text-ink font-serif">
                Fee: <span className="font-bold text-vermillion">0.0001 ETH</span>
              </p>
            </div>

            <Button
              onClick={handleSend}
              disabled={isLoading || !userEmail || recipientExists === false || !to || !subject || !message}
              className="bg-vermillion hover:bg-vermillion/90 text-white font-serif px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEncrypting ? "Encrypting..." : isLoading ? "Sending..." : "Send"}
            </Button>
            {/* Debug info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="text-xs text-muted-ink mt-2">
                Debug: userEmail={userEmail ? 'yes' : 'no'}, 
                recipientExists={String(recipientExists)}, 
                to={to ? 'yes' : 'no'}, 
                subject={subject ? 'yes' : 'no'}, 
                message={message ? 'yes' : 'no'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
