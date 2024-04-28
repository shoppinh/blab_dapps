import { View, Text, Button, StyleSheet } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import 'react-native-get-random-values';

import '@ethersproject/shims';

import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider(
  'http://117.4.240.104:8545',
);

const toAddress = '0x51a6ED422389e66BBfB4921CA1F31397a8b98be3';
const privateKey =
  '0xe28f76b3bbc7a8ea9c6663e51d5ef59b4bc68a16bc76fda71f1aeeaddd73e244';
const Transaction = () => {
  const [transactions, setTransactions] = useState<any>();
  const getTransaction = useCallback(async () => {
    const tx = await provider.getTransaction(
      '0xd40b3418b5117acb1053173cbd2f733dbff5c6852d4eb2971a01e57f103f93d1',
    );
    setTransactions(tx);
  }, []);

  async function sendTransaction() {
    const amount = ethers.utils.parseEther('0.1');
    const wallet = new ethers.Wallet(privateKey, provider);
    const tx = await wallet.sendTransaction({
      to: toAddress,
      value: amount,
    });
    console.log(tx);
  }

  // useEffect(() => {
  //   getTransaction().catch(() => {});
  // }, [getTransaction]);
  return (
    <View style={styles.container}>
      <Button title="Get Transaction" onPress={getTransaction} />
      <Button title="Send Transaction" onPress={sendTransaction} />
      <Text>{JSON.stringify(transactions)}</Text>
    </View>
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
  },
});
