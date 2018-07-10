<template>
  <section class='note'>
    <h2>{{currentNotebook.data.title + ": " + currentNote.data.title}}</h2>
    <textarea class='turndown'
      :hidden='viewMarkdown'
      v-model='currentNote.data.content'
      v-on:change='saveNote'
      @input='markItDown'></textarea>
    <div class='markdown' contenteditable="true" :hidden='!viewMarkdown'>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import marked from 'marked'
import TurndownService from 'turndown'
import { gfm } from 'turndown-plugin-gfm'
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

    markItDown (e) {
      let options = {
        headingStyle: 'atx'
      }
      let rule = {
        filter: ['p'],
        replacement: function (content) {
          return content + '\n\n'
        }
      }

      let markedDisplay = document.querySelector('div.markdown')
      markedDisplay.innerHTML = marked(this.currentNote.data.content)

      var turndownService = new TurndownService(options)
      turndownService.use(gfm)
      turndownService.addRule('stuff', rule)

      let turnedDisplay = document.querySelector('textarea.turndown')
      turnedDisplay.innerHTML = turndownService.turndown(markedDisplay.innerHTML)
    },

    turnItDown () {
      console.log('key was pressed')
      let options = {
        headingStyle: 'atx'
      }
      let rule = {
        filter: ['p'],
        replacement: function (content) {
          return content + '\n\n'
        }
      }
      var turndownService = new TurndownService(options)
      turndownService.use(gfm)
      turndownService.addRule('stuff', rule)

      let markedDisplay = document.querySelector('div.markdown')
      let turnedDisplay = document.querySelector('textarea.turndown')
      turnedDisplay.value = turndownService.turndown(markedDisplay.innerHTML)
    }
  },

  computed: {
    ...mapState(['currentNotebookId', 'currentNoteId', 'notebooks', 'notes', 'viewMarkdown']),

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
    // marked.setOptions({
    //   renderer: new marked.Renderer(),
    //   gfm: true
    // })
    // console.log(marked)
    // console.log(turndownPluginGfm)
    // var gfm = turndownPluginGfm.gfm
    // var turndownService = new TurndownService()
    // turndownService.use(gfm)
    // console.log(turndownService.turndown('<h2>Hello</h2>'))
  },

  mounted () {
    let markedDisplay = document.querySelector('div.markdown')
    setTimeout(() => {
      markedDisplay.innerHTML = marked(this.currentNote.data.content)
    }, 0)

    markedDisplay.addEventListener('blur', e => {
      let turnedDisplay = document.querySelector('textarea.turndown')
      turnedDisplay.dispatchEvent(new Event('input'))
      this.saveNote()
    })

    markedDisplay.addEventListener('keyup', e => {
      this.turnItDown()
    })
  }

}
</script>

<style>
  ul {
    list-style: none;
    padding: none;
  }
  section.note {
    display: flex;
    flex-flow: column nowrap;
  }
  section.note > h2 {
    margin: .4em;
    font-size: 1.2em;
  }
  textarea.turndown {
    box-sizing: border-box;
    font-size: 1em;
    padding: 1em 1em 0 1em;
    width: 100%;
    height: 100%;
    border: none;
    background: rgb(240, 240, 240);
    font-family: monospace;
    overflow-y: scroll;
    max-height: calc(100vh - 9em);
  }
  div.markdown {
    box-sizing: border-box;
    padding: 0 1em;
    width: 100%;
    height: 100%;
    /* background: rgb(155, 213, 236); */
    overflow-y: scroll;
    max-height: calc(100vh - 9em);
  }
</style>
