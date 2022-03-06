import { AsyncStorage } from 'react-native';

class StoreUtil {
  static getItem = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.log('error while getting item from the store', error);
    }
  };
  static setItem = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log('error while setting item to the store', error);
    }
  };
  static removeItem = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.log('error while removing item from the store', error);
    }
  };
}
export default StoreUtil;