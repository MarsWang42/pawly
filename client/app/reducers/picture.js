import createReducer from '../helpers/createReducer';
import db from '../db';
import apis from '../apis';
import { fromJS, List, Map } from 'immutable';
import { loop, Cmd } from 'redux-loop';

export const CREATE_PICTURE = 'CREATE_PICTURE';
export const CREATE_PICTURE_SUCCEED = 'CREATE_PICTURE_SUCCEED';
export const CREATE_PICTURE_FAILED = 'CREATE_PICTURE_FAILED';
export const FETCH_FEED = 'FETCH_FEED';
export const FETCH_FEED_SUCCEED = 'FETCH_FEED_SUCCEED';
export const FETCH_FEED_FAILED = 'FETCH_FEED_FAILED';
export const FETCH_NEARBY = 'FETCH_NEARBY';
export const FETCH_NEARBY_SUCCEED = 'FETCH_NEARBY_SUCCEED';
export const FETCH_NEARBY_FAILED = 'FETCH_NEARBY_FAILED';
export const TOGGLE_PICTURE_LIKE = 'TOGGLE_PICTURE_LIKE';
export const TOGGLE_PICTURE_LIKE_SUCCEED = 'TOGGLE_PICTURE_LIKE_SUCCEED';
export const TOGGLE_PICTURE_LIKE_FAILED = 'TOGGLE_PICTURE_LIKE_FAILED';

const createPictureSucceed = (respond, action) => {
  action.callback && action.callback();
  return {
    type: CREATE_PICTURE_SUCCEED,
    followingList: respond.data.feeds,
  };
};

const createPictureFailed = () => ({
  type: CREATE_PICTURE_FAILED,
});

const fetchFeedSucceed = (respond) => {
  return {
    type: FETCH_FEED_SUCCEED,
    followingList: respond.data.feeds,
  };
};

const fetchFeedFailed = () => ({
  type: FETCH_FEED_FAILED,
});

const fetchNearbySucceed = (respond) => {
  return {
    type: FETCH_NEARBY_SUCCEED,
    placeList: respond.data.places,
  };
};

const fetchNearbyFailed = () => ({
  type: FETCH_NEARBY_FAILED,
});

const toggleLikeSucceed = (respond, { callback }) => {
  callback && callback();
  return {
    type: TOGGLE_PICTURE_LIKE_SUCCEED,
    data: respond.data,
  };
};

const toggleLikeFailed = () => ({
  type: TOGGLE_PICTURE_LIKE_FAILED,
});

export const PictureReducer = createReducer({
  followingList: List(),
  nearbyList: List(),
  placeList: List(),
  isFetchingFeed: false,
}, {
  [CREATE_PICTURE](state, action) {
    return loop(
      { ...state, isCreatingPicture: true, createPictureError: undefined },
      Cmd.run(apis.picture.create, {
        successActionCreator: response => createPictureSucceed(response, action),
        failActionCreator: createPictureFailed,
        args: [action.body, action.token]
      })
    );
  },
  [CREATE_PICTURE_SUCCEED](state, action) {
    return {
      ...state,
      isCreatingPicture: false,
    };
  },
  [CREATE_PICTURE_FAILED](state, action) {
    return {
      ...state,
      isCreatingPicture: false,
      createPictureError: 'Creating failed.',
    };
  },
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
  [FETCH_NEARBY](state, action) {
    return loop(
      { ...state, isFetchingNearby: true, fetchNearbyError: undefined },
      Cmd.run(apis.picture.nearby, {
        successActionCreator: fetchNearbySucceed,
        failActionCreator: fetchNearbyFailed,
        args: [action.latitude, action.longitude, action.radius, action.token]
      })
    );
  },
  [FETCH_NEARBY_SUCCEED](state, action) {
    const nearbyList = action.placeList.reduce((acc, cur) =>
      [...acc, ...cur.pictures], []);
    return {
      ...state,
      isFetchingNearby: false,
      placeList: fromJS(action.placeList),
      nearbyList: fromJS(nearbyList),
    };
  },
  [FETCH_NEARBY_FAILED](state, action) {
    return {
      ...state,
      isFetchingNearby: false,
      fetchNearbyError: 'Fetching failed.',
    };
  },
  [TOGGLE_PICTURE_LIKE](state, action) {
    return loop(
      { ...state, isTogglingLike: true, toggleLikeError: undefined },
      Cmd.run(apis.picture.toggleLike, {
        successActionCreator: (response) => toggleLikeSucceed(response, action),
        failActionCreator: toggleLikeFailed,
        args: [action.picId, action.toggleType, action.token]
      })
    );
  },
  [TOGGLE_PICTURE_LIKE_SUCCEED](state, action) {
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
  [TOGGLE_PICTURE_LIKE_FAILED](state, action) {
    return {
      ...state,
      isTogglingLike: false,
      toggleLikeError: 'Fetching failed.',
    };
  },
});
