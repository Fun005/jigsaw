import { TextStyle, Container, Sprite, Text } from 'pixi.js'

import Jigsaw from './jigsaw'
import Result from './result'

const STYLE_WHITE = new TextStyle({
  fontFamily: 'Arial',
  fontSize: 46,
  fontWeight: 'bold',
  fill: '#ffffff',
})

// 游戏时间显示，60秒内没完成，则游戏失败
const TOTAL_TIME = 60

// 倒计时
let _countdown = TOTAL_TIME

/**
 * 游戏场景
 * 这个类负责整个游戏世界的显示，控制游戏的开始和结束。
 */
export default class Scene extends Container {

  constructor() {
    super()

    let bg = new Sprite(app.res.bg.texture)
    bg.anchor.set(0.5)
    this.addChild(bg)

    // 提示图
    let idol = new Sprite(app.res.main.textures.puzzle)
    idol.y = -198
    idol.x = -165
    idol.anchor.set(0.5)
    idol.scale.set(0.37)
    this.addChild(idol)

    // 倒计时显示
    this.$time = new Text(_countdown + '″', STYLE_WHITE)
    this.$time.anchor.set(0.5)
    this.$time.x = 170
    this.$time.y = -156
    this.addChild(this.$time)

    // 拼图模块
    this.$jigsaw = new Jigsaw(3, app.res.main.textures.puzzle)
    this.addChild(this.$jigsaw)
  }

  /**
   * 开始游戏
   */
  start() {

    // 创建结果页面
    let result = new Result()
    this.addChild(result)

    // 播放背景音乐
    app.sound.play('sound_bg', true)

    // 启动倒计时timer，判断游戏成功还是失败。
    let timer = setInterval(() => {
      if (this.$jigsaw.success) {
        // 成功后停止timer，停止背景音乐，播放胜利音乐，显示胜利页面。
        clearInterval(timer)
        app.sound.stop('sound_bg')
        app.sound.play('sound_win')
        result.win()
      } else {
        _countdown--
        this.$time.text = _countdown + '″'
        if (_countdown == 0) {
          // 失败后停止timer，停止背景音乐，播放失败音乐，显示失败页面。
          clearInterval(timer)
          app.sound.stop('sound_bg')
          app.sound.play('sound_fail')
          result.fail()
        }
      }
    }, 1000)
  }
}