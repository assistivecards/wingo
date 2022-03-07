import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import API from '../api'
import SearchItem from './SearchItem'

const SearchResults = ({ term, activities, showAll, tasks, onItemPress }) => {
  const results = showAll ? activities : API.search(term, activities);

  return (
    <SafeAreaView>
      <View style={styles.searchCarrier}>
        {
          results.map((result, i) => {
            return (
              <SearchItem
                key={i}
                result={result}
                width={"100%"}
                onPress={() => onItemPress(result.slug)}
                selected={tasks[result.slug]}
              />
            );
          })
        }
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

export default SearchResults;
