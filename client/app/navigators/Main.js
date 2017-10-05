import { StackNavigator } from 'react-navigation';

import mapNavigationStateParamsToProps from '../helpers/mapNavigationStateParamsToProps';
import Home from '../containers/Main/Home';
import User from '../containers/Shared/User';
import Pet from '../containers/Shared/Pet';
import PictureDetail from '../containers/Shared/PictureDetail';

const routeConfiguration = {
  Home: { screen: Home },
  MainUser: { screen: mapNavigationStateParamsToProps(User) },
  MainPet: { screen: mapNavigationStateParamsToProps(Pet) },
  MainPictureDetail: { screen: mapNavigationStateParamsToProps(PictureDetail) },
};

const stackNavigatorConfiguration = {
  headerMode: 'none',
  initialRouteName: 'Home'
};

export const NavigatorMain = StackNavigator(routeConfiguration, stackNavigatorConfiguration);
