// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Navigation from './components/Navigation'
import Modal from './components/Modal'
import Register from './components/Register'
import Login from './components/Login'
import router from './router'
import store from './store'

Vue.config.productionTip = false

/* eslint-disable no-new */
Vue.component('notez-navigation', Navigation)
Vue.component('notez-modal', Modal)
Vue.component('notez-register', Register)
Vue.component('notez-login', Login)

new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
