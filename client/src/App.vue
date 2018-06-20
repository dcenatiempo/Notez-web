<template>
  <div id="app">
    <notez-navigation></notez-navigation>
    <router-view/>
  </div>
</template>

<script>
import axios from 'axios'
import router from './router'
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'App',

  computed: mapState({
    'loginModalState': state => state.showModal.Login
  }),

  methods: {
    ...mapMutations(['LOGIN', 'HIDE_MODAL'])
  },

  beforeCreate () {
    console.log('creating app!!!!!!!!!!!!!')
    axios({
      method: 'get',
      url: '/api/user/check-login'
    }).then((response) => {
      if (response.status === 200) {
        this.LOGIN(response.data.email)
        router.push('dashboard')
      }
    }).catch((err) => {
      return err
      // console.log(err)
    })
  }
}
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding-top: 60px;
}
button {
  border: none;
  background: dodgerblue;
  color: white;
  font-size: 1em;
  padding: 1em 2em;
  border-radius: 0.5em;
}
button.link {
  background: transparent;
  color: dodgerblue;
  cursor: pointer;
  padding: 0;
}
</style>
