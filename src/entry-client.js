import 'es6-promise/auto'
import Vue from 'vue'
import util from 'src/libs/util.js'
import { createApp } from 'src/app'
import iView from 'iview';

// a global mixin that calls `asyncData` when a route component's params change
// Vue.mixin({
//   beforeRouteUpdate (to, from, next) {
//     const { asyncData } = this.$options
//     if (asyncData) {
//       asyncData({
//         store: this.$store,
//         route: to
//       }).then(next).catch(next)
//     } else next();
//   }
// })

const { app, router, store } = createApp()

router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.title) window.document.title = `${to.meta.title} | XXX`;
  iView.LoadingBar.start();
  next()
});

router.afterEach(() => { iView.LoadingBar.finish() });

window.vm = app;

// prime the store with server-initialized state.
// the state is determined during SSR and inlined in the page markup.
if (window.__INITIAL_STATE__) {
  window.__INITIAL_STATE__.app.lan = app.$i18n.locale = util.checkLan();
  store.replaceState(window.__INITIAL_STATE__);
}

// wait until router has resolved all async before hooks
// and async components...
router.onReady(() => {
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to), prevMatched = router.getMatchedComponents(from);
    let diffed = false;
    const activated = matched.filter((c, i) => diffed || (diffed = (prevMatched[i] !== c)));
    const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _);
    if (!asyncDataHooks.length) return next();
    Promise.all(asyncDataHooks.map(hook => hook({ store, route: to }))).then(() => { next() }).catch(next);
  })
  app.$mount('#app')
})

// service worker
// const isLocalhost = () => /^http(s)?:\/\/localhost/.test(location.href);
// if (('https:' === location.protocol || isLocalhost()) && navigator.serviceWorker) {
//   navigator.serviceWorker.register('/service-worker.js')
// }