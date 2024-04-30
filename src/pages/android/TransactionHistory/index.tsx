import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { APIS } from '../../../store/types';
import AndroidLayout from '../../../layout/android';

const TransactionHistory = () => {
  const sourceAddress = process.env.EXPO_PUBLIC_ADDRESS_DESTINATION ?? '';
  const [txHistory, setTxHistory] = useState<any>();
  useEffect(() => {
    fetch(
      `${process.env.EXPO_PUBLIC_API_URL ?? ''}${
        APIS.transactionHistory
      }?address=${sourceAddress}`,
    )
      .then(value => {
        console.log('Value', JSON.stringify(value));
        setTxHistory(value);
      })
      .catch(err => {
        console.log('Err', err);
      });
  }, [sourceAddress]);
  return (
    <AndroidLayout>
      <View>
        <Text>{JSON.stringify(txHistory)}</Text>
      </View>
    </AndroidLayout>
  );
};

export default TransactionHistory;
