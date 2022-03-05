import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import API from '../api';

const Loading = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", height: 300 }}>
      <ActivityIndicator color={API.config.backgroundColor} />
    </View>
  )
};
export default Loading;
