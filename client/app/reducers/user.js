import createReducer from '../helpers/createReducer';
import db from '../db';
import apis from '../apis';
import * as pictureActions from './picture';
import { fromJS, List, Map } from 'immutable';
import { loop, Cmd } from 'redux-loop';

export const FETCH_USER_DETAIL = 'FETCH_USER_DETAIL';
export const FETCH_USER_DETAIL_SUCCEED = 'FETCH_USER_DETAIL_SUCCEED';
export const FETCH_USER_DETAIL_FAILED = 'FETCH_USER_DETAIL_FAILED';
export const SEARCH_USERS = 'SEARCH_USERS';
export const SEARCH_USERS_SUCCEED = 'SEARCH_USERS_SUCCEED';
export const SEARCH_USERS_FAILED = 'SEARCH_USERS_FAILED';
export const CLEAR_SEARCH_USERS = 'CLEAR_SEARCH_USERS';
export const TOGGLE_USER_FOLLOW = 'TOGGLE_USER_FOLLOW';
export const TOGGLE_USER_FOLLOW_SUCCEED = 'TOGGLE_USER_FOLLOW_SUCCEED';
export const TOGGLE_USER_FOLLOW_FAILED = 'TOGGLE_USER_FOLLOW_FAILED';

const fetchUserDetailSucceed = (respond, action) => {
  return {
    type: FETCH_USER_DETAIL_SUCCEED,
    userDetail: respond.data,
  };
};

const fetchUserDetailFailed = () => ({
  type: FETCH_USER_DETAIL_FAILED,
});

const searchUsersSucceed = (respond) => {
  return {
    type: SEARCH_USERS_SUCCEED,
    userList: respond.data.users,
  };
};

const searchUsersFailed = () => ({
  type: SEARCH_USERS_FAILED,
});

const toggleUserFollowSucceed = (respond, { userId, callback }) => {
  callback && callback();
  return {
    type: TOGGLE_USER_FOLLOW_SUCCEED,
    followed: respond.data.followed,
    followers: respond.data.followers,
    userId,
  };
};

const toggleUserFollowFailed = () => ({
  type: TOGGLE_USER_FOLLOW_FAILED,
});

export const UserReducer = createReducer({
  userDetails: Map(),
  isFetchingFeed: false,
}, {
  [FETCH_USER_DETAIL](state, action) {
    return loop(
      { ...state, isFetchingUserDetail: true, fetchUserDetailError: undefined },
      Cmd.run(apis.user.detail, {
        successActionCreator: (respond) => fetchUserDetailSucceed(respond, action),
        failActionCreator: fetchUserDetailFailed,
        args: [action.id, action.token]
      })
    );
  },
  [FETCH_USER_DETAIL_SUCCEED](state, { userDetail }) {
    return {
      ...state,
      isFetchingUserDetail: false,
      userDetails: state.userDetails.set(userDetail.id, fromJS(userDetail)),
    };
  },
  [FETCH_USER_DETAIL_FAILED](state, action) {
    return {
      ...state,
      isFetchingUserDetail: false,
      fetchUserDetailError: 'Fetching failed.',
    };
  },
  [SEARCH_USERS](state, action) {
    return loop(
      { ...state, isSearchingUsers: true, searchUsersError: undefined },
      Cmd.run(apis.user.search, {
        successActionCreator: (respond) => searchUsersSucceed(respond, action),
        failActionCreator: searchUsersFailed,
        args: [action.keyword, action.token]
      })
    );
  },
  [SEARCH_USERS_SUCCEED](state, action) {
    return {
      ...state,
      isSearchingUsers: false,
      userList: action.userList,
    };
  },
  [SEARCH_USERS_FAILED](state, action) {
    return {
      ...state,
      isSearchingUsers: false,
      searchUsersError: 'Fetching failed.',
    };
  },
  [CLEAR_SEARCH_USERS](state, action) {
    return {
      ...state,
      userList: [],
    };
  },
  [TOGGLE_USER_FOLLOW](state, action) {
    return loop(
      { ...state, isTogglingUserFollow: true, toggleUserFollowError: undefined },
      Cmd.run(apis.user.toggleFollow, {
        successActionCreator: (response) => toggleUserFollowSucceed(response, action),
        failActionCreator: toggleUserFollowFailed,
        args: [action.userId, action.toggleType, action.token]
      })
    );
  },
  [TOGGLE_USER_FOLLOW_SUCCEED](state, { userId, followed, followers }) {
    const updatedUserDetails = state.userDetails
      .setIn([userId, 'followed'], followed)
      .setIn([userId, 'followers'], followers)
    ;
    return {
      ...state,
      userDetails: updatedUserDetails,
      isTogglingUserFollow: false,
    };
  },
  [TOGGLE_USER_FOLLOW_FAILED](state, action) {
    return {
      ...state,
      isTogglingUserFollow: false,
      toggleUserFollowError: 'Fetching failed.',
    };
  },
  [pictureActions.TOGGLE_PICTURE_LIKE_SUCCEED](state, { data }) {
    const updatedUserDetails = state.userDetails.setIn(
      [
        data.creator.id,
        'pictures',
        state.userDetails.getIn([data.creator.id, 'pictures']).findIndex(item =>
          item.get('pictureId') === data.pictureId)
      ],
      fromJS(data)
    );
    return {
      ...state,
      userDetails: updatedUserDetails,
    };
  },
});
