import React, { useCallback, useMemo, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import 'react-native-get-random-values';

import '@ethersproject/shims';

import { useWalletConnectModal } from '@walletconnect/modal-react-native';
import { ethers } from 'ethers';
import {
  Address,
  Hash,
  createPublicClient,
  createWalletClient,
  custom,
  defineChain,
  http,
} from 'viem';
import Layout from '../../../layout';

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
const Transaction = () => {
  const [transactions, setTransactions] = useState<any>();
  const parsedTransactions = useMemo(() => {
    if (transactions) {
      const result = Object.values(transactions).map(item => {
        return typeof item === 'bigint'
          ? ethers.BigNumber.from(item).toString()
          : item;
      });

      return result;
    }
  }, [transactions]);

  const [inputTransactionId, setInputTransactionId] = useState<string>('');
  const [toAddress, setToAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const { provider, address } = useWalletConnectModal();

  const publicClient = createPublicClient({
    chain: bscTestNet,
    transport: http(),
  });

  const walletClient = useMemo(
    () =>
      createWalletClient({
        chain: bscTestNet,
        transport: custom({
          async request({ method, params }) {
            return await provider?.request({ method, params });
          },
        }),
      }),
    [provider],
  );
  const getTransaction = useCallback(async () => {
    try {
      const tx = await publicClient.getTransaction({
        hash: inputTransactionId as Hash,
      });
      setTransactions(tx);
    } catch (err) {
      console.log('err', err);
    }
  }, [inputTransactionId, publicClient]);

  async function sendTransaction() {
    const parsedAmount = BigInt(amount);

    if (amount && toAddress) {
      try {
        const tx = await walletClient.sendTransaction({
          to: toAddress as Address,
          value: parsedAmount,
          account: address as Address,
        });
        setTransactions(tx);
      } catch (err) {
        console.log('err', err);
      }
    }
  }

  return (
    <Layout>
      <View style={styles.container}>
        {/* Input text to get transaction */}
        <Text>Chuỗi băm giao dịch</Text>

        <TextInput
          style={styles.input}
          onChangeText={setInputTransactionId}
          value={inputTransactionId}
          accessibilityLabel=""
        />
        <Button title="Lấy thông tin giao dịch" onPress={getTransaction} />
        <Text>Địa chỉ đích</Text>
        <TextInput
          style={styles.input}
          onChangeText={setToAddress}
          value={toAddress}
          accessibilityLabel=""
        />
        <Text>Số lượng</Text>

        <TextInput
          style={styles.input}
          onChangeText={setAmount}
          value={amount}
          accessibilityLabel=""
        />
        <Button title="Gửi giao dịch" onPress={sendTransaction} />
        <Text>Thông tin giao dịch</Text>

        <Text>{JSON.stringify(parsedTransactions)}</Text>
      </View>
    </Layout>
  );
};

export default Transaction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '100%',
  },
});
