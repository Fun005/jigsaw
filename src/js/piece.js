import { Sprite, utils } from 'pixi.js'
/**
 * Piece class
 * 一张大拼图中得一块图，可拖拽
 */
export default class Piece extends Sprite {

  /**
   *
   * @param {*} texture 块显示的图片
   * @param {*} currentIndex 块当前的索引
   * @param {*} targetIndex 块的正确位置
   * 当块的 targetIndex == currentIndex 说明块在正确的位置
   * 当所有的块都在正确位置，则赢得游戏
   *
   * piece 的索引（以3*3为例）
   * 0  1  2
   * 3  4  5
   * 6  7  8
   */
  constructor(texture, currentIndex, targetIndex) {
    super(texture)

    // mixin EventEmitter
    utils.EventEmitter.call(this)

    this.currentIndex = currentIndex
    this.targetIndex = targetIndex

    // 让块接收响应时间
    this.interactive = true

    // 监听拖拽事件
    this
      .on('pointerdown', this._onDragStart)
      .on('pointermove', this._onDragMove)
      .on('pointerup', this._onDragEnd)
      .on('pointerupoutside', this._onDragEnd)
  }

  /**
   * 开始拖拽
   * @param {*} event
   */
  _onDragStart(event) {
    this.dragging = true
    this.data = event.data
    //拖拽中的piece设置成半透明
    // this.alpha = 0.5

    // 当前鼠标位置（相对于父节点的位置）
    let pointer_pos = this.data.getLocalPosition(this.parent)

    // 鼠标点击位置和piece位置的偏移量，用于移动计算，防止鼠标点击后块中心点瞬间偏移到鼠标位置。
    this.offset_x = pointer_pos.x - this.x
    this.offset_y = pointer_pos.y - this.y

    // 块原来的位置，用于交换两个块时候位置设置
    this.origin_x = this.x
    this.origin_y = this.y

    // emit拖拽开始事件
    this.emit('dragstart', this)
  }

  /**
   * 拖拽移动中
   */
  _onDragMove() {
    if (this.dragging) {
      const pos = this.data.getLocalPosition(this.parent)

      // 根据鼠标位置，计算块当前位置。
      this.x = pos.x - this.offset_x
      this.y = pos.y - this.offset_y
      this.emit('dragmove', this)
    }
  }

  /**
   * 拖拽完成，松开鼠标或抬起手指
   */
  _onDragEnd() {
    if (this.dragging) {
      this.dragging = false
      // 恢复透明度
      this.alpha = 1
      this.data = null
      this.emit('dragend', this)
    }
  }

  /**
   * center postion of the piece
   */
  get center() {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2
    }
  }
}

// mixin EventEmitter
Object.assign(Piece.prototype, utils.EventEmitter.prototype)