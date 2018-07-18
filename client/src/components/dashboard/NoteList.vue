<template>
  <section v-bind:class='{reverse: isReverse}' class='notes'>
    <h1><input v-model='currentNotebook.data.title'></h1>
    <ul>
      <li
        v-for='note in currentNotes'
        :key='note.id'
        v-bind:noteid='note.id'
        v-on:click='openNote'
        @mousedown='start' @mouseleave='stop' @mouseup='stop' @touchstart='start' @touchend='stop' @touchcancel='stop'>
        <h3>{{note.data.title}}</h3>
        <span class='content' v-html='markIt(note.data.content)'></span>
      </li>
    </ul>
    <notez-modal :title="'Delete Note'">
      <delete-note :deleteId="deleteId"></delete-note>
    </notez-modal>
  </section>
</template>

<script>
import axios from 'axios'
import { mapState, mapMutations } from 'vuex'
import DeleteNote from '@/components/modal/DeleteNote'
import Modal from '@/components/modal/Modal'
import marked from 'marked'
export default {
  name: 'NoteList',

  components: {
    'delete-note': DeleteNote,
    'notez-modal': Modal
  },

  methods: {
    ...mapMutations(['SET_TAB', 'SET_CURRENT_NOTE', 'DELETE_NOTE', 'SHOW_MODAL']),

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
    },

    start (e) {
      if (!this.interval) {
        this.interval = setInterval(() => {
          this.count++
          console.log(this.count)
          if (this.count >= 4) {
            this.deleteId = e.target.getAttribute('noteid')
            this.SHOW_MODAL('delete-note')
            this.stop()
          }
        }, 100)
      }
    },

    stop () {
      clearInterval(this.interval)
      this.interval = false
      this.count = 0
    },

    markIt (text) {
      return marked(text)
    }
  },

  computed: {
    ...mapState(['currentNotebookId', 'currentNoteId', 'notebooks', 'notes', 'lastTab']),

    currentNotebook () {
      return this.notebooks.filter(item => item.id === this.currentNotebookId)[0]
    },

    currentNotes () {
      return this.notes.filter(item => item.notebookid === this.currentNotebookId)
    },

    isReverse () {
      if (this.lastTab === 'main') return false
      else if (this.lastTab === 'note') return true
    }
  },

  data () {
    return {
      warning: '',
      count: 0,
      interval: false,
      deleteId: null
    }
  },

  mounted () {}

}
</script>

<style>
section.notes {
  background: rgb(241, 241, 241);
  max-height: calc(100vh - 6.5em);
  overflow-y: scroll;
  overflow-x: hidden;
}
section.notes > h1 {
  padding-left: 0.5em;
  animation: slide-left 200ms ease-out 1;
}
section.notes > h1 input {
  width: calc(100% - .5em);
  border: none;
  background: transparent;
  font-size: 1.5em;
  padding: 0;
  color: #2c3e50;
  font: inherit;
}
section.notes > ul {
  display: grid;
  grid-row-gap: 5px;
  list-style: none;
  padding: 0;
  margin: 0;
  animation: slide-left 200ms ease-out 1;
}
section.notes.reverse >h1,
section.notes.reverse > ul {
  animation: slide-right 200ms ease-out 1;
}
section.notes > ul > li {
  background: white;
  padding: 0.5em;
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  box-shadow:0 5px 10px -4px rgba(90, 90, 90, 0.2);
}
section.notes > ul > li:active {
  /* background: rgb(255, 232, 236); */
  box-shadow: none;
}
section.notes > ul > li::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(255,255,255,0) 1%,rgba(255,255,255,0) 80%,rgba(255,255,255,.8) 95%,rgba(255,255,255,1) 100%);
}
section.notes > ul > li::after {
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
section.notes > ul > li > h3 {
  margin: 0;
}
section.notes > ul > li > span.content {
  max-height: 20vh;
  overflow: hidden;

}
section.notes > ul > li > * {
  pointer-events: none;
}
</style>
