import React from 'react';
import { View, ScrollView } from 'react-native';
import { DAY } from '../constants';
import { useAppContext } from '../hooks';
import DayItem from './DayItem';

const DayMenu = () => {
  const { day, setDay } = useAppContext();
  return (
    <View style={{ paddingVertical: 10, paddingHorizontal: 30 }}>
      <ScrollView
        horizontal
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%"
        }}
      >
        {Object.entries(DAY).map(([key, data]) => (
          <DayItem
            key={key}
            day={data}
            onPress={() => setDay(data)}
            selected={data === day}
          />
        ))}
      </ScrollView>
    </View>
  );
};
export default DayMenu;
