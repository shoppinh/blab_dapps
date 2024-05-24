import React, { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
interface Props extends PropsWithChildren {}
const Layout: React.FC<Props> = ({ children }) => {
  return <View style={styles.wrapper}>{children}</View>;
};

export default Layout;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
