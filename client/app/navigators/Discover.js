import { StackNavigator } from 'react-navigation';

import mapNavigationStateParamsToProps from '../helpers/mapNavigationStateParamsToProps';
import Home from '../containers/Discover/Home';
import User from '../containers/Shared/User';
import Pet from '../containers/Shared/Pet';
import AdoptionForm from '../containers/Shared/AdoptionForm';
import PictureDetail from '../containers/Shared/PictureDetail';
import FollowingList from '../containers/Shared/FollowingList';
import FollowerList from '../containers/Shared/FollowerList';

const routeConfiguration = {
  Home: { screen: Home },
  DiscoverUser: { screen: mapNavigationStateParamsToProps(User) },
  DiscoverPet: { screen: mapNavigationStateParamsToProps(Pet) },
  DiscoverAdoptionForm: { screen: mapNavigationStateParamsToProps(AdoptionForm) },
  DiscoverPictureDetail: { screen: mapNavigationStateParamsToProps(PictureDetail) },
  DiscoverFollowingList: { screen: mapNavigationStateParamsToProps(FollowingList) },
  DiscoverFollowerList: { screen: mapNavigationStateParamsToProps(FollowerList) },
};

const stackNavigatorConfiguration = {
  headerMode: 'none',
  initialRouteName: 'Home'
};

export const NavigatorDiscover = StackNavigator(routeConfiguration, stackNavigatorConfiguration);
