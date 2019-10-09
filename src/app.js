import Vue from 'vue'
import App from './App.vue'
import { createStore } from './store'
import { createRouter } from './routes'
import { sync } from 'vuex-router-sync'
import VueI18n from 'vue-i18n'
import iview from './components'
import 'iview/dist/styles/iview.css'
import langage from 'src/lang/langage'
import util from 'src/libs/util.js'
import en from 'iview/dist/locale/en-US'
import zh from 'iview/dist/locale/zh-CN'
// import ru from 'iview/dist/locale/ru-RU'
import VueClipboard from 'vue-clipboard2';

// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/line');
require('echarts/lib/component/tooltip');

VueClipboard.config.autoSetContainer = true
Vue.locale = () => {}
Vue.prototype.$U = util
Vue.prototype.$E = echarts
Vue.use(VueClipboard)
Vue.use(iview)
Vue.use(VueI18n)

export function createApp (context) {
  const store = createStore();
  const router = createRouter();
  if (context) {
    store.state.app.lan = util.switchLan(context.lan);
    store.state.app.ssoUrl = context.ssoUrl;
    store.state.app.siteUrl = context.siteUrl;
    store.state.app.centerUrl = context.centerUrl;
    store.state.app.isPC = context.isPC;
  }
  const i18n = new VueI18n({
    locale: store.getters.lan,
    messages: {
      en: Object.assign(langage.en, en),
      zh: Object.assign(langage.zh, zh),
      // ru: Object.assign(langage.ru, ru),
    }
  });
  const app = new Vue({ router, store, i18n, render: h => h(App) });
  sync(store, router)

  return { app, router, store }
}
