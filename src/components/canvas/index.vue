<template>
  <div>
    <canvas ref="canvas" :width="width" :height="height"></canvas>
  </div>
</template>

<script>
import { Palette } from '../lib/palette'
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
      lineWidth: 2
    }
  },
  mounted () {
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
    moveCallback (data, ...val) {
      console.log(data, val)
      // this.palette.getImageData()
    },
    // 改变绘制条件 type, color, lineWidth, sides
    changeWay ({ type, color, lineWidth, sides }) {
      this.palette.changeWay({ type, color, lineWidth, sides })
    },
    // 切换工具
    selectTool ({ action }) {
      // this.moveCallback(action)
      // this.palette[action]()
    }
  }
}
</script>

<style scoped>

</style>
