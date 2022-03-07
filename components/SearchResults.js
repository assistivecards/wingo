import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import API from '../api'
import SearchItem from './SearchItem'
import { DateUtil } from '../utils';
import { useAppContext } from '../hooks';


const SearchResults = ({ term, activities, showAll, onItemPress }) => {
  const results = showAll ? activities : API.search(term, activities);
  const { tasks } = useAppContext();
  
  const today = DateUtil.today();

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
                selected={tasks && tasks[today] && tasks[today][result.slug]}
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
