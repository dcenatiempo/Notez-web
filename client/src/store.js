import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    email: null,
    isLoggedIn: false,
    modalList: {'register': 'false', 'login': 'false', 'add-notebook': 'false', 'add-note': 'false'},
    notebooks: [],
    notes: [],
    currentTab: 'main', // 'main', 'notebook', 'note'
    currentNotebookId: -1,
    currentNoteId: -1
  },

  mutations: {
    LOGOUT (state) {
      state.isLoggedIn = false
    },
    LOGIN (state, payload) {
      console.log('logging in')
      state.isLoggedIn = true
      state.email = payload
    },
    HIDE_MODAL (state, payload) {
      state.modalList[payload.toLowerCase()] = 'false'
    },
    SHOW_MODAL (state, payload) {
      state.modalList[payload.toLowerCase()] = 'true'
    },
    REGISTER_MODAL (state, payload) {
      state.modalList[payload.toLowerCase()] = 'false'
    },
    SET_NOTEBOOKS (state, payload) {
      state.notebooks = payload
    },
    ADD_NOTEBOOK (state, payload) {
      state.notebooks = state.notebooks.concat(payload)
    },
    DELETE_NOTEBOOK (state, payload) {
      state.notebooks = state.notebooks.filter(item => item.id !== parseInt(payload))
    },
    SET_NOTES (state, payload) {
      state.notes = payload
    },
    ADD_NOTE (state, payload) {
      state.notes = state.notes.concat(payload)
    },
    DELETE_NOTE (state, payload) {
      state.notes = state.notes.filter(item => item.id !== parseInt(payload))
    },
    SET_CURRENT_NOTEBOOK (state, payload) {
      state.currentNotebookId = parseInt(payload)
    },
    SET_CURRENT_NOTE (state, payload) {
      state.currentNoteId = parseInt(payload)
    },
    SET_TAB (state, payload) {
      state.currentTab = payload
    }
  },
  actions: {
    //
  },

  getters: {
    //
  }
})
