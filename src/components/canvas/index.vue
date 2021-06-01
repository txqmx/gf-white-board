<template>
  <div>
    <canvas ref="canvas" :width="width" :height="height"></canvas>
  </div>
</template>

<script>
import { Palette } from '../lib/palette'
import io from 'socket.io-client'
export default {
  name: 'index',
  props: {
    width: {
      default: 500,
      type: Number
    },
    height: {
      default: 300,
      type: Number
    }
  },
  data () {
    return {
      palette: '',
      drawColor: '#000000',
      drawType: 'line',
      lineWidth: 2,
      recordList: []
    }
  },
  mounted () {
    this.socket = io.connect('0.0.0.0:3000')
    this.socket.emit('join', 123456)
    this.socket.on('message', (data, val) => {
      // console.log(data, val)
      // this.palette[data](...val)
    })
    this.initPalette()
  },
  methods: {
    // 初始化白板
    initPalette () {
      this.palette = new Palette(this.$refs.canvas, {
        drawColor: this.drawColor,
        drawType: this.drawType,
        lineWidth: this.lineWidth,
        moveCallback: this.moveCallback
      })
    },
    moveCallback (data) {
      console.log(data)
      this.recordList.push(JSON.stringify(data))
      // this.socket.emit('message', 123456, data, val)
    },
    // 改变绘制条件 type, color, lineWidth, sides
    changeWay ({ type, color, lineWidth, sides }) {
      this.palette.changeWay({ type, color, lineWidth, sides })
    },
    // 切换工具
    selectTool ({ action }) {
      this.moveCallback(action)
      this.palette[action]()
    },
    record () {
      console.log('录制')
    },
    replay () {
      this.palette.destroy()
      this.initPalette()
      this.palette.replay(this.recordList)
      console.log('回放')
    }
  }
}
</script>

<style scoped>

</style>
