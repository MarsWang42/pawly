import createReducer from '../helpers/createReducer';
import db from '../db';
import apis from '../apis';
import { loop, Cmd } from 'redux-loop';

export const GET_CURRENT_USER = 'GET_CURRENT_USER';
export const GET_CURRENT_USER_SUCCEED = 'GET_CURRENT_USER_SUCCEED';
export const GET_CURRENT_USER_FAILED = 'GET_CURRENT_USER_FAILED';
export const LOGIN_USER = 'LOGIN_USER';
export const LOGIN_USER_SUCCEED = 'LOGIN_USER_SUCCEED';
export const LOGIN_USER_FAILED = 'LOGIN_USER_FAILED';
export const REGISTER_USER = 'REGISTER_USER';
export const REGISTER_USER_SUCCEED = 'REGISTER_USER_SUCCEED';
export const REGISTER_USER_FAILED = 'REGISTER_USER_FAILED';
export const UPDATE_USER = 'UPDATE_USER';
export const UPDATE_USER_SUCCEED = 'UPDATE_USER_SUCCEED';
export const UPDATE_USER_FAILED = 'UPDATE_USER_FAILED';
export const LOGOUT_USER = 'LOGOUT_USER';
export const UPLOAD_AVATAR = 'UPLOAD_AVATAR';
export const UPLOAD_AVATAR_SUCCEED = 'UPLOAD_AVATAR_SUCCEED';
export const UPLOAD_AVATAR_FAILED = 'UPLOAD_AVATAR_FAILED';
export const SET_CURRENT_LOCATION = 'SET_CURRENT_LOCATION';
export const SET_LOCATION_AUTH = 'SET_LOCATION_AUTH';

const getCurrentUserSucceed = (value) => {
  value = JSON.parse(value);
  if (value && value.username) {
    return {
      type: GET_CURRENT_USER_SUCCEED,
      value,
    };
  } else {
    db.AsyncStorage.setCurrentUser('');
    return getCurrentUserFailed();
  }
};

const getCurrentUserFailed = () => ({
  type: GET_CURRENT_USER_FAILED,
});

const loginUserSucceed = (respond) => {
  db.AsyncStorage.setCurrentUser(JSON.stringify(respond.data));
  return {
    type: LOGIN_USER_SUCCEED,
    currentUser: respond.data
  };
};

const loginUserFailed = (data) => ({
  type: LOGIN_USER_FAILED,
  error: data.response,
});

const registerUserSucceed = (respond) => {
  return {
    type: REGISTER_USER_SUCCEED,
    currentUser: respond.data,
  };
};

const registerUserFailed = (respond) => ({
  type: REGISTER_USER_FAILED,
  error: respond,
});

const updateUserSucceed = (respond) => {
  db.AsyncStorage.setCurrentUser(JSON.stringify(respond.data));
  return {
    type: UPDATE_USER_SUCCEED,
    currentUser: respond.data,
  };
};

const updateUserFailed = (data) => ({
  type: UPDATE_USER_FAILED,
  error: data.response,
});

const uploadAvatarSucceed = (respond, callback) => {
  callback && callback();
  return {
    type: UPLOAD_AVATAR_SUCCEED,
    ava: respond.data,
  };
};

const uploadAvatarFailed = (respond, callback) => {
  callback && callback();
  return {
    type: UPLOAD_AVATAR_FAILED,
    value: respond,
  };
};

