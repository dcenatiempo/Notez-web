<template>
  <div>
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
import { mapMutations } from 'vuex'
import router from '../router'
export default {
  // export name??
  name: 'Login',

  // props
  data () {
    return {
      email: '',
      password: ''
    }
  },

  // methods
  methods: {
    ...mapMutations(['LOGIN', 'HIDE_MODAL']),
    login (e) {
      axios({
        method: 'post',
        url: '/api/user/login',
        data: {
          'email': this.email,
          'password': this.password
        }
      }).then((response) => {
        console.log(response)
        this.LOGIN()
        this.HIDE_MODAL('Login')
        router.push('dashboard')
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
