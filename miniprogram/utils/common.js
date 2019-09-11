const db = wx.cloud.database()
const app = getApp()
export const handleRecent = (song) => {
  try {
    console.log('开始获取最近歌曲')
    var value = wx.getStorageSync('recentList')
    let has = false
    let arr = []
    if (value) {
      console.log('最近歌曲获取成功：', value)
      arr = value
      arr.forEach((item, index) => {
        if (item.id === song.id) {
          console.log(index)
          arr.splice(index, 1)
          arr.unshift(song)
          has = true
        }
      })
      if (!has) {
        arr.unshift(song)
      }
      console.log('最近歌曲处理完毕:', arr)
      console.log('最近歌曲往本地存储写入...')
      wx.setStorage({
        key: "recentList",
        data: arr
      })
    } else {
      console.log('第一次最近歌曲')
      arr.unshift(song)
      wx.setStorage({
        key: "recentList",
        data: arr
      })
    }
  } catch (e) {
    console.log('最近歌曲获取失败', e)
  }
}
export const handleFav = (song) => {
  try {
    console.log('开始获取收藏歌曲')
    let has = false
    let arr = []
    var value = wx.getStorageSync('favList')
    if (value) {
      console.log('收藏歌曲获取成功：', value)
      arr = value
      arr.forEach((item, index) => {
        if (item.id === song.id) {
          console.log(index)
          arr.splice(index, 1)
          arr.unshift(song)
          has = true
        }
      })
      if (!has && song) {
        arr.unshift(song)
      }
      console.log('收藏歌曲处理完毕:', arr)
      console.log('收藏歌曲往本地存储写入...')
      wx.setStorage({
        key: "favList",
        data: arr
      })
    } else {
      console.log('第一次收藏歌曲')
      if(song) {
        arr.unshift(song)
      }
      wx.setStorage({
        key: "favList",
        data: arr
      })
    }
  } catch (e) {
    console.log('收藏歌曲获取失败', e)
  }
}
export const addRecentSong = (song) => {
  console.log('首先判断是否存在这首歌曲')
  getRecentSong((res) => {
    let arr = []
    if (res.errMsg === 'collection.get:ok') {
      arr = res.data
    }
    arr.forEach(item => {
      if(item.id === song.id) {
        console.log('存在')
        return
      }
    })
  })
  console.log('开始往数据库添加最近歌曲',song)
  db.collection('recent').add({
    // data 字段表示需新增的 JSON 数据
    data: {
      // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
      song: song,
      userInfo: app.globalData.userInfo
      // 为待办事项添加一个地理位置（113°E，23°N）
    },
    success: function (res) {
      // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
      console.log('添加成功', res)
    },
    fail: console.error
  })
}

export const getRecentSong = (f) => {
  db.collection('recent').where({
    userInfo: app.globalData.userInfo // 填入当前用户 openid
  }).get({
    success: function (res) {
      f(res)
    }
  })
}

//生成从minNum到maxNum的随机数
export function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10);
      break;
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
      break;
    default:
      return 0;
      break;
  }
} 

export const lyric = '[00:00.000] 作曲 : 徐良\n[00:01.000] 作词 : 徐良\n[00:16.11]也许是发了疯\n[00:18.53]病的是你\n[00:20.77]还是我\n[00:22.81]烂个空洞\n[00:24.80]铺垫了千万种\n[00:27.05]最后却哽住喉咙\n[00:31.37]你带不带种\n[00:33.73]这一幕突然感觉陌生又熟悉\n[00:40.09]曾经在哪里\n[00:42.57]画面里有那时的我那时的你\n[00:48.80]我听见你说\n[00:50.99]想在你的耳畔深深呼吸\n[00:55.37]想在你的怀里面眨眼睛\n[00:59.65]想被你抱在风中紧紧的窒息\n[01:04.96]重叠在你影子里\n[01:08.43]想在你的耳畔说没关系\n[01:12.75]想含着眼泪说声来不及\n[01:17.13]想在你最后转身离开的时机\n[01:22.33]不让你看见表情\n[01:28.30]也许是着了魔\n[01:30.30]说的是对\n[01:32.75]还是错\n[01:34.83]千疮百孔\n[01:36.81]似曾相识的梦\n[01:39.25]如今还动不动容\n[01:43.49]会不会痛\n[01:45.77]这一幕突然感觉陌生又熟悉\n[01:52.08]曾经在哪里\n[01:54.49]画面里有那时的我那时的你\n[02:00.85]我听见你说\n[02:03.18]想在你的耳畔深深呼吸\n[02:07.34]想在你的怀里面眨眼睛\n[02:11.66]想被你抱在风中紧紧的窒息\n[02:16.86]重叠在你影子里\n[02:20.40]想在你的耳畔说没关系\n[02:24.74]想含着眼泪说声来不及\n[02:29.12]想在你最后转身离开的时机\n[02:34.30]不让你看见表情\n[02:38.33]想在你的耳畔深深呼吸\n[02:42.28]想在你的怀里面眨眼睛\n[02:46.55]想被你抱在风中紧紧的窒息\n[02:51.81]重叠在你影子里\n[02:55.43]想在你的耳畔说没关系\n[02:59.72]想含着眼泪说声来不及\n[03:04.02]想在你最后转身离开的时机\n[03:09.27]不让你看见表情\n[03:14.42]制作人：胡皓\n[03:14.85]编曲：金若晨\n[03:15.25]和声编写：何文锐\n[03:15.50]和声：王笑文\n[03:15.78]吉他：张楚弦\n[03:16.02]人声录音：樊俊\n[03:16.36]混音&母带：周天澈\n[03:16.69]\n'
