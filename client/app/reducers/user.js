import createReducer from '../helpers/createReducer';
import apis from '../apis';
import * as pictureActions from './picture';
import { fromJS, List, Map } from 'immutable';
import { loop, Cmd } from 'redux-loop';

export const FETCH_USER_DETAIL = 'FETCH_USER_DETAIL';
export const FETCH_USER_DETAIL_SUCCEED = 'FETCH_USER_DETAIL_SUCCEED';
export const FETCH_USER_DETAIL_FAILED = 'FETCH_USER_DETAIL_FAILED';
export const FETCH_FOLLOWING_LIST = 'FETCH_FOLLOWING_LIST';
export const FETCH_FOLLOWING_LIST_SUCCEED = 'FETCH_FOLLOWING_LIST_SUCCEED';
export const FETCH_FOLLOWING_LIST_FAILED = 'FETCH_FOLLOWING_LIST_FAILED';
export const FETCH_FOLLOWER_LIST = 'FETCH_FOLLOWER_LIST';
export const FETCH_FOLLOWER_LIST_SUCCEED = 'FETCH_FOLLOWER_LIST_SUCCEED';
export const FETCH_FOLLOWER_LIST_FAILED = 'FETCH_FOLLOWER_LIST_FAILED';
export const SEARCH_USERS = 'SEARCH_USERS';
export const SEARCH_USERS_SUCCEED = 'SEARCH_USERS_SUCCEED';
export const SEARCH_USERS_FAILED = 'SEARCH_USERS_FAILED';
export const CLEAR_SEARCH_USERS = 'CLEAR_SEARCH_USERS';
export const TOGGLE_USER_FOLLOW = 'TOGGLE_USER_FOLLOW';
export const TOGGLE_USER_FOLLOW_SUCCEED = 'TOGGLE_USER_FOLLOW_SUCCEED';
export const TOGGLE_USER_FOLLOW_FAILED = 'TOGGLE_USER_FOLLOW_FAILED';
export const CREATE_PET_SUCCEED = 'CREATE_PET_SUCCEED';
export const EDIT_PET_SUCCEED = 'EDIT_PET_SUCCEED';
export const FETCH_RECEIVED_ADOPTIONS = 'FETCH_RECEIVED_ADOPTIONS';
export const FETCH_RECEIVED_ADOPTIONS_SUCCEED = 'FETCH_RECEIVED_ADOPTIONS_SUCCEED';
export const FETCH_RECEIVED_ADOPTIONS_FAILED = 'FETCH_RECEIVED_ADOPTIONS_FAILED';

const fetchUserDetailSucceed = (respond, action) => {
  return {
    type: FETCH_USER_DETAIL_SUCCEED,
    userDetail: respond.data,
  };
};

const fetchUserDetailFailed = () => ({
  type: FETCH_USER_DETAIL_FAILED,
});

const fetchFollowingListSucceed = (respond, action) => {
  return {
    type: FETCH_FOLLOWING_LIST_SUCCEED,
    followingList: respond.data.users,
    userId: action.id,
  };
};

const fetchFollowingListFailed = () => ({
  type: FETCH_FOLLOWING_LIST_FAILED,
});

const fetchFollowerListSucceed = (respond, action) => {
  return {
    type: FETCH_FOLLOWER_LIST_SUCCEED,
    followerList: respond.data.users,
    userId: action.id,
  };
};

const fetchFollowerListFailed = () => ({
  type: FETCH_FOLLOWER_LIST_FAILED,
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
    followerLength: respond.data.followerLength,
    followingLength: respond.data.followingLength,
    currentUserId: respond.data.currentUserId,
    userId,
  };
};

const toggleUserFollowFailed = () => ({
  type: TOGGLE_USER_FOLLOW_FAILED,
});

const fetchReceivedAdoptionsSucceed = (respond, action) => {
  return {
    type: FETCH_RECEIVED_ADOPTIONS_SUCCEED,
    adoptionRequests: respond.data.adoptionRequests,
  };
};

const fetchReceivedAdoptionsFailed = () => ({
  type: FETCH_RECEIVED_ADOPTIONS_FAILED,
});

