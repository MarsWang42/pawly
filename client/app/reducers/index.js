import { combineReducers } from 'redux-loop';

import { NavReducer } from './nav';
import { SessionReducer } from './session';
import { PictureReducer } from './picture';
import { UserReducer } from './user';

export default combineReducers({
  nav: NavReducer,
  session: SessionReducer,
  picture: PictureReducer,
  user: UserReducer,
});
