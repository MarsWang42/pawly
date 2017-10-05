import createReducer from '../helpers/createReducer';
import db from '../db';
import apis from '../apis';
import { fromJS, List, Map } from 'immutable';
import { loop, Cmd } from 'redux-loop';

export const CREATE_PICTURE = 'CREATE_PICTURE';
export const CREATE_PICTURE_SUCCEED = 'CREATE_PICTURE_SUCCEED';
export const CREATE_PICTURE_FAILED = 'CREATE_PICTURE_FAILED';
export const FETCH_PICTURE_DETAIL = 'FETCH_PICTURE_DETAIL';
export const FETCH_PICTURE_DETAIL_SUCCEED = 'FETCH_PICTURE_DETAIL_SUCCEED';
export const FETCH_PICTURE_DETAIL_FAILED = 'FETCH_PICTURE_DETAIL_FAILED';
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

const fetchPictureDetailSucceed = (respond, action) => {
  return {
    type: FETCH_PICTURE_DETAIL_SUCCEED,
    pictureDetail: respond.data,
  };
};

const fetchPictureDetailFailed = () => ({
  type: FETCH_PICTURE_DETAIL_FAILED,
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
  pictureDetails: Map(),
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
  [FETCH_PICTURE_DETAIL](state, action) {
    return loop(
      { ...state, isFetchingPictureDetail: true, fetchPictureDetailError: undefined },
      Cmd.run(apis.picture.detail, {
        successActionCreator: (respond) => fetchPictureDetailSucceed(respond, action),
        failActionCreator: fetchPictureDetailFailed,
        args: [action.id, action.token]
      })
    );
  },
  [FETCH_PICTURE_DETAIL_SUCCEED](state, { pictureDetail }) {
    return {
      ...state,
      isFetchingPictureDetail: false,
      pictureDetails: state.pictureDetails.set(pictureDetail.pictureId, fromJS(pictureDetail)),
    };
  },
  [FETCH_PICTURE_DETAIL_FAILED](state, action) {
    return {
      ...state,
      isFetchingPictureDetail: false,
      fetchPictureDetailError: 'Fetching failed.',
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
    const followingId = state.followingList.findIndex(item =>
        item.get('pictureId') === action.data.pictureId);
    const nearbyId = state.nearbyList.findIndex(item =>
        item.get('pictureId') === action.data.pictureId);

    const updatedFollowingList = followingId !== -1 ? state.followingList.update(
      followingId, item => fromJS(action.data)
    ) : state.followingList;

    const updatedNearbyList = nearbyId !== -1 ? state.nearbyList.update(
      nearbyId, item => fromJS(action.data)
    ) : state.nearbyList;

    return {
      ...state,
      followingList: updatedFollowingList,
      nearbyList: updatedNearbyList,
      isTogglingLike: false,
      pictureDetails: state.pictureDetails.set(action.data.pictureId, fromJS(action.data)),
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
