'use client'

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { reputationRegistryAbi } from '@/lib/abis'
import { sepolia } from 'wagmi/chains'

const REPUTATION_REGISTRY_ADDRESS = (process.env.NEXT_PUBLIC_REPUTATION_REGISTRY_ADDRESS || '0x3d1CAB0E1A960F6136903c1CFe57fF929415C5Cd') as `0x${string}`

export function useRating() {
  const { data: hash, writeContract, isPending, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const submitRating = async (agentId: number, stars: number) => {
    // Convert stars (0.5-5.0) to score (10-100)
    const score = Math.round(stars * 20)
    
    // Create dummy feedbackAuth (289 bytes minimum: 224 bytes struct + 65 bytes signature)
    // 224 bytes (FEEDBACK_AUTH_STRUCT_SIZE) + 32 bytes (r) + 32 bytes (s) + 1 byte (v) = 289 bytes
    const dummyAuth = '0x' + '00'.repeat(289)
    
    try {
      writeContract({
        address: REPUTATION_REGISTRY_ADDRESS,
        abi: reputationRegistryAbi,
        functionName: 'giveFeedback',
        chainId: sepolia.id,
        args: [
          BigInt(agentId),
          score,
          '0x0000000000000000000000000000000000000000000000000000000000000000', // tag1 (empty)
          '0x0000000000000000000000000000000000000000000000000000000000000000', // tag2 (empty)
          '', // fileuri (empty)
          '0x0000000000000000000000000000000000000000000000000000000000000000', // filehash (empty)
          dummyAuth as `0x${string}`, // feedbackAuth (289 zero bytes)
        ],
      })
    } catch (err) {
      console.error('Error submitting rating:', err)
      throw err
    }
  }

  return {
    submitRating,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
  }
}
