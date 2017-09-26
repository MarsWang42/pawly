import { StackNavigator } from 'react-navigation';

import Home from '../containers/Profile/Home';

const routeConfiguration = {
  Home: { screen: Home },
};

const stackNavigatorConfiguration = {
  headerMode: 'none',
  initialRouteName: 'Home'
};

export const NavigatorProfile = StackNavigator(routeConfiguration, stackNavigatorConfiguration);
