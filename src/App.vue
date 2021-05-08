<template>
  <div id="app">
    <white-board ref="whiteBoard"/>
  </div>
</template>

<script>

import WhiteBoard from './components/index'
export default {
  name: 'App',
  components: { WhiteBoard },
  mounted () {
    this.initBoard()
  },
  methods: {
    // 初始化白板
    initBoard () {
      const width = document.getElementById('app').clientWidth - 40
      const height = document.getElementById('app').clientHeight - 40
      const config = {
        width: width,
        height: height,
        moveCallback: this.moveCallback
      }
      this.$refs.whiteBoard.init(config)
    }
  }
}
</script>

<style lang="less">
canvas{
  border: 1px black solid;
}
  html, body, #app{
    width: 100%;
    height: 100%;
  }
</style>
