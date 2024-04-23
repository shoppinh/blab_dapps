import React from 'react';
import './polyfills';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AndroidAccount from './src/pages/android/Account';
import AndroidHomePage from './src/pages/android/HomePage';
import AndroidTransaction from './src/pages/android/Transaction';
import TransactionHistory from './src/pages/android/TransactionHistory';
import IOSTransaction from './src/pages/ios/Transaction';
import ERC20 from './src/pages/ios/ERC20';
import IOSAccount from './src/pages/ios/Account';
import IOSHomePage from './src/pages/ios/HomePage';
import { isIOS } from './src/utils/helper';
import SmartContract from './src/pages/ios/SmartContract';
import BlockDetail from './src/pages/android/BlockDetail';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={isIOS() ? IOSHomePage : AndroidHomePage}
        />
        <Stack.Screen
          name="Account"
          component={isIOS() ? IOSAccount : AndroidAccount}
        />
        <Stack.Screen
          name="Transaction"
          component={isIOS() ? IOSTransaction : AndroidTransaction}
        />
        <Stack.Screen name="ERC20" component={ERC20} />
        <Stack.Screen
          name="TransactionHistory"
          component={TransactionHistory}
        />
        <Stack.Screen name="SmartContract" component={SmartContract} />
        <Stack.Screen name="BlockDetail" component={BlockDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
