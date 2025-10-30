// Sample mail data for testing and demo purposes

export interface MockMail {
  id: string
  from: string
  to: string
  subject: string
  body: string
  timestamp: Date
  isRead: boolean
}

export const SAMPLE_INBOX_MAILS: MockMail[] = [
  {
    id: "welcome-1",
    from: "team@zamail.com",
    to: "",
    subject: "Welcome to Zamail - Your Encrypted Email on Blockchain",
    body: `Welcome to Zamail!

Thank you for registering your email address on Zamail, the world's first fully homomorphic encrypted (FHE) email system on blockchain.

What makes Zamail special:
✓ Complete Privacy: Your emails are encrypted end-to-end using FHE technology
✓ Blockchain Security: All emails stored securely on Sepolia testnet
✓ Decentralized: No central authority can read your messages
✓ One Email Per Wallet: Your wallet is your identity

Getting Started:
1. Click "Compose" to send your first encrypted email
2. Enter recipient's @zamail.com address
3. Write your message - it will be automatically encrypted
4. Pay 0.0001 ETH to send (testnet fee)

Need Help?
Visit our documentation or contact support@zamail.com

Happy mailing!
The Zamail Team`,
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isRead: false,
  },
  {
    id: "sample-2",
    from: "alice@zamail.com",
    to: "",
    subject: "Testing Zamail - Encrypted Communication",
    body: `Hi there!

This is a test email to demonstrate Zamail's encrypted messaging capabilities.

In production, this content would be:
- Encrypted with FHE before sending
- Stored as encrypted handle on blockchain
- Only decryptable by sender and recipient

Current Status: Using placeholder encryption for demo.

Best regards,
Alice`,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isRead: false,
  },
  {
    id: "sample-3",
    from: "bob@zamail.com",
    to: "",
    subject: "Meeting Tomorrow at 3 PM",
    body: `Hello,

Just a quick reminder about our meeting tomorrow at 3 PM.

Topics to discuss:
- FHE integration progress
- Smart contract optimization
- Frontend improvements

See you tomorrow!

Bob`,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    isRead: true,
  },
  {
    id: "sample-4",
    from: "charlie@zamail.com",
    to: "",
    subject: "Important: Sepolia Testnet Update",
    body: `Dear Zamail User,

We wanted to inform you about an upcoming update to the Sepolia testnet:

Scheduled Maintenance: October 31, 2025
Duration: 2 hours
Impact: Minimal service interruption

What to expect:
- Email sending may be temporarily unavailable
- Reading existing emails will work normally
- All data remains secure on blockchain

Thank you for your patience!

Charlie
Zamail Infrastructure Team`,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isRead: true,
  },
]

export const WELCOME_EMAIL: Omit<MockMail, "id" | "to" | "timestamp" | "isRead"> = {
  from: "team@zamail.com",
  subject: "🎉 Welcome to Zamail - Your Encrypted Email Journey Begins!",
  body: `Congratulations on joining Zamail!

Welcome aboard! Your email address has been successfully registered on the Zamail platform. You're now part of a revolutionary encrypted email system powered by blockchain and Fully Homomorphic Encryption (FHE).

🔐 What You Get:
• Complete Privacy: Your emails are encrypted with military-grade FHE
• Blockchain Security: Every message secured on Sepolia testnet
• True Ownership: Your wallet, your email, your data
• Censorship Resistant: Decentralized and unstoppable

📝 Quick Start Guide:
1. Click "Compose" button to write your first email
2. Enter recipient's @zamail.com address
3. Type your message (we'll encrypt it automatically)
4. Send for just 0.0001 ETH (testnet)

💡 Pro Tips:
• Your inbox updates in real-time
• All sent emails are in your "Sent" folder
• Adjust font size and style in Settings (⚙️)
• Switch between dark/light themes

🚀 Current Features:
✓ Send encrypted emails
✓ Receive encrypted emails
✓ View inbox and sent messages
✓ Customizable reading experience
✓ Dark/Light theme support

🔮 Coming Soon:
• Full FHE encryption with Zama Relayer
• Email attachments
• Address book
• Email search
• Multiple email support

📞 Need Help?
If you have any questions or need assistance:
• Visit our documentation
• Join our community Discord
• Email: support@zamail.com

Thank you for being an early adopter of Zamail. Together, we're building the future of private communication!

Welcome to the revolution! 🚀

Best regards,
The Zamail Team

---
P.S. This is a demo/testnet version. Never send sensitive information until we launch on mainnet.`,
}

// Function to get welcome email for a specific user
export function getWelcomeEmail(recipientEmail: string): MockMail {
  return {
    id: `welcome-${Date.now()}`,
    from: WELCOME_EMAIL.from,
    to: recipientEmail,
    subject: WELCOME_EMAIL.subject,
    body: WELCOME_EMAIL.body,
    timestamp: new Date(),
    isRead: false,
  }
}

// Function to store mock mail in localStorage
export function saveMockMailToInbox(email: string, mail: MockMail) {
  const key = `zamail_inbox_${email}`
  const existing = localStorage.getItem(key)
  const mails: MockMail[] = existing ? JSON.parse(existing) : []
  mails.unshift(mail) // Add to beginning
  localStorage.setItem(key, JSON.stringify(mails))
}

// Function to load mock mails from localStorage
export function loadMockMailsFromInbox(email: string): MockMail[] {
  const key = `zamail_inbox_${email}`
  const existing = localStorage.getItem(key)
  return existing ? JSON.parse(existing) : SAMPLE_INBOX_MAILS
}
