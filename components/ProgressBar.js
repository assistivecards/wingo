import React from 'react';
import { View, Text } from 'react-native';
import API from '../api';

const ProgressBar = ({ completedCount, allCount }) => {
  return (
    <View
      style={{
        marginVertical: 10,
        paddingHorizontal: API.config.globalPadding,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '85%',
        }}>
        {
          [...Array(allCount).keys()].map((bar, index) => (
            <View
              key={index}
              style={{
                height: 10,
                width: `${100 / allCount}%`,
                backgroundColor: API.config.backgroundColor,
                opacity: index < completedCount ? 1 : 0.4,
                borderBottomLeftRadius: index === 0 ? 10 : 0,
                borderTopLeftRadius: index === 0 ? 10 : 0,
                borderBottomRightRadius: index === allCount - 1 ? 10 : 0,
                borderTopRightRadius: index === allCount - 1 ? 10 : 0,
              }}
            />
          ))
        }
      </View>
      <View style={{ width: '15%' }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'right',
            color: API.config.backgroundColor,
          }}>
          {completedCount}/{allCount}
        </Text>
      </View>
    </View>
  );
};
export default ProgressBar;
