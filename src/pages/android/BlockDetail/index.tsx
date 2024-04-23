import 'react-native-get-random-values';

import '@ethersproject/shims';

import { ethers } from 'ethers';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';

const provider = new ethers.providers.JsonRpcProvider(
  'http://117.4.240.104:8545',
);
const acceptedKeys = [
  'hash',
  'parentHash',
  'number',
  'timestamp',
  'nonce',
  'difficulty',
  'miner',
];

const BlockDetail = () => {
  const [blockDetail, setBlockDetail] = useState<any>();
  const getBlock = useCallback(async () => {
    const block = await provider.getBlock(1);
    setBlockDetail(block);
  }, []);

  const blockMappedData = useMemo(() => {
    return blockDetail
      ? Object.keys(blockDetail)
          .filter(item => acceptedKeys.includes(item))
          .map(key => ({
            key,
            data: blockDetail?.[key],
          }))
      : [];
  }, [blockDetail]);
  // useFocusEffect(
  //   React.useCallback(() => {
  //     getBlock();
  //   }, [getBlock]),
  // );

  useEffect(() => {
    getBlock().catch(() => {});
  }, [getBlock]);

  return (
    <View style={styles.container}>
      <FlatList
        data={blockMappedData}
        renderItem={({ item }) => (
          <View style={styles.listRow}>
            <Text numberOfLines={1} style={styles.listItemKey}>
              {item.key} :
            </Text>
            <Text numberOfLines={1} style={styles.listItem}>
              {item.data}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default BlockDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  listRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  listItem: {},
  listItemKey: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});
