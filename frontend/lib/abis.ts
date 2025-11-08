// lib/abis.ts
import { parseAbi } from 'viem';

export const identityRegistryAbi = parseAbi([
  "function register(string tokenURI_) returns (uint256 agentId)",
  "function totalAgents() view returns (uint256 count)",
  "function ownerOf(uint256 tokenId) view returns (address owner)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function getMetadata(uint256 agentId, string key) view returns (bytes value)",
  "function agentExists(uint256 agentId) view returns (bool exists)",
  "event Registered(uint256 indexed agentId, string tokenURI, address indexed owner)",
]);

export const reputationRegistryAbi = parseAbi([
  "function giveFeedback(uint256 agentId, uint8 score, bytes32 tag1, bytes32 tag2, string fileuri, bytes32 filehash, bytes feedbackAuth) external",
  "function revokeFeedback(uint256 agentId, uint64 feedbackIndex) external",
  "function getSummary(uint256 agentId, address[] clientAddresses, bytes32 tag1, bytes32 tag2) external view returns (uint64 count, uint8 averageScore)",
  "function readFeedback(uint256 agentId, address clientAddress, uint64 index) external view returns (uint8 score, bytes32 tag1, bytes32 tag2, bool isRevoked)",
  "event NewFeedback(uint256 indexed agentId, address indexed clientAddress, uint8 score, bytes32 indexed tag1, bytes32 tag2, string fileuri, bytes32 filehash)",
]);
