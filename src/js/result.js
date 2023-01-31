
import { TextStyle, Container, Sprite, Text, Graphics } from 'pixi.js'
import * as config from './config'

/**
 * 游戏结果
 */
export default class Result extends Container {
  constructor() {
    super()
    this.visible = false

    const bg = new Graphics()
    bg.moveTo(0, 0)
    bg.beginFill(0x000000, 0.8)
    bg.drawRect(-config.width / 2, -config.height / 2, config.width, config.height)
    bg.interactive = true
    this.addChild(bg)

    this.$win = new Container()
    const win_icon = new Sprite(app.res.main.textures.win)
    win_icon.anchor.set(0.5)
    win_icon.y = -160

    this.$win.addChild(win_icon)

    // 胜利文字
    const win_text = new Text('你赢得了一个平底锅', new TextStyle({
      fontFamily: 'Arial',
      fontSize: 40,
      fontWeight: 'bold',
      fill: '#ffffff',
    }))
    win_text.anchor.set(0.5)
    this.$win.addChild(win_text)

    const win_button = new Sprite(app.res.main.textures.button_get)
    win_button.anchor.set(0.5)
    win_button.y = 80
    win_button.interactive = true
    win_button.buttonMode = true
    win_button.on('pointertap', () => {
      console.log('win')
      location.href = location.href.replace(/mobile(\d)/, 'mobile0')
    })
    this.$win.addChild(win_button)

    this.$fail = new Container()

    const fail_icon = new Sprite(app.res.main.textures.fail)
    fail_icon.y = -200
    fail_icon.anchor.set(0.5)
    fail_icon.interactive = true
    fail_icon.buttonMode = true
    fail_icon.on('pointertap', () => {
      console.log('fail')
      location.href = location.href.replace(/mobile(\d)/, 'mobile0')
    })
    this.$fail.addChild(fail_icon)

    // 失败文字
    const fail_text = new Text('你获得了一张优惠券', new TextStyle({
      fontFamily: 'Arial',
      fontSize: 40,
      fontWeight: 'bold',
      fill: '#ffffff',
    }))
    fail_text.anchor.set(0.5)
    this.$fail.addChild(fail_text)

    this.addChild(this.$fail)
    this.addChild(this.$win)
  }

  /**
   * win the game
   */
  win() {
    this.visible = true
    this.$win.visible = true
    this.$fail.visible = false
  }


  /**
   * fail the game
   */
  fail() {
    this.visible = true
    this.$win.visible = false
    this.$fail.visible = true
  }
}