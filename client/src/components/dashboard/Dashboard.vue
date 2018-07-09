<template>
  <div class="dashboard">
    <notebook-list  v-if='currentTab === "main"'>
    </notebook-list>
    <note-list v-else-if='currentTab === "notebook"'>
    </note-list>
    <note v-else>
    </note>
    <toolbar></toolbar>
    <notez-modal :title="'Add Notebook'">
      <add-notebook></add-notebook>
    </notez-modal>
    <notez-modal :title="'Add Note'">
      <add-note></add-note>
    </notez-modal>
  </div>
</template>

<script>
import axios from 'axios'
import marked from 'marked'
import { mapState, mapMutations } from 'vuex'
import router from '@/router'
import AddNotebook from './AddNotebook'
import AddNote from './AddNote'
import Toolbar from '@/components/toolbar/Toolbar'
import NotebookList from './NotebookList'
import NoteList from './NoteList'
import Note from './Note'
import Modal from '@/components/modal/Modal'
export default {
  name: 'Dashboard',

  components: {
    'add-notebook': AddNotebook,
    'add-note': AddNote,
    'notebook-list': NotebookList,
    'note-list': NoteList,
    'note': Note,
    'toolbar': Toolbar,
    'notez-modal': Modal
  },

  methods: {
    ...mapMutations(['SET_NOTEBOOKS', 'DELETE_NOTEBOOK', 'SET_NOTES', 'DELETE_NOTE', 'SET_CURRENT_NOTEBOOK', 'SET_CURRENT_NOTE', 'HIDE_MODAL', 'SHOW_MODAL']),

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

    resetNotebooks (e) {
      this.SET_CURRENT_NOTEBOOK(-1)
    },

    openNote (e) {
      let noteId = e.target.getAttribute('noteid')
      this.SET_CURRENT_NOTE(noteId)
    },

    resetNotes (e) {
      this.SET_CURRENT_NOTE(-1)
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

    noteCount (notebookId) {
      return this.notes.filter(item => item.notebookid === notebookId).length
    },

    markItUp (e) {
      let markedDisplay = document.querySelector('div.markup')
      markedDisplay.innerHTML = marked(this.currentNote.data.content)
    }
  },

  computed: {
    ...mapState(['isLoggedIn', 'showModal', 'notebooks', 'notes', 'currentTab', 'currentNotebookId', 'currentNoteId']),

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

  watch: {
    currentNoteId () {
      if (this.currentNoteId >= 0) {
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
  div.dashboard {
    display: grid;
    grid-template-rows: 1fr min-content;
  }
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
