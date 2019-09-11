//index.js
const app = getApp()
const gl = app.globalData
import { handleRecent, addRecentSong } from '../../utils/common.js'
Page({
  data: {
    id: 2144082923,
    tracks: null,
    tracksList: null,
    index: 0,
    name: '',
    coverImgUrl: '',
    playCount: 1,
    request: true,
    timer: null
  },
  onPullDownRefresh() {
    wx.showLoading({
      title: '加载中',
    })
    this._getTracks(this.data.id)
  },
  onLoad: function (options) {
    this.data.id = options.id
    console.log('tracks id', options.id)
    wx.showLoading({
      title: '加载中',
    })
    this._getTracks(options.id)
  },

  playSong(e) {
    console.log(e.detail)
    const object = e.detail
    gl.index = object.index
    console.log(gl.index)
    const song = gl.playList[gl.index]
    console.log(song)
    handleRecent(gl.recentList, object.item)
    addRecentSong(object.item)
    wx.navigateTo({
      url: '../audio/audio'
    })
  },
  handleMutil(e) {
    console.log('mutil')
    console.log(e.detail)
    wx.showActionSheet({
      itemList: ['收藏歌曲'],
      success(res) {
        console.log(res.tapIndex)
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  _getTracks(id) {
    if(this.data.request) {
      wx.cloud.callFunction({
        name: 'getTracks',
        data: {
          id: id
        },
        success: res => {
          wx.hideLoading()
          const result = JSON.parse(res.result)
          if (result.code === 200) {
            wx.stopPullDownRefresh()
            this.setData({
              tracks: result.playlist.tracks,
              name: result.playlist.name,
              coverImgUrl: result.playlist.coverImgUrl,
              playCount: result.playlist.playCount
            })
            gl.playList = result.playlist.tracks
            console.log(result)
          } else {
            console.log(result)
          }
        },
        fail: err => {
          wx.hideLoading()
          wx.showToast({
            icon: 'none',
            title: '网络不佳...请下拉刷新',
          })
        }
      })
    }
  }
})
