import React from 'react';
import TouchableScale from 'touchable-scale-btk';
import { Text, View } from 'react-native';
import API from '../api';

const DayItem = ({ day, onPress, selected }) => {
  return (
    <TouchableScale onPress={onPress}>
      <View
        style={{
          backgroundColor: !selected ? API.config.panelColor : API.config.backgroundColor,
          paddingHorizontal: 15,
          paddingVertical: 8,
          borderRadius: 50
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: !selected ? API.config.backgroundColor : API.config.panelColor,
            opacity: !selected ? 0.4 : 1,
          }}>
          {API.t(day)}
        </Text>
      </View>
    </TouchableScale>
  );
};
export default DayItem;
