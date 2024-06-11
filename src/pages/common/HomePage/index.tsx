import { useNavigation } from '@react-navigation/native';
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
import Layout from '../../../layout';
export const CHAINS = [mainnet, sepolia];

export default function HomePage() {
  const {
    open,
    isConnected,
    provider,
    address: wcAddress,
  } = useWalletConnectModal();
  const address = wcAddress as Address | undefined;
  const navigation = useNavigation();

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
        publicClient.getBlock(),
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
    <Layout>
      <View style={styles.container}>
        <View style={styles.actionContainer}>
          <Button
            title="Tài khoản"
            onPress={() => navigation.navigate('Account')}
          />
          <Button
            title="Chi tiết khối"
            onPress={() => navigation.navigate('BlockDetail')}
          />
          <Button
            title="Giao dịch"
            onPress={() => navigation.navigate('Transaction')}
          />
          <Button
            title="Lịch sử giao dịch"
            onPress={() => navigation.navigate('TransactionHistory')}
          />
          <Button title="ERC20" onPress={() => navigation.navigate('ERC20')} />
        </View>

        <View style={styles.block}>
          <Text numberOfLines={1}>Số khối: {String(blockNumber)}</Text>
          <Text numberOfLines={1}>Giá GAS: {formatEther(gasPrice)} ETH</Text>
          <View style={styles.connectBlock}>
            {isConnected ? (
              <>
                <View style={{ marginVertical: 5 }}>
                  <Button title="Ký" onPress={onSignMessage} />
                </View>
                <View style={{ marginVertical: 5 }}>
                  <Button
                    title="Hủy kết nối"
                    onPress={() => provider?.disconnect()}
                    color="red"
                  />
                </View>
              </>
            ) : (
              <Button title="Kết nối" onPress={() => open()} />
            )}
          </View>
        </View>
        <WalletConnectModal
          projectId={process.env.EXPO_PUBLIC_PROJECT_ID ?? ''}
          providerMetadata={providerMetadata}
        />
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    paddingVertical: 40,
  },
  block: {
    marginTop: 32,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  actionContainer: {
    flexDirection: 'column',
    gap: 20,
  },
  connectBlock: {
    marginTop: 10,
  },
});
