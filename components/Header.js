import React from 'react';
import { StyleSheet, Platform, Text, View, SafeAreaView, TouchableOpacity, StatusBar, Dimensions, Image, ActivityIndicator } from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

import API from '../api'

export default class App extends React.Component {
  state = {
    rightButtonActivity: false
  }
  constructor(props) {
    super(props);
    if (typeof API.user == "undefined") {
      API.user = { isRTL: false }
    }
  }

  onRightButtonPress() {
    this.setState({ rightButtonActivity: true })
    setTimeout(() => {
      this.props.rightButtonPress();
    }, 200);
  }

  render() {
    return (
      <View style={{ backgroundColor: API.config.panelColor }}>
        <StatusBar backgroundColor={this.props.backgroundColor ? this.props.backgroundColor : API.config.backgroundColor} barStyle={this.props.backgroundColor == API.config.backgroundColor ? "light-content" : "dark-content"} />
        <SafeAreaView>
          <View style={[styles.container, { flexDirection: API.isRTL() ? "row-reverse" : "row" }]}>
            <Text style={[API.styles.h2, { padding: 0, margin: 0, color: "#000" }]}>Activities</Text>
            {this.props.rightButtonRender &&
              <TouchableOpacity disabled={!this.props.rightButtonActive} onPress={() => this.onRightButtonPress()} style={{ padding: 10, paddingHorizontal: 25 }}>
                <View style={[styles.rightButton, { backgroundColor: API.config.backgroundColor, opacity: this.props.rightButtonActive ? 1 : 0.4 }]}>
                  {this.state.rightButtonActivity &&
                    <ActivityIndicator color={API.config.panelColor} />
                  }
                  {!this.state.rightButtonActivity &&
                    <Svg width={25} height={25} viewBox="0 0 25 25" strokeWidth={1} stroke={API.config.panelColor}>
                      <Path fill={API.config.panelColor} d="M9 16.2l-3.5-3.5c-.39-.39-1.01-.39-1.4 0-.39.39-.39 1.01 0 1.4l4.19 4.19c.39.39 1.02.39 1.41 0L20.3 7.7c.39-.39.39-1.01 0-1.4-.39-.39-1.01-.39-1.4 0L9 16.2z"></Path>
                    </Svg>
                  }
                </View>
              </TouchableOpacity>
            }
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 0,
  },
  buttonHolder: {
    paddingTop: 12,
    paddingBottom: 3,
    paddingHorizontal: 25,
  },
  buttonHolderFS: {
    paddingTop: 7,
    paddingBottom: 8,
    paddingHorizontal: 25,
  },
  title: {
    width: Dimensions.get("window").width - 78 * 2,
    height: 43,
    position: "relative",
    top: 3,
    flexDirection: "row",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center"
  },
  rightButton: {
    backgroundColor: API.config.backgroundColor,
    height: 30,
    width: 60,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center"
  }
});
