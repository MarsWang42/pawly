import createReducer from '../helpers/createReducer';
import db from '../db';
import apis from '../apis';
import * as userActions from './user';
import { fromJS, Map } from 'immutable';
import { loop, Cmd } from 'redux-loop';

export const FETCH_PET_DETAIL = 'FETCH_PET_DETAIL';
export const FETCH_PET_DETAIL_SUCCEED = 'FETCH_PET_DETAIL_SUCCEED';
export const FETCH_PET_DETAIL_FAILED = 'FETCH_PET_DETAIL_FAILED';
export const CREATE_PET = 'CREATE_PET';
export const CREATE_PET_SUCCEED = 'CREATE_PET_SUCCEED';
export const CREATE_PET_FAILED = 'CREATE_PET_FAILED';
export const EDIT_PET = 'EDIT_PET';
export const EDIT_PET_SUCCEED = 'EDIT_PET_SUCCEED';
export const EDIT_PET_FAILED = 'EDIT_PET_FAILED';
export const DELETE_PET = 'DELETE_PET';
export const DELETE_PET_SUCCEED = 'DELETE_PET_SUCCEED';
export const DELETE_PET_FAILED = 'DELETE_PET_FAILED';

const fetchPetDetailSucceed = (response, action) => {
  return {
    type: FETCH_PET_DETAIL_SUCCEED,
    petDetail: response.data,
  };
};

const fetchPetDetailFailed = () => ({
  type: FETCH_PET_DETAIL_FAILED,
});

const createPetSucceed = (response, action) => {
  action.callback && action.callback();
  return {
    type: CREATE_PET_SUCCEED,
    pet: response.data,
  };
};

const createPetFailed = () => ({
  type: CREATE_PET_FAILED,
});

const editPetSucceed = (response, action) => {
  action.callback && action.callback();
  return {
    type: EDIT_PET_SUCCEED,
    pet: response.data,
  };
};

const editPetFailed = () => ({
  type: EDIT_PET_FAILED,
});

const deletePetSucceed = (response, action) => {
  action.callback && action.callback();
  return {
    type: DELETE_PET_SUCCEED,
    token: action.token,
    userId: response.data.userId
  };
};

const deletePetFailed = () => ({
  type: DELETE_PET_FAILED,
});

export const PetReducer = createReducer({
  petDetails: Map(),
}, {
  [FETCH_PET_DETAIL](state, action) {
    return loop(
      { ...state, isFetchingPetDetail: true, fetchPetDetailError: undefined },
      Cmd.run(apis.pet.detail, {
        successActionCreator: (response) => fetchPetDetailSucceed(response, action),
        failActionCreator: fetchPetDetailFailed,
        args: [action.id, action.token]
      })
    );
  },
  [FETCH_PET_DETAIL_SUCCEED](state, { petDetail }) {
    return {
      ...state,
      isFetchingPetDetail: false,
      petDetails: state.petDetails.set(petDetail.id, fromJS(petDetail)),
    };
  },
  [FETCH_PET_DETAIL_FAILED](state, action) {
    return {
      ...state,
      isFetchingPetDetail: false,
      fetchPetDetailError: 'Fetching failed.',
    };
  },
  [CREATE_PET](state, action) {
    return loop(
      { ...state, isCreatingPet: true, createPetError: undefined },
      Cmd.run(apis.pet.create, {
        successActionCreator: (response) => createPetSucceed(response, action),
        failActionCreator: createPetFailed,
        args: [action.payload, action.token]
      })
    );
  },
  [CREATE_PET_SUCCEED](state) {
    return {
      ...state,
      isCreatingPet: false,
    };
  },
  [CREATE_PET_FAILED](state, action) {
    return {
      ...state,
      isCreatingPet: false,
      createPetError: 'Create failed.',
    };
  },
  [EDIT_PET](state, action) {
    return loop(
      { ...state, isEditingPet: true, editPetError: undefined },
      Cmd.run(apis.pet.update, {
        successActionCreator: (response) => editPetSucceed(response, action),
        failActionCreator: editPetFailed,
        args: [action.payload, action.petId, action.token]
      })
    );
  },
  [EDIT_PET_SUCCEED](state) {
    return {
      ...state,
      isEditingPet: false,
    };
  },
  [EDIT_PET_FAILED](state, action) {
    return {
      ...state,
      isEditingPet: false,
      editPetError: 'Edit failed.',
    };
  },
  [DELETE_PET](state, action) {
    return loop(
      { ...state, isDeletingPet: true, deletePetError: undefined },
      Cmd.run(apis.pet.remove, {
        successActionCreator: (response) => deletePetSucceed(response, action),
        failActionCreator: deletePetFailed,
        args: [action.id, action.token]
      })
    );
  },
  [DELETE_PET_SUCCEED](state, action) {
    return loop(
      {
        ...state,
        isDeletingPet: false,
      },
      Cmd.action({
        type: userActions.FETCH_USER_DETAIL,
        id: action.userId,
        token: action.token,
      }),
    );
  },
  [DELETE_PET_FAILED](state, action) {
    return {
      ...state,
      isDeletingPet: false,
      deletePetError: 'Create failed.',
    };
  },
});
