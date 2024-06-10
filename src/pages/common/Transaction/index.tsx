import React, { useCallback, useMemo, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import 'react-native-get-random-values';

import '@ethersproject/shims';

import { useWalletConnectModal } from '@walletconnect/modal-react-native';
import {
  Address,
  Hash,
  createPublicClient,
  createWalletClient,
  custom,
  http,
} from 'viem';
import { mainnet } from 'viem/chains';
import Layout from '../../../layout';

const Transaction = () => {
  const [transactions, setTransactions] = useState<any>();
  const [inputTransactionId, setInputTransactionId] = useState<string>('');
  const [toAddress, setToAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const { provider, address } = useWalletConnectModal();

  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(),
  });

  const walletClient = useMemo(
    () =>
      createWalletClient({
        chain: mainnet,
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
        <TextInput
          style={styles.input}
          onChangeText={setInputTransactionId}
          value={inputTransactionId}
          accessibilityLabel=""
        />
        <Button title="Get Transaction" onPress={getTransaction} />
        <TextInput
          style={styles.input}
          onChangeText={setToAddress}
          value={toAddress}
          accessibilityLabel=""
        />
        <TextInput
          style={styles.input}
          onChangeText={setAmount}
          value={amount}
          accessibilityLabel=""
        />
        <Button title="Send Transaction" onPress={sendTransaction} />
        <Text>{JSON.stringify(transactions)}</Text>
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
