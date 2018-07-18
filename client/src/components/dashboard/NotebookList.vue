<template>
  <section class='notebooks'>
    <h1>My Notebooks</h1>
    <ul>
      <li
        v-for='notebook in notebooks'
        :key='notebook.id'
        v-bind:notebookid='notebook.id'
        v-on:click='openNotebook'
        @mousedown='start' @mouseleave='stop' @mouseup='stop' @touchstart='start' @touchend='stop' @touchcancel='stop'>
        <h3>{{notebook.data.title}}</h3>
        <span> ({{noteCount(notebook.id)}}) Notes </span>
      </li>
    </ul>
    <notez-modal :title="'Delete Notebook'">
      <delete-notebook :deleteId="deleteId"></delete-notebook>
    </notez-modal>
  </section>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import DeleteNotebook from './DeleteNotebook'
import Modal from '@/components/modal/Modal'
export default {
  name: 'Dashboard',

  components: {
    'delete-notebook': DeleteNotebook,
    'notez-modal': Modal
  },

  methods: {
    ...mapMutations(['DELETE_NOTEBOOK', 'SET_TAB', 'SET_CURRENT_NOTEBOOK', 'SHOW_MODAL']),

    openNotebook (e) {
      let notebookId = e.target.getAttribute('notebookid')
      this.SET_CURRENT_NOTEBOOK(notebookId)
      this.SET_TAB('notebook')
    },

    noteCount (notebookId) {
      return this.notes.filter(item => item.notebookid === notebookId).length
    },

    start (e) {
      if (!this.interval) {
        this.interval = setInterval(() => {
          this.count++
          console.log(this.count)
          if (this.count >= 4) {
            this.deleteId = e.target.getAttribute('notebookid')
            this.SHOW_MODAL('delete-notebook')
            this.stop()
          }
        }, 100)
      }
    },

    stop () {
      clearInterval(this.interval)
      this.interval = false
      this.count = 0
    }
  },

  computed: {
    ...mapState(['currentNoteBook', 'currentNote', 'notebooks', 'notes'])
  },

  data () {
    return {
      warning: '',
      count: 0,
      interval: false,
      deleteId: null
    }
  }
}
</script>

<style>
section.notebooks {
  background: rgb(241, 241, 241);
  max-height: calc(100vh - 6.5em);
  overflow-y: scroll;
}
section.notebooks > h1 {
  padding-left: 0.5em;
  font-size: 1.5em;
}
section.notebooks > ul {
  display: grid;
  grid-row-gap: 5px;
  list-style: none;
  padding: 0;
  margin: 0;
}
section.notebooks > ul > li {
  background: white;
  padding: 0.5em;
  display: flex;
  flex-flow: column nowrap;
  position: relative;
}
section.notebooks > ul > li::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  right: 1em;
  height: 100%;
  width: 24px;
  opacity: .1;
  background-image: url('data:image/svg+xml,%3Csvg version=%221.1%22 id=%22Layer_1%22 xmlns=%22http://www.w3.org/2000/svg%22 xmlns:xlink=%22http://www.w3.org/1999/xlink%22 x=%220px%22 y=%220px%22%09 width=%2224px%22 height=%2224px%22 viewBox=%220 0 24 24%22 enable-background=%22new 0 0 24 24%22 xml:space=%22preserve%22%3E%3Cpath d=%22M8.59%2C16.59L13.17%2C12L8.59%2C7.41L10%2C6l6%2C6l-6%2C6L8.59%2C16.59z%22/%3E%3Cpath fill=%22none%22 d=%22M0%2C0h24v24H0V0z%22/%3E%3C/svg%3E');
  background-size: 50px;
  background-position: center;
  background-repeat: no-repeat;
  background-color: transparent;
}
section.notebooks > ul > li h3{
  margin: 0;
}

section.notebooks > ul > li > * {
  pointer-events: none;
}
</style>
