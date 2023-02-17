import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { DAY } from '../constants';
import { useAppContext } from '../hooks';
import DayItem from './DayItem';
import API from '../api';

import LeftArrow from './icons/LeftArrow';
import RightArrow from './icons/RightArrow';

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

  if (API.isTablet) {
    return (
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between",
      }}>
        <View style={{
          width: '33%',
          justifyContent: 'center'
        }}>
          <DayItem
            onPress={() => setDay(day)}
            day={DAY.yesterday}
          />
        </View>
        <View style={{
          width: '33%',
          justifyContent: 'center',
        }}>
          <DayItem
            onPress={() => setDay(day)}
            day={DAY.today}
          />
        </View>
        <View style={{
          width: '33%',
          justifyContent: 'center'
        }}>
          <DayItem
            onPress={() => setDay(day)}
            day={DAY.tomorrow}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.arrowContainer}>
        {day !== DAY.yesterday && (
          <TouchableOpacity onPress={onPrevPress}>
            <View style={styles.arrow}>
              <LeftArrow color={API.config.backgroundColor} />
            </View>
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
            <View style={styles.arrow}>
              <RightArrow color={API.config.backgroundColor} />
            </View>
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
  },
  arrow: {
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default DayMenu;
