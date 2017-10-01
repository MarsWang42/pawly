import { combineReducers } from 'redux-loop';

import { NavigatorApp } from '../navigators/App';
import { tabBarReducer } from '../navigators/TabBar';

import { NavigatorAuth } from '../navigators/Auth';

import { NavigatorMap } from '../navigators/Map';
import { NavigatorDiscover } from '../navigators/Discover';
import { NavigatorProfile } from '../navigators/Profile';

export const NavReducer = combineReducers({
  app: (state, action) => (NavigatorApp.router.getStateForAction(action,state) || state),
  tabBar: tabBarReducer,

  auth: (state, action) => (NavigatorAuth.router.getStateForAction(action,state) || state),

  map: (state, action) => (NavigatorMap.router.getStateForAction(action,state) || state),
  profile: (state, action) => (NavigatorProfile.router.getStateForAction(action,state) || state),
  discover: (state, action) => (NavigatorDiscover.router.getStateForAction(action,state) || state),
});
