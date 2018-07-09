<template>
  <section class='note'>
    <h2>{{currentNotebook.data.title + ": " + currentNote.data.title}}</h2>
    <textarea
      v-model='currentNote.data.content'
      v-on:change='saveNote'
      @input='markItUp'></textarea>
    <div class='markup'>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import marked from 'marked'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'Dashboard',

  methods: {
    ...mapMutations(['SET_TAB', 'SET_CURRENT_NOTE', 'DELETE_NOTEBOOK', 'SET_NOTES', 'DELETE_NOTE']),

    resetNotes (e) {
      this.currentNoteId = -1
    },

    saveNote () {
      let noteId = this.currentNoteId
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
    },

    markItUp (e) {
      let markedDisplay = document.querySelector('div.markup')
      markedDisplay.innerHTML = marked(this.currentNote.data.content)
    }
  },

  computed: {
    ...mapState(['currentNotebookId', 'currentNoteId', 'notebooks', 'notes']),

    currentNotebook () {
      return this.notebooks.filter(item => item.id === this.currentNotebookId)[0]
    },

    currentNotes () {
      return this.notes.filter(item => item.notebookid === this.currentNotebookId)
    },

    currentNote () {
      return this.notes.filter(item => item.id === this.currentNoteId)[0]
    }
  },

  data () {
    return {
      warning: ''
    }
  },

  created () {
    marked.setOptions({
      renderer: new marked.Renderer(),
      gfm: true
    })
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
    height: 40px;
    border: none;
    background: forestgreen;
  }
</style>
