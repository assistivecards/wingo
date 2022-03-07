import React, { useState, useEffect } from 'react';
import Svg, { Path } from 'react-native-svg';
import TouchableScale from 'touchable-scale-btk';
import { ActivityIndicator, StatusBar, View, Text, Animated, SafeAreaView, KeyboardAvoidingView, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Loading, Search, SearchResults } from '../components';
import API from '../api';
import { StoreUtil, DateUtil } from '../utils';
import { useAppContext } from '../hooks';

const AddActivity = ({ navigation }) => {
  const [activities, setActivities] = useState(undefined);
  const [search, setSearch] = useState(false);
  const [searchToggleAnim] = useState(new Animated.Value(0));
  const [term, setTerm] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const { tasks, setTasks } = useAppContext();
  console.log("🚀 ~ file: AddActivity.js ~ line 18 ~ AddActivity ~ tasks", JSON.stringify(tasks, null, 2))

  const today = DateUtil.today();

  const handleItemPress = (slug) => {
    setTasks(
      {
        ...tasks,
        [today]: {
          ...tasks[today],
          [slug]: tasks[today] && !tasks[today][slug] ? true : undefined
        }
      }
    );
  };

  const handleAddBtnPress = async () => {
    setAddLoading(true);
    await StoreUtil.setItem('@tasks', tasks);
    setTimeout(() => {
      navigation.pop();
    }, 300);
  };

  useEffect(() => {
    API.hit("AddActivity");
    setTimeout(() => setActivities(API.activities), 200);
  }, []);

  const toggleSearch = (status) => {
    if (search != status) {
      setSearch(status);

      Animated.timing(searchToggleAnim, {
        toValue: status ? 1 : 0,
        duration: 300,
        useNativeDriver: false
      }).start();
    }
  };

  const onBlur = () => {
    if (!term) {
      toggleSearch(false);
    }
  };

  const dismissSearch = () => {
    setTerm('');
    toggleSearch(false);
  };

  const onSearch = (searchTerm) => {
    if (searchTerm != term) {
      setTerm(searchTerm);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: API.config.panelColor }}>
      <SafeAreaView></SafeAreaView>
      <StatusBar backgroundColor={API.config.panelColor} barStyle={"dark-content"} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS == "ios" ? "padding" : "height"}>
        <ScrollView stickyHeaderIndices={[1]} contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled" keyboardDismissMode={"on-drag"}>
          <SafeAreaView>
            <View style={{ flexDirection: API.isRTL() ? "row-reverse" : "row", justifyContent: "space-between", alignItems: "center", height: 60 }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={[API.styles.h2, {
                    padding: 0,
                    margin: 0,
                    color: "#000"
                  }]}>
                  Today
                </Text>
              </View>
            </View>
          </SafeAreaView>

          <SafeAreaView>
            <Search
              onFocus={() => toggleSearch(true)}
              term={term} onBlur={() => onBlur(false)}
              onChangeText={onSearch}
              dismiss={dismissSearch}
            />
          </SafeAreaView>

          <View>
            {!activities && <Loading />}
          </View>

          <View>
            {activities &&
              <SearchResults
                term={term}
                showAll={!term}
                activities={activities}
                onItemPress={handleItemPress}
                tasks={tasks[today]}
              />
            }
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <LinearGradient colors={[API.config.transparentPanelColor, API.config.panelColor, API.config.panelColor]} style={{
        padding: 30,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: 0,
        zIndex: 99,
        width: "100%",
        height: 90,
      }}>
        <TouchableScale
          style={{
            position: "absolute",
            bottom: 40,
            backgroundColor: API.config.backgroundColor,
            borderRadius: 25,
            width: 50,
            height: 50,
            justifyContent: "center",
            alignItems: "center"
          }}
          onPress={handleAddBtnPress}
        >
          {addLoading &&
            <ActivityIndicator color={API.config.panelColor} />
          }
          {!addLoading && (
            <Svg viewBox="0 0 24 24" width={32} height={32}>
              <Path fill={API.config.panelColor} d="M9 16.2l-3.5-3.5c-.39-.39-1.01-.39-1.4 0-.39.39-.39 1.01 0 1.4l4.19 4.19c.39.39 1.02.39 1.41 0L20.3 7.7c.39-.39.39-1.01 0-1.4-.39-.39-1.01-.39-1.4 0L9 16.2z"></Path>
            </Svg>
          )}
        </TouchableScale>
      </LinearGradient>
    </View>
  );
};
export default AddActivity;