export const SessionReducer = createReducer({
  isCheckingUser: true,
  currentLocation: { coords: { longitude: -122.4194, latitude: 37.7749 } },
  isLocationAuthed: false,
}, {
  [GET_CURRENT_USER](state, action) {
    return loop(
      { ...state, initStarted: true },
      Cmd.run(db.AsyncStorage.getCurrentUser, {
        successActionCreator: getCurrentUserSucceed,
        failActionCreator: getCurrentUserFailed,
      })
    );
  },
  [GET_CURRENT_USER_SUCCEED](state, action) {
    return {
      ...state,
      isLoggedIn: true,
      isCheckingUser: false,
      currentUser: action.value,
    };
  },
  [GET_CURRENT_USER_FAILED](state, action) {
    return {
      ...state,
      isLoggedIn: false,
      isCheckingUser: false,
    };
  },
  [LOGIN_USER](state, action) {
    return loop(
      { ...state, initStarted: true, isLoggingIn: action.strategy },
      Cmd.run(apis.user.login, {
        successActionCreator: loginUserSucceed,
        failActionCreator: loginUserFailed,
        args: [action.strategy, action.token],
      }),
    );
  },
  [LOGIN_USER_SUCCEED](state, action) {
    return {
      ...state,
      isLoggingIn: false,
      currentUser: action.currentUser,
      loginError: undefined,
    };
  },
  [LOGIN_USER_FAILED](state, action) {
    return {
      ...state,
      isLoggingIn: false,
      loginError: 'Login User Failed.'
    };
  },
  [REGISTER_USER](state, action) {
    return loop(
      { ...state, registerError: undefined, isRegistering: false },
      Cmd.run(apis.user.register, {
        successActionCreator: registerUserSucceed,
        failActionCreator: registerUserFailed,
        args: [action.email, action.password],
      })
    );
  },
  [REGISTER_USER_SUCCEED](state, action) {
    return { ...state, isRegistering: false, currentUser: action.currentUser };
  },
  [REGISTER_USER_FAILED](state, action) {
    return {
      ...state,
      isRegistering: false,
      registerError: 'Register User Failed.'
    };
  },
  [UPDATE_USER](state, action) {
    return loop(
      { ...state, isUpdating: true, updateError: undefined },
      Cmd.run(apis.user.update, {
        successActionCreator: updateUserSucceed,
        failActionCreator: updateUserFailed,
        args: [action.update, action.token],
      })
    );
  },
  [UPDATE_USER_SUCCEED](state, action) {
    return {
      ...state,
      isUpdating: false,
      currentUser: action.currentUser,
    };
  },
  [UPDATE_USER_FAILED](state, action) {
    return {
      ...state,
      isUpdating: false,
      updateError: action.error.data,
    };
  },
  [UPLOAD_AVATAR](state, action) {
    return loop(
      {
        ...state,
        isUploadingAvatar: true,
        uploadAvatarError: undefined
      },
      Cmd.run(apis.user.avatar, {
        successActionCreator: (response) =>
          uploadAvatarSucceed(response, action.callback),
        failActionCreator: (response) =>
          uploadAvatarFailed(response, action.callback),
        args: [action.image, action.token],
      })
    );
  },
  [UPLOAD_AVATAR_SUCCEED](state, action) {
    const currentUserWithAva = { ...state.currentUser };
    return {
      ...state,
      isUploadingAvatar: false,
      currentUser: {
        ...state.currentUser,
        avatar: action.ava,
      },
    };
  },
  [UPLOAD_AVATAR_FAILED](state, action) {
    return {
      ...state,
      isUploadingAvatar: false,
      uploadAvatarError: 'Register User Failed.'
    };
  },
  [LOGOUT_USER](state, action) {
    db.AsyncStorage.setCurrentUser('');
    return {
      state,
      isLoggedIn: false,
      isCheckingUser: false,
      currentUser: undefined,
    };
  },
  [SET_LOCATION_AUTH](state, action) {
    return {
      ...state,
      isLocationAuthed: action.isLocationAuthed,
    };
  },
  [SET_CURRENT_LOCATION](state, action) {
    return {
      ...state,
      currentLocation: action.loc,
    };
  },
  ['START_ONBOARDING'](state, action) {
    return Object.assign({}, state, {
      currentUser: action.currentUser,
      loginError: false,
      registerError: false,
    });
  },
  // Only for showing user pic after getCurrentUser
  ['USER_LOGGED_IN'](state, action) {
    return Object.assign({}, state, {
      isLoggedIn: true,
      isCheckingUser: false,
    });
  },
  ['SET_FILTER_LOCATION'](state, action) {
    return Object.assign({}, state, {
      filterLocation: action.loc,
    });
  },
  ['SET_MAIN_TAB'](state, action) {
    return Object.assign({}, state, {
      mainTab: action.i,
    });
  },
  ['SET_FILTER'](state, action) {
    return Object.assign({}, state, {
      filterLocation: action.filter.location,
      filter: {
        radius: action.filter.radius,
        price: action.filter.price,
        rating: action.filter.rating,
      },
    });
  },
});
