import React, { useState, useEffect } from 'react';
import Svg, { Path } from 'react-native-svg';
import TouchableScale from 'touchable-scale-btk';
import { ActivityIndicator, StatusBar, View, Text, Animated, SafeAreaView, KeyboardAvoidingView, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Loading, Search, SearchResults } from '../components';
import API from '../api';

const AddActivity = ({ navigation }) => {
  const [activities, setActivities] = useState(undefined);
  const [search, setSearch] = useState(false);
  const [searchToggleAnim] = useState(new Animated.Value(0));
  const [term, setTerm] = useState('');
  const [addLoading, setAddLoading] = useState(false);

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

  const handleAddBtnPress = () => {
    setAddLoading(true);
    setTimeout(() => {
      navigation.pop();
    }, 300);
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
                <Text style={[API.styles.h2, { padding: 0, margin: 0, color: "#000" }]}>Add activities</Text>
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
              <SearchResults term={term} showAll={!term} activities={activities} />
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
