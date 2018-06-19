<template>
  <div id="app">
    <notez-navigation></notez-navigation>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding-top: 60px;
}
button {
  border: none;
  background: dodgerblue;
  color: white;
  font-size: 1em;
  padding: 1em 2em;
  border-radius: 0.5em;
}
button.link {
  background: transparent;
  color: dodgerblue;
  cursor: pointer;
  padding: 0;
}
</style>
