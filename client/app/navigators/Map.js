import { StackNavigator } from 'react-navigation';

import mapNavigationStateParamsToProps from '../helpers/mapNavigationStateParamsToProps';
import Home from '../containers/Map/Home';
import User from '../containers/Shared/User';
import Pet from '../containers/Shared/Pet';
import PictureDetail from '../containers/Shared/PictureDetail';
import FollowingList from '../containers/Shared/FollowingList';
import FollowerList from '../containers/Shared/FollowerList';

const routeConfiguration = {
  Home: { screen: Home },
  MapUser: { screen: mapNavigationStateParamsToProps(User) },
  MapPet: { screen: mapNavigationStateParamsToProps(Pet) },
  MapPictureDetail: { screen: mapNavigationStateParamsToProps(PictureDetail) },
  MapFollowingList: { screen: mapNavigationStateParamsToProps(FollowingList) },
  MapFollowerList: { screen: mapNavigationStateParamsToProps(FollowerList) },
};

const stackNavigatorConfiguration = {
  headerMode: 'none',
  initialRouteName: 'Home'
};

export const NavigatorMap = StackNavigator(routeConfiguration, stackNavigatorConfiguration);
