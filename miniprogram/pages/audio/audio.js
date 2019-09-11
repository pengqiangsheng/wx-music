const app = getApp()
const gl = app.globalData
import { Lyric } from '../../utils/lyric.js'
import { randomNum, lyric } from '../../utils/common.js'
Page({
  onUnload: function () {
    console.log('audio unload')
    gl.songStatus = {
      start: this.data.start,
      end: this.data.end,
      percent: this.data.percent,
      left: this.data.left,
      play: this.data.play,
      lyric: gl.songStatus.lyric
    }
    if (gl.lyric) {
      gl.lyric.stop()
      console.log('停止播放歌词')
    }
    console.log('歌曲快照', gl.songStatus)

    // 收藏歌曲处理
    if (this.data.favStatus) {
      console.log('收藏歌曲状态被改动，重新存储')
      wx.setStorage({
        key: "favList",
        data: this.data.favList
      })
      this.data.favStatus = 0
    }
  },
  onHide: function () {
    console.log('audio hide')
  },
  onLoad (options) {
    if (options.id) {
      console.log('在播放列表中找歌曲id为', options.id)
      gl.playList.forEach((item, index) => {
        if (item.id == options.id) {
          console.log('找到了,给全局index赋值')
          gl.index = index
          console.log('歌曲快照play设为false')
          gl.songStatus.play = false
        }
      })
    }
    this._init()
  },
  onReady: function (e) {
    // 设置动画
    this.animation = wx.createAnimation({
      timingFunction: 'ease'
    })
    wx.createSelectorQuery().select('.progress-container').fields({
      size: true
    }, (res) => {
      this.data.a = res
      console.log('容器size：',res)
    }).exec()
    wx.createSelectorQuery().select('.progress-text').fields({
      size: true
    }, (res) => {
      this.data.b = res
      console.log('时间显示模块size：',res)
    }).exec()

    wx.createSelectorQuery().select('.background').fields({
      size: true
    }, (res) => {
      this.data.listHeight = res.height * 0.6
      console.log('height：', res.height * 0.6)
    }).exec()
  },
  data: {
    animationParent: {},
    listHeight: 0,
    favStatus: 0,
    favList: [],
    songList: [],
    listShow: false,
    playMode: 0,
    start: '0:00',
    end: 0,
    left: '0px',
    percent: 0,
    txt: '',
    play: false,
    a: {}, // progress-container
    b: {}, // progress-txt
    currentSong: null,
    lyric: null,
    index: -1
  },
  getLyric (id) {
    wx.cloud.callFunction({
      name: 'getLyric',
      data: {
        id: id
      },
      success: res => {
        const result = JSON.parse(res.result)
        if (result.code === 200) {
          console.log('歌词',result)
        } else {
          console.log('歌词',result)
        }
      },
      fail: err => {
        console.log('歌词失败')
        wx.showToast({
          icon: 'none',
          title: '调用失败songurl',
        })
        // this.getSongUrl(id)
      }
    })
    
  },
  getSongUrl(id) {
    const url = `http://149.129.86.207/1321762869_C32kbps.mp3`
    if (id === 1321762869) {
      console.log('冯提莫既视感测试')
      gl.audioCtx.src = url
      this.backgroundInit()
      gl.lyric = new Lyric(lyric, ({ lineNum, txt }) => {
        this.setData({
          txt: txt
        })
      })
      // this.getLyric(id)
    }else {
      wx.showLoading({
        title: '加载中',
      })
      wx.cloud.callFunction({
        name: 'getSong',
        data: {
          id: id,
          mode: 1
        },
        success: res => {
          wx.hideLoading()
          wx.showToast({
            title: 'GET 歌曲',
          })
          const result = res.result
          if (result.code === 200) {
            gl.audioCtx.src = result.data[0].url
            gl.songStatus.lyric = result.data[0].lyric
            this.backgroundInit()
            console.log(result)
          } else {
            console.log(result)
          }
        },
        fail: err => {
          wx.hideLoading()
          wx.showToast({
            icon: 'none',
            title: '歌曲获取失败',
          })
          // this.getSongUrl(id)
        }
      })
    }
  },
  backgroundInit() {
    gl.audioCtx.title = this.data.currentSong.name
    gl.audioCtx.epname = this.data.currentSong.name
    gl.audioCtx.singer = this.data.currentSong.ar[0].name
    gl.audioCtx.coverImgUrl = this.data.currentSong.al.picUrl
  },
  _init () {
    this.favListInit()

    this.setData({
      currentSong: gl.playList[gl.index],
      songList: gl.playList,
      index: gl.index
    })



    console.log(this.data.currentSong)
    if(!gl.audioCtx.currentTime) {
      this.getSongUrl(this.data.currentSong.id)
    }else{
      if (this.data.currentSong.id === 1321762869) {
        gl.lyric = new Lyric(lyric, ({ lineNum, txt }) => {
          this.setData({
            txt: txt
          })
        })
      } else {
        console.log('重新激活页面获取歌词')
        if (gl.songStatus.lyric) {
          console.log('获取歌词',new Date())
          gl.lyric = new Lyric(gl.songStatus.lyric, ({ lineNum, txt }) => {
            this.setData({
              txt: txt
            })
          })
        }
      }
      this.setData({
        start: gl.songStatus.start,
        percent: gl.songStatus.percent,
        end: gl.songStatus.end,
        left: gl.songStatus.left
      })
      if (gl.songStatus.play) {
        this.setData({
          play: true
        })
        console.log('歌曲播放到了', gl.audioCtx.currentTime | 0)
        if(gl.lyric) {
          console.log('歌词重新设置位置:', gl.audioCtx.currentTime | 0)
          gl.lyric.seek(gl.audioCtx.currentTime * 1000)
        }
      }
    }
    // console.log(gl.audioCtx.duration)
    this.audioInit()
  },
  favListInit () {
    console.log('开始获取收藏歌曲')
    const that = this
    wx.getStorage({
      key: 'favList',
      success(res) {
        console.log('收藏歌曲获取成功', res.data)
        that.setData({
          favList: res.data
        })
      }
    })
  },
  audioInit() {
    gl.audioCtx.onNext(() => {
      this.next()
    })
    gl.audioCtx.onPrev(() => {
      this.prev()
    })
    gl.audioCtx.onTimeUpdate(() => {
      let barWidth = this.data.a.width - this.data.b.width * 2 - 20
      this.setData({
        start: this.format(gl.audioCtx.currentTime | 0),
        percent: 100 * (gl.audioCtx.currentTime / gl.audioCtx.duration) | 0,
        end: this.format(gl.audioCtx.duration | 0),
        left: `${this.data.percent * barWidth / 100}px`
      })
    })
    gl.audioCtx.onCanplay(() => {
      console.log('准备播放...', new Date())
      if (gl.songStatus.lyric) {
        console.log('初始化歌词解析器')
        gl.lyric = new Lyric(gl.songStatus.lyric, ({ lineNum, txt }) => {
          this.setData({
            txt: txt
          })
        })
      }
      gl.audioCtx.play()
    })
    gl.audioCtx.onPlay(() => {
      console.log('开始播放', new Date())
      // gl.play = true
      this.setData({
        play: true
      })
      // console.log(gl.audioCtx.currentTime)
      if (gl.lyric) {
        if (!gl.audioCtx.currentTime) {
          console.log('刚开始播放，同步放歌词')
          gl.lyric.play()
        } else {
          console.log('已经播放到了', gl.audioCtx.currentTime)
          console.log('切到这一秒歌词')
          gl.lyric.seek(gl.audioCtx.currentTime * 1000)
        }
      }
    })
    gl.audioCtx.onPause(() => {
      console.log('暂停播放')
      if (gl.lyric) {
        gl.lyric.stop()
      }
      // gl.play = false
      this.setData({
        play: false
      })
    })
    gl.audioCtx.onStop(() => {
      gl.play = false
      this.setData({
        play: false
      })
      if (gl.lyric) {
        gl.lyric.stop()
      }
    })
    gl.audioCtx.onEnded(() => {
      console.log('自然播放结束')
      this.next()
    })

    gl.audioCtx.onSeeked(() => {
      console.log('完成跳转', gl.audioCtx.currentTime)
      if (gl.lyric) {
        gl.lyric.seek(gl.audioCtx.currentTime * 1000)
      }
      if (gl.audioCtx.paused) {
        gl.audioCtx.play()
        this.setData({
          play: true
        })
      }
    })
  },
  touchStart: function (e) {
    let sx = e.touches[0].pageX
  },
  touchMove: function (e) {
    gl.audioCtx.pause()
    this.setData({
      play: false
    })
    let sx = e.touches[0].pageX;
    const paddingWidth = 20
    let barWidth = this.data.a.width - this.data.b.width * 2 - 20

    let offsetX = sx - this.data.b.width - 10
    if (offsetX < 0) {
      offsetX = 0
    }
    if (offsetX > barWidth) {
      offsetX = barWidth
    }
    let seek = Math.abs(offsetX / barWidth) * (gl.audioCtx.duration | 0) | 0
    this.setData({
      percent: 100 * (seek / gl.audioCtx.duration) | 0,
      left: `${offsetX}px`
    })
  },
  touchEnd: function (e) {
    let sx = e.changedTouches[0].pageX;
    let barWidth = this.data.a.width - this.data.b.width * 2 - 20

    let offsetX = sx - this.data.b.width - 10
    if (offsetX < 0) {
      offsetX = 0
    }
    if (offsetX > barWidth) {
      offsetX = barWidth
    }
    let seek = Math.abs(offsetX / barWidth) * (gl.audioCtx.duration | 0) | 0
    this.setData({
      percent: 100 * (seek / gl.audioCtx.duration) | 0,
      start: this.format(seek | 0),
      left: `${offsetX}px`
    })
    console.log('seek', seek)
    gl.audioCtx.seek(seek)
  },
  audioPlay: function () {
    this.setData({
      play: !this.data.play
    })

    if(this.data.play) {
      gl.audioCtx.play()
    }else {
      gl.audioCtx.pause()
    }
  },
  prev: function () {
    console.log('获取歌曲在播放列表中的位置')
    let index = null
    if (this.data.index === 0) {
      index = gl.playList.length - 1
    }else {
      index = this.data.index - 1
    }

    // 随机播放
    index = this.data.playMode ? randomNum(0, gl.playList.length - 1) : index

    this.toggleSong(index)
  },
  next: function () {
    console.log('获取歌曲在播放列表中的位置')
    let index = null
    if (this.data.index === gl.playList.length - 1) {
      index = 0
    } else {
      index = this.data.index + 1
    }
    // 随机播放
    index = this.data.playMode ? randomNum(0, gl.playList.length - 1) : index
    // index = this.data.index
    this.toggleSong(index)
  },
  changeMode () {
    const mode = this.data.playMode ? 0 : 1
    this.setData({
      playMode: mode
    })
    const title = mode ? '随机播放' : '顺序播放' 

    wx.showToast({
      title: title
    }) 
  },
  showPlayList () {
    const height = this.data.listHeight
    this.setData({
      listShow: true
    })
    this.animation.opacity(1).translateY(-height).step()
    this.setData({ animation: this.animation.export() })

    var animationParent = wx.createAnimation({
      timingFunction: 'ease'
    })
    animationParent.opacity(1).step()
    this.setData({
      animationParent: animationParent.export()
    })
  },
  hidePlayList () {
    const height = this.data.listHeight
    setTimeout(() => {
      this.setData({
        listShow: false
      })
    }, 400)
    this.animation.opacity(0).translateY(height).step()
    this.setData({ animation: this.animation.export() })

    var animationParent = wx.createAnimation({
      timingFunction: 'ease'
    })
    animationParent.opacity(0).step()
    this.setData({
      animationParent: animationParent.export()
    })
  },
  favPlayList () {

    console.log('收藏歌曲')
    
    let favList = this.data.favList

    const notHave = favList.every(item => {
      return item.id !== object.item.id
    })

    const save = () => {
      favList.push(object.item)
      that.data.favStatus = 1
      console.log('收藏歌曲, 收藏状态改动')
    }

    this.data.songList.forEach(item => {
      notHave ? save() : ''
    })
    
  },
  playSong(e) {
    const object = e.detail
    const notPlay = this.data.currentSong.id !== object.item.id
    if (notPlay) {
      // 播放
      console.log('切换播放')
      this.toggleSong(object.index)
    } else {
      const goonPlay = () => {
        wx.showToast({
          icon: 'none',
          title: '继续播放',
        })
        gl.audioCtx.play()
      }

      this.data.play ? wx.showToast({
        icon: 'none',
        title: '正在播放',
      }) : goonPlay()

      console.log('切换的是同一首歌')
      return
    }
  },
  handleDel (e) {
    const object = e.detail
    console.log('从播放列表中移除歌曲')
    let arr = this.data.songList
    arr.splice(object.index, 1)
    this.setData({
      songList: arr
    })
  },
  clearPlayList () {
    gl.playList = []
    gl.index = 0
    gl.audioCtx.pause()
    gl.lyric=null
    gl.show=true
    gl.play=false
    gl.songStatus = {}

    wx.navigateBack()
  },
  toggleSong(index) {
    if (gl.audioCtx) {

      gl.audioCtx.stop()

      // gl.audioCtx.destroy()
      gl.audioCtx = null
      console.log('销毁音频实例')
      gl.audioCtx = wx.getBackgroundAudioManager()
      console.log('创建音频实例')
      this.audioInit()
      console.log('挂载音频监听')
    }
    if (gl.lyric) {
      console.log('停止播放歌词')
      gl.lyric.stop()
      gl.lyric = null
      console.log('销毁歌词实例', gl.lyric)
    }
    if (gl.songStatus) {
      console.log('清空歌曲快照')
      gl.songStatus = {}
    }
    console.log('全局index赋值')
    gl.index = index
    console.log('当前页面index赋值')
    this.setData({
      index: index
    })
    console.log('当前页面currentSong重新赋值', gl.playList[index])
    this.setData({
      currentSong: gl.playList[index]
    })

    

    console.log('初始化进度条、歌词显示、播放状态')
    this.setData({
      left: '0px',
      start: '0:00',
      play: false,
      txt: ''
    })
    console.log('尝试获取歌曲src和lyric')
    this.getSongUrl(this.data.currentSong.id)
  },
  format(time) {
    let m = time / 60 | 0
    let s = time % 60
    s = s.toString().length >= 2 ? s : `0${s}`
    return `${m}:${s}`
  }
})