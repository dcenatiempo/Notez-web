<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
  </div>
</template>

<script>
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

  beforeCreate () {
    if (!this.isLoggedIn) {
      router.push('/')
    }
  }
}
</script>

<style>

</style>
