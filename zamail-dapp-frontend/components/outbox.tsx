"use client"

import { useState, useEffect } from "react"
import type { ethers } from "ethers"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { RefreshCw, Star } from "lucide-react"
import { getZamailContract, getOutboxHandles } from "@/lib/zamail-utils"

interface OutboxProps {
  provider: ethers.BrowserProvider
  account: string
}

interface SentMail {
  id: string
  to: string
  timestamp: string
  subject: string
  handle: string
}

export function Outbox({ provider, account }: OutboxProps) {
  const [sentMails, setSentMails] = useState<SentMail[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    void loadOutboxMails()
  }, [account])

  const loadOutboxMails = async () => {
    try {
      setIsLoading(true)
      const signer = await provider.getSigner()
      const contract = await getZamailContract(signer)
      const handles = await getOutboxHandles(contract)
      
      // Create placeholder mails from handles
      const loadedMails: SentMail[] = handles.map((handle: string, index: number) => ({
        id: `${index}`,
        to: `recipient${index}@zamail.com`,
        timestamp: "Recent",
        subject: "Encrypted Message",
        handle: handle,
      }))
      
      setSentMails(loadedMails)
    } catch (error) {
      console.error("Error loading outbox:", error)
      setSentMails([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b-2 border-muted-ink/20 px-4 py-3 flex items-center gap-4">
        <Checkbox />
        <Button variant="ghost" size="icon" onClick={loadOutboxMails} className="text-ink hover:bg-muted-ink/10">
          <RefreshCw className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-ink font-serif ml-auto">
          {sentMails.length} sent messages
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-ink font-serif">Loading...</p>
          </div>
        ) : sentMails.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-ink font-serif italic">No sent messages</p>
          </div>
        ) : (
          <div>
            {sentMails.map((mail) => (
              <div
                key={mail.id}
                className="border-b border-muted-ink/20 px-4 py-3 hover:shadow-md transition-shadow cursor-pointer bg-paper flex items-center gap-4"
              >
                <Checkbox />
                <Button variant="ghost" size="icon" className="text-muted-ink hover:text-vermillion">
                  <Star className="h-4 w-4" />
                </Button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4">
                    <span className="font-serif text-ink font-semibold w-48 truncate">To: {mail.to}</span>
                    <span className="flex-1 text-ink font-serif truncate">{mail.subject}</span>
                    <span className="text-sm text-muted-ink font-serif whitespace-nowrap">{mail.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
