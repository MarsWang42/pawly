import { combineReducers } from 'redux-loop';

import { NavigatorApp } from '../navigators/App';

import { NavigatorAuth } from '../navigators/Auth';
import { tabBarReducer } from '../navigators/TabBar';

export const NavReducer = combineReducers({
  app: (state,action) => (NavigatorApp.router.getStateForAction(action,state) || state),
  auth: (state,action) => (NavigatorAuth.router.getStateForAction(action,state) || state),
  tabBar: tabBarReducer,
});
