// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';

import ElementUI from 'element-ui';
import './styles/theme/index.css';
import './styles/base.scss';

import store from './store/index.js';
import App from './App';
import router from './router';
import './utils/directives';
import './utils/filter';

Vue.use(ElementUI);

Vue.config.productionTip = false;

/* eslint-disable no-new */
const RootAppConstructor = Vue.extend(App);

new RootAppConstructor({
  el: '#app',
  store,
  router
});
