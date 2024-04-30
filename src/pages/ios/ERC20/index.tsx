import { View, StyleSheet, Button, Text } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import 'react-native-get-random-values';

import '@ethersproject/shims';

import { ethers } from 'ethers';
import ERC20_ABI from '../../erc20.abi.json';
import IOSLayout from '../../../layout/ios';
import { useFocusEffect } from '@react-navigation/native';

const provider = new ethers.providers.JsonRpcProvider(
  process.env.EXPO_PUBLIC_URL_PROVIDER,
);
const privateKey = process.env.EXPO_PUBLIC_PRIVATE_KEY;
const toAddress = process.env.EXPO_PUBLIC_ADDRESS_DESTINATION;
const erc20Address = process.env.EXPO_PUBLIC_ECR20_ADDRESS;

const ERC20 = () => {
  const [newBalance, setNewBalance] = useState('0');

  const getBalance = useCallback(async () => {
    const erc20 = new ethers.Contract(erc20Address ?? '', ERC20_ABI, provider);
    try {
      const balance = await erc20.balanceOf(toAddress);
      setNewBalance(ethers.utils.formatEther(balance));
    } catch (err) {
      console.log('err', err);
    }
  }, []);
  const sendERC20Transaction = useCallback(async () => {
    const erc20 = new ethers.Contract(erc20Address ?? '', ERC20_ABI, provider);

    const signer = new ethers.Wallet(privateKey ?? '', provider);
    // send 0.0000000001 erc20 token to toAddress
    const amount = ethers.utils.parseUnits('0.0000000001', 18);
    const tx = await erc20.connect(signer).transfer(toAddress, amount);
    const balance = await erc20.balanceOf(toAddress);
    setNewBalance(ethers.utils.formatEther(balance));
  }, []);

  useFocusEffect(() => {
    getBalance();
  });

  return (
    <IOSLayout>
      <View style={styles.container}>
        <Text>{`Destination Address's ERC20 balance: ${newBalance}`}</Text>
        <Button title="Send ECR20 Transaction" onPress={sendERC20Transaction} />
      </View>
    </IOSLayout>
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
  },
});
