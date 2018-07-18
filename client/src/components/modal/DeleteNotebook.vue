<template>
<div class="delete-notebook">
      <div v-bind:show='isWarning(warning)' class='warning'>{{warning}}</div>
  <div>Are you sure you want to delete this notebook?</div>
  <button v-on:click='deleteNotebook'>Delete Notebook</button>
</div>
</template>

<script>
import axios from 'axios'
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'DeleteNotebook',

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
      'deleteNotebookModalState': state => state.modalList['delete-notebook']
    })
  },

  methods: {
    ...mapMutations(['DELETE_NOTEBOOK', 'HIDE_MODAL', 'SHOW_MODAL']),

    deleteNotebook (e) {
      axios({
        method: 'delete',
        url: `/api/notebook/${this.deleteId}`
      }).then((response) => {
        if (response.status === 200) {
          this.HIDE_MODAL('delete-notebook')
          this.DELETE_NOTEBOOK(this.deleteId)
        }
      }).catch((err) => {
        console.log(err)
        this.warning = 'Could Not Delete Notebook'
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
div.delete-notebook {
  display: flex;
  flex-flow: column nowrap;
}
div.delete-notebook div {
  margin-bottom: 10px;
}
</style>
