import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image as CachedImage } from "react-native-expo-image-cache";
import TouchableScale from 'touchable-scale-btk';
import API from '../api'

const SearchItem = ({ result, selected, onPress }) => {
  const imageUrl = `${API.assetEndpoint}activities/assets/${result.slug}.png?v=${API.version}`;

  const speak = (text, speed) => {
    API.haptics("touch");
    API.speak(text, speed);
  };

  const handlePress = () => {
    onPress && onPress();
    speak(result.title);
  };

  return (
    <TouchableScale style={{ width: '100%' }} onPress={handlePress}>
      <View
        style={[
          styles.item, {
            flexDirection: API.isRTL() ? "row-reverse" : "row",
            backgroundColor: "#F7F7F7",
            borderColor: selected && API.config.backgroundColor,
            borderWidth: selected && 3,
          }]}>
        <CachedImage uri={imageUrl} style={{ width: API.isTablet ? 70 : 50, height: API.isTablet ? 70 : 50, margin: 5 }} />
        <Text style={[styles.searchItemText, { fontSize: 19, marginLeft: 10 }]}>{result.title}</Text>
      </View>
    </TouchableScale>
  );
};

const styles = StyleSheet.create({
  item: {
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 25,
    padding: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  searchItemText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "rgba(0,0,0,0.75)",
    flex: 1,
    paddingRight: 10
  },
  searchItemEmoji: {
    fontSize: 25, margin: 10
  }
});

export default SearchItem;
