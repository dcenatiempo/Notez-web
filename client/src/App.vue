<template>
  <div id="app">
    <notez-navigation></notez-navigation>
    <router-view/>
  </div>
</template>

<script>
import axios from 'axios'
import router from './router'
import { mapMutations } from 'vuex'
export default {
  name: 'App',

  computed: {},

  methods: {
    ...mapMutations(['LOGIN', 'HIDE_MODAL'])
  },

  beforeCreate () {
    axios({
      method: 'get',
      url: '/api/user/session'
    }).then((response) => {
      if (response.status === 200) {
        this.LOGIN(response.data.email)
        router.push('/dashboard')
      }
    }).catch((err) => {
      return err
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
  color: #2c3e50;
  display: grid;
  grid-template-rows: min-content 1fr;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
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
button.icon {
  height: 30px;
  width: 30px;
  color: dodgerblue;
  border: 1px solid dodgerblue;
  background: white;
  padding: 0px;
  border-radius: 50%;
}
@keyframes slide-left {
    from {transform: translateX(100vw);}
    to {transform: translateX(0vw);}
}
@keyframes slide-right {
    from {transform: translateX(-100vw);}
    to {transform: translateX(0vw);}
}
/* @keyframes slide-up {
    from {transform: translateY(100vw);}
    to {transform: translateX(0vw);}
} */
</style>
