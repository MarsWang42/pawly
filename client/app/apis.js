import axios from 'axios';

export const BASE_URL = 'http://localhost:3000/api/v1';
// const BASE_URL = 'https://peaceful-woodland-53096.herokuapp.com/api/v1'
export const AUTH_URL = `${BASE_URL}/user_token`;
export const USER_URL = `${BASE_URL}/users`;
export const USERNAME_URL = `${BASE_URL}/username`;
export const AVATAR_URL = `${BASE_URL}/user/avatar`;
export const PETS_URL = `${BASE_URL}/pets`;


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
  },
};
