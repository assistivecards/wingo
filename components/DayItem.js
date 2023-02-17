import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import TouchableScale from 'touchable-scale-btk';

import API from '../api';

const DayItem = ({ day, selected, onPress }) => {
  const getTextColor = () => {
    if (API.isTablet) {
      return API.config.backgroundColor
    }
    return !selected ? API.config.backgroundColor : API.config.panelColor
  }

  const getOpacity = () => {
    if (API.isTablet) {
      return 1
    }
    return !selected ? 0.4 : 1
  }

  return (
    <TouchableScale onPress={onPress}>
      <View
        style={[
          styles.root,
          { backgroundColor: !selected ? API.config.panelColor : API.config.backgroundColor }
        ]}>
        <Text
          style={[styles.text, {
            color: getTextColor(),
            opacity: getOpacity()
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
    alignSelf: API.isTablet ? 'center' : 'flex-start',
  },
  text: {
    fontSize: API.isTablet ? 26 : 18,
    fontWeight: "bold",
    textAlign: 'center',
  },
});

export default DayItem;
