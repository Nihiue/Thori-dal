import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { getAccessToken, genUserToken } from '../utils';
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    auth: null,
    userInfo: null,
    serverInfo: null,
    recordsList: []
  },
  mutations: {
    updateAuth(state, data) {
      if (data) {
        state.auth = {
          name: data.name,
          password: data.password,
          token: genUserToken(data.name, data.password)
        };
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
    async bonjour({ commit }) {
      const resp = await axios.get('/api/bonjour');
      commit('updateServerInfo', {
        salt: resp.data.salt,
        delta: resp.data.date - Date.now()
      });
    },
    async fetchUserInfo({ commit, state }) {
      const resp = await axios.get('/api/users/' + state.auth.name);
      commit('updateUserInfo', resp.data);
    }
  }
});
axios.interceptors.request.use(function (config) {
  const state = store.state;
  if (state.auth && state.serverInfo) {
    if (!config.headers) {
      config.headers = {};
    }
    const serverTime = Date.now() + state.serverInfo.delta;
    const accessToken = getAccessToken(state.auth.token, state.serverInfo.salt, serverTime);
    config.headers['X-Thoridal-Auth'] = [encodeURIComponent(state.auth.name), accessToken, serverTime].join('&');
  }

  return config;
}, function (error) {
  return Promise.reject(error);
});
export default store;
