<template>
  <div class="home">
    <h1>Notez is a markdown note app</h1>
    <p>Organize markdown notes into notebooks. View/Edit on any device!</p>
    
    <div v-if='!isLoggedIn' class="get-started">
      <button v-on:click='showLogin'>Login</button>
      <button v-on:click='showRegister'>Register</button>
      <notez-modal :title="'Register'">
        <notez-register></notez-register>
      </notez-modal>
      <notez-modal :title="'Login'">
        <notez-login></notez-login>
      </notez-modal>
    </div>
    <p>Markdown is a lightweight and easy-to-use syntax for styling all forms of writing. <a href='https://guides.github.com/features/mastering-markdown/' targer='_blank' >Learn more about markdown here.</a></p>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

import router from '@/router'
export default {
  name: 'Home',

  created () {
    if (this.isLoggedIn) {
      router.push('/dashboard')
    }
  },

  data () {
    return {
      // props
    }
  },

  computed: {
    ...mapState(['isLoggedIn'])
  },

  methods: {
    ...mapMutations(['REGISTER_MODAL', 'HIDE_MODAL', 'SHOW_MODAL']),

    showRegister () {
      this.SHOW_MODAL('register')
    },

    showLogin () {
      this.SHOW_MODAL('login')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div.home {
  padding: 10px;
  overflow-y: auto;
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.get-started {
  max-width: 400px;
  border: 1px solid gray;
  border-radius: 1em;
  padding: 1em;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  margin: 2em auto;
}
.get-started button {
  margin: 20px;
}
</style>
