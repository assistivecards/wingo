import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image as CachedImage } from "react-native-expo-image-cache";
import TouchableScale from 'touchable-scale-btk';
import API from '../api'

const ActivityItem = ({ data, selected, onPress, speakOnPress = true }) => {
  const imageUrl = `${API.assetEndpoint}activities/assets/${data.slug}.png?v=${API.version}`;

  const speak = (text, speed) => {
    API.haptics("touch");
    API.speak(text, speed);
  };

  const handlePress = () => {
    onPress && onPress();

    setTimeout(() => {
      speakOnPress && speak(data.title);
    }, 100);
  };

  return (
    <TouchableScale style={{ width: '100%' }} onPress={handlePress}>
      <View
        style={[
          styles.item, {
            backgroundColor: 'rgba(99, 110, 182, 0.05)',
            borderColor: !selected ? API.config.panelColor : API.config.backgroundColor,
            borderWidth: 3,
            padding: 10,
          }]}>
        <CachedImage
          uri={imageUrl}
          style={{
            width: API.isTablet ? 160 * API.artworkAspectRatio : 140 * API.artworkAspectRatio,
            height: API.isTablet ? 160 : 140,
            margin: 5
          }}
        />
        <Text
          style={[styles.searchItemText, {
            fontSize: 19,
            marginLeft: 10,
            marginTop: 10,
          }]}
        >
          {data.title}
        </Text>
      </View>
    </TouchableScale>
  );
};

const styles = StyleSheet.create({
  item: {
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

export default ActivityItem;
