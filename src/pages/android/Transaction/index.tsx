import { View, Text } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import 'react-native-get-random-values';

import '@ethersproject/shims';

import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider(
  'http://117.4.240.104:8545',
);
const Transaction = () => {
  const [transactions, setTransactions] = useState<any>();
  console.log('🚀 ~ Transaction ~ transactions:', transactions);
  const getTransaction = useCallback(async () => {
    const tx = await provider.getTransaction(
      '0xd40b3418b5117acb1053173cbd2f733dbff5c6852d4eb2971a01e57f103f93d1',
    );
    setTransactions(tx);
  }, []);

  useEffect(() => {
    getTransaction().catch(() => {});
  }, [getTransaction]);
  return (
    <View>
      <Text>Transaction</Text>
      <Text>{JSON.stringify(transactions)}</Text>
    </View>
  );
};

export default Transaction;
