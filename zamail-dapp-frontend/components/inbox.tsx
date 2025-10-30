"use client"

import { useState, useEffect } from "react"
import type { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { RefreshCw, Star, Reply } from "lucide-react"
import { getZamailContract, getMyEmail, sendMail } from "@/lib/zamail-utils"
import { loadMockMailsFromInbox, type MockMail } from "@/lib/mock-mails"
import {
  getEncryptedMails,
  decryptMailContent,
  encryptMailContent,
  saveEncryptedMail,
} from "@/lib/offchain-storage"

interface InboxProps {
  provider: ethers.BrowserProvider
  account: string
}

interface Mail {
  id: string
  from: string
  timestamp: string
  handle: string
  subject: string
  body: string
}

export function Inbox({ provider, account }: InboxProps) {
  const [mails, setMails] = useState<Mail[]>([])
  const [selectedMail, setSelectedMail] = useState<{ from: string; subject: string; body: string } | null>(null)
  const [isReplying, setIsReplying] = useState(false)
  const [replySubject, setReplySubject] = useState("")
  const [replyBody, setReplyBody] = useState("")
  const [isSendingReply, setIsSendingReply] = useState(false)
  const [, setIsDecrypting] = useState(false)
  const [, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    void loadInboxMails()
  }, [account])

  const loadInboxMails = async () => {
    try {
      setIsLoading(true)
      const signer = await provider.getSigner()
      const contract = await getZamailContract(signer)
      
      try {
        // Load from off-chain storage (localStorage) instead of contract
        const encryptedMails = getEncryptedMails()
        const userEmail = await getMyEmail(contract)
        
        console.log('Loading inbox from localStorage...')
        console.log('User email:', userEmail)
        console.log('Total encrypted mails:', encryptedMails.length)
        
        // Filter mails sent TO this user
        const inboxMails = encryptedMails.filter((m) => m.to.toLowerCase() === userEmail.toLowerCase())
        
        console.log('Inbox mails:', inboxMails.length)
        
        // Decrypt and display
        const loadedMails: Mail[] = []
        
        for (const encryptedMail of inboxMails) {
          try {
            // Decrypt content
            const decrypted = await decryptMailContent(
              encryptedMail.ciphertext,
              encryptedMail.from,
              encryptedMail.to
            )
            
            loadedMails.push({
              id: encryptedMail.hash,
              from: decrypted.from,
              timestamp: formatTimestamp(new Date(encryptedMail.timestamp)),
              handle: encryptedMail.hash,
              subject: decrypted.subject,
              body: decrypted.body,
            })
          } catch (decryptError) {
            console.error('Failed to decrypt mail:', decryptError)
            // Show encrypted placeholder
            loadedMails.push({
              id: encryptedMail.hash,
              from: encryptedMail.from,
              timestamp: formatTimestamp(new Date(encryptedMail.timestamp)),
              handle: encryptedMail.hash,
              subject: 'Encrypted Mail',
              body: 'Failed to decrypt content',
            })
          }
        }
        
        setMails(loadedMails)
      } catch (error) {
        console.error('Error loading inbox:', error)
        // Fallback to mock mails
        const userEmail = await getMyEmail(contract)
        if (userEmail) {
          const mockMails = loadMockMailsFromInbox(userEmail)
          const loadedMails: Mail[] = mockMails.map((mail: MockMail, index: number) => ({
            id: mail.id,
            from: mail.from,
            timestamp: formatTimestamp(mail.timestamp),
            handle: `mock-${index}`,
            subject: mail.subject,
            body: mail.body,
          }))
          setMails(loadedMails)
        }
      }
    } catch (error) {
      console.error("Error loading inbox:", error)
      setMails([])
    } finally {
      setIsLoading(false)
    }
  }

  const formatTimestamp = (date: Date): string => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Date(date).toLocaleDateString()
  }

  const handleReadMail = async (mail: Mail) => {
    setIsDecrypting(true)

    try {
      // Show mail content directly
      await new Promise((resolve) => setTimeout(resolve, 300))
      setSelectedMail({
        from: mail.from,
        subject: mail.subject,
        body: (mail as Mail).body || "No content.",
      })
      // Pre-fill reply subject
      setReplySubject(mail.subject.startsWith("Re: ") ? mail.subject : `Re: ${mail.subject}`)
    } catch (error) {
      console.error("Error reading mail:", error)
      toast({
        title: "Read Failed",
        description: "Unable to read email content",
        variant: "destructive",
      })
    } finally {
      setIsDecrypting(false)
    }
  }

  const handleReply = () => {
    setIsReplying(true)
    setReplyBody("")
  }

  const handleSendReply = async () => {
    if (!selectedMail || !replyBody.trim()) {
      toast({
        title: "Validation Error",
        description: "Reply body cannot be empty",
        variant: "destructive",
      })
      return
    }

    setIsSendingReply(true)

    try {
      const signer = await provider.getSigner()
      const contract = await getZamailContract(signer)
      const userEmail = await getMyEmail(contract)

      toast({
        title: "Encrypting Reply...",
        description: "Creating encrypted reply",
      })

      // Encrypt reply content
      const { hash, ciphertext } = await encryptMailContent(
        replySubject,
        replyBody,
        userEmail,
        selectedMail.from
      )

      // Save to localStorage
      saveEncryptedMail({
        hash,
        ciphertext,
        timestamp: Date.now(),
        from: userEmail,
        to: selectedMail.from,
      })

      toast({
        title: "Sending Reply...",
        description: "Storing encrypted reply",
      })

      // Send (off-chain only)
      await sendMail(contract, selectedMail.from, hash)

      toast({
        title: "Reply Sent!",
        description: `Reply sent to ${selectedMail.from}`,
      })

      // Reset reply form
      setIsReplying(false)
      setReplyBody("")
      setSelectedMail(null)

      // Reload inbox
      await loadInboxMails()
    } catch (error) {
      console.error("Error sending reply:", error)
      toast({
        title: "Reply Failed",
        description: error instanceof Error ? error.message : "Failed to send reply",
        variant: "destructive",
      })
    } finally {
      setIsSendingReply(false)
    }
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="border-b-2 border-muted-ink/20 px-4 py-3 flex items-center gap-4">
          <Checkbox />
          <Button variant="ghost" size="icon" className="text-ink hover:bg-muted-ink/10">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-ink font-serif ml-auto">
            1-{mails.length} of {mails.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
          {mails.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-ink font-serif italic">No messages</p>
            </div>
          ) : (
            <div>
              {mails.map((mail) => (
                <div
                  key={mail.id}
                  onClick={() => handleReadMail(mail)}
                  className="border-b border-muted-ink/20 px-4 py-3 hover:shadow-md transition-shadow cursor-pointer bg-paper flex items-center gap-4"
                >
                  <Checkbox onClick={(e) => e.stopPropagation()} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-ink hover:text-vermillion"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4">
                      <span className="font-serif text-ink font-semibold w-48 truncate">{mail.from}</span>
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

      <Dialog open={!!selectedMail} onOpenChange={() => { setSelectedMail(null); setIsReplying(false); }}>
        <DialogContent className="max-w-3xl bg-paper border-2 border-muted-ink/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-ink">{selectedMail?.subject}</DialogTitle>
            <p className="text-sm text-muted-ink font-serif pt-2">From: {selectedMail?.from}</p>
          </DialogHeader>
          <div className="mt-4 border-t-2 border-muted-ink/20 pt-4">
            <p className="text-ink font-serif leading-relaxed whitespace-pre-wrap">{selectedMail?.body}</p>
          </div>
          
          {/* Reply Section */}
          {!isReplying ? (
            <div className="mt-4 pt-4 border-t border-muted-ink/20">
              <Button
                onClick={handleReply}
                className="bg-ink text-paper hover:bg-ink/90"
              >
                <Reply className="h-4 w-4 mr-2" />
                Reply
              </Button>
            </div>
          ) : (
            <div className="mt-4 pt-4 border-t border-muted-ink/20 space-y-4">
              <div>
                <label className="block text-sm font-serif text-ink mb-2">Subject</label>
                <Input
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  className="border-muted-ink/20"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-serif text-ink mb-2">Reply</label>
                <Textarea
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  placeholder="Write your reply..."
                  className="border-muted-ink/20 min-h-[150px]"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSendReply}
                  disabled={isSendingReply || !replyBody.trim()}
                  className="bg-ink text-paper hover:bg-ink/90"
                >
                  {isSendingReply ? "Sending..." : "Send Reply"}
                </Button>
                <Button
                  onClick={() => setIsReplying(false)}
                  variant="outline"
                  disabled={isSendingReply}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
