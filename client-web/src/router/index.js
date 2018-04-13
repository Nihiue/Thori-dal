import Vue from 'vue';
import Router from 'vue-router';
// import HelloWorld from '@/components/HelloWorld';
import loginView from '@/pages/login';
import listView from '@/pages/list';
Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: loginView
    }, {
      path: '/list',
      name: 'list',
      component: listView
    }
  ]
});
