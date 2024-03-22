import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: require('@/pages/index/index').default
    },
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/drxsmd',
      name: 'drxsmd',
      component: require('@/pages/drxsmd/drxsmd').default
    },
    {
      path: '/dnyh',
      name: 'dnyh',
      component: require('@/pages/dnyh/dnyh').default
    },
    {
      path: '/random',
      name: 'random',
      component: require('@/pages/random/random').default
    },
    {
      path: '/accomplish',
      name: 'accomplish',
      component: require('@/pages/accomplish/accomplish').default
    }
  ]
})
