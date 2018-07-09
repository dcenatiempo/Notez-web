<template>
  <section class='notebooks'>
    <ul>
      <li v-for='notebook in notebooks' :key='notebook.id'>
        <button class='link'
          v-bind:notebookid='notebook.id'
          v-on:click='openNotebook'>
          {{notebook.data.title}} ({{noteCount(notebook.id)}}) Notes
        </button>
        <button class="icon"
          v-bind:notebookid='notebook.id'
          v-on:click='deleteNotebook'>
          x
        </button>
      </li>
    </ul>
  </section>
</template>

<script>
import axios from 'axios'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'Dashboard',

  methods: {
    ...mapMutations(['DELETE_NOTEBOOK', 'SET_TAB', 'SET_CURRENT_NOTEBOOK']),

    deleteNotebook (e) {
      let notebookId = e.target.getAttribute('notebookid')
      axios({
        method: 'delete',
        url: `/api/notebook/${notebookId}`
      }).then((response) => {
        if (response.status === 200) {
          this.DELETE_NOTEBOOK(notebookId)
        }
      }).catch((err) => {
        this.warning = err
      })
    },

    openNotebook (e) {
      let notebookId = e.target.getAttribute('notebookid')
      this.SET_CURRENT_NOTEBOOK(notebookId)
      this.SET_TAB('notebook')
    },

    noteCount (notebookId) {
      return this.notes.filter(item => item.notebookid === notebookId).length
    }
  },

  computed: {
    ...mapState(['currentNoteBook', 'currentNote', 'notebooks', 'notes'])
  },

  data () {
    return {
      warning: ''
    }
  }
}
</script>

<style>
  ul {
    list-style: none;
    padding: none;
  }
  textarea {
    width: 90%;
    height: 400px;
    border: none;
  }
</style>
