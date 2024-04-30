import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import 'react-native-get-random-values';

import '@ethersproject/shims';

import { ethers } from 'ethers';
import AndroidLayout from '../../../layout/android';

const provider = new ethers.providers.JsonRpcProvider(
  process.env.EXPO_PUBLIC_URL_PROVIDER,
);

const toAddress = process.env.EXPO_PUBLIC_ADDRESS_DESTINATION;
const privateKey = process.env.EXPO_PUBLIC_PRIVATE_KEY;
const Transaction = () => {
  const [transactions, setTransactions] = useState<any>();
  const [inputTransactionId, setInputTransactionId] = useState<string>('');
  const getTransaction = useCallback(async () => {
    try {
      const tx = await provider.getTransaction(inputTransactionId);
      setTransactions(tx);
    } catch (err) {
      console.log('err', err);
    }
  }, [inputTransactionId]);

  async function sendTransaction() {
    const amount = ethers.utils.parseEther('0.1');
    const wallet = new ethers.Wallet(privateKey ?? '', provider);
    try {
      const tx = await wallet.sendTransaction({
        to: toAddress,
        value: amount,
      });
      setTransactions(tx);
    } catch (err) {
      console.log('err', err);
    }
  }

  return (
    <AndroidLayout>
      <View style={styles.container}>
        {/* Input text to get transaction */}
        <TextInput
          style={styles.input}
          onChangeText={setInputTransactionId}
          value={inputTransactionId}
          accessibilityLabel=""
        />
        <Button title="Get Transaction" onPress={getTransaction} />
        <Button title="Send Transaction" onPress={sendTransaction} />
        <Text>{JSON.stringify(transactions)}</Text>
      </View>
    </AndroidLayout>
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
