/**
 * entrance file
 */
import { Container } from 'pixi.js'
import * as config from './config'
import Application from './app'
import Loading from './loading'
// import VideoAd from './ad'
import Scene from './scene'
import swal from 'sweetalert'

// 游戏分层
const layers = {
  back: new Container(),
  scene: new Container(),
  ui: new Container()
}

/**
 * 启动项目
 */
async function boot() {

  document.title = config.name

  window.app = new Application({
    width: config.width,
    height: config.height,
    view: document.querySelector('#scene'),
    transparent: true
  })

  // 把层加入场景内，并将层位置设置为屏幕中心点
  for (const key in layers) {
    let layer = layers[key]
    app.stage.addChild(layer)
    layer.x = config.width / 2
    layer.y = config.height / 2
  }
}

/**
 * 预加载游戏资源
 */
function loadRes() {

  let promise = new Promise((resolve, reject) => {

    // 显示loading进度页面
    let loading = new Loading()
    layers.ui.addChild(loading)

    // 根据application事件更新状态
    app.on('loader:progress', progress => loading.progress = progress)
    app.on('loader:error', error => reject(error))

    app.on('loader:complete', () => {
      resolve()
      loading.destroy()
    })

    app.load()
  })

  return promise
}

/**
 * 创建游戏场景
 */
function setup() {

  let scene = new Scene()
  layers.scene.addChild(scene)

  // 这里注释掉了播放视频模块，你可以打开这部分，游戏开始前将播放一个视频，视频播放完毕后才会显示游戏。
  // let ad = new VideoAd()
  // layers.ui.addChild(ad)
  // ad.on('over', () => {
  scene.start()
  // })
}

window.onload = async () => {
  // 启动application
  boot()

  // 加载资源，出错的话就显示错误提示
  try {
    await loadRes()
  } catch (error) {
    let reload = await swal({
      title: 'load resource failed',
      text: error,
      icon: 'error',
      button: 'reload'
    })

    if (reload) {
      location.reload(true)
    }

    return
  }

  // 加载成功后显示游戏界面
  setup()

}