import { View, StyleSheet, Button } from 'react-native';
import React from 'react';
import 'react-native-get-random-values';

import '@ethersproject/shims';

import { ethers } from 'ethers';
import ERC20_ABI from '../../erc20.abi.json';

const provider = new ethers.providers.JsonRpcProvider(
  'http://117.4.240.104:8545',
);

const toAddress = '0x51a6ED422389e66BBfB4921CA1F31397a8b98be3';
const erc20Address = '0x1198290bf1dC4d257a6A30518C640C29e961C41e';

const ERC20 = () => {
  async function sendERC20Transaction() {
    const erc20 = new ethers.Contract(erc20Address, ERC20_ABI, provider);
    // check erc20 token balance of address
    const balance = await erc20.balanceOf(toAddress);
    console.log(ethers.utils.formatEther(balance));

    // send 0.0000000001 erc20 token to toAddress
    //   const amount = ethers.utils.parseUnits("0.0000000001", 18);
    //   const tx = await erc20.connect(signer).transfer(toAddress, amount);
    //   console.log(tx);
  }

  return (
    <View style={styles.container}>
      <Button title="Send ECR20 Transaction" onPress={sendERC20Transaction} />
    </View>
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
