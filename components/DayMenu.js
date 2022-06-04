import React, { useState } from 'react';
import HorizontalPicker from '@vseslav/react-native-horizontal-picker';
import { View } from 'react-native';
import { DAY } from '../constants';
import { useAppContext } from '../hooks';
import { ResponsiveUtil } from '../utils';
import DayItem from './DayItem';
import API from '../api';

const INITIAL_DAY_INDEX = 1;

const DayMenu = () => {
  const { setDay } = useAppContext();
  const [dayIndex, setDayIndex] = useState(INITIAL_DAY_INDEX)

  const renderItem = (item, index) => {
    return (
      <DayItem
        key={index}
        day={item}
        selected={index === dayIndex}
      />
    )
  };

  const handleChange = (index) => {
    setDayIndex(index);
    setDay(Object.values(DAY)[index]);
  }

  return (
    <View style={{ paddingVertical: 10, paddingHorizontal: API.config.globalPadding }}>
      <HorizontalPicker
        data={Object.values(DAY)}
        renderItem={renderItem}
        itemWidth={ResponsiveUtil.wp(30)}
        defaultIndex={INITIAL_DAY_INDEX}
        onChange={handleChange}
      />
    </View>
  );
};
export default DayMenu;
