import { combineReducers } from 'redux-loop';

import { NavReducer } from './nav';
import { SessionReducer } from './session';
import { PictureReducer } from './picture';

export default combineReducers({
  nav: NavReducer,
  session: SessionReducer,
  picture: PictureReducer,
});
