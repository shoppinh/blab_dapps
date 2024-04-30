import React, { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { ANDROID_GREEN } from '../../utils/constants';
interface Props extends PropsWithChildren {}
const AndroidLayout: React.FC<Props> = ({ children }) => {
  return <View style={styles.wrapper}>{children}</View>;
};

export default AndroidLayout;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: ANDROID_GREEN,
    flex: 1,
  },
});
