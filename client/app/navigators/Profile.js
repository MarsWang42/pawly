import { StackNavigator } from 'react-navigation';

import mapNavigationStateParamsToProps from '../helpers/mapNavigationStateParamsToProps';
import Home from '../containers/Profile/Home';
import Settings from '../containers/Profile/Settings';
import User from '../containers/Shared/User';
import Pet from '../containers/Shared/Pet';
import PetList from '../containers/Profile/PetList.js';
import AddPet from '../containers/Profile/AddPet.js';
import FollowingList from '../containers/Shared/FollowingList';
import FollowerList from '../containers/Shared/FollowerList';

const routeConfiguration = {
  Home: { screen: Home },
  Settings: { screen: Settings },
  PetList: { screen: PetList },
  AddPet: { screen: AddPet },
  ProfilePet: { screen: mapNavigationStateParamsToProps(Pet) },
  ProfileUser: { screen: mapNavigationStateParamsToProps(User) },
  ProfileFollowingList: { screen: mapNavigationStateParamsToProps(FollowingList) },
  ProfileFollowerList: { screen: mapNavigationStateParamsToProps(FollowerList) },
};

const stackNavigatorConfiguration = {
  headerMode: 'none',
  initialRouteName: 'Home'
};

export const NavigatorProfile = StackNavigator(routeConfiguration, stackNavigatorConfiguration);
