const Home = () => import('src/views/home/index')
const Worker = () => import('src/views/worker/index')
const Dashboard = () => import('src/views/dashboard/index')
const RecvAndPay = () => import('src/views/recvAndPay/index')
const Setting = () => import('src/views/setting/index')
const SettingTrash = () => import('src/views/setting/trash/index')
const Configuration = () => import('src/views/setting/configuration/index')

const titles = require('./title')

const appRouter = [
  {
    path: '/home',
    name: 'home',
    meta: { title: '' },
    component: Home
  }, {
    path: '/dashboard',
    name: 'dashboard',
    meta: { title: '' },
    component: Dashboard
  }, {
    path: '/worker',
    name: 'worker',
    meta: { title: '' },
    component: Worker
  }, {
    path: '/recvAndPay',
    name: 'recvAndPay',
    meta: { title: '' },
    component: RecvAndPay
  }, {
    path: '/setting',
    name: 'setting',
    meta: { title: '' },
    component: Setting
  }, {
    path: '/setting/trash',
    name: 'setting-trash',
    meta: { title: '' },
    component: SettingTrash
  }, {
    path: '/setting/configuration',
    name: 'setting-configuration',
    meta: { title: '' },
    component: Configuration
  }, {
    path: '*',
    redirect: { name: 'home' }
  }
]

appRouter.forEach(router => {
  if(router.name) router.meta.title = titles[router.name] || '';
})

// appRouter.forEach(router => {
//   if (router.component && router.meta) router.component.title = router.meta.title;
// })

export const routers = appRouter;
