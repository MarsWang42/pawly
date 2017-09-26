import { combineReducers } from 'redux-loop';

import { NavigatorApp } from '../navigators/App';
import { tabBarReducer } from '../navigators/TabBar';

import { NavigatorAuth } from '../navigators/Auth';

import { NavigatorProfile } from '../navigators/Profile';

export const NavReducer = combineReducers({
  app: (state, action) => (NavigatorApp.router.getStateForAction(action,state) || state),
  auth: (state, action) => (NavigatorAuth.router.getStateForAction(action,state) || state),
  profile: (state, action) => (NavigatorProfile.router.getStateForAction(action,state) || state),
  tabBar: tabBarReducer,
});
