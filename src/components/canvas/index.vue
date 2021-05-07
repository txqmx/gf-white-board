<template>
  <div>
    <canvas style="margin-left: 200px" ref="canvas" :width="width" :height="height"></canvas>
    <div @click="handleClick('line')">画笔</div>
    <div @click="handleClick('rect')">矩形</div>
    <div @click="handleClick('move')">选择</div>
    <div @click="clear">清空</div>
    <div @click="redraw">重绘</div>
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
      palette: ''
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
    handleClick (val) {
      this.palette.test(val)
    },
    clear (val) {
      this.palette.clear(val)
    },
    redraw (val) {
      this.palette.reDraw(val)
    }
  }
}
</script>

<style scoped>

</style>
