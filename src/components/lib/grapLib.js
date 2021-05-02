import { uuid } from './utils'

export function Line (lineColor, lineWidth) {
  return {
    type: 'line',
    id: uuid(),
    time: Date.now(),
    lineColor: lineColor,
    lineWidth: lineWidth
  }
}

export function rect (x, y, width, height, lineColor, lineWidth) {
  return {
    type: 'rect',
    id: uuid(),
    time: Date.now(),
    lineColor: lineColor,
    lineWidth: lineWidth
  }
}
