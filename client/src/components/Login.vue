<template>
  <form class='login'>
    <div v-bind:show='isWarning(warning)' class='warning'>{{warning}}</div>
    <span>Email</span>
    <input
      required
      type='email'
      name='email'
      v-model='email'>
    <span>Password</span>
    <input
      required
      type='password'
      name='password'
      v-model='password'>
    <button v-on:click='login'>Login</button>
  </form>
</template>

<script>
import axios from 'axios'
import { mapMutations, mapState } from 'vuex'
import router from '../router'
export default {
  name: 'Login',

  computed: mapState({
    'loginModalState': state => state.showModal.Login
  }),

  data () {
    return {
      email: '',
      password: '',
      warning: ''
    }
  },

  methods: {
    ...mapMutations(['LOGIN', 'HIDE_MODAL']),
    login (e) {
      e.preventDefault()
      let form = document.querySelector('form.login')
      if (!form.checkValidity()) {
        form.reportValidity()
        return
      }
      axios({
        method: 'post',
        url: '/api/user/session',
        data: {
          'email': this.email,
          'password': this.password
        }
      }).then((response) => {
        if (response.status === 200) {
          this.LOGIN(response.data.email)
          this.HIDE_MODAL('Login')
          router.push('dashboard')
        }
      }).catch((error) => {
        this.warning = error.response.data.error
      })
    },
    isWarning (warning) {
      if (warning === '') {
        return 'false'
      }
      return 'true'
    },
    resetForm () {
      this.email = ''
      this.password = ''
      this.warning = ''
    }
  },

  watch: {
    loginModalState (value) {
      if (value === 'false') {
        this.resetForm()
      }
    }
  },

  mounted () {}
}
</script>

<style>

</style>
