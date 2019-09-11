const app = getApp()
const gl = app.globalData
Component({
  properties: {
    avatarUrl: {
      type: String,
      value: 'user-unlogin.png',
    },
    play: {
      type: Boolean,
      value: false,
    },
    songImgUrl: {
      type: String,
      value: 'cover.jpg',
    }
  },
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#1296db",
    list: [{
      pagePath: "/pages/index/index",
      className: 'iconfont iconyinle',
      text: "乐库"
    },
    {
      pagePath: "/pages/index/index",
      className: 'user-unlogin.png',
      text: ""
    },
    {
      pagePath: "/pages/audio/audio",
      className: 'iconfont iconaccountfilling',
      text: "我的"
    }],
    miniPlay: 'middle-play play',
    miniPause: 'middle-play pause',
    playSongUrl: 'cover.jpg',
    show: true
  },
  attached() {
    console.log('miniPlay attached')
  },
  detached () {
    console.log('miniPlay detached')
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      // wx.navigateTo({url})
      this.setData({
        selected: data.index
      })

      if(this.data.selected === 0) {
        this.data.show = true
      } else if (this.data.selected === 2) {
        this.data.show = false
      }
      this.triggerEvent('myevent', { show: this.data.show });
    },
    openMusic() {
      console.log('open')
      if(gl.playList.length === 0) {
        wx.showToast({
          icon: 'none',
          title: '播放列表暂无歌曲',
        })
      }else {
        wx.navigateTo({ url: '/pages/audio/audio' })
      }
    }
  }
})