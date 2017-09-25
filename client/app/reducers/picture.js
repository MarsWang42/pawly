import createReducer from '../helpers/createReducer';
import db from '../db';
import apis from '../apis';
import { fromJS, List } from 'immutable';
import { loop, Cmd } from 'redux-loop';

export const FETCH_FEED = 'FETCH_FEED';
export const FETCH_FEED_SUCCEED = 'FETCH_FEED_SUCCEED';
export const FETCH_FEED_FAILED = 'FETCH_FEED_FAILED';
export const TOGGLE_LIKE = 'TOGGLE_LIKE';
export const TOGGLE_LIKE_SUCCEED = 'TOGGLE_LIKE_SUCCEED';
export const TOGGLE_LIKE_FAILED = 'TOGGLE_LIKE_FAILED';

const getFeedSucceed = (respond) => {
  return {
    type: FETCH_FEED_SUCCEED,
    followingList: respond.data.feeds,
  };
};

const getFeedFailed = () => ({
  type: FETCH_FEED_FAILED,
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
        successActionCreator: getFeedSucceed,
        failActionCreator: getFeedFailed,
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
