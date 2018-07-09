<template>
  <div v-bind:id='dataTitle'>
    <div class='modal' v-bind:show='showModal'>
      <div class='modal-content'>
        <header>
          <h1>{{title}}</h1>
          <button @click='close'>X</button>
        </header>
        <main>
          <slot>Body</slot>
        </main>
        <footer><slot name="header"></slot></footer>
      </div>
    </div>
    <!-- <open-modal-btn @open-modal='open'>{{title}}</open-modal-btn> -->
  </div>
</template>

<script>
// import OpenModalBtn from './OpenModalBtn'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'Modal',

  components: {
    // 'open-modal-btn': OpenModalBtn
  },

  // two way bindings
  data () {
    return {
    }
  },

  props: {
    title: {
      type: String,
      required: true,
      default: ''
    }
  },

  computed: {
    ...mapState(['modalList']),

    dataTitle: function () {
      return this.title.toLowerCase().split(' ').join('-')
    },

    showModal: function () {
      return this.modalList[this.dataTitle]
    }

  },

  // methods
  methods: {
    ...mapMutations(['HIDE_MODAL', 'SHOW_MODAL']),
    close (e) {
      this.HIDE_MODAL(this.dataTitle)
    },
    open (e) {
      this.SHOW_MODAL(this.dataTitle)
    }
  },

  // observer functions??
  watch: {},

  // lifecyle method
  mounted () {
  },

  created () {
  }
}
</script>

<style>
  [show] {
    display: initial;
  }
  [show=false] {
    display: none;
  }
  .modal {
    position: fixed;
    z-index: 100;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
  }
  .modal header {
    position: relative;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding: 1em 0 0 1em;
  }
  .modal header h1 {
    margin: 0;
  }
  .modal header > button {
    position: absolute;
    top: 0;
    right: 0;
    border: none;
    background: transparent;
    padding: 10px;
    font-size: 1.5em;
    color: #2c3e50;
  }
  .modal > .modal-content {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 50%;
    min-width: 320px;
    background-color: white;
    border-radius: .5em;
  }
  .modal main {
    padding: 1em;
  }
  .modal input {
    font-size: 1em;
    padding: .5em;
    border: none;
    background: #f7f7f7;
  }
  .modal button {
    grid-column: 2;
  }
  .modal-content main .register,
  .modal-content main .login {
    display: grid;
    grid-template-columns: min-content 1fr;
    grid-gap: .5em;
    align-items: center;
  }
  .modal .warning {
    grid-column: 1/3;
    background: pink;
    color: red;
    padding: .4em;
  }
</style>
