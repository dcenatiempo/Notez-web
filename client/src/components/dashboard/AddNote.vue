<template>
<form class="add-note">
  <input v-model='title' required placeholder="Note Title">
  <button v-on:click='addNote'>Add Note</button>
</form>
</template>

<script>
import axios from 'axios'
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'AddNote',

  props: {},

  data () {
    return {
      title: ''
    }
  },

  computed: {
    ...mapState({
      'addNoteModalState': state => state.modalList['add-note'],
      'notebookId': state => state.currentNotebookId
    })
  },

  methods: {
    ...mapMutations(['ADD_NOTE', 'HIDE_MODAL', 'SHOW_MODAL']),

    addNote (e) {
      e.preventDefault()
      let form = document.querySelector('form.add-note')
      if (!form.checkValidity()) {
        form.reportValidity()
        return
      }
      axios({
        method: 'post',
        url: `/api/note/${this.notebookId}`,
        data: {
          'title': this.title
        }
      }).then((response) => {
        if (response.status === 201) {
          this.HIDE_MODAL('add-note')
          this.ADD_NOTE(response.data.data)
        }
      }).catch((err) => {
        this.warning = err
      })
    },
    resetForm () {
      this.title = ''
    }
  },

  watch: {
    addNoteModalState (value) {
      if (value === 'false') {
        this.resetForm()
      }
    }
  }
}
</script>

<style>

</style>
