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
    this.drawType = drawType || 'rect' // 绘制形状
    this.drawColor = drawColor || '#000000' // 绘制颜色
    this.lineWidth = lineWidth || 5 // 线条宽度
    this.moveCallback = moveCallback || function () {} // 鼠标移动的回调
    this.bindMousemove = this.onMouseMove.bind(this) // 解决问题: 1.addEventListener 的this指向问题 2.bind绑定后为新函数，无法移除监听
    this.bindMousedown = this.onMouseDown.bind(this)
    this.bindMouseup = this.onMouseUp.bind(this)
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
    this.lastDot = [this.x, this.y]
    this.canvas.addEventListener('mousemove', this.bindMousemove)
  }

  // 鼠标移动
  onMouseMove (e) {
    this.isMoveCanvas = true
    const endX = e.offsetX
    const endY = e.offsetY
    const width = endX - this.x
    const height = endY - this.y
    const nowDot = [endX, endY] // 当前移动到的位置
    switch (this.drawType) {
      case 'line' : {
        const params = [this.lastDot, nowDot, this.lineWidth, this.drawColor]
        this.moveCallback('line', ...params)
        this.line(...params)
        break
      }
      case 'rect' : {
        const params = [this.x, this.y, width, height, this.lineWidth, this.drawColor]
        this.moveCallback('rect', ...params)
        this.rect(...params)
        break
      }
    }
  }

  // 鼠标抬起
  onMouseUp (e) {
    if (this.isClickCanvas) {
      this.isClickCanvas = false
      this.canvas.removeEventListener('mousemove', this.bindMousemove)
      if (this.isMoveCanvas) { // 鼠标没有移动不保存
        this.isMoveCanvas = false
        this.moveCallback('gatherImage')
        this.gatherImage()
      }
    }
  }

  // 绘制线条
  line (lastDot, nowDot, lineWidth, drawColor) {
    this.paint.beginPath()
    this.paint.lineCap = 'round'
    this.paint.lineJoin = 'round'
    this.paint.lineWidth = lineWidth
    this.paint.strokeStyle = drawColor
    this.paint.moveTo(lastDot[0], lastDot[1])
    this.paint.lineTo(nowDot[0], nowDot[1])
    this.paint.closePath()
    this.paint.stroke() // 进行绘制
    this.lastDot = nowDot
  }

  // 绘制矩形
  rect (x, y, width, height, lineWidth, drawColor) {
    this.reSetImage()
    this.paint.lineWidth = lineWidth
    this.paint.strokeStyle = drawColor
    this.paint.strokeRect(x, y, width, height)
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

  // 获取数据
  getImageData () {
    console.log(this.imgData)
  }

  test (val) {
    this.drawType = val
  }
}

export {
  Palette
}
