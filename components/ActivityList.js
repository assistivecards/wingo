import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import ActivityItem from './ActivityItem'
import API from '../api'

const ActivityList = ({ term, activities, showAll, onItemPress, getIsSelected }) => {
  const results = showAll ? activities : API.search(term, activities);

  return (
    <SafeAreaView>
      <View
        style={[
          styles.searchCarrier,
          {
            paddingHorizontal: API.config.globalPadding,
          }
        ]}
      >
        {results.map((result, i) => (
          <ActivityItem
            key={i}
            data={result}
            onPress={() => onItemPress(result.slug, result.isPremium)}
            selected={getIsSelected(result.slug)}
          />
        ))}
        <View style={{ width: "100%", height: 75 }}></View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchCarrier: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginTop: 2
  }
});

export default ActivityList;
