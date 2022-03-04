import React, { useState, useEffect } from 'react';
import { View, StatusBar, Animated, SafeAreaView, KeyboardAvoidingView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import TouchableScale from 'touchable-scale-btk';
import Svg, { Path } from 'react-native-svg';
import API from '../api';
import Search from '../components/Search';
import Header from '../components/Header';

const AddActivity = ({ navigation }) => {
  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState(false);
  const [searchToggleAnim, setSearchToggleAnim] = useState(new Animated.Value(0));
  const [term, setTerm] = useState('');

  useEffect(() => {
    API.hit("AddActivity");
    console.log("🚀 ~ file: AddActivity.js ~ line 19 ~ useEffect ~ API.user", API.user)
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
      <Header rightButtonRender={true} rightButtonActive={false} rightButtonPress={() => null} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS == "ios" ? "padding" : "height"}>
        <ScrollView stickyHeaderIndices={[1]} contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled" keyboardDismissMode={"on-drag"}>
          <View>
            <Search
              onFocus={() => toggleSearch(true)}
              term={term} onBlur={() => onBlur(false)}
              onChangeText={onSearch}
              dismiss={dismissSearch}
            />
          </View>
          {/* <View>
        {(search && term != "") &&
          <SearchResults term={term} orientation={orientation}/>
        }
      </View> */}

          {/* {!term &&
            <SafeAreaView>
              <Animated.View style={[styles.board, { opacity: boardOpacity, transform: [{ translateY: boardTranslate }] }]}>
                {API.user.active_profile && this.renderPacks()}
              </Animated.View>
            </SafeAreaView>
          } */}
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
        <TouchableScale style={{ position: "absolute", bottom: 40, backgroundColor: API.config.backgroundColor, borderRadius: 25, width: 50, height: 50, justifyContent: "center", alignItems: "center" }} onPress={() => navigation.pop()}>
          <Svg viewBox="0 0 24 24" width={32} height={32}>
            <Path fill={API.config.panelColor} d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
          </Svg>
        </TouchableScale>
      </LinearGradient>
    </View>
  );
};

export default AddActivity;
