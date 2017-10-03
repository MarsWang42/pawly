import { StackNavigator } from 'react-navigation';

import mapNavigationStateParamsToProps from '../helpers/mapNavigationStateParamsToProps';
import Home from '../containers/Main/Home';
import User from '../containers/Shared/User';
import Pet from '../containers/Shared/Pet';

const routeConfiguration = {
  Home: { screen: Home },
  User: { screen: mapNavigationStateParamsToProps(User) },
  Pet: { screen: mapNavigationStateParamsToProps(Pet) },
};

const stackNavigatorConfiguration = {
  headerMode: 'none',
  initialRouteName: 'Home'
};

export const NavigatorMain = StackNavigator(routeConfiguration, stackNavigatorConfiguration);
