import { View, Text, FlatList, StyleSheet, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import { APIS } from '../../../store/types';
import AndroidLayout from '../../../layout/android';

const Item = ({ title }: { title: string }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const TransactionHistory = () => {
  const sourceAddress = process.env.EXPO_PUBLIC_ADDRESS_SOURCE ?? '';
  const [txHistory, setTxHistory] = useState<any>();
  useEffect(() => {
    const options = {
      method: 'GET',
    };
    fetch(
      `${process.env.EXPO_PUBLIC_API_URL ?? ''}${
        APIS.transactionHistory
      }?address=${sourceAddress}`,
      options,
    )
      .then(response => response.json())
      .then(data => setTxHistory(data.data))
      .catch(err => {
        console.log('Err', err);
      });
  }, [sourceAddress]);
  return (
    <AndroidLayout>
      <View style={styles.wrapper}>
        <FlatList
          data={txHistory}
          renderItem={({ item }) => <Item title={item} />}
          keyExtractor={item => item.id}
        />
      </View>
    </AndroidLayout>
  );
};

export default TransactionHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    marginTop: 20,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 12,
  },
});
