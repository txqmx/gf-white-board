<template>
  <div id="app">
    <white-board/>
  </div>
</template>

<script>

import WhiteBoard from './components/index'
export default {
  name: 'App',
  components: { WhiteBoard }
}
</script>

<style lang="less">
canvas{
  border: 1px black solid;
}
</style>
