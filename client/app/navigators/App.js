import { StackNavigator } from 'react-navigation';

import TabBar from '../containers/TabBar';
import Camera from '../containers/Camera';

const routeConfiguration = {
  TabBar: { screen: TabBar },
  Camera: { screen: Camera },
};

const stackNavigatorConfiguration = {
  mode: 'modal',
  headerMode: 'none',
  initialRouteName: 'TabBar'
};

export const NavigatorApp = StackNavigator(routeConfiguration, stackNavigatorConfiguration);
