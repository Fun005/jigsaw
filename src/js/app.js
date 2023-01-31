import * as PIXI from 'pixi.js'
import { throttle } from 'throttle-debounce'

import Sound from './sound'
import * as config from './config'


/**
 * Application模块
 * 此类继承PIXI.Application，扩展了自己需要的功能，实现了自适应，资源加载，集成sound模块功能。
 */
export default class Application extends PIXI.Application {

  /**
   * @param {jsonobject} options 和 PIXI.Application 构造函数需要的参数是一样的
   */
  constructor(options) {
    // 禁用 PIXI ResizePlugin功能，防止pixi自动自适应.
    // pixi的自适应会修改canvas.width和canvas.height导致显示错误,没法铺满宽或者高。
    options.resizeTo = undefined

    super(options)

    PIXI.utils.EventEmitter.call(this)

    // canvas显示区域，如果设置了viewRect就显示在viewRect矩形内，没设置的话全屏显示。
    this.viewRect = config.viewRect

    // 防止调用过快发生抖动，throttle一下
    window.addEventListener('resize', throttle(300, () => {
      this.autoResize(this.viewRect)
    }))
    window.addEventListener('orientationchange', throttle(300, () => {
      this.autoResize(this.viewRect)
    }))

    // 自适应
    this.autoResize(this.viewRect)

    // 挂载模块
    this.sound = new Sound()
  }

  /**
   * 自适应cavas大小和位置，按比例铺满宽或者高。
   * resize the canvas size and position to the center of the container
   * fill the canvas to container widh constant game ratio(config.js config.width/config.height).
   *
   * pixi default ResizePlugin will change the canvas.width and canvas.height,thus the canvas won't sacled, just enlarge the size to right and bottom.
   */
  autoResize() {

    const viewRect = Object.assign({
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight
    }, this.viewRect)

    // 游戏宽高比
    const defaultRatio = this.view.width / this.view.height

    // 视口宽高比
    const windowRatio = viewRect.width / viewRect.height

    let width
    let height

    // 这里判断根据宽适配还是高适配
    if (windowRatio < defaultRatio) {
      width = viewRect.width
      height = viewRect.width / defaultRatio
    } else {
      height = viewRect.height
      width = viewRect.height * defaultRatio
    }

    //居中显示canvas
    //让canvas显示在中心，高铺满的话，两边留黑边，宽铺满的话，上下留黑边
    let x = viewRect.x + (viewRect.width - width) / 2
    let y = viewRect.y + (viewRect.height - height) / 2

    //自适应
    let autofitItems = document.querySelectorAll('.autofit')
    autofitItems.forEach(item => {
      //设置canvas(autofit)的宽高，注意这里千万不要直接设置canvas.width和height。
      item.style.left = `${x}px`
      item.style.top = `${y}px`
      item.style.width = `${width}px`
      item.style.height = `${height}px`
    })
  }

  /**
   * 加载所有的资源
   * @param {*} baseUrl
   */
  load(baseUrl) {
    console.log('baseUrl', baseUrl)
    const loader = new PIXI.Loader(baseUrl)

    // 为了解决cdn缓存不更新问题，这里获取资源时候加个版本bust
    loader.defaultQueryString = `v=${config.version}`

    // 加载所有游戏资源
    config.resources.forEach(res => {
      loader.add(res)
    })

    loader
      .on('start', () => {
        console.log('loader:start')
        this.emit('loader:start')
      })
      .on('progress', (loader, res) => {
        this.emit('loader:progress', parseInt(loader.progress))
      })
      .on('load', (loader, res) => {
        console.log(`loader:load ${res.url}`)
        // this.emit('load:res', res.url)
      })
      .on('error', (err, loader, res) => {
        console.warn(err)
        this.emit('loader:error', res.url)
      })
      .load((loader, res) => {
        console.log('loader:complete')
        app.res = res
        // this.i18n.add(res[this.i18n.file].data)
        // delete res[this.i18n.file]
        this.emit('loader:complete', res)
      })

    return loader
  }
}

//mixin EventEmitter
Object.assign(Application.prototype, PIXI.utils.EventEmitter.prototype)