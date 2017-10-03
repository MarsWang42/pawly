import { StackNavigator } from 'react-navigation';

import Home from '../containers/Profile/Home';
import Settings from '../containers/Profile/Settings';

const routeConfiguration = {
  Home: { screen: Home },
  Settings: { screen: Settings },
};

const stackNavigatorConfiguration = {
  headerMode: 'none',
  initialRouteName: 'Home'
};

export const NavigatorProfile = StackNavigator(routeConfiguration, stackNavigatorConfiguration);
