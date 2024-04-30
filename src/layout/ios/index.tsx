import React, { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { IOS_BLUE } from '../../utils/constants';
interface Props extends PropsWithChildren {}
const IOSLayout: React.FC<Props> = ({ children }) => {
  return <View style={styles.wrapper}>{children}</View>;
};

export default IOSLayout;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: IOS_BLUE,
    flex: 1,
  },
});
