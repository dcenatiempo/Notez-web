<template>
<form class="add-notebook">
  <input v-model='title' required placeholder="Notebook Title">
  <button v-on:click='addNotebook'>Add Notebook</button>
</form>
</template>

<script>
import axios from 'axios'
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'AddNotebook',

  data () {
    return {
      title: ''
    }
  },

  computed: {
    ...mapState({
      'addNotebookModalState': state => state.modalList['add-notebook']
    })
  },

  methods: {
    ...mapMutations(['ADD_NOTEBOOK', 'HIDE_MODAL', 'SHOW_MODAL']),

    addNotebook (e) {
      e.preventDefault()
      let form = document.querySelector('form.add-notebook')
      if (!form.checkValidity()) {
        form.reportValidity()
        return
      }
      axios({
        method: 'post',
        url: '/api/notebook',
        data: {
          'title': this.title
        }
      }).then((response) => {
        if (response.status === 201) {
          this.HIDE_MODAL('add-notebook')
          this.ADD_NOTEBOOK(response.data.data)
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
    addNotebookModalState (value) {
      if (value === 'false') {
        this.resetForm()
      }
    }
  }
}
</script>

<style>
form.add-notebook {
  display: flex;
  flex-flow: column nowrap;
}
form.add-notebook input {
  margin-bottom: 10px;
}
</style>
