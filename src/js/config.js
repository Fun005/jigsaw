/**
 * 游戏基本信息，游戏名字，版本，宽，高等
 */

//with of the canvas
export const width = 796

//height of the canvas
export const height = 1280

//game name
export const name = 'jigsaw'

//game version
export const version = '1.0.0'

//游戏视口显示区域，不写的话全屏显示。
export const viewRect = null

//资源列表
export const resources = [
  {
    name: 'main',
    url: 'assets/image/main.json'
  }, {
    name: 'sound_bg',
    url: 'assets/audio/bg.mp3'
  }, {
    name: 'sound_win',
    url: 'assets/audio/win.mp3'
  }, {
    name: 'sound_fail',
    url: 'assets/audio/fail.mp3'
  },
  {
    name: 'bg',
    url: 'assets/image/bg_zh-cn.png',
  }
]