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
export const COMMENT_PICTURE = 'COMMENT_PICTURE';
export const COMMENT_PICTURE_SUCCEED = 'COMMENT_PICTURE_SUCCEED';
export const COMMENT_PICTURE_FAILED = 'COMMENT_PICTURE_FAILED';
export const FETCH_FEED = 'FETCH_FEED';
export const FETCH_FEED_SUCCEED = 'FETCH_FEED_SUCCEED';
export const FETCH_FEED_FAILED = 'FETCH_FEED_FAILED';
export const FETCH_NEARBY = 'FETCH_NEARBY';
export const FETCH_NEARBY_SUCCEED = 'FETCH_NEARBY_SUCCEED';
export const FETCH_NEARBY_FAILED = 'FETCH_NEARBY_FAILED';
export const TOGGLE_PICTURE_LIKE = 'TOGGLE_PICTURE_LIKE';
export const TOGGLE_PICTURE_LIKE_SUCCEED = 'TOGGLE_PICTURE_LIKE_SUCCEED';
export const TOGGLE_PICTURE_LIKE_FAILED = 'TOGGLE_PICTURE_LIKE_FAILED';

const createPictureSucceed = (response, action) => {
  action.callback && action.callback();
  return {
    type: CREATE_PICTURE_SUCCEED,
    followingList: response.data.feeds,
  };
};

const createPictureFailed = () => ({
  type: CREATE_PICTURE_FAILED,
});

const fetchPictureDetailSucceed = (response, action) => {
  return {
    type: FETCH_PICTURE_DETAIL_SUCCEED,
    pictureDetail: response.data,
  };
};

const fetchPictureDetailFailed = () => ({
  type: FETCH_PICTURE_DETAIL_FAILED,
});

const commentPictureSucceed = (response, action) => {
  action.callback && action.callback();
  return {
    type: COMMENT_PICTURE_SUCCEED,
    comment: response.data,
    pictureId: action.pictureId,
  };
};

const commentPictureFailed = () => ({
  type: COMMENT_PICTURE_FAILED,
});

const fetchFeedSucceed = (response, initialize) => {
  return {
    type: FETCH_FEED_SUCCEED,
    followingList: response.data.feeds,
    initialize,
  };
};

const fetchFeedFailed = () => ({
  type: FETCH_FEED_FAILED,
});

const fetchNearbySucceed = (response) => {
  return {
    type: FETCH_NEARBY_SUCCEED,
    placeList: response.data.places,
  };
};

const fetchNearbyFailed = () => ({
  type: FETCH_NEARBY_FAILED,
});

const toggleLikeSucceed = (response, { callback }) => {
  callback && callback();
  return {
    type: TOGGLE_PICTURE_LIKE_SUCCEED,
    data: response.data,
  };
};

const toggleLikeFailed = () => ({
  type: TOGGLE_PICTURE_LIKE_FAILED,
});

export const PictureReducer = createReducer({
  followingList: List(),
  followingListPage: 1,
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
        successActionCreator: (response) => fetchPictureDetailSucceed(response, action),
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
  [COMMENT_PICTURE](state, action) {
    return loop(
      { ...state, isCommentingPicture: true, commentPictureError: undefined },
      Cmd.run(apis.picture.comment, {
        successActionCreator: (response) => commentPictureSucceed(response, action),
        failActionCreator: commentPictureFailed,
        args: [action.pictureId, action.body, action.targetId, action.token]
      })
    );
  },
  [COMMENT_PICTURE_SUCCEED](state, action) {
    const updatedPictureDetails = state.pictureDetails.updateIn(
      [
        action.pictureId,
        'comments',
      ],
      arr => arr.push(fromJS(action.comment))
    );
    return {
      ...state,
      isCommentingPicture: false,
      pictureDetails: updatedPictureDetails,
    };
  },
  [COMMENT_PICTURE_FAILED](state, action) {
    return {
      ...state,
      isCommentingPicture: false,
      commentPictureError: 'Comment failed.',
    };
  },
  [FETCH_FEED](state, action) {
    // If initializing, then reset page.
    if (action.initial) {
      return loop(
        { ...state, followingListPage: 1, isFetchingFeed: true, fetchFeedError: undefined },
        Cmd.run(apis.picture.feed, {
          successActionCreator: (response) => fetchFeedSucceed(response, true),
          failActionCreator: fetchFeedFailed,
          args: [1, action.token]
        })
      );
    }
    return loop(
      { ...state, isFetchingMoreFeed: true, fetchFeedError: undefined },
      Cmd.run(apis.picture.feed, {
          successActionCreator: (response) => fetchFeedSucceed(response, false),
        failActionCreator: fetchFeedFailed,
        args: [state.followingListPage, action.token]
      })
    );
  },
  [FETCH_FEED_SUCCEED](state, action) {
    let updatedFollowingList;
    if (action.initialize) {
      updatedFollowingList = fromJS(action.followingList);
    } else {
      updatedFollowingList = state.followingList;
      // Get rid of the duplicated feeds
      if (action.followingList.length > 0) {
        let duplicatedFollowingId = updatedFollowingList.findIndex(o =>
          (new Date(o.get('timestamp'))).getTime() <= (new Date(action.followingList[0].timestamp)).getTime()
        );
        if (duplicatedFollowingId !== -1) {
          updatedFollowingList = updatedFollowingList.slice(0, duplicatedFollowingId);
        }
      }
      updatedFollowingList = updatedFollowingList.concat(fromJS(action.followingList));
    }
    return {
      ...state,
      isFetchingFeed: false,
      isFetchingMoreFeed: false,
      followingList: fromJS(updatedFollowingList),
      followingListPage: state.followingListPage + 1,
    };
  },
  [FETCH_FEED_FAILED](state, action) {
    return {
      ...state,
      isFetchingFeed: false,
      isFetchingMoreFeed: false,
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
