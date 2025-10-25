import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

// const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

// if (!projectId) {
//   throw new Error('Missing VITE_WALLETCONNECT_PROJECT_ID environment variable');
// }

export const config = getDefaultConfig({
  appName: 'Confidential Diary',
  projectId:"projectId",
  chains: [sepolia],
  ssr: false,
});
