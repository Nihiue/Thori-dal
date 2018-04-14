import Vue from 'vue';
import Router from 'vue-router';
// import HelloWorld from '@/components/HelloWorld';
import loginView from '@/pages/login';
import listView from '@/pages/list';
import store from '../store';
Vue.use(Router);
const router = new Router({
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
    }, {
      path: '*',
      redirect: '/'
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (store.state.userInfo && to.name === 'login') {
    return next({
      name: 'list'
    });
  }
  if (!store.state.userInfo && to.name !== 'login') {
    return next({
      name: 'login'
    });
  }
  next();
});

export default router;
