import {
  widthPercentageToDP as wp2dp,
  heightPercentageToDP as hp2dp,
} from 'react-native-responsive-screen';

class ResponsiveUtil {
  static wp = percentage => {
    return wp2dp(percentage)
  };

  static hp = percentage => {
    return hp2dp(percentage)
  };
}

export default ResponsiveUtil;