export const UserReducer = createReducer({
  userList: List(),
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
  [FETCH_FOLLOWING_LIST](state, action) {
    return loop(
      { ...state, isFetchingFollowingList: true, fetchFollowingListError: undefined },
      Cmd.run(apis.user.followingList, {
        successActionCreator: (respond) => fetchFollowingListSucceed(respond, action),
        failActionCreator: fetchFollowingListFailed,
        args: [action.id, action.token]
      })
    );
  },
  [FETCH_FOLLOWING_LIST_SUCCEED](state, { userId, followingList }) {
    return {
      ...state,
      isFetchingFollowingList: false,
      userDetails: state.userDetails.setIn(
        [userId, 'following'], fromJS(followingList)
      ),
    };
  },
  [FETCH_FOLLOWING_LIST_FAILED](state, action) {
    return {
      ...state,
      isFetchingFollowingList: false,
      fetchUserDetailError: 'Fetching failed.',
    };
  },
  [FETCH_FOLLOWER_LIST](state, action) {
    return loop(
      { ...state, isFetchingFollowerList: true, fetchFollowerListError: undefined },
      Cmd.run(apis.user.followerList, {
        successActionCreator: (respond) => fetchFollowerListSucceed(respond, action),
        failActionCreator: fetchFollowerListFailed,
        args: [action.id, action.token]
      })
    );
  },
  [FETCH_FOLLOWER_LIST_SUCCEED](state, { userId, followerList }) {
    return {
      ...state,
      isFetchingFollowerList: false,
      userDetails: state.userDetails.setIn(
        [userId, 'followers'], fromJS(followerList)
      ),
    };
  },
  [FETCH_FOLLOWER_LIST_FAILED](state, action) {
    return {
      ...state,
      isFetchingFollowerList: false,
      fetchFollowerListError: 'Fetching failed.',
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
      userList: fromJS(action.userList),
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
      userList: List(),
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
  [TOGGLE_USER_FOLLOW_SUCCEED](state, { currentUserId, userId, followed, followerLength, followingLength }) {
    const updatedUserDetails = state.userDetails
      .setIn([userId, 'followed'], followed)
      .setIn([currentUserId, 'followingLength'], followingLength)
      .setIn([userId, 'followerLength'], followerLength)
    ;
    const updatedUserList = state.userList
      .setIn(
        [state.userList.findIndex(item => item.get('id') === userId), 'followed'],
        followed,
      );

    return {
      ...state,
      userDetails: updatedUserDetails,
      userList: updatedUserList,
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
  [CREATE_PET_SUCCEED](state, { pet }) {
    const updatedUserDetails = state.userDetails.updateIn(
      [
        pet.ownerId,
        'pets',
      ],
      arr => arr.push(fromJS(pet))
    );
    return {
      ...state,
      userDetails: updatedUserDetails,
    };
  },
  [EDIT_PET_SUCCEED](state, { pet }) {
    const updatedPetIndex = state.userDetails.getIn([pet.ownerId, 'pets'])
      .findIndex(p => p.id === pet.id);
    const updatedUserDetails = state.userDetails.setIn(
      [
        pet.ownerId,
        'pets',
        updatedPetIndex,
      ],
      fromJS(pet)
    );
    return {
      ...state,
      userDetails: updatedUserDetails,
    };
  },
  [FETCH_RECEIVED_ADOPTIONS](state, action) {
    return loop(
      { ...state, isFetchingReceivedAdoptions: true, fetchReceivedAdoptionsError: undefined },
      Cmd.run(apis.user.receivedAdoptions, {
        successActionCreator: (respond) => fetchReceivedAdoptionsSucceed(respond, action),
        failActionCreator: fetchReceivedAdoptionsFailed,
        args: [action.token]
      })
    );
  },
  [FETCH_RECEIVED_ADOPTIONS_SUCCEED](state, action) {
    return {
      ...state,
      isFetchingReceivedAdoptions: false,
      receivedRequests: action.adoptionRequests
    };
  },
  [FETCH_RECEIVED_ADOPTIONS_FAILED](state, action) {
    return {
      ...state,
      isFetchingReceivedAdoptions: false,
      fetchReceivedAdoptionsError: 'Fetching failed.',
    };
  },
  [pictureActions.TOGGLE_PICTURE_LIKE_SUCCEED](state, { data }) {
    if (state.userDetails.get(data.creator.id)) {
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
    }
    return state;
  },
});
