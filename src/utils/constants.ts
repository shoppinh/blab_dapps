import { defineChain } from 'viem';

export const ANDROID_GREEN = '#3DDC84 ';
export const IOS_BLUE = '#87C181';
export const bscTestNet = /*#__PURE__*/ defineChain({
  id: 97,
  name: 'BSC',
  nativeCurrency: { name: 'tBNB', symbol: 'tBNB', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BSCScan',
      url: 'https://testnet.bscscan.com/',
    },
  },
  contracts: {
    ensRegistry: {
      address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    },
    ensUniversalResolver: {
      address: '0xc0497E381f536Be9ce14B0dD3817cBcAe57d2F62',
      blockCreated: 16_966_585,
    },
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 14_353_601,
    },
  },
});
