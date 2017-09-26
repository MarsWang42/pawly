import createReducer from '../helpers/createReducer';
import db from '../db';
import apis from '../apis';
import { fromJS, List, Map } from 'immutable';
import { loop, Cmd } from 'redux-loop';

export const FETCH_FEED = 'FETCH_FEED';
export const FETCH_FEED_SUCCEED = 'FETCH_FEED_SUCCEED';
export const FETCH_FEED_FAILED = 'FETCH_FEED_FAILED';
export const FETCH_USER_DETAIL = 'FETCH_USER_DETAIL';
export const FETCH_USER_DETAIL_SUCCEED = 'FETCH_USER_DETAIL_SUCCEED';
export const FETCH_USER_DETAIL_FAILED = 'FETCH_USER_DETAIL_FAILED';
export const TOGGLE_LIKE = 'TOGGLE_LIKE';
export const TOGGLE_LIKE_SUCCEED = 'TOGGLE_LIKE_SUCCEED';
export const TOGGLE_LIKE_FAILED = 'TOGGLE_LIKE_FAILED';

const fetchFeedSucceed = (respond) => {
  return {
    type: FETCH_FEED_SUCCEED,
    followingList: respond.data.feeds,
  };
};

const fetchFeedFailed = () => ({
  type: FETCH_FEED_FAILED,
});

const fetchUserDetailSucceed = (respond, action) => {
  return {
    type: FETCH_USER_DETAIL_SUCCEED,
    currentUser: action.currentUser,
    userDetail: respond.data,
  };
};

const fetchUserDetailFailed = () => ({
  type: FETCH_USER_DETAIL_FAILED,
});

const toggleLikeSucceed = (respond, { callback }) => {
  callback && callback();
  return {
    type: TOGGLE_LIKE_SUCCEED,
    data: respond.data,
  };
};

const toggleLikeFailed = () => ({
  type: TOGGLE_LIKE_FAILED,
});

export const PictureReducer = createReducer({
  followingList: List(),
  isFetchingFeed: false,
}, {
  [FETCH_FEED](state, action) {
    return loop(
      { ...state, isFetchingFeed: true, fetchFeedError: undefined },
      Cmd.run(apis.picture.feed, {
        successActionCreator: fetchFeedSucceed,
        failActionCreator: fetchFeedFailed,
        args: [action.token]
      })
    );
  },
  [FETCH_FEED_SUCCEED](state, action) {
    return {
      ...state,
      isFetchingFeed: false,
      followingList: fromJS(action.followingList),
    };
  },
  [FETCH_FEED_FAILED](state, action) {
    return {
      ...state,
      isFetchingFeed: false,
      fetchFeedError: 'Fetching failed.',
    };
  },
  [FETCH_USER_DETAIL](state, action) {
    return loop(
      { ...state, isFetchingUserDetail: true, fetchUserDetailError: undefined },
      Cmd.run(apis.picture.userDetail, {
        successActionCreator: (respond) => fetchUserDetailSucceed(respond, action),
        failActionCreator: fetchUserDetailFailed,
        args: [action.id, action.token]
      })
    );
  },
  [FETCH_USER_DETAIL_SUCCEED](state, action) {
    if (action.currentUser) {
      return {
        ...state,
        isFetchingUserDetail: false,
        currentUserDetail: fromJS(action.userDetail),
      };
    }
    return {
      ...state,
      isFetchingUserDetail: false,
      userDetail: fromJS(action.userDetail),
    };
  },
  [FETCH_USER_DETAIL_FAILED](state, action) {
    return {
      ...state,
      isFetchingUserDetail: false,
      fetchUserDetailError: 'Fetching failed.',
    };
  },
  [TOGGLE_LIKE](state, action) {
    return loop(
      { ...state, isTogglingLike: true, toggleLikeError: undefined },
      Cmd.run(apis.picture.toggleLike, {
        successActionCreator: (response) => toggleLikeSucceed(response, action),
        failActionCreator: toggleLikeFailed,
        args: [action.picId, action.toggleType, action.token]
      })
    );
  },
  [TOGGLE_LIKE_SUCCEED](state, action) {
    const updatedFollowingList = state.followingList.update(
      state.followingList.findIndex(item =>
        item.get('pictureId') === action.data.pictureId),
      item => fromJS(action.data)
    );
    return {
      ...state,
      followingList: updatedFollowingList,
      isTogglingLike: false,
    };
  },
  [TOGGLE_LIKE_FAILED](state, action) {
    return {
      ...state,
      isTogglingLike: false,
      toggleLikeError: 'Fetching failed.',
    };
  },
});
