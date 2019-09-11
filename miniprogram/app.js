//app.js
App({
  onLaunch: function () {
    // wx.hideTabBar()
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    this.globalData.audioCtx = wx.getBackgroundAudioManager()
    this.globalData.show = true
  },
  globalData: {
    userInfo: null,
    playList: [],
    index: 0,
    audioCtx: null,
    lyric: null,
    show: true,
    play: false,
    recentList: [],
    favList: [],
    songStatus: {}
  },
  /**
  * 设置监听器
  */
  setWatcher(data, watch) { // 接收index.js传过来的data对象和watch对象
    Object.keys(watch).forEach(v => { // 将watch对象内的key遍历
      this.observe(data, v, watch[v]); // 监听data内的v属性，传入watch内对应函数以调用
    })
  },

  /**
   * 监听属性 并执行监听函数
   */
  observe(obj, key, watchFun) {
    var val = obj[key]; // 给该属性设默认值
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      set: function (value) {
        val = value;
        watchFun(value, val); // 赋值(set)时，调用对应函数
      },
      get: function () {
        return val;
      }
    })
  }
})
