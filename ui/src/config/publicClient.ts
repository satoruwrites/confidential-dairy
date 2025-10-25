import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';

const infuraKey = import.meta.env.VITE_INFURA_API_KEY;

if (!infuraKey) {
  throw new Error('Missing VITE_INFURA_API_KEY environment variable');
}

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(`https://sepolia.infura.io/v3/${infuraKey}`),
});
