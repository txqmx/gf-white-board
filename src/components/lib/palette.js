import { Line, Rect } from './grapLib'

class Palette {
  constructor (canvas, { drawType, drawColor, lineWidth, moveCallback }) {
    this.canvas = canvas
    this.width = canvas.width // 宽
    this.height = canvas.height // 高
    this.paint = canvas.getContext('2d')
    this.isClickCanvas = false // 是否点击canvas内部, 没看出作用
    this.isMoveCanvas = false // 鼠标是否有移动
    this.imgData = [] // 存储上一次的图像，用于撤回
    this.index = 0 // 记录当前显示的是第几帧
    this.x = 0 // 鼠标按下时的 x 坐标
    this.y = 0 // 鼠标按下时的 y 坐标
    this.lastDot = [this.x, this.y] // 鼠标按下及每次移动后的坐标
    this.drawType = drawType || 'line' // 绘制形状
    this.drawColor = drawColor || '#000000' // 绘制颜色
    this.lineWidth = lineWidth || 2 // 线条宽度
    this.moveCallback = moveCallback || function () {} // 鼠标移动的回调
    this.bindMousemove = this.onMouseMove.bind(this) // 解决问题: 1.addEventListener 的this指向问题 2.bind绑定后为新函数，无法移除监听
    this.bindMousedown = this.onMouseDown.bind(this)
    this.bindMouseup = this.onMouseUp.bind(this)
    this.drawItem = null // 保存当前绘制图形实例
    this.drawMap = {}
    this.selectItem = null // 保存当前选中的图形实例
    this.operateQue = [] // 保存操作类型，返回时需要判断
    this.recycle = [] // 回收站
    this.init()
  }

  init () {
    this.paint.fillStyle = '#fff'
    this.paint.fillRect(0, 0, this.width, this.height)
    this.gatherImage()
    this.canvas.addEventListener('mousedown', this.bindMousedown)
    document.addEventListener('mouseup', this.bindMouseup)
  }

  // 鼠标按下
  onMouseDown (e) {
    this.isClickCanvas = true
    this.x = e.offsetX
    this.y = e.offsetY
    this.lastDot = [e.offsetX, e.offsetY]
    switch (this.drawType) {
      case 'line': {
        this.drawItem = new Line(this.drawColor, this.lineWidth, [this.lastDot])
        break
      }
      case 'rect': {
        this.drawItem = new Rect(this.drawColor, this.lineWidth, this.lastDot)
        break
      }
      case 'eraser':
      case 'move': {
        for (const key in this.drawMap) {
          const item = this.drawMap[key]
          if (item.isPointInPath(this.paint, this.x, this.y)) {
            this.selectItem = item
            this.selectItem.selected = true
            if (this.selectItem.setOffsetDot) {
              this.selectItem.setOffsetDot(this.lastDot)
            }
          } else {
            item.selected = false
          }
        }
        this.reDraw()
        break
      }
    }
    this.canvas.addEventListener('mousemove', this.bindMousemove)
  }

  // 鼠标移动
  onMouseMove (e) {
    this.isMoveCanvas = true
    const endX = e.offsetX
    const endY = e.offsetY
    const width = endX - this.x
    const height = endY - this.y
    const nowDot = [e.offsetX, e.offsetY] // 当前移动到的位置
    switch (this.drawType) {
      case 'line' : {
        // const params = [this.lastDot, nowDot, this.lineWidth, this.drawColor]
        // this.moveCallback('line', ...params)
        this.drawItem.drawLine(this.paint, this.lastDot, nowDot)
        this.lastDot = nowDot
        // this.line(...params)
        break
      }
      case 'rect' : {
        // const params = [this.x, this.y, width, height, this.lineWidth, this.drawColor]
        // this.moveCallback('rect', ...params)
        // this.rect(...params)
        this.reSetImage()
        this.drawItem.drawRect(this.paint, width, height)
        break
      }
      case 'move' : {
        // this.reSetImage()
        // this.selectItem.startDot = []
        if (this.selectItem && this.selectItem.type !== 'line') {
          this.selectItem.drawMove(this.paint, nowDot[0], nowDot[1])
          this.reDraw()
        }
        // this.lastDot = nowDot
        break
      }
    }
  }

