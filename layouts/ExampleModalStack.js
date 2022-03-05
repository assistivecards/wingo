import React from 'react';
import { StyleSheet, Text, View, ScrollView, Animated, ActivityIndicator, Dimensions, TouchableWithoutFeedback, TouchableOpacity, LayoutAnimation, Platform, RefreshControl, PanResponder, Image as RNImage, Easing, SafeAreaView } from 'react-native';
import TouchableScale from 'touchable-scale-btk';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';

import TopBar from '../components/TopBar';
import API from '../api';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.variable = this.props.navigation.getParam("variable");
  }

  render() {

    return (
      <View style={{ flex: 1, backgroundColor: API.config.panelColor }}>
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
          <TouchableScale style={{ position: "absolute", bottom: 40, backgroundColor: API.config.backgroundColor, borderRadius: 25, width: 50, height: 50, justifyContent: "center", alignItems: "center" }} onPress={() => this.props.navigation.pop()}>
            <Svg viewBox="0 0 24 24" width={32} height={32}>
              <Path fill={API.config.panelColor} d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
            </Svg>
          </TouchableScale>
        </LinearGradient>
      </View>
    );
  }
}
