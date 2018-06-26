<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import router from '../router'
export default {
  name: 'Dashboard',
  computed: mapState([
    'isLoggedIn'
  ]),
  data () {
    return {
    }
  },

  methods: {},

  watch: {},

  created () {
    if (!this.isLoggedIn) {
      router.push('/')
    }
    axios({
      method: 'get',
      url: '/api/notebook',
      data: {
        'email': this.email,
        'password': this.password
      }
    }).then((response) => {
      console.log(response.data)
    }).catch((error) => {
      this.warning = error.response.data.error
    })
  }
}
</script>

<style>

</style>
