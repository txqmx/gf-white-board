// import { uuid } from './utils'

class Line {
  constructor (lineColor, lineWidth, points, id) {
    this.type = 'line'
    this.id = id || new Date().getTime()
    this.lineColor = lineColor
    this.lineWidth = lineWidth
    this.points = points || []
    this.selected = false
  }

  // 判断点击是否在该图形中
  isPointInPath (canvas, x, y) {
    this.reDraw(canvas, false)
    return canvas.isPointInPath(x, y)
  }

  // 绘制线条
  drawLine (canvas, lastDot, nowDot) {
    canvas.beginPath()
    canvas.lineCap = 'round'
    canvas.lineJoin = 'round'
    canvas.lineWidth = this.lineWidth
    canvas.strokeStyle = this.lineColor
    canvas.moveTo(lastDot[0], lastDot[1])
    canvas.lineTo(nowDot[0], nowDot[1])
    canvas.closePath()
    canvas.stroke() // 进行绘制
    this.points.push(nowDot)
  }

  // 线条重绘
  reDraw (canvas, isStroke = true) {
    if (this.points.length < 2) return
    canvas.beginPath()
    canvas.lineCap = 'round'
    canvas.lineJoin = 'round'
    canvas.lineWidth = this.lineWidth
    canvas.strokeStyle = this.selected ? 'red' : this.lineColor
    canvas.moveTo(this.points[0][0], this.points[0][1])
    for (let i = 1; i < this.points.length; i++) {
      canvas.lineTo(this.points[i][0], this.points[i][1])
    }
    if (isStroke) {
      canvas.stroke()
    }
    canvas.closePath()
  }
}

class Rect {
  constructor (lineColor, lineWidth, startDot, id) {
    this.type = 'rect'
    this.id = id || new Date().getTime()
    this.lineColor = lineColor
    this.lineWidth = lineWidth
    this.startDot = startDot || []
    this.offsetDot = []
    this.width = 0
    this.height = 0
    this.selected = false
  }

  setOffsetDot (newDot) {
    this.offsetDot = [newDot[0] - this.startDot[0], newDot[1] - this.startDot[1]]
  }

  // 判断点击是否在该图形中
  isPointInPath (canvas, x, y) {
    this.reDraw(canvas, false)
    return canvas.isPointInPath(x, y)
  }

  drawMove (canvas, x, y) {
    this.startDot = [x - this.offsetDot[0], y - this.offsetDot[1]]
    // this.reDraw(canvas, true, newDot)
  }

  // 绘制线条
  drawRect (canvas, width, height) {
    canvas.beginPath()
    canvas.lineWidth = this.lineWidth
    canvas.strokeStyle = this.lineColor
    canvas.rect(this.startDot[0], this.startDot[1], width, height)
    canvas.stroke() // 进行绘制
    this.width = width
    this.height = height
  }

  // 线条重绘
  reDraw (canvas, isStroke = true, startDot = this.startDot) {
    canvas.beginPath()
    canvas.lineWidth = this.lineWidth
    canvas.strokeStyle = this.selected ? 'red' : this.lineColor
    canvas.rect(startDot[0], startDot[1], this.width, this.height)
    if (isStroke) {
      canvas.stroke() // 进行绘制
    }
  }
}

export {
  Line,
  Rect
}
