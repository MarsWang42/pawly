import { combineReducers } from 'redux-loop';

import { NavReducer } from './nav';
import { SessionReducer } from './session';

export default combineReducers({
  nav: NavReducer,
  session: SessionReducer,
});
