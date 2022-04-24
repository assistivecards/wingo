import React from 'react';
import { View, Text } from 'react-native';
import TouchableScale from 'touchable-scale-btk';
import API from '../api';

const ProgressBar = ({ completedCount, allCount }) => {
  const successMessage = 'Congratulations!';
  const successDescription = 'You completed all your tasks.';

  const speak = (text, speed) => {
    API.haptics("touch");
    API.speak(text, speed);
  };

  const handleCongratsPress = () => {
    speak(`${successMessage} ${successDescription}`);
  };

  return (
    <>
      {completedCount === allCount && (
        <TouchableScale style={{ width: '100%' }} onPress={handleCongratsPress}>
          <View style={{
            marginTop: 10,
            paddingVertical: 7,
            borderRadius: 10,
            backgroundColor: API.config.successBgColor,
            marginHorizontal: API.config.globalPadding,
          }}>
            <Text
              style={[API.styles.h1,
              {
                marginBottom: -3,
                fontSize: 26,
                marginHorizontal: 0,
                marginVertical: 10,
                textAlign: 'center',
                color: API.config.successColor,
              }]}>
              {successMessage}
            </Text>
            <Text style={[API.styles.p,
            {
              marginHorizontal: 0,
              textAlign: 'center'
            }]}>
              {successDescription}
            </Text>
          </View>
        </TouchableScale>
      )}
      <View
        style={{
          marginVertical: 10,
          paddingHorizontal: API.config.globalPadding,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '85%',
          }}>
          {
            [...Array(allCount).keys()].map((bar, index) => (
              <View
                key={index}
                style={{
                  height: 10,
                  width: `${100 / allCount}%`,
                  backgroundColor: completedCount === allCount ? API.config.successColor : API.config.backgroundColor,
                  opacity: index < completedCount ? 1 : 0.4,
                  borderBottomLeftRadius: index === 0 ? 10 : 0,
                  borderTopLeftRadius: index === 0 ? 10 : 0,
                  borderBottomRightRadius: index === allCount - 1 ? 10 : 0,
                  borderTopRightRadius: index === allCount - 1 ? 10 : 0,
                }}
              />
            ))
          }
        </View>
        <View style={{ width: '15%' }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'right',
              color: completedCount === allCount ? API.config.successColor : API.config.backgroundColor,
            }}>
            {completedCount}/{allCount}
          </Text>
        </View>
      </View>
    </>
  );
};
export default ProgressBar;
