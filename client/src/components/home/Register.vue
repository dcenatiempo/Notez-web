<template>
  <form class='register'>
    <div v-bind:show='isWarning(warning)' class='warning'>{{warning}}</div>
    <span>Email</span>
    <input
      required
      type='email'
      name='email'
      v-model='email'>
    <span>Confirm Email</span>
    <input
      required
      type='email'
      name='emailCheck'
      v-model='emailCheck'
      v-bind:pattern='email'
      oninvalid="setCustomValidity('Email does not match')"
      oninput="setCustomValidity('')">
    <span>Password</span>
    <input
      required
      type='password'
      name='password'
      v-model='password'>
    <span>Confirm Password</span>
    <input
      required
      type='password'
      name='passwordCheck'
      v-model='passwordCheck'
      v-bind:pattern='password'
      oninvalid="setCustomValidity('Password does not match')"
      oninput="setCustomValidity('')">
    <button v-on:click='register'>Register</button>
  </form>
</template>

<script>
import axios from 'axios'
import router from '@/router'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'Register',

  computed: {
    ...mapState({
      'registerModalState': state => state.modalList.register
    })
  },

  data () {
    return {
      email: '',
      emailCheck: '',
      password: '',
      passwordCheck: '',
      warning: ''
    }
  },

  methods: {
    ...mapMutations(['LOGIN', 'HIDE_MODAL']),

    register (e) {
      e.preventDefault()
      let form = document.querySelector('form.register')
      if (!form.checkValidity()) {
        form.reportValidity()
        return
      }
      axios({
        method: 'post',
        url: '/api/user',
        data: {
          'email': this.email,
          'password': this.password
        }
      }).then((response) => {
        if (response.status === 201) {
          this.LOGIN(response.data.email)
          this.HIDE_MODAL('Register')
          router.push('/dashboard')
        }
      }).catch((err) => {
        console.log(err)
        this.HIDE_MODAL('Register')
        this.warning = err
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
      this.emailCheck = ''
      this.password = ''
      this.passwordCheck = ''
      this.warning = ''
    }
  },

  watch: {
    registerModalState (value) {
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
