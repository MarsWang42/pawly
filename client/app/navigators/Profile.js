import { StackNavigator } from 'react-navigation';

import mapNavigationStateParamsToProps from '../helpers/mapNavigationStateParamsToProps';
import Home from '../containers/Profile/Home';
import Settings from '../containers/Profile/Settings';
import Notifications from '../containers/Profile/Notifications';
import User from '../containers/Shared/User';
import PictureDetail from '../containers/Shared/PictureDetail';
import Pet from '../containers/Shared/Pet';
import PetList from '../containers/Profile/PetList.js';
import PetForm from '../containers/Profile/PetForm.js';
import FollowingList from '../containers/Shared/FollowingList';
import FollowerList from '../containers/Shared/FollowerList';

const routeConfiguration = {
  Home: { screen: Home },
  Settings: { screen: Settings },
  Notifications: { screen: Notifications },
  PetList: { screen: PetList },
  PetForm: { screen: mapNavigationStateParamsToProps(PetForm) },
  ProfilePet: { screen: mapNavigationStateParamsToProps(Pet) },
  ProfilePictureDetail: { screen: mapNavigationStateParamsToProps(PictureDetail) },
  ProfileUser: { screen: mapNavigationStateParamsToProps(User) },
  ProfileFollowingList: { screen: mapNavigationStateParamsToProps(FollowingList) },
  ProfileFollowerList: { screen: mapNavigationStateParamsToProps(FollowerList) },
};

const stackNavigatorConfiguration = {
  headerMode: 'none',
  initialRouteName: 'Home'
};

export const NavigatorProfile = StackNavigator(routeConfiguration, stackNavigatorConfiguration);
