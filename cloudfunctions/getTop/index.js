// 云函数入口文件
const cloud = require('wx-server-sdk')
const got = require('got')
const axios = require('axios')
cloud.init()

// // 云函数入口函数
// exports.main = async (event, context) => {
//   let url
//   event.cat === '全部' ? url = `http://api.inner.ink/top/playlist?limit=${event.limit}` :  url = `http://api.inner.ink/top/playlist?limit=${event.limit}&cat=${event.cat}`
//   const response = await got(url)
//   return response.body
// }

// 云函数入口函数
exports.main = async (event, context) => {
  let url = `http://api.inner.ink/top/playlist`
  const response = await axios.get(url, {
    params: {
      limit: event.limit,
      cat: event.cat
    }
  })
  return response.data
}