<template>
  <section class='notes'>
    <h1><input v-model='currentNotebook.data.title'></h1>
    <ul>
      <li v-for='note in currentNotes' :key='note.id' v-bind:noteid='note.id' v-on:click='openNote'>
        <h3>{{note.data.title}}</h3>
        <span class='content' v-html='markIt(note.data.content)'></span>
      </li>
    </ul>
  </section>
</template>

<script>
import axios from 'axios'
import { mapState, mapMutations } from 'vuex'
import marked from 'marked'
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
    },

    markIt (text) {
      return marked(text)
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
  },

  mounted () {}

}
</script>

<style>
section.notes {
  background: rgb(241, 241, 241);
  max-height: calc(100vh - 6.5em);
  overflow-y: scroll;
}
section.notes > h1 {
  padding-left: 0.5em;
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
}
section.notes > ul > li {
  background: white;
  padding: 0.5em;
  display: flex;
  flex-flow: column nowrap;
  position: relative;
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
