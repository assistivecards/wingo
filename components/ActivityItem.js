import React from 'react';
import TouchableScale from 'touchable-scale-btk';
import Svg, { Path } from 'react-native-svg';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Image as CachedImage } from "react-native-expo-image-cache";
import { useAppContext } from '../hooks'
import API from '../api'

const ActivityItem = ({
  data,
  selected,
  onPress,
  onRemoveItem,
  speakOnPress = true,
  showEditing,
  drag,
  isActive,
}) => {
  const { isEditing } = useAppContext();

  const imageUrl = `${API.assetEndpoint}activities/assets/${data.slug}.png?v=${API.version}`;

  const speak = (text, speed) => {
    API.haptics("touch");
    API.speak(text, speed);
  };

  const handlePress = () => {
    onPress && onPress();

    if(data.isPremium && !API.isPremium()){
      return false;
    }

    setTimeout(() => {
      speakOnPress && speak(data.title);
    }, 100);
  };

  return (
    <View style={{ flexDirection: 'row' }}>
      {(showEditing && isEditing) && (
          <View
            style={{
              position: 'absolute',
              left: 10,
              height: "100%",
              width: 200,
              justifyContent: "center",
              zIndex: 100
            }}>
              <TouchableOpacity
                style={{
                  transform: [{
                    scale: isActive ? 1.15 : 1
                  }],
                  height: "100%", justifyContent: "center"
                }}
                activeOpacity={0.9}
                onLongPress={() => { API.haptics("impact"); drag(); }}>
              <Svg height={32} width={32} viewBox="0 0 24 24" style={{ opacity: 0.9 }}>
                <Path fill={API.config.backgroundColor} d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></Path>
              </Svg>
            </TouchableOpacity>
        </View>
      )}

      <TouchableScale style={{ width: '100%' }} onPress={handlePress}>
        <View
          style={[
            styles.item, {
              backgroundColor: '#f7f8fb',
              borderColor: !selected ? API.config.panelColor : API.config.backgroundColor,
              borderWidth: isActive ? 0 : 3,
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
              textAlign: "center"
            }]}
          >
            {data.title}
          </Text>
        </View>
        {(data.isPremium == 1 && !API.isPremium()) &&
          <View style={[styles.button, {backgroundColor: "#a2ddfd"}]}>
            <Text style={{color: "#3e455b", fontWeight: "bold"}}>Premium</Text>
          </View>
        }
      </TouchableScale>

      {(showEditing && isEditing) && (
          <View
            style={{
              position: 'absolute',
              right: 10,
              height: "100%",
              justifyContent: "center",
              zIndex: 100
            }}>
            <TouchableOpacity style={{height: "100%", justifyContent: "center"}} onPress={() => onRemoveItem && onRemoveItem(data.slug)}>
              <Svg height={32} width={32} viewBox="0 0 24 24" style={{ opacity: 0.9 }}>
                <Path fill={API.config.backgroundColor} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4 11H8c-.55 0-1-.45-1-1s.45-1 1-1h8c.55 0 1 .45 1 1s-.45 1-1 1z"></Path>
              </Svg>
            </TouchableOpacity>
          </View>
      )}

    </View>
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
  },
  button: {
    backgroundColor: "#6989FF",
    height: 30,
    borderRadius: 15,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 10,
    top: 17
  }
});

export default ActivityItem;
