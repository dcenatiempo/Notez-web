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
import { mapState, mapMutations } from 'vuex'
import router from '@/router'
import AddNotebook from '@/components/modal/AddNotebook'
import AddNote from '@/components/modal/AddNote'
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
    ...mapMutations(['SET_NOTEBOOKS', 'SET_NOTES', 'SET_CURRENT_NOTEBOOK', 'SET_CURRENT_NOTE', 'HIDE_MODAL', 'SHOW_MODAL']),

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

    noteCount (notebookId) {
      return this.notes.filter(item => item.notebookid === notebookId).length
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
    }
  }
}
</script>

<style>
  div.dashboard {
    display: grid;
    grid-template-rows: 1fr min-content;
    background: rgb(241, 241, 241);
  }
</style>
