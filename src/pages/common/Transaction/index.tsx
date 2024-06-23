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
  http,
} from 'viem';
import Layout from '../../../layout';
import { bscTestNet } from '../../../utils/constants';

const Transaction = () => {
  const [transactions, setTransactions] = useState<any>();
  const [transferredTxHash, setTransferredTxHash] = useState('');
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
        setTransferredTxHash(tx);
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

        <Text>Thông tin giao dịch</Text>

        <Text>{JSON.stringify(parsedTransactions)}</Text>
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
        <Text>Thông tin giao dịch vừa gửi</Text>

        <Text>{transferredTxHash}</Text>
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
