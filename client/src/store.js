import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    email: null,
    isLoggedIn: false,
    showModal: {'Login': 'false', 'Register': 'false'}
  },
  mutations: {
    LOGOUT (state) {
      state.isLoggedIn = false
    },
    LOGIN (state, payload) {
      state.isLoggedIn = true
      state.email = payload
    },
    HIDE_MODAL (state, payload) {
      console.log(payload)
      state.showModal[payload] = 'false'
    },
    SHOW_MODAL (state, payload) {
      console.log(payload)
      state.showModal[payload] = 'true'
    }
  },
  actions: {
    //
  },
  getters: {
    //
  }
})
