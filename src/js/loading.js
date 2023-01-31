import { Container, Graphics, TextStyle, Text } from 'pixi.js'
import * as config from './config'
import { randomColor } from './util'

/**
 * 这是加载等待界面，转转转。可用于加载，网络延迟时候显示加载中。
 */
export default class Loading extends Container {

  /**
   * @param {object} options
   * @param {boolean} options.progress 是否显示加载进度文本
   */
  constructor(options) {
    super()

    this.options = Object.assign({
      progress: true
    }, options)

    // 一段弧的弧度
    const arcAngle = Math.PI * 0.2

    // 弧之间的间距弧度
    const gapAngle = Math.PI * 0.05

    // pixi.js 里面 graphics 从3点钟方向开始为0°，这里为了好看往回移动半个弧的距离。
    const offsetAngle = -arcAngle * 0.5

    // 转动图案的半径
    const radius = 80

    // 背景遮罩，一层灰色的遮罩，阻挡底层ui和操作
    let bg = new Graphics()
    bg.moveTo(0, 0)
    bg.beginFill(randomColor(), 0.8)
    // bg.beginFill(0x000000, 0.8)
    bg.drawRect(-config.width / 2, -config.height / 2, config.width, config.height)
    bg.interactive = true
    this.addChild(bg)

    // 创建8个弧
    for (let i = 0; i < 8; i++) {
      const arc = new Graphics()
      const startAngle = offsetAngle + gapAngle * i + arcAngle * i
      const endAngle = startAngle + arcAngle
      arc.lineStyle(16, 0xffffff, 1, 0.5)
      arc.arc(0, 0, radius, startAngle, endAngle)
      this.addChild(arc)
    }

    // 创建旋转的弧，加载时候，有个弧会一直转圈，顺序的盖在八个弧之上。
    let mask = new Graphics()
    this.addChild(mask)

    if (this.options.progress) {
      this.indicatorText = new Text('0%', new TextStyle({
        fontFamily: 'Arial',
        fontSize: 20,
        fill: '#ffffff',
      }))

      this.indicatorText.anchor.set(0.5)
      this.addChild(this.indicatorText)
    }

    // 旋转的弧当前转到哪个位置了，一共八个位置。
    let maskIndex = 0

    // 启动timer让loading转起来
    this.timer = setInterval(() => {
      mask.clear()
      mask.lineStyle(16, 0x000000, 0.5, 0.5)
      let startAngle = offsetAngle + gapAngle * maskIndex + arcAngle * maskIndex
      let endAngle = startAngle + arcAngle
      mask.arc(0, 0, radius, startAngle, endAngle)
      maskIndex = (maskIndex + 1) % 8
    }, 100)
  }

  /**
   * 设置进度
   * @param {number} newValue
   */
  set progress(newValue) {
    if (this.options.progress) {
      this.indicatorText.text = `${newValue}%`
    }
  }

  destroy() {
    clearInterval(this.timer)
    super.destroy(true)
  }
}