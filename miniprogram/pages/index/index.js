//index.js
const app = getApp()
const gl = app.globalData
const db = wx.cloud.database()
import { handleRecent } from '../../utils/common.js'
Page({
  data: {
    hotList: [
      {
        title: '热门歌单Hot',
        playList: [
          {
            id: 1,
            name: '缘分一道桥',
            ar: {
              name: '王力宏'
            },
            coverImgUrl: '../../style/cover.jpg'
          },
          {
            id: 1,
            name: '缘分一道桥',
            ar: {
              name: '王力宏'
            },
            coverImgUrl: '../../style/cover.jpg'
          }, {
            id: 1,
            name: '缘分一道桥',
            ar: {
              name: '王力宏'
            },
            coverImgUrl: '../../style/cover.jpg'
          }, {
            id: 1,
            name: '缘分一道桥',
            ar: {
              name: '王力宏'
            },
            coverImgUrl: '../../style/cover.jpg'
          }, {
            id: 1,
            name: '缘分一道桥',
            ar: {
              name: '王力宏'
            },
            coverImgUrl: '../../style/cover.jpg'
          }, {
            id: 1,
            name: '缘分一道桥',
            ar: {
              name: '王力宏'
            },
            coverImgUrl: '../../style/cover.jpg'
          }
        ]
      },
      {
        title: '精品歌单Top',
        playList: [
          {
            id: 1,
            name: '缘分一道桥',
            ar: {
              name: '王力宏'
            },
            coverImgUrl: '../../style/cover.jpg'
          },
          {
            id: 1,
            name: '缘分一道桥',
            ar: {
              name: '王力宏'
            },
            coverImgUrl: '../../style/cover.jpg'
          }, {
            id: 1,
            name: '缘分一道桥',
            ar: {
              name: '王力宏'
            },
            coverImgUrl: '../../style/cover.jpg'
          }, {
            id: 1,
            name: '缘分一道桥',
            ar: {
              name: '王力宏'
            },
            coverImgUrl: '../../style/cover.jpg'
          }, {
            id: 1,
            name: '缘分一道桥',
            ar: {
              name: '王力宏'
            },
            coverImgUrl: '../../style/cover.jpg'
          }, {
            id: 1,
            name: '缘分一道桥',
            ar: {
              name: '王力宏'
            },
            coverImgUrl: '../../style/cover.jpg'
          }
        ]
      }
    ],
    songList: [
      {
        id: 3069117,
        al: {
          picUrl: '../../style/cover.jpg'
        },
        ar: [
          {
            name: 'Angie Miller'
          }
        ],
        name: "This Is the Life",
      },
      {
        id: 3069117,
        al: {
          picUrl: '../../style/cover.jpg'
        },
        ar: [
          {
            name: 'Angie Miller'
          }
        ],
        name: "This Is the Life",
      },
      {
        id: 3069117,
        al: {
          picUrl: '../../style/cover.jpg'
        },
        ar: [
          {
            name: 'Angie Miller'
          }
        ],
        name: "This Is the Life",
      },
      {
        id: 3069117,
        al: {
          picUrl: '../../style/cover.jpg'
        },
        ar: [
          {
            name: 'Angie Miller'
          }
        ],
        name: "This Is the Life",
      },
      {
        id: 3069117,
        al: {
          picUrl: '../../style/cover.jpg'
        },
        ar: [
          {
            name: 'Angie Miller'
          }
        ],
        name: "This Is the Life",
      }
    ],
    arr: [],
    show: true,
    avatarUrl: 'user-unlogin.png',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    play: false,
    songImgUrl: 'cover.jpg',
    limit: 10,
    searchShow: false,
    mode: 2
  },
  onMyEvent: function (e) {
   console.log('儿子：', e.detail.show)
   this.setData({
     show: e.detail.show
   })
  },
  backEvent (e) {
    this.setData({
      searchShow: e.detail.searchShow
    })
  },
  onShow () {
    console.log('index onShow')
    const that = this
    wx.getBackgroundAudioPlayerState({
      success(res) {
        const status = res.status
        if(status === 0) {
          that.setData({
            play: false,
            songImgUrl: gl.playList[gl.index].al.picUrl
          })
        }else if (status === 1) {
          that.setData({
            play: true,
            songImgUrl: gl.playList[gl.index].al.picUrl
          })
        }else {
          that.setData({
            play: false,
            songImgUrl: 'cover.jpg'
          })
        }
      }
    })
  },
  onLoad: function() {
    this._getRecommend()
    this._getTop()
    this._getNew()
  
    let that = this
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    // this.getRecent()
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  playSong (e) {
    const song = e.detail.item
    console.log(song)
    app.globalData.playList = this.data.songList

    // 添加最近歌曲
    handleRecent(song)
    
    console.log(song.name)
    wx.navigateTo({
      url: `../audio/audio?id=${song.id}`
    })
  },
  toggoleTracks (e) {
    console.log(e.detail)
    const id = e.detail.item.id
    console.log('id',id)
    wx.navigateTo({
      url: `../track/index?id=${id}`
    })
  },
  toggoleSearch () {
    this.setData({
      searchShow: true
    })
    console.log(this.data.searchShow)
  },
  toggoleSongSheet() {
    wx.navigateTo({
      url: `../sheet/index`
    })
  },
  _getTop() {
    let that = this
    db.collection('tracks').where({
      tag: '华语'
    }).get({
      success: function (res) {
        console.log(res)
        let hot = {
          playList: res.data,
          title: '热门歌单Hot'
        }
        that.data.arr.push(hot)
        console.log(arr)
        that.setData({
          hotList: that.data.arr
        })
      }
    })
  },
  _getNew() {
    wx.cloud.callFunction({
      name: 'getTop',
      data: {
        limit: 6,
        cat: "全部"
      },
      success: res => {
        const result = res.result
        if (result.code === 200) {
          let hot = {
            playList: result.playlists,
            title: '精品歌单Top'
          }
          this.data.arr.push(hot)
          this.setData({
            hotList: this.data.arr
          })
        } else {
          console.log(result)
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [sum] 调用失败：', err)
        this._getNew()
      }
    })
  },
  _getRecommend(limit = 10) {
    let that = this

    db.collection('tracks').doc('26b301645d53b6d213d04a6e652bc675').get({
      success: function (res) {
        console.log(res)
        let arr = res.data.tracks
        let list = []
        if (limit > arr.length) {
          limit = arr.length
        }
        for (let i = 0; i < limit; i++) {
          list.push(arr[i])
        }
        that.setData({
          songList: list
        })
        wx.hideLoading()
      },
      error: function(res) {
        console.log(res)
        wx.hideLoading()
      }
    })
  },
  getRecent() {
    try {
      console.log('从本地存储获取最近歌曲')
      var value = wx.getStorageSync('recentList')
      if (value) {
        gl.recentList = value
        console.log('最近歌曲', value)
      }
    } catch (e) {
      console.log('获取最近歌曲失败', e)
    }
  },
  loadMore () {
    wx.showLoading({
      title: '加载中',
    })
    this.data.limit +=10
    this._getRecommend(this.data.limit)
  }
})
