import { TabNavigator } from 'react-navigation';
import { Platform } from 'react-native';
// Tab-Navigators
import Main from '../containers/Main';
import Map from '../containers/Map';
import Discover from '../containers/Discover';
import Profile from '../containers/Profile';

const routeConfiguration = {
  Main: { screen: Main },
  Map: { screen: Map },
  Discover: { screen: Discover },
  Profile: { screen: Profile },
};

const tabBarConfiguration = {
  lazyLoad: true,
  swipeEnabled: false,
  //...other configs
  tabBarOptions:{
    showLabel: false,
    showIcon: true,
    indicatorStyle: { backgroundColor: 'blue' },
    iconStyle: {
      height: 30,
      width: 50,
      marginBottom: (Platform.OS === 'ios') ? 0 : 20,
    },
    tabStyle: {
      padding: (Platform.OS === 'ios') ? 12 : 4,
    },
    // tint color is passed to text and icons (if enabled) on the tab bar
    activeTintColor: '#e63460',
    inactiveTintColor: 'black',
    style:{
      position: 'absolute',
      height: 45,
      zIndex: 100,
      bottom: 0,
      left: 0,
      right: 0
    }
  }
};

export const TabBar = TabNavigator(routeConfiguration, tabBarConfiguration);

export const tabBarReducer = (state,action) => {
  if (action.type === 'JUMP_TO_TAB') {
    return { ...state, index:0 };
  } else {
    return TabBar.router.getStateForAction(action,state) || state;
  }
};
