<template>
  <div>
    Email
    <input
      type='email'
      name='email'
      v-model='email'>
    Confirm Email
    <input
      type='email'
      name='emailCheck'
      v-model='emailCheck'>
    Password
    <input
      type='password'
      name='password'
      v-model='password'>
    Confirm Password
    <input
      type='password'
      name='passwordCheck'
      v-model='passwordCheck'>
    <button v-on:click='register'>Register</button>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  // export name??
  name: 'Register',

  // props
  data () {
    return {
      // props
      email: '',
      emailCheck: '',
      password: '',
      passwordCheck: ''
    }
  },

  // methods
  methods: {
    register (e) {
      axios({
        method: 'post',
        url: '/api/user/register',
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
