<template>
<div class="delete-note">
      <div v-bind:show='isWarning(warning)' class='warning'>{{warning}}</div>
  <div>Are you sure you want to delete this note?</div>
  <button v-on:click='deleteNote'>Delete Note</button>
</div>
</template>

<script>
import axios from 'axios'
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'DeleteNote',

  props: {
    deleteId: String
  },

  data () {
    return {
      title: '',
      warning: ''
    }
  },

  computed: {
    ...mapState({
      'deleteNoteModalState': state => state.modalList['delete-note']
    })
  },

  methods: {
    ...mapMutations(['DELETE_NOTE', 'HIDE_MODAL', 'SHOW_MODAL']),

    deleteNote (e) {
      axios({
        method: 'delete',
        url: `/api/note/${this.deleteId}`
      }).then((response) => {
        if (response.status === 200) {
          this.HIDE_MODAL('delete-note')
          this.DELETE_NOTE(this.deleteId)
        }
      }).catch((err) => {
        console.log(err)
        this.warning = 'Could Not Delete Note'
      })
    },

    isWarning (warning) {
      if (warning === '') {
        return 'false'
      }
      return 'true'
    }
  }
}
</script>

<style>
div.delete-note {
  display: flex;
  flex-flow: column nowrap;
}
div.delete-note div {
  margin-bottom: 10px;
}
</style>
