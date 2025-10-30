'use client'

import type { FhevmInstance } from '@zama-fhe/relayer-sdk/web'
import { ZAMAIL_CONTRACT } from './contracts'

// Singleton instance
let fhevmInstance: FhevmInstance | null = null

/**
 * Initialize FHE instance for Sepolia - SDK v0.1.0
 */
export async function initFhevmInstance(): Promise<FhevmInstance> {
  if (fhevmInstance) {
    return fhevmInstance
  }

  console.log('Initializing FHEVM instance for Sepolia...')
  
  try {
    // Dynamic import to avoid SSR issues
    const { createInstance } = await import('@zama-fhe/relayer-sdk/web')
    
    // Use createInstance without config for auto Sepolia detection
    console.log('Creating instance for Sepolia network...')
    fhevmInstance = await createInstance({ network: 'sepolia' })
    console.log('FHEVM instance initialized successfully')
    
    return fhevmInstance
  } catch (error) {
    console.error('Failed to initialize FHEVM:', error)
    throw new Error('FHEVM initialization failed. Please check network connection.')
  }
}

/**
 * Get existing FHEVM instance or create new one
 */
export async function getFhevmInstance(): Promise<FhevmInstance> {
  if (!fhevmInstance) {
    return initFhevmInstance()
  }
  return fhevmInstance
}

/**
 * Encrypt email content for sending
 * @param subject - Email subject
 * @param body - Email body
 * @param senderEmail - Sender's email address
 * @param userAddress - User's wallet address
 * @returns Encrypted handles and proof
 */
export async function encryptEmailContent(
  subject: string,
  body: string,
  senderEmail: string,
  userAddress: string
) {
  try {
    const instance = await getFhevmInstance()
    
    // Create email content as JSON string
    const emailContent = JSON.stringify({
      subject,
      body,
      from: senderEmail,
      timestamp: Date.now(),
    })
    
    console.log('Email content to encrypt:', emailContent)
    
    // Convert string to BigInt (simplified - using first 32 bytes of hash)
    const encoder = new TextEncoder()
    const data = encoder.encode(emailContent)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    const contentHash = BigInt('0x' + hashHex)
    
    console.log('Content hash:', contentHash.toString())
    
    // Create encrypted input buffer
    const buffer = instance.createEncryptedInput(
      ZAMAIL_CONTRACT.ADDRESS,
      userAddress
    )
    
    console.log('Buffer created, adding content...')
    
    // Add the content as euint256
    buffer.add256(contentHash)
    
    console.log('Encrypting...')
    
    // Encrypt and get handles
    const encrypted = await buffer.encrypt()
    
    console.log('Encryption successful:', encrypted)
    
    return {
      handle: encrypted.handles[0],
      proof: encrypted.inputProof,
      originalContent: emailContent,
    }
  } catch (error) {
    console.error('Encryption error details:', error)
    throw error
  }
}

/**
 * Decrypt email content
 * @param ciphertextHandle - The handle returned from contract
 * @param signer - Ethers signer for EIP-712 signature
 * @returns Decrypted email content
 */
export async function decryptEmailContent(
  ciphertextHandle: string,
  signer: any // ethers.Signer
): Promise<string> {
  const instance = await getFhevmInstance()
  
  // Generate keypair for user decryption
  const keypair = instance.generateKeypair()
  
  const handleContractPairs = [
    {
      handle: ciphertextHandle,
      contractAddress: ZAMAIL_CONTRACT.ADDRESS,
    },
  ]
  
  const startTimeStamp = Math.floor(Date.now() / 1000).toString()
  const durationDays = '10'
  const contractAddresses = [ZAMAIL_CONTRACT.ADDRESS]
  
  // Create EIP-712 typed data for signature
  const eip712 = instance.createEIP712(
    keypair.publicKey,
    contractAddresses,
    startTimeStamp,
    durationDays
  )
  
  // Sign with user's wallet
  const signature = await signer.signTypedData(
    eip712.domain,
    {
      UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification,
    },
    eip712.message
  )
  
  // Decrypt using relayer
  const result = await instance.userDecrypt(
    handleContractPairs,
    keypair.privateKey,
    keypair.publicKey,
    signature.replace('0x', ''),
    contractAddresses,
    signer.address,
    startTimeStamp,
    durationDays
  )
  
  const decryptedValue = result[ciphertextHandle]
  
  // Convert decrypted BigInt back to string
  // In production, implement proper decoding
  try {
    const hexStr = decryptedValue.toString(16).padStart(64, '0')
    const buffer = Buffer.from(hexStr, 'hex')
    return buffer.toString('utf8')
  } catch (error) {
    console.error('Error decoding decrypted value:', error)
    return JSON.stringify({
      subject: 'Encrypted Message',
      body: 'Unable to decrypt content',
      from: 'unknown',
    })
  }
}

/**
 * Parse decrypted email content
 */
export function parseEmailContent(decryptedStr: string) {
  try {
    const parsed = JSON.parse(decryptedStr)
    return {
      subject: parsed.subject || 'No Subject',
      body: parsed.body || '',
      from: parsed.from || 'unknown',
      timestamp: parsed.timestamp || Date.now(),
    }
  } catch (error) {
    return {
      subject: 'Encrypted Message',
      body: decryptedStr,
      from: 'unknown',
      timestamp: Date.now(),
    }
  }
}
