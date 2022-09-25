import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import TouchableScale from 'touchable-scale-btk';

import API from '../api';

const DayItem = ({ day, selected, onPress }) => {
  return (
    <TouchableScale onPress={onPress}>
      <View
        style={[
          styles.root,
          { backgroundColor: !selected ? API.config.panelColor : API.config.backgroundColor }
        ]}>
        <Text
          style={[styles.text, {
            color: !selected ? API.config.backgroundColor : API.config.panelColor,
            opacity: !selected ? 0.4 : 1
          }]}>
          {API.t(day)}
        </Text>
      </View>
    </TouchableScale>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 50,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: 'center',
  },
});

export default DayItem;
