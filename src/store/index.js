import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import user from './modules/user';
import dashboard from './modules/dashboard';
import recvAndPay from './modules/recvAndPay';
import setting from './modules/setting';
import home from './modules/home';

Vue.use(Vuex);

export const createStore = () => {
  const store = new Vuex.Store({
    modules: { app, user, dashboard, recvAndPay, home, setting }
  })
  return store
}
