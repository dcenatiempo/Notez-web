<template>
    <button @click='openModal'><slot>Open Modal</slot></button>
</template>

<script>
export default {
  name: 'OpenModalBtn',
  data () {
    return {
    }
  },
  methods: {
    openModal () {
      this.$emit('open-modal')
    }
  }
}
</script>

<style>

</style>
