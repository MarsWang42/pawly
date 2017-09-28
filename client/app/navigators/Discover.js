import { StackNavigator } from 'react-navigation';

import mapNavigationStateParamsToProps from '../helpers/mapNavigationStateParamsToProps';
import Home from '../containers/Discover/Home';
import User from '../containers/Discover/User';

const routeConfiguration = {
  Home: { screen: Home },
  User: { screen: mapNavigationStateParamsToProps(User) },
};

const stackNavigatorConfiguration = {
  headerMode: 'none',
  initialRouteName: 'Home'
};

export const NavigatorDiscover = StackNavigator(routeConfiguration, stackNavigatorConfiguration);