  // 鼠标抬起
  onMouseUp (e) {
    if (this.isClickCanvas) {
      this.isClickCanvas = false
      this.canvas.removeEventListener('mousemove', this.bindMousemove)
      if (this.drawType === 'eraser') {
        if (this.selectItem) {
          this.operateQue.push(this.drawType)
          this.eraser(this.selectItem.id)
          this.gatherImage()
          return
        }
      }
      this.reSelect()
      if (this.isMoveCanvas) { // 鼠标没有移动不保存
        this.isMoveCanvas = false
        switch (this.drawType) {
          case 'line':
          case 'rect': {
            const id = this.drawItem.id
            this.drawMap[id] = this.drawItem
            this.operateQue.push(this.drawType)
            this.gatherImage()
            break
          }
          case 'move': {
            this.operateQue.push(this.drawType)
            this.gatherImage()
            break
          }
        }
      }
      this.drawItem = null
    }
  }

  // 采集图像
  gatherImage () {
    this.imgData = this.imgData.slice(0, this.index + 1) // 每次鼠标抬起时，将储存的imgdata截取至index处
    const imgData = this.paint.getImageData(0, 0, this.width, this.height)
    this.imgData.push(imgData)
    this.index = this.imgData.length - 1 // 储存完后将 index 重置为 imgData 最后一位
  }

  // 重置为上一帧，图形绘制，鼠标抬起之前需要重置
  reSetImage () {
    this.paint.clearRect(0, 0, this.width, this.height)
    if (this.imgData.length >= 1) {
      this.paint.putImageData(this.imgData[this.index], 0, 0)
    }
  }

  // 重绘
  reDraw () {
    this.paint.clearRect(0, 0, this.width, this.height)
    for (const key in this.drawMap) {
      const item = this.drawMap[key]
      item.reDraw(this.paint)
    }
  }

  // 绘制条件改变
  changeWay ({ type, color, lineWidth, sides }) {
    console.log(type)
    this.reSelect()
    this.drawType = type || this.drawType // 绘制形状
    this.drawColor = color || this.drawColor // 绘制颜色
    this.lineWidth = lineWidth || this.lineWidth // 线宽
    this.sides = sides || this.sides // 边数
  }

  // 重置选中状态
  reSelect () {
    if (this.selectItem) { // 边界判断
      for (const key in this.drawMap) {
        const item = this.drawMap[key]
        item.selected = false
      }
      this.selectItem = null
      this.reDraw()
    }
  }

  // 删除元素
  eraser (id) {
    if (this.drawMap[id]) {
      this.reSelect()
      this.recycle.push({
        id: id,
        content: this.drawMap[id]
      })
      delete this.drawMap[id]
      this.reDraw()
    }
  }

  // 清屏
  clear () {
    // 清屏后不能再恢复了
    this.imgData = []
    this.drawMap = {}
    this.operateQue = []
    this.paint.clearRect(0, 0, this.width, this.height)
    this.paint.fillStyle = '#fff'
    this.paint.fillRect(0, 0, this.width, this.height)
    this.gatherImage()
  }

  // 撤回
  back () {
    if (--this.index < 0) {
      this.index = 0
      return
    }
    if (this.operateQue[this.operateQue.length - 1] === 'line' || this.operateQue[this.operateQue.length - 1] === 'rect') {
      const lastId = Object.keys(this.drawMap)[Object.keys(this.drawMap).length - 1]
      delete this.drawMap[lastId]
      this.operateQue.pop()
      this.paint.putImageData(this.imgData[this.index], 0, 0)
    } else if (this.operateQue[this.operateQue.length - 1] === 'eraser') {
      const delItem = this.recycle.pop()
      if (delItem) {
        this.drawMap[delItem.id] = delItem.content
        this.operateQue.pop()
        this.paint.putImageData(this.imgData[this.index], 0, 0)
      }
    } else if (this.operateQue[this.operateQue.length - 1] === 'move') {
      this.operateQue.pop()
      this.paint.putImageData(this.imgData[this.index], 0, 0)
    }
  }
}

export {
  Palette
}
