import React, { useState, useEffect } from 'react';
import Svg, { Path } from 'react-native-svg';
import TouchableScale from 'touchable-scale-btk';
import { ActivityIndicator, StatusBar, View, Text, Animated, SafeAreaView, KeyboardAvoidingView, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityList, Loading, Search } from '../components';
import { DateUtil } from '../utils';
import { isEmpty } from '../utils/common';
import { useAppContext } from '../hooks';
import API from '../api';

const AddActivity = ({ navigation }) => {
  const { tasks, setTasks, day, dayDate } = useAppContext();
  const [activities, setActivities] = useState(undefined);
  const [search, setSearch] = useState(false);
  const [searchToggleAnim] = useState(new Animated.Value(0));
  const [term, setTerm] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [newTasks, setNewTasks] = useState({});
  const [updated, setUpdated] = useState({});

  const handleAddBtnPress = async () => {
    setAddLoading(true);
    setTasks(newTasks);
    setTimeout(() => {
      navigation.pop();
    }, 300);
  };

  const handleItemPress = (slug) => {
    setNewTasks(
      {
        ...newTasks,
        [dayDate]: {
          ...newTasks[dayDate],
          [slug]: newTasks[dayDate] && !newTasks[dayDate][slug] ? {
            added: DateUtil.now(),
            completed: null,
          } : undefined
        }
      }
    );
    if (updated[slug]) {
      delete updated[slug];
    } else {
      setUpdated({
        ...updated,
        [slug]: true,
      });
    }
  };

  useEffect(() => {
    API.hit("AddActivity");
    setNewTasks(tasks);
    setTimeout(() => {
      setActivities(
        tasks && tasks[dayDate]
          ? API.activities.filter(activity => !tasks[dayDate][activity.slug])
          : API.activities
      );
    }, 400);
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

  const getIsSelected = (slug) => {
    return newTasks && newTasks[dayDate] && newTasks[dayDate][slug];
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
                  {API.t(day)}
                </Text>
              </View>
            </View>
          </SafeAreaView>

          <SafeAreaView>
            <Search
              term={term}
              onFocus={() => toggleSearch(true)}
              onBlur={() => onBlur(false)}
              onChangeText={onSearch}
              dismiss={dismissSearch}
            />
          </SafeAreaView>

          <View>
            {!activities && <Loading />}
          </View>

          <View>
            {activities &&
              <ActivityList
                term={term}
                activities={activities}
                showAll={!term}
                onItemPress={handleItemPress}
                getIsSelected={getIsSelected}
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
          onPress={!isEmpty(updated) ? handleAddBtnPress : () => navigation.pop()}
        >
          {addLoading &&
            <ActivityIndicator color={API.config.panelColor} />
          }
          {!addLoading && (
            <>
              {!isEmpty(updated) ? (
                <Svg viewBox="0 0 24 24" width={32} height={32}>
                  <Path fill={API.config.panelColor} d="M9 16.2l-3.5-3.5c-.39-.39-1.01-.39-1.4 0-.39.39-.39 1.01 0 1.4l4.19 4.19c.39.39 1.02.39 1.41 0L20.3 7.7c.39-.39.39-1.01 0-1.4-.39-.39-1.01-.39-1.4 0L9 16.2z"></Path>
                </Svg>
              ) : (
                <Svg viewBox="0 0 24 24" width={32} height={32}>
                  <Path fill={API.config.panelColor} d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
                </Svg>
              )}
            </>
          )}
        </TouchableScale>
      </LinearGradient>
    </View>
  );
};
export default AddActivity;
