import Vue from 'vue';
import VueRouter from 'vue-router';
import {routers} from './router';

Vue.use(VueRouter);

const RouterConfig = {
  mode: 'history',
  fallback: false,
  scrollBehavior: () => ({y: 0}),
  routes: routers
};

export function createRouter() {
  return new VueRouter(RouterConfig)
}
