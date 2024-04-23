import {
  IProvider,
  WalletConnectModal,
  useWalletConnectModal,
} from '@walletconnect/modal-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Address, Chain, createWalletClient, custom, formatEther } from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import { publicClient } from '../../../clients/public';
import { providerMetadata } from '../../../clients/walletConnect';
import { useNavigation } from '@react-navigation/native';
export const CHAINS = [mainnet, sepolia];

export default function Account() {
  const {
    open,
    isConnected,
    provider,
    address: wcAddress,
  } = useWalletConnectModal();
  const address = wcAddress as Address | undefined;

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

  const [blockNumber, setBlockNumber] = useState(0n);
  const [gasPrice, setGasPrice] = useState(0n);
  const [chain, setChain] = useState<Chain>(CHAINS[0]);
  const [balance, setBalance] = useState(0n);
  const [signature, setSignature] = useState<`0x${string}`>();
  const navigation = useNavigation();
  const onSignMessage = async () => {
    if (address) {
      const signature = await walletClient.signMessage({
        account: address,
        message: 'Sign this message to prove you are the owner of this wallet',
      });

      setSignature(signature);
    }
  };

  useEffect(() => {
    const getNetworkData = async () => {
      const [blockNumber, gasPrice] = await Promise.all([
        publicClient.getBlockNumber(),
        publicClient.getGasPrice(),
      ]);

      setBlockNumber(blockNumber);
      setGasPrice(gasPrice);
    };

    void getNetworkData();
  }, []);

  useEffect(() => {
    const onChainChangedEvent = (chainId: string) => {
      const chain =
        CHAINS.find(chain => chain.id === Number(chainId)) ?? CHAINS[0];
      setChain(chain);
    };

    const onConnectEvent = async ({
      session,
    }: {
      session: IProvider['session'];
    }) => {
      const chainId = session?.namespaces.eip155.chains?.[0].replace(
        'eip155:',
        '',
      );

      if (chainId) {
        onChainChangedEvent(chainId);
      }

      if (address) {
        const balance = await publicClient.getBalance({
          address,
        });
        setBalance(balance);
      }
    };

    // @ts-ignore
    provider?.on('connect', onConnectEvent);
    provider?.on('chainChanged', onChainChangedEvent);

    return () => {
      provider?.removeListener('chainChanged', onChainChangedEvent);
      provider?.removeListener('connect', onConnectEvent);
    };
  }, [address, provider, walletClient]);

  return (
    <View style={styles.container}>
      {isConnected ? (
        <View style={styles.block}>
          <Text numberOfLines={1}>Address: {address}</Text>
          <Text numberOfLines={1}>Balance: {formatEther(balance)} ETH</Text>
          <Text>Connected to: {chain.name}</Text>

          {signature && (
            <View style={styles.block}>
              <Text>Signature: {signature}</Text>
            </View>
          )}
        </View>
      ) : (
        <View>
          <Text>Your account has not been connected. Connect now!</Text>
        </View>
      )}

      <View style={styles.block}>
        {isConnected ? (
          <>
            <Button title="Sign message" onPress={onSignMessage} />
            <Button
              title="Disconnect"
              onPress={() => provider?.disconnect()}
              color="red"
            />
          </>
        ) : (
          <View style={styles.actionWrapper}>
            <Button title="Connect" onPress={() => open()} />

            <Button
              title="Back to Home Page"
              onPress={() => navigation.goBack()}
            />
          </View>
        )}
      </View>
      <WalletConnectModal
        projectId={process.env.EXPO_PUBLIC_PROJECT_ID ?? ''}
        providerMetadata={providerMetadata}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  block: {
    marginTop: 32,
  },
  actionWrapper: {
    flexDirection: 'column',
    gap: 10,
  },
});
