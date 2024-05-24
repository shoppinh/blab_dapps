import React from 'react';
import './polyfills';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BlockDetail from './src/pages/android/BlockDetail';
import AndroidHomePage from './src/pages/android/HomePage';
import TransactionHistory from './src/pages/android/TransactionHistory';
import Account from './src/pages/common/Account';
import ERC20 from './src/pages/ios/ERC20';
import IOSHomePage from './src/pages/ios/HomePage';
import SmartContract from './src/pages/ios/SmartContract';
import Transaction from './src/pages/common/Transaction';
import { isIOS } from './src/utils/helper';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={isIOS() ? IOSHomePage : AndroidHomePage}
          options={{
            title: 'Trang chủ',
          }}
        />
        <Stack.Screen
          name="Account"
          component={Account}
          options={{
            title: 'Tài khoản',
          }}
        />
        <Stack.Screen
          name="Transaction"
          component={Transaction}
          options={{
            title: 'Giao dịch',
          }}
        />
        <Stack.Screen name="ERC20" component={ERC20} />
        <Stack.Screen
          name="TransactionHistory"
          component={TransactionHistory}
          options={{
            title: 'Lịch sử giao dịch',
          }}
        />
        <Stack.Screen name="SmartContract" component={SmartContract} />
        <Stack.Screen
          name="BlockDetail"
          component={BlockDetail}
          options={{
            title: 'Chi tiết khối',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
