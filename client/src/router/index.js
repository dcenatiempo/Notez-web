import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home/Home'
import Dashboard from '@/components/dashboard/Dashboard'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    }, {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    }
  ]
})
