import { StackNavigator } from 'react-navigation';

import mapNavigationStateParamsToProps from '../helpers/mapNavigationStateParamsToProps';
import Home from '../containers/Discover/Home';
import User from '../containers/Shared/User';
import FollowingList from '../containers/Shared/FollowingList';
import FollowerList from '../containers/Shared/FollowerList';

const routeConfiguration = {
  Home: { screen: Home },
  DiscoverUser: { screen: mapNavigationStateParamsToProps(User) },
  DiscoverFollowingList: { screen: mapNavigationStateParamsToProps(FollowingList) },
  DiscoverFollowerList: { screen: mapNavigationStateParamsToProps(FollowerList) },
};

const stackNavigatorConfiguration = {
  headerMode: 'none',
  initialRouteName: 'Home'
};

export const NavigatorDiscover = StackNavigator(routeConfiguration, stackNavigatorConfiguration);
