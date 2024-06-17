import React, { useCallback, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import 'react-native-get-random-values';

import '@ethersproject/shims';

import { useFocusEffect } from '@react-navigation/native';
import { ethers } from 'ethers';
import Layout from '../../../layout';
import ERC20_ABI from '../../erc20.abi.json';

const provider = new ethers.providers.JsonRpcProvider(
  process.env.EXPO_PUBLIC_URL_PROVIDER,
);
const privateKey = process.env.EXPO_PUBLIC_PRIVATE_KEY;
const balanceAddress = process.env.EXPO_PUBLIC_ADDRESS_SOURCE;
const erc20Address = process.env.EXPO_PUBLIC_ECR20_ADDRESS;

const ERC20 = () => {
  const [newBalance, setNewBalance] = useState('0');
  const [inputBalance, setInputBalance] = useState('');
  const [toAddress, setToAddress] = useState('');

  const getBalance = useCallback(async () => {
    const erc20 = new ethers.Contract(erc20Address ?? '', ERC20_ABI, provider);
    try {
      const balance = await erc20.balanceOf(balanceAddress);
      setNewBalance(ethers.utils.formatEther(balance));
    } catch (err) {
      console.log('🚀 ~ getBalance ~  err:', err);
    }
  }, []);
  const sendERC20Transaction = useCallback(async () => {
    const erc20 = new ethers.Contract(erc20Address ?? '', ERC20_ABI, provider);
    const signer = new ethers.Wallet(privateKey ?? '', provider);
    // send 0.0000000001 erc20 token to toAddress
    const amount = ethers.utils.parseUnits(inputBalance, 18);
    try {
      await erc20.connect(signer).transfer(toAddress, amount);
    } catch (err) {
      console.log('🚀 ~ sendERC20Transaction transfer ~ err:', err);
    }
    const balance = await erc20.balanceOf(balanceAddress);
    setNewBalance(ethers.utils.formatEther(balance));
  }, [inputBalance, toAddress]);

  useFocusEffect(() => {
    getBalance();
  });

  return (
    <Layout>
      <View style={styles.container}>
        <Text>{`Số dư: ${newBalance}`}</Text>

        <Text>Địa chỉ ví đích</Text>

        <TextInput
          style={styles.input}
          onChangeText={setToAddress}
          value={toAddress}
          accessibilityLabel=""
        />

        <Text>Số lượng</Text>

        <TextInput
          style={styles.input}
          onChangeText={setInputBalance}
          value={inputBalance}
          accessibilityLabel=""
        />
        <Button title="Gửi giao dịch ERC20" onPress={sendERC20Transaction} />
      </View>
    </Layout>
  );
};

export default ERC20;

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
