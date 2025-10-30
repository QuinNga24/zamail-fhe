'use client'

import { ethers } from 'ethers'

/**
 * Off-chain encrypted mail storage
 * Stores ciphertext in localStorage, only hash on-chain
 */

export interface EncryptedMail {
  hash: string
  ciphertext: string
  timestamp: number
  from: string
  to: string
}

const STORAGE_KEY = 'zamail_encrypted_mails'

/**
 * Save encrypted mail to localStorage
 */
export function saveEncryptedMail(mail: EncryptedMail): void {
  try {
    const existing = getEncryptedMails()
    existing.push(mail)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
    console.log('Saved encrypted mail to localStorage:', mail.hash)
  } catch (error) {
    console.error('Failed to save encrypted mail:', error)
  }
}

/**
 * Get all encrypted mails from localStorage
 */
export function getEncryptedMails(): EncryptedMail[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    return JSON.parse(stored) as EncryptedMail[]
  } catch (error) {
    console.error('Failed to get encrypted mails:', error)
    return []
  }
}

/**
 * Get encrypted mail by hash
 */
export function getEncryptedMailByHash(hash: string): EncryptedMail | null {
  try {
    const mails = getEncryptedMails()
    return mails.find((mail) => mail.hash === hash) || null
  } catch (error) {
    console.error('Failed to get encrypted mail by hash:', error)
    return null
  }
}

/**
 * Encrypt email content (simple AES-like encryption for demo)
 * In production, use proper encryption library
 */
export async function encryptMailContent(
  subject: string,
  body: string,
  senderEmail: string,
  recipientEmail: string
): Promise<{ hash: string; ciphertext: string }> {
  try {
    // Create email JSON
    const emailData = {
      subject,
      body,
      from: senderEmail,
      to: recipientEmail,
      timestamp: Date.now(),
    }

    // Convert to string
    const plaintext = JSON.stringify(emailData)

    // Simple XOR encryption with pseudo-random key (for demo)
    // In production, use proper encryption like AES-GCM
    const encoder = new TextEncoder()
    const data = encoder.encode(plaintext)
    
    // Generate deterministic key from recipient email (demo only!)
    const keyHash = ethers.keccak256(ethers.toUtf8Bytes(recipientEmail + senderEmail))
    const keyBytes = ethers.getBytes(keyHash)
    
    // XOR encryption
    const encrypted = new Uint8Array(data.length)
    for (let i = 0; i < data.length; i++) {
      encrypted[i] = data[i] ^ keyBytes[i % keyBytes.length]
    }
    
    // Convert to hex string
    const ciphertext = '0x' + Array.from(encrypted)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    // Hash for on-chain reference
    const hash = ethers.keccak256(ethers.toUtf8Bytes(plaintext))

    console.log('Encrypted mail:', {
      hash,
      ciphertextLength: ciphertext.length,
    })

    return { hash, ciphertext }
  } catch (error) {
    console.error('Encryption error:', error)
    throw error
  }
}

/**
 * Decrypt email content
 */
export async function decryptMailContent(
  ciphertext: string,
  senderEmail: string,
  recipientEmail: string
): Promise<{ subject: string; body: string; from: string }> {
  try {
    // Generate same key
    const keyHash = ethers.keccak256(ethers.toUtf8Bytes(recipientEmail + senderEmail))
    const keyBytes = ethers.getBytes(keyHash)
    
    // Convert hex to bytes
    const encrypted = ethers.getBytes(ciphertext)
    
    // XOR decryption
    const decrypted = new Uint8Array(encrypted.length)
    for (let i = 0; i < encrypted.length; i++) {
      decrypted[i] = encrypted[i] ^ keyBytes[i % keyBytes.length]
    }
    
    // Convert to string
    const decoder = new TextDecoder()
    const plaintext = decoder.decode(decrypted)
    
    // Parse JSON
    const emailData = JSON.parse(plaintext)
    
    console.log('Decrypted mail successfully')
    
    return {
      subject: emailData.subject,
      body: emailData.body,
      from: emailData.from,
    }
  } catch (error) {
    console.error('Decryption error:', error)
    throw error
  }
}
