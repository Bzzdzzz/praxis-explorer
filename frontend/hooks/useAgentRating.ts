'use client'

import { useReadContract } from 'wagmi'
import { reputationRegistryAbi } from '@/lib/abis'
import { sepolia } from 'wagmi/chains'

const REPUTATION_REGISTRY_ADDRESS = (process.env.NEXT_PUBLIC_REPUTATION_REGISTRY_ADDRESS || '0x3d1CAB0E1A960F6136903c1CFe57fF929415C5Cd') as `0x${string}`

export function useAgentRating(agentId: number) {
  const { data, isLoading, error } = useReadContract({
    address: REPUTATION_REGISTRY_ADDRESS,
    abi: reputationRegistryAbi,
    functionName: 'getSummary',
    chainId: sepolia.id,
    args: [
      BigInt(agentId),
      [], // No client filter - get all feedback
      '0x0000000000000000000000000000000000000000000000000000000000000000', // tag1 (no filter)
      '0x0000000000000000000000000000000000000000000000000000000000000000', // tag2 (no filter)
    ],
  })

  // Convert the data to a more usable format
  const count = data ? Number(data[0]) : 0
  const averageScore = data ? Number(data[1]) : 0
  const stars = averageScore > 0 ? (averageScore / 100) * 5 : 0

  return {
    count,
    averageScore,
    stars,
    isLoading,
    error,
  }
}
