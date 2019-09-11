const app = getApp()
const gl = app.globalData
Component({
  properties: {
    recentList: {
      type: Array,
      value: [],
    }
  },
  data: {
    width: '100%',
    value: '',
    focus: false,
    result: null,
    hisList: []
  },
  methods: {
    cancle() {
      this.clear()
      this.setData({
        focus: false,
        width: '100%',
        result: null
      })
    },
    inputFocus() {
      this.setData({
        focus: true,
        width: '90%'
      })
    },
    clear() {
      console.log('clear')
      this.setData({
        value: ''
      })
    },
    back () {
      this.triggerEvent('back', { searchShow: false });
    },
    bindconfirm(e) {
      console.log(e.detail.value)
      this.handleSearch(e.detail.value)
    },
    bindblur() {

    },
    handleSearch(keywords) {
      wx.showLoading({
        title: '加载中',
      })
      console.log(this.data)
      const have = this.data.hisList.some(item => {
        return item === keywords
      })
      
      have ? console.log('历史记录有了') : this.data.hisList.push(keywords)
      const arr = this.data.hisList
      this.setData({
        hisList: arr
      })
      wx.cloud.callFunction({
        name: 'search',
        data: {
          keywords: keywords
        },
        success: res => {
          wx.hideLoading()
          this.setData({
            focus: false,
            width: '100%'
          })
          const result = JSON.parse(res.result)
          if (result.code === 200) {
            console.log(result)
            const songs = result.result.songs
            songs.forEach(item => {
              item.ar = item.artists
            })
            this.setData({
              result: songs
            })
            console.log(result)
          } else {
            console.log(result)
          }
        },
        fail: err => {
          console.log(err)
          wx.hideLoading()
          wx.showToast({
            icon: 'none',
            title: '网络不佳...尝试重新获取',
          })
        }
      })
    },
    playSong(e) {
      const object = e.detail.object
      gl.index = object.index
      gl.playList = this.data.result

      if (gl.audioCtx.src) {
        console.log('初始化音频实例')
        gl.audioCtx.destroy()
        gl.audioCtx = null
        gl.audioCtx = wx.createInnerAudioContext()
      }
      if (gl.lyric) {
        console.log('初始化歌词解析器')
        gl.lyric.stop()
        gl.lyric = null
      }
      if (gl.songStatus) {
        console.log('初始化歌曲快照')
        gl.songStatus = {}
      }
      wx.navigateTo({
        url: '../audio/audio'
      })
    },
    delHistroy () {
      console.log('del')
      this.setData({
        hisList: []
      })
    }
  },
  attached () {
 
    try {
      var value = wx.getStorageSync('history')
      if (value) {
        this.setData({
          hisList: value
        })
        console.log(value)
      }
    } catch (e) {
      console.log(e)
    }
  },
  detached () {
    console.log('set...')
    wx.setStorage({
      key: "history",
      data: this.data.hisList
    })
    console.log('set...end')
  }
})