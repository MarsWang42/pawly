import { combineReducers } from 'redux-loop';

import { NavigatorAuth } from '../navigators/Auth';

export const NavReducer = combineReducers({
  auth: (state,action) => (NavigatorAuth.router.getStateForAction(action,state) || state),
});
