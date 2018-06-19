<template>
  <div v-bind:id='title'>
    <div class='modal' v-bind:show='showModal[title]'>
      <div class='modal-content'>
        <header>
          <h1>{{title}}</h1>
          <button @click='close'>X</button>
        </header>
        <slot @close-modal='close'>Body</slot>
        <footer><slot name="header"></slot></footer>
      </div>
    </div>
    <open-modal-btn @open-modal='open'>{{title}}</open-modal-btn>
  </div>
</template>

<script>
import OpenModalBtn from './OpenModalBtn'
import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    'open-modal-btn': OpenModalBtn
  },
  computed: mapState([
    'showModal'
  ]),
  name: 'Modal',
  props: {
    title: {
      type: String,
      required: false,
      default: ''
    }
  },

  // two way bindings
  data () {
    return {
    }
  },

  // methods
  methods: {
    ...mapMutations(['HIDE_MODAL', 'SHOW_MODAL']),
    close (e) {
      console.log('close me')
      this.HIDE_MODAL(this.title)
    },
    open (e) {
      console.log('open me')
      this.SHOW_MODAL(this.title)
    }
  },

  // observer functions??
  watch: {},

  // lifecyle method
  mounted () {

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
  }
  .modal header > button {
    position: absolute;
    top: 0;
    right: 0;
    border: none;
    background: transparent;
    padding: 10px;
    font-size: 1.5em;
  }
  .modal > .modal-content {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 50%;
    min-width: 320px;
    height: 50%;
    background-color: aquamarine;
  }
</style>
