<template>
  <div class="hello">
    <h1>Notez is a markdown note app</h1>
    <p>Organize markdown notes into notebooks. View/Edit on any device!</p>
    <div v-if='!isLoggedIn' class="get-started">
      <notez-modal :title="'Register'">
        <notez-register></notez-register>
      </notez-modal>
      <notez-modal :title="'Login'">
        <notez-login></notez-login>
      </notez-modal>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import router from '../router'
export default {
  name: 'Home',
  data () {
    return {
      // props
    }
  },
  computed: mapState([
    'isLoggedIn'
  ]),
  methods: {
    openRegister () {
      this.$emit('open-register-modal')
    }
  },
  created () {
    if (this.isLoggedIn) {
      router.push('dashboard')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
  border: 1px solid gray;
  border-radius: 1em;
  padding: 2em;
  display: flex;
  justify-content: space-around;
  margin: 2em;
}
</style>
