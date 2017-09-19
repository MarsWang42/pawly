import { AsyncStorage } from 'react-native';

export const getCurrentUser = () => {
  return AsyncStorage.getItem('currentUser');
};

export const setCurrentUser = (username) => {
  return AsyncStorage.setItem('currentUser', username);
};

export const getHealthkitPermission = () => {
  return AsyncStorage.getItem('healthkitPermission');
};

export const setHealthkitPermission = (healthkitPermission) => {
  return AsyncStorage.setItem('healthkitPermission', healthkitPermission);
};

export const getDeviceToken = () => {
  return AsyncStorage.getItem('deviceToken');
};

export const setDeviceToken = (deviceToken) => {
  return AsyncStorage.setItem('deviceToken', deviceToken);
};

export const getSearchHistory = () => {
  return AsyncStorage.getItem('searchHistory');
};

export const setSearchHistory = (searchHistory) => {
  return AsyncStorage.setItem('searchHistory', searchHistory);
};
