import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { DAY } from '../constants';
import { useAppContext } from '../hooks';
import DayItem from './DayItem';
import API from '../api';
import { TouchableOpacity } from 'react-native-gesture-handler';

const DayMenu = () => {
  const { day, setDay } = useAppContext();

  const onPrevPress = () => {
    if (day === DAY.today) {
      setDay(DAY.yesterday)
    }
    if (day === DAY.tomorrow) {
      setDay(DAY.today)
    }
  };

  const onNextPress = () => {
    if (day === DAY.yesterday) {
      setDay(DAY.today)
    }
    if (day === DAY.today) {
      setDay(DAY.tomorrow)
    }
  }

  return (
    <View style={styles.root}>
      <View style={styles.arrowContainer}>
        {day !== DAY.yesterday && (
          <TouchableOpacity onPress={onPrevPress}>
            <Text>Prev</Text>
          </TouchableOpacity>
        )}
      </View>
      <DayItem
        onPress={() => setDay(day)}
        day={day}
        selected={true}
      />
      <View style={styles.arrowContainer}>
        {day !== DAY.tomorrow && (
          <TouchableOpacity onPress={onNextPress}>
            <Text>Next</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingVertical: 10,
    marginHorizontal: API.config.globalPadding,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  arrowContainer: {
    width: '10%',
    height: 35,
    justifyContent: 'center',
  }
});

export default DayMenu;
