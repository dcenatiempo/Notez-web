<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <section v-if='currentNotebookIndex === -1' class='notebooks'>
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
      <notez-modal :title="'Add Notebook'">
        <add-notebook></add-notebook>
      </notez-modal>
    </section>
    <section v-else-if='currentNoteIndex === -1' class='notes'>
      <button class='link'
        v-on:click='resetNotebooks'>
        back
      </button>
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
      <notez-modal :title="'Add Note'">
        <add-note v-bind:notebookId='currentNotebookIndex'></add-note>
      </notez-modal>
    </section>
    <section v-else class='notes'>
      <button class='link'
        v-on:click='resetNotes'>
        back
      </button>
      <h2>{{currentNotebook.data.title + ": " + currentNote.data.title}}</h2>
      <textarea
        v-model='currentNote.data.content'
        v-on:change='saveNote'
        @input='markItUp'></textarea>
      <div class='markup'>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import marked from 'marked'
import { mapState, mapMutations } from 'vuex'
import router from '@/router'
import AddNotebook from './AddNotebook'
import AddNote from './AddNote'
export default {
  name: 'Dashboard',

  components: {
    'add-notebook': AddNotebook,
    'add-note': AddNote
  },

  methods: {
    ...mapMutations(['SET_NOTEBOOKS', 'DELETE_NOTEBOOK', 'SET_NOTES', 'DELETE_NOTE', 'HIDE_MODAL', 'SHOW_MODAL']),

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
      this.currentNotebookIndex = parseInt(notebookId)
    },

    resetNotebooks (e) {
      this.currentNotebookIndex = -1
    },

    openNote (e) {
      let noteId = e.target.getAttribute('noteid')
      this.currentNoteIndex = parseInt(noteId)
    },

    resetNotes (e) {
      this.currentNoteIndex = -1
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
    },

    noteCount (notebookId) {
      return this.notes.filter(item => item.notebookid === notebookId).length
    },

    markItUp (e) {
      let markedDisplay = document.querySelector('div.markup')
      markedDisplay.innerHTML = marked(this.currentNote.data.content)
    }
  },

  computed: {
    ...mapState(['isLoggedIn', 'showModal', 'notebooks', 'notes']),

    currentNotebook () {
      return this.notebooks.filter(item => item.id === this.currentNotebookIndex)[0]
    },

    currentNotes () {
      return this.notes.filter(item => item.notebookid === this.currentNotebookIndex)
    },

    currentNote () {
      return this.notes.filter(item => item.id === this.currentNoteIndex)[0]
    }
  },

  data () {
    return {
      warning: '',
      currentNotebookIndex: -1,
      currentNoteIndex: -1
    }
  },

  watch: {
    currentNoteIndex () {
      if (this.currentNoteIndex >= 0) {
        // let marked = this.marked
        setTimeout(() => {
          let markedDisplay = document.querySelector('div.markup')
          markedDisplay.innerHTML = marked(this.currentNote.data.content)
        }, 0)
      }
    }
  },

  beforeCreated () {

  },

  created () {
    if (!this.isLoggedIn) {
      router.push('/')
    } else {
      axios({
        method: 'get',
        url: '/api/notebook'
      }).then((response) => {
        this.SET_NOTEBOOKS(response.data.data)
      }).catch((error) => {
        console.log(error)
        this.warning = error
      })
      axios({
        method: 'get',
        url: '/api/note'
      }).then((response) => {
        this.SET_NOTES(response.data.data)
      }).catch((error) => {
        console.log(error)
        this.warning = error
      })
      marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true
      })
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
