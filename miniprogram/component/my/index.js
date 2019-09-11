const app = getApp()
const gl = app.globalData
import { handleFav } from '../../utils/common.js'
Component({
  properties: {
    avatarUrl: {
      type: String,
      value: 'user-unlogin.png',
    }
  },
  data: {
    mode: 3,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    number: 0,
    recentList: [],
    favList: [],
    recentStatus: 0,
    favStatus: 0,
    selected: 0,
    songList: [],
    titleList: [
      {
        name: '最近',
        number: 0,
        list: []
      },
      {
        name: '收藏',
        number: 0,
        list: []
      }
    ]
  },
  attached() {
    console.log('my attached')
    this._init(this.data.selected)
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
        app.globalData.userInfo = res.userInfo
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
  },
  detached() {
    console.log('my detached')
    this.save()
  },
  methods: {
    save() {
      if (this.data.recentStatus) {
        console.log('最近歌曲状态被改动，重新存储')
        wx.setStorage({
          key: "recentList",
          data: this.data.titleList[0].list
        })
        this.data.recentStatus = 0    
      }
      if (this.data.favStatus) {
        console.log('收藏歌曲状态被改动，重新存储')
        wx.setStorage({
          key: "favList",
          data: this.data.titleList[1].list
        })
        this.data.favStatus = 0
      }
    },
    getUserInfo: function (e) {
      console.log(e)
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    },
    _init(index, toggle=false) {
      try {
        
        let arr = this.data.titleList
        if (!toggle) { // 初始化
          console.log('初始化')
          const recentList = wx.getStorageSync('recentList')
          if (recentList) {
            arr[0].list = recentList
            arr[0].number = recentList.length
            console.log('最近歌曲获取成功：', recentList)
          }
          const favList = wx.getStorageSync('favList')
          if (favList) {
            arr[1].number = favList.length
            arr[1].list = favList
            console.log('收藏歌曲获取成功：', favList)
          }
        }else{ // 切换
          console.log('开始切换')
          this.save()
          // if (this.data.recentStatus) { // 如果状态被改动了
          //   const recentList = wx.getStorageSync('recentList')
          //   if (recentList) {
          //     arr[0].list = recentList
          //     arr[0].number = recentList.length
          //   }
          // }
          // if (this.data.favStatus) { // 如果状态被改动了
          //   const favList = wx.getStorageSync('favList')
          //   if (favList) {
          //     arr[1].number = favList.length
          //     arr[1].list = favList
          //   }
          // }
        }
        this.setData({
          songList: arr[index].list,
          titleList: arr
        })
      } catch (e) {
        console.log('获取失败', e)
      }
    },
    playSong(e) {
      const object = e.detail
      gl.index = object.index
      gl.playList = this.data.songList
      if (gl.audioCtx.src) {
        console.log('初始化音频实例')
        gl.audioCtx.stop()
        // gl.audioCtx.destroy()
        // gl.audioCtx = null
        // gl.audioCtx = wx.createInnerAudioContext()
      }
      if(gl.lyric) {
        console.log('初始化歌词解析器')
        gl.lyric.stop()
        gl.lyric = null
      }
      if (gl.songStatus) {
        console.log('初始化歌曲快照')
        gl.songStatus = {}
      }
      console.log(gl.playList)
      this.save()
      wx.navigateTo({
        url: '../audio/audio'
      })
    },
    toggle(e) {
      const index = e.currentTarget.dataset.index
      this.setData({
        selected: index,
      })
      this._init(index,true)
    },
    handleMutil(e) {
      const object = e.detail
      const that = this
      console.log('开始处理mutil事件，对象为：', object)
      if(this.data.selected) {
        wx.showActionSheet({
          itemList: ['从列表移除歌曲'],
          success(res) {
            if (res.tapIndex === 0) {
              console.log('从收藏列表中移除歌曲')
              let arr = that.data.songList
              arr.splice(object.index, 1)
              that.data.titleList[1].number = arr.length
              that.setData({
                songList: arr,
                titleList: that.data.titleList
              })
              console.log('修改收藏歌曲状态为1')
              that.data.favStatus = 1
            }
          },
          fail(res) {
            console.log('操作mutil事件失败', res.errMsg)
          }
        })
      }else {
        wx.showActionSheet({
          itemList: ['收藏歌曲', '从列表移除歌曲'],
          success(res) {
            if (res.tapIndex === 0) {
              console.log('收藏歌曲')
              
              let fav = that.data.titleList[1]
              const notHave = fav.list.every(item => {
                return item.id !== object.item.id
              })
              const save = () => {
                fav.list.push(object.item)
                // handleFav(object.item)
                wx.showToast({
                  title: '收藏成功',
                })
              }

              notHave ? save() : wx.showToast({
                icon: 'none',
                title: '已经收藏过了',
              })
              
              fav.number = fav.list.length
              that.setData({
                titleList: that.data.titleList
              })
              that.data.favStatus = 1
              console.log('修改收藏歌曲状态为1')
            }
            if (res.tapIndex === 1) {
              console.log('从最近列表中移除歌曲')
              let arr = that.data.songList
              arr.splice(object.index, 1)
              that.data.titleList[0].number = arr.length
              that.setData({
                songList: arr,
                titleList: that.data.titleList
              })
              console.log('修改最近歌曲状态为1')
              that.data.recentStatus = 1
            }
          },
          fail(res) {
            console.log('操作mutil事件失败', res.errMsg)
          }
        })
      }
      
     
    }
  }
})