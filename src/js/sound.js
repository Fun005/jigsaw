import sound from 'pixi-sound'

/**
 * 音频模块
 * 需要依赖pixi-sound库实现功能。
 */
export default class Sound {
  constructor() { }

  /**
   * 设置音量大小 volumn  0≤ volume ≤1
   * @param {Number} volume [required] : volumn  0≤volume≤1
   */
  setVolume(volume) {
    sound.volumeAll = Math.max(0,
      Math.min(1, parseFloat(volume))
    )
  }

  /**
   * 播放音乐
   * name是音乐名字，config.js文件resources里面音频的name，loop是否循环播放。
   * @param {String} name [required]: name of the sound in resouces
   * @param {Boolean} loop [optional]: loop the sound true:loop false:once
   * @param {String} tag [required]: music or effect (not used now)
   */
  play(name, loop) {

    if (typeof loop !== 'boolean') loop = false

    // app -> window.app, 在入口main.js中已经注入
    const sound = app.res[name].sound
    sound.loop = loop
    return sound.play()
  }

  /**
   * 停止播放
   * @param {String} name [required]: the name of the sound
   */
  stop(name) {
    app.res[name].sound.stop()
  }

  /**
   * 开启关闭静音
   */
  toggleMuteAll() {
    sound.toggleMuteAll()
  }
}