import { Texture, Container, Rectangle } from 'pixi.js'
import Piece from './piece'

// piece之间的空隙
const GAP_SIZE = 2

/**
 * 拼图类，控制拼图逻辑，计算块位置，检查游戏是否结束。
 */
export default class Jigsaw extends Container {
  // level难度，比如level=3，则拼图切分成3*3=9块，可尝试换成更大的值调高难度。
  // texture 拼图用的大图
  constructor(level, texture) {
    super()

    this.level = level
    this.texture = texture

    // 移动步数
    this.moveCount = 0

    // 所有块所在的container（层级）
    this.$pieces = new Container()
    this.$pieces.y = 208
    this.$pieces.x = -4
    this.addChild(this.$pieces)

    // 前景层，将拖拽中得块置于此层，显示在最前面
    this.$select = new Container()
    this.$select.y = 208
    this.$select.x = -4
    this.addChild(this.$select)

    this._createPieces()
  }

  /**
   * 洗牌生成一个长度为level*level的数组，里面的数字是[0,level*leve)随机值
   * 例如level=3,返回[0,3,2,5,4,1,8,7,6]
   *
   * shuffle, random create the pieces index
   * index of piece（level=3 3*3 etc.）
   * 0  1  2
   * 3  4  5
   * 6  7  8
   *
   * suffle will return [3,8,6,2,5,1,4,0,7] etc.
   */
  _shuffle() {

    let index = -1
    const length = this.level * this.level
    const lastIndex = length - 1

    const result = Array.from({ length }, (v, i) => i)

    while (++index < length) {
      const rand = index + Math.floor(Math.random() * (lastIndex - index + 1))
      const value = result[rand]
      result[rand] = result[index]
      result[index] = value
    }
    return result
  }

  /**
   * 创建拼图用的所有的块(piece)
   */
  _createPieces() {

    // 每个piece的宽和高
    this.piece_width = this.texture.orig.width / this.level
    this.piece_height = this.texture.orig.height / this.level

    // 块位置的偏移量，因为是以屏幕中心点计算的，所有所有块向左偏移半张大图的位置。
    const offset_x = this.texture.orig.width / 2
    const offset_y = this.texture.orig.height / 2

    const shuffled_index = this._shuffle()

    for (let ii = 0; ii < shuffled_index.length; ii++) {

      // 从大图中选一张小图生成块(piece)，以level=3为例，将大图切成3*3=9块图
      // 0  1  2
      // 3  4  5
      // 6  7  8
      // 然后根据shuffled_index从大图上的位置取一个图
      const frame_row = parseInt(shuffled_index[ii] / this.level)
      const frame_col = shuffled_index[ii] % this.level

      const frame = new Rectangle(frame_col * this.piece_width, frame_row * this.piece_height, this.piece_width, this.piece_height)

      // 注意，这里currentIndex=ii,targetIndex=shuffled_index[ii]
      const piece = new Piece(new Texture(this.texture, frame), ii, shuffled_index[ii])


      // 将块放在currentIndex所指示的位置位置
      const row = parseInt(ii / this.level)
      const col = ii % this.level
      piece.x = col * this.piece_width - offset_x + GAP_SIZE * col
      piece.y = row * this.piece_height - offset_y + GAP_SIZE * row

      piece
        .on('dragstart', (picked) => {
          // 当前拖拽的块显示在最前
          this.$pieces.removeChild(picked)
          this.$select.addChild(picked)
        })
        .on('dragmove', (picked) => {
          // 检查当前拖拽的块是否位于其他块之上
          this._checkHover(picked)
        })
        .on('dragend', (picked) => {

          // 拖拽完毕时候恢复块层级
          this.$select.removeChild(picked)
          this.$pieces.addChild(picked)

          // 检查是否有可以交换的块
          let target = this._checkHover(picked)
          if (target) {
            // 有的话增加步数，交换两个块
            this.moveCount++
            this._swap(picked, target)
            target.tint = 0xFFFFFF
          } else {
            // 没有的话，回归原位
            picked.x = picked.origin_x
            picked.y = picked.origin_y
          }
        })
      this.$pieces.addChild(piece)
    }
  }
  /**
   * 交换两个块的位置
   * @param {*} picked 当前拖拽的块
   * @param {*} target 要交换的块
   */
  _swap(picked, target) {

    // 互换指示当前位置的currentIndex和位置
    let pickedIndex = picked.currentIndex
    picked.x = target.x
    picked.y = target.y
    picked.currentIndex = target.currentIndex

    target.x = picked.origin_x
    target.y = picked.origin_y
    target.currentIndex = pickedIndex
  }

  /**
   * check游戏是否成功
   */
  get success() {

    // 所有的piece都在正确的位置
    let success = this.$pieces.children.every(piece => piece.currentIndex == piece.targetIndex)

    if (success) {
      console.log('success', this.moveCount)
    }

    return success
  }

  /**
   * i当前的拖拽的块是否悬浮在其他块之上
   * @param {*} picked
   */
  _checkHover(picked) {

    let overlap = this.$pieces.children.find(piece => {
      // 拖拽的块中心点是否在其它块矩形边界内部
      let rect = new Rectangle(piece.x, piece.y, piece.width, piece.height)
      return rect.contains(picked.center.x, picked.center.y)
    })

    this.$pieces.children.forEach(piece => piece.tint = 0xFFFFFF)

    // 改变底下块的颜色，显示块可被交换
    if (overlap) {
      overlap.tint = 0x00ffff
    }

    return overlap
  }

  // createBack() {
  //   const graphics = new Graphics()
  //   this.$pieces.children.forEach(piece => {
  //     graphics.lineStyle(2, 0xFEEB77, 1)
  //     graphics.beginFill(0x650a5A)
  //     graphics.drawRect(piece.x, piece.y, piece.width, piece.height)
  //     graphics.endFill()
  //     this.back.addChild(graphics)
  //   })
  // }
}