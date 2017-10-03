import createReducer from '../helpers/createReducer';
import db from '../db';
import apis from '../apis';
import * as pictureActions from './picture';
import { fromJS, List, Map } from 'immutable';
import { loop, Cmd } from 'redux-loop';

export const FETCH_PET_DETAIL = 'FETCH_PET_DETAIL';
export const FETCH_PET_DETAIL_SUCCEED = 'FETCH_PET_DETAIL_SUCCEED';
export const FETCH_PET_DETAIL_FAILED = 'FETCH_PET_DETAIL_FAILED';

const fetchPetDetailSucceed = (respond, action) => {
  return {
    type: FETCH_PET_DETAIL_SUCCEED,
    petDetail: respond.data,
  };
};

const fetchPetDetailFailed = () => ({
  type: FETCH_PET_DETAIL_FAILED,
});

export const PetReducer = createReducer({
  petDetails: Map(),
}, {
  [FETCH_PET_DETAIL](state, action) {
    return loop(
      { ...state, isFetchingPetDetail: true, fetchPetDetailError: undefined },
      Cmd.run(apis.pet.detail, {
        successActionCreator: (respond) => fetchPetDetailSucceed(respond, action),
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
});
