<template>
  <section class='notes'>
    <h2>{{currentNotebook.data.title}}</h2>
    <ul>
      <li v-for='note in currentNotes' :key='note.id'>
        <button class='link'
          v-bind:noteid='note.id'
          v-on:click='openNote'>
          {{note.data.title}}
        </button>
        <button class="icon"
          v-bind:noteid='note.id'
          v-on:click='deleteNote'>
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
  name: 'NoteList',

  methods: {
    ...mapMutations(['SET_TAB', 'SET_CURRENT_NOTE', 'SET_NOTEBOOKS', 'DELETE_NOTEBOOK', 'SET_NOTES', 'DELETE_NOTE']),

    resetNotebooks (e) {
      this.currentNotebookId = -1
    },

    openNote (e) {
      let noteId = e.target.getAttribute('noteid')
      this.SET_CURRENT_NOTE(parseInt(noteId))
      this.SET_TAB('note')
    },

    saveNote () {
      let noteId = this.currentNoteIndex
      axios({
        method: 'patch',
        url: `/api/note/${noteId}`,
        data: {
          content: this.currentNote.data.content,
          title: this.currentNote.data.title
        }
      }).then((response) => {
        if (response.status === 200) {
          console.log(response.data)
        }
      }).catch((err) => {
        this.warning = err
      })
    },

    deleteNote (e) {
      let noteId = e.target.getAttribute('noteid')
      axios({
        method: 'delete',
        url: `/api/note/${noteId}`
      }).then((response) => {
        if (response.status === 200) {
          this.DELETE_NOTE(noteId)
        }
      }).catch((err) => {
        this.warning = err
      })
    }
  },

  computed: {
    ...mapState(['currentNotebookId', 'currentNoteId', 'notebooks', 'notes']),

    currentNotebook () {
      return this.notebooks.filter(item => item.id === this.currentNotebookId)[0]
    },

    currentNotes () {
      return this.notes.filter(item => item.notebookid === this.currentNotebookId)
    }
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
