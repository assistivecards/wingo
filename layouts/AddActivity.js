import React, { useState, useEffect } from 'react';
import { View, Text, Animated, SafeAreaView, KeyboardAvoidingView, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import TouchableScale from 'touchable-scale-btk';
import Svg, { Path } from 'react-native-svg';
import API from '../api';
import Search from '../components/Search';
import SearchResults from '../components/SearchResults';

const AddActivity = ({ navigation }) => {
  const [activities, setActivities] = useState(undefined);
  const [search, setSearch] = useState(false);
  const [searchToggleAnim] = useState(new Animated.Value(0));
  const [term, setTerm] = useState('');

  useEffect(() => {
    API.hit("AddActivity");
    setTimeout(() => setActivities(API.activities), 300);
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

  let headerHeight = searchToggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [60, 0]
  });

  let headerOpacity = searchToggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0]
  });

  let boardOpacity = searchToggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0]
  });

  let boardTranslate = searchToggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 400]
  });

  return (
    <View style={{ flex: 1, backgroundColor: API.config.panelColor }}>
      <SafeAreaView></SafeAreaView>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS == "ios" ? "padding" : "height"}>
        <ScrollView stickyHeaderIndices={[1]} contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled" keyboardDismissMode={"on-drag"}>
          <SafeAreaView>
            <Animated.View style={{ height: headerHeight, opacity: headerOpacity }}>
              <View style={{ flexDirection: API.isRTL() ? "row-reverse" : "row", justifyContent: "space-between", alignItems: "center", height: 60 }}>
                <View style={{ flex: 1 }}>
                  <Text style={[API.styles.h2, { padding: 0, margin: 0, color: "#000" }]}>Activities</Text>
                </View>
              </View>
            </Animated.View>
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
            {(search && term != "" && activities) &&
              <SearchResults term={term} activities={activities} />
            }
          </View>

          {!term && activities &&
            <SafeAreaView>
              <Animated.View style={[styles.board, { opacity: boardOpacity, transform: [{ translateY: boardTranslate }] }]}>
                {API.user && <SearchResults term={term} showAll activities={activities} />
                }
              </Animated.View>
            </SafeAreaView>
          }
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
        {!search && (
          <TouchableScale style={{ position: "absolute", bottom: 40, backgroundColor: API.config.backgroundColor, borderRadius: 25, width: 50, height: 50, justifyContent: "center", alignItems: "center" }} onPress={() => navigation.pop()}>
            <Svg viewBox="0 0 24 24" width={32} height={32}>
              <Path fill={API.config.panelColor} d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
            </Svg>
          </TouchableScale>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  carrier: {
    flex: 1,
    backgroundColor: "#fff",
    height: "100%"
  },
  header: {
    backgroundColor: "#6989FF"
  },
  avatar: {
    marginHorizontal: 30, padding: 2, backgroundColor: "#a5d5ff", borderRadius: 40, overflow: "hidden",
    width: 45,
    height: 45,
    marginTop: 5,
  },
  avatarHolder: {
    position: "relative"
  },
  avatarIcon: {
    backgroundColor: "#fff",
    width: 18,
    height: 18,
    position: "absolute",
    bottom: -2,
    right: 28,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  categoryItem: {
    width: "50%"
  },
  categoryItemLandscape: {
    width: "33.3%"
  },
  board: {
    justifyContent: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  categoryItemInner: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1, borderRadius: 25,
    margin: 5
  },
  categoryItemText: {
    fontWeight: "bold",
    marginBottom: 10,
    color: "rgba(0,0,0,0.75)"
  },
  addPack: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#ddd"
  },
});

export default AddActivity;
