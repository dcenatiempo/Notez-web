<template>
  <div>
    <h1>Login</h1>
    Email
    <input
      type='email'
      name='email'
      v-model='email'>
    Password
    <input
      type='password'
      name='password'
      v-model='password'>
    <button v-on:click='login'>Login</button>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  // export name??
  name: 'Login',

  // props
  data () {
    return {
      // props
      email: '',
      password: ''
    }
  },

  // methods
  methods: {
    login (e) {
      axios({
        method: 'post',
        url: 'http://localhost:3000/api/user/login',
        data: {
          'email': this.email,
          'password': this.password
        }
      }).then((response) => {
        console.log(response)
      }).catch((error) => {
        console.log(error)
      })
    }
  },

  // observer functions??
  watch: {
    email (value) {
      console.log(value)
    }
  },

  // lifecyle method
  mounted () {}
}
</script>

<style>

</style>
