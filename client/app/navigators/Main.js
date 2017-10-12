import { StackNavigator } from 'react-navigation';

import mapNavigationStateParamsToProps from '../helpers/mapNavigationStateParamsToProps';
import Home from '../containers/Main/Home';
import User from '../containers/Shared/User';
import Pet from '../containers/Shared/Pet';
import AdoptionForm from '../containers/Shared/AdoptionForm';
import PictureDetail from '../containers/Shared/PictureDetail';
import FollowingList from '../containers/Shared/FollowingList';
import FollowerList from '../containers/Shared/FollowerList';

const routeConfiguration = {
  Home: { screen: Home },
  MainUser: { screen: mapNavigationStateParamsToProps(User) },
  MainPet: { screen: mapNavigationStateParamsToProps(Pet) },
  MainAdoptionForm: { screen: mapNavigationStateParamsToProps(AdoptionForm) },
  MainPictureDetail: { screen: mapNavigationStateParamsToProps(PictureDetail) },
  MainFollowingList: { screen: mapNavigationStateParamsToProps(FollowingList) },
  MainFollowerList: { screen: mapNavigationStateParamsToProps(FollowerList) },
};

const stackNavigatorConfiguration = {
  headerMode: 'none',
  initialRouteName: 'Home'
};

export const NavigatorMain = StackNavigator(routeConfiguration, stackNavigatorConfiguration);
