import { StackNavigator } from 'react-navigation';

import mapNavigationStateParamsToProps from '../helpers/mapNavigationStateParamsToProps';
import Home from '../containers/Map/Home';

const routeConfiguration = {
  Home: { screen: Home },
};

const stackNavigatorConfiguration = {
  headerMode: 'none',
  initialRouteName: 'Home'
};

export const NavigatorMap = StackNavigator(routeConfiguration, stackNavigatorConfiguration);
