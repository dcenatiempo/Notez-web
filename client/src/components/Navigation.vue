<template>
  <nav class="main-nav">
    <h1>Notez</h1>
    <ul v-if='isLoggedIn'>
      <li>{{email}}</li>
      <li><button class='link' @click='logout'>Logout</button></li>
    </ul>
  </nav>
</template>

<script>
import axios from 'axios'
import { mapState, mapMutations } from 'vuex'
import router from '../router'
export default {
  name: 'Navigation',

  computed: {
    ...mapState(['isLoggedIn', 'email'])
  },

  data () {
    return {
    }
  },

  // methods
  methods: {
    ...mapMutations(['LOGOUT']),
    logout () {
      axios({
        method: 'delete',
        url: '/api/user/session'
      }).then((response) => {
        this.LOGOUT()
        router.push('/')
      }).catch((err) => {
        console.log(err)
      })
    }
  },

  // observer functions??
  watch: {},

  // lifecyle method
  mounted () {}
}
</script>

<style>
  .main-nav {
    box-sizing: border-box;
    display: grid;
    grid-template-columns: min-content 1fr;
    height: 3em;
    justify-content: space-between;
    align-items: end;
    padding: 0 10px;
    background: pink;
  }
  .main-nav > h1 {
    margin: 0;
  }
  .main-nav > ul {
    list-style: none;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
    margin: 0;
    padding: 0;
  }
  .main-nav > ul > li {
    padding: 0 5px;
  }
</style>
