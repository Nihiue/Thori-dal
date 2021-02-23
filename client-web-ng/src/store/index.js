
import axios from 'axios';
import { createStore } from 'vuex'
import { getAccessToken, genUserToken } from '../utils/index';
import cipher from '../utils/cipher';

const store = createStore({
  state: {
    auth: null,
    userInfo: null,
    serverInfo: null,
    recordsList: []
  },
  mutations: {
    updateAuthToken(state, data) {
      if (state.auth) {
        state.auth.token = data;
      }
    },
    updateAuth(state, data) {
      if (data) {
        state.auth = data;
      } else {
        state.auth = null;
      }
    },
    updateUserInfo(state, data) {
      state.userInfo = data;
    },
    updateServerInfo(state, data) {
      state.serverInfo = data;
    }
  },
  actions: {
    async login({ commit, dispatch, state }, { name, password }) {
      try {
        const token = await genUserToken(name, password);
        commit('updateAuth', {
          token,
          name
        });
        await dispatch('fetchUserInfo', name);
        const auth = {
          ok: true,
          token,
          name
        };
        auth._decryptedKey = await cipher.decryptText(state.userInfo.Key.Data, password, state.userInfo.Key.IV, true);
        commit('updateAuth', auth);
        return true;
      } catch (e) {
        commit('updateAuth', null);
        return false;
      }
    },
    async bonjour({ commit }) {
      const resp = await axios.get('/api/bonjour');
      commit('updateServerInfo', {
        salt: resp.data.salt,
        delta: resp.data.date - Date.now()
      });
    },
    async fetchUserInfo({ commit, state }, name) {
      const resp = await axios.get('/api/users/' + name);
      commit('updateUserInfo', resp.data);
    }
  },
  getters: {
    readyToLogin(state) {
      return Boolean(state.serverInfo);
    }
  }
});

axios.interceptors.request.use(async function (config) {
  const state = store.state;
  if (state.auth && state.serverInfo) {
    if (!config.headers) {
      config.headers = {};
    }
    const serverTime = Date.now() + state.serverInfo.delta;
    const accessToken = await getAccessToken(state.auth.token, state.serverInfo.salt, serverTime);
    config.headers['X-Thoridal-Auth'] = [encodeURIComponent(state.auth.name), accessToken, serverTime].join('&');
  }

  return config;
}, function (error) {
  return Promise.reject(error);
});

export default store;
