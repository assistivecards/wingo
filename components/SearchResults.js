import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { useAppContext } from '../hooks';
import SearchItem from './SearchItem'
import API from '../api'

const SearchResults = ({ term, activities, showAll }) => {
  const results = showAll ? activities : API.search(term, activities);
  const { tasks, dayDate, setTasks } = useAppContext();

  const handleItemPress = (slug) => {
    setTasks(
      {
        ...tasks,
        [dayDate]: {
          ...tasks[dayDate],
          [slug]: tasks[dayDate] && !tasks[dayDate][slug] ? true : undefined
        }
      }
    );
  };
  
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
                onPress={() => handleItemPress(result.slug)}
                selected={tasks && tasks[dayDate] && tasks[dayDate][result.slug]}
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
