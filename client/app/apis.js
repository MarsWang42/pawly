import axios from 'axios';

// export const BASE_URL = 'http://localhost:3000/api/v1';
export const BASE_URL = 'https://pawly.herokuapp.com/api/v1';
export const AUTH_URL = `${BASE_URL}/user_token`;
export const USER_URL = `${BASE_URL}/users`;
export const USERNAME_URL = `${BASE_URL}/username`;
export const USER_SEARCH_URL = (keyword) => `${USER_URL}/search/${keyword}`;
export const USER_FOLLOW_URL = `${USER_URL}/follow`;
export const USER_UNFOLLOW_URL = `${USER_URL}/unfollow`;
export const FOLLOWING_LIST_URL = (userId) => `${USER_URL}/${userId}/following`;
export const FOLLOWER_LIST_URL = (userId) => `${USER_URL}/${userId}/followers`;
export const USER_DETAIL_URL = (userId) => `${USER_URL}/detail/${userId}`;
export const AVATAR_URL = `${USER_URL}/avatar`;

export const NOTIFICATION_URL = `${BASE_URL}/notifications`;
export const NOTIFICATION_READ_URL = (id) => `${BASE_URL}/notifications/read/${id}`;

export const PETS_URL = `${BASE_URL}/pets`;
export const PETS_SEARCH_URL = (keyword) => `${USER_URL}/pets/${keyword}`;
export const PET_DETAIL_URL = (petId) => `${PETS_URL}/${petId}`;
export const ADOPTION_URL = (id) => `${BASE_URL}/adoption/${id}`;
export const RECEIVED_ADOPTIONS_URL = `${BASE_URL}/adoptions/received`;

export const FEED_URL = page => `${USER_URL}/feed/${page}`;
export const PICTURE_URL = `${BASE_URL}/pictures`;
export const COMMENT_URL = `${BASE_URL}/comments`;
export const NEARBY_URL = `${BASE_URL}/places/nearby`;
export const PICTURE_LIKE_URL = `${PICTURE_URL}/like`;
export const PICTURE_UNLIKE_URL = `${PICTURE_URL}/unlike`;


export default {

  /* User APIs */
  user: {
    login: (strategy, token) =>
      axios({
        method: 'post',
        url: AUTH_URL,
        data: {
          ...token,
          strategy,
        }
      }),
    register: (email, password) =>
      axios({
        method: 'post',
        url: USER_URL,
        data: {
          email,
          password
        }
      }),
    update: (update, token) =>
      axios({
        method: 'patch',
        url: USER_URL,
        headers: { Authorization: token },
        data: update,
      }),
    detail: (id, token) =>
      axios({
        method: 'get',
        url: USER_DETAIL_URL(id),
        headers: {
          Authorization: token,
        },
      }),
    toggleFollow: (userId, type, token) =>
      axios({
        method: 'post',
        url: type === 'follow' ? USER_FOLLOW_URL : USER_UNFOLLOW_URL,
        headers: {
          Authorization: token,
        },
        data: { id: userId },
      }),
    search: (keyword, token) =>
      axios({
        method: 'get',
        url: USER_SEARCH_URL(keyword),
        headers: { Authorization: token },
      }),
    followingList: (id, token) =>
      axios({
        method: 'get',
        url: FOLLOWING_LIST_URL(id),
        headers: { Authorization: token },
      }),
    followerList: (id, token) =>
      axios({
        method: 'get',
        url: FOLLOWER_LIST_URL(id),
        headers: { Authorization: token },
      }),
    avatar: (image, token) =>
      axios({
        method: 'patch',
        url: AVATAR_URL,
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data',
        },
        data: image
      }),
    petsSearch: (keyword, token) =>
      axios({
        method: 'get',
        url: PETS_SEARCH_URL(keyword),
        headers: { Authorization: token },
      }),
    receivedAdoptions: (token) =>
      axios({
        method: 'get',
        url: RECEIVED_ADOPTIONS_URL,
        headers: { Authorization: token },
      }),
  },

  notification: {
    get: (token) =>
      axios({
        method: 'get',
        url: NOTIFICATION_URL,
        headers: { Authorization: token },
      }),
    read: (id, token) =>{
      return axios({
        method: 'get',
        url: NOTIFICATION_READ_URL(id),
        headers: { Authorization: token },
      })

    }
  },

  /* Pet APIs */
  pet: {
    create: (payload, token) =>
      axios({
        method: 'post',
        url: PETS_URL,
        headers: {
          Authorization: token,
        },
        data: payload,
      }),
    update: (payload, petId, token) =>
      axios({
        method: 'patch',
        url: `${PETS_URL}/${petId}`,
        headers: {
          Authorization: token,
        },
        data: payload,
      }),
    remove: (id, token) =>
      axios({
        method: 'delete',
        url: `${PETS_URL}/${id}`,
        headers: {
          Authorization: token,
        },
      }),
    detail: (id, token) =>
      axios({
        method: 'get',
        url: PET_DETAIL_URL(id),
        headers: {
          Authorization: token,
        },
      }),
    requestAdoption: (payload, petId, token) =>
      axios({
        method: 'post',
        url: ADOPTION_URL(petId),
        headers: {
          Authorization: token,
        },
        data: payload,
      }),
  },

  /* Picture APIs */
  picture: {
    create: (body, token) =>
      axios({
        method: 'post',
        url: PICTURE_URL,
        headers: { Authorization: token },
        data: body,
      }),
    detail: (id, token) =>
      axios({
        method: 'get',
        url: `${PICTURE_URL}/${id}`,
        headers: { Authorization: token },
      }),
    toggleLike: (picId, type, token) =>
      axios({
        method: 'post',
        url: type === 'like' ? PICTURE_LIKE_URL : PICTURE_UNLIKE_URL,
        headers: {
          Authorization: token,
        },
        data: { picId },
      }),
    comment: (pictureId, body, targetId, token) =>
      axios({
        method: 'post',
        url: COMMENT_URL,
        headers: {
          Authorization: token,
        },
        data: { pictureId, body, targetId },
      }),
    nearby: (latitude, longitude, radius, latitudeDelta, longitudeDelta, token) =>
      axios({
        method: 'post',
        url: NEARBY_URL,
        headers: {
          Authorization: token,
        },
        data: { latitude, longitude, radius, latitudeDelta, longitudeDelta },
      }),
    feed: (page, token) =>
      axios({
        method: 'get',
        url: FEED_URL(page),
        headers: {
          Authorization: token,
        },
      }),
  }
};
