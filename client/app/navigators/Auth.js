import { StackNavigator } from 'react-navigation';

import Home from '../containers/Auth/Home';

const routeConfiguration = {
  Home: { screen: Home },
};

const stackNavigatorConfiguration = {
  headerMode: 'none',
  initialRouteName: 'Home'
};

export const NavigatorAuth = StackNavigator(routeConfiguration, stackNavigatorConfiguration);
