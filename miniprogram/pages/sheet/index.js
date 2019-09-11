// pages/sheet/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    touchInited: false,
    touchStart: 0,
    touchEnd: 0,
    songSheet: [
      {
        id: 1,
        name: '缘分一道桥',
        ar: {
          name: '王力宏'
        },
        coverImgUrl: 'http://p2.music.126.net/SjJfSQqlLgqXfZAI2A3YNA==/19091919905258248.jpg'
      },
      {
        id: 1,
        name: '缘分一道桥',
        ar: {
          name: '王力宏'
        },
        coverImgUrl: 'http://p2.music.126.net/SjJfSQqlLgqXfZAI2A3YNA==/19091919905258248.jpg'
      },
      {
        id: 1,
        name: '缘分一道桥',
        ar: {
          name: '王力宏'
        },
        coverImgUrl: 'http://p2.music.126.net/SjJfSQqlLgqXfZAI2A3YNA==/19091919905258248.jpg'
      },
      {
        id: 1,
        name: '缘分一道桥',
        ar: {
          name: '王力宏'
        },
        coverImgUrl: 'http://p2.music.126.net/SjJfSQqlLgqXfZAI2A3YNA==/19091919905258248.jpg'
      },
      {
        id: 1,
        name: '缘分一道桥',
        ar: {
          name: '王力宏'
        },
        coverImgUrl: 'http://p2.music.126.net/SjJfSQqlLgqXfZAI2A3YNA==/19091919905258248.jpg'
      },
      {
        id: 1,
        name: '缘分一道桥',
        ar: {
          name: '王力宏'
        },
        coverImgUrl: 'http://p2.music.126.net/SjJfSQqlLgqXfZAI2A3YNA==/19091919905258248.jpg'
      },
      {
        id: 1,
        name: '缘分一道桥',
        ar: {
          name: '王力宏'
        },
        coverImgUrl: 'http://p2.music.126.net/SjJfSQqlLgqXfZAI2A3YNA==/19091919905258248.jpg'
      },
      {
        id: 1,
        name: '缘分一道桥',
        ar: {
          name: '王力宏'
        },
        coverImgUrl: 'http://p2.music.126.net/SjJfSQqlLgqXfZAI2A3YNA==/19091919905258248.jpg'
      },
      {
        id: 1,
        name: '缘分一道桥',
        ar: {
          name: '王力宏'
        },
        coverImgUrl: 'http://p2.music.126.net/SjJfSQqlLgqXfZAI2A3YNA==/19091919905258248.jpg'
      },
      {
        id: 1,
        name: '缘分一道桥',
        ar: {
          name: '王力宏'
        },
        coverImgUrl: 'http://p2.music.126.net/SjJfSQqlLgqXfZAI2A3YNA==/19091919905258248.jpg'
      },
      {
        id: 1,
        name: '缘分一道桥',
        ar: {
          name: '王力宏'
        },
        coverImgUrl: 'http://p2.music.126.net/SjJfSQqlLgqXfZAI2A3YNA==/19091919905258248.jpg'
      },
      {
        id: 1,
        name: '缘分一道桥',
        ar: {
          name: '王力宏'
        },
        coverImgUrl: 'http://p2.music.126.net/SjJfSQqlLgqXfZAI2A3YNA==/19091919905258248.jpg'
      }
    ],
    limit: 21,
    sheetNameList: [
      {
        name: '精品',
        cat: '全部'
      },
      {
        name: '华语',
        cat: '华语'
      },
      {
        name: '流行',
        cat: '流行'
      },
      {
        name: '民谣',
        cat: '民谣'
      },
      {
        name: '轻音乐',
        cat: '轻音乐'
      }
    ],
    selected: 0,
    active: 'active'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._init()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  }, 

  handleSheet(e) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      songSheet: []
    })
    const index = e.currentTarget.dataset.index
    this.setData({
      selected: index
    })
    console.log(this.data.sheetNameList)
    console.log(this.data.selected)
    const cat = this.data.sheetNameList[this.data.selected].cat
    console.log(cat)
    this.getTop({
      limit: 21,
      cat: this.data.sheetNameList[this.data.selected].cat
    })
  },
  
  loadMore() {
    wx.showLoading({
      title: '加载中',
    })
    this.data.limit += 21
    this.getTop(
    {
      limit: this.data.limit,
      cat: this.data.sheetNameList[this.data.selected].cat 
    })
  },

  toggoleTracks(e) {
    console.log(e.detail)
    const id = e.detail.item.id
    console.log('id', id)
    wx.navigateTo({
      url: `../track/index?id=${id}`
    })
  },
  _init() {
    this.getTop({
      limit: 21,
      cat: '全部'
    })
  },
  getTop({limit, cat}) {
    console.log(cat,limit)
    wx.cloud.callFunction({
      name: 'getTop',
      data: {
        limit: limit,
        cat: cat
      },
      success: res => {
        wx.hideLoading()
        const result = res.result
        if (result.code === 200) {
          console.log(result)
          if (result.playlists.length > 0) {
            this.setData({
              songSheet: result.playlists
            })
          }
        } else {
          console.log(result)
        }
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
  touchStart: function (e) {
    this.data.touchInited = true
    this.data.touchStart = e.touches[0].pageX
  },
  touchMove: function (e) {
    if(!this.data.touchInited) {
      return
    }
    let sx = e.touches[0].pageX;
    this.data.touchEnd = sx - this.data.touchStart
  },
  touchEnd: function (e) {
    this.data.touchInited = false
    const length = 5
    let index = this.data.selected
    const weight = Math.abs(this.data.touchEnd) - 100
    if (weight > 0) {
      wx.showLoading({
        title: '加载中',
      })
      if (this.data.touchEnd < 0) {
        console.log('下一跳')
        index += 1
        index = index % length

        this.setData({
          selected: index
        })

        this.getTop({
          limit: 21,
          cat: this.data.sheetNameList[this.data.selected].cat
        })
      }else {
        index -= 1
        index = index < 0 ? (length - 1) % length : index % length

        this.setData({
          selected: index
        })

        this.getTop({
          limit: 21,
          cat: this.data.sheetNameList[this.data.selected].cat
        })
        console.log('上一跳')
      }
    }
  },
})