import { StackNavigator } from 'react-navigation';

import mapNavigationStateParamsToProps from '../helpers/mapNavigationStateParamsToProps';
import TabBar from '../containers/TabBar';
import Camera from '../containers/Camera';

const routeConfiguration = {
  Home: { screen: TabBar },
  Camera: { screen: mapNavigationStateParamsToProps(Camera) },
};

const stackNavigatorConfiguration = {
  mode: 'modal',
  headerMode: 'none',
  initialRouteName: 'Home'
};

export const NavigatorApp = StackNavigator(routeConfiguration, stackNavigatorConfiguration);
