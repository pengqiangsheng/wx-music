// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let url = `http://api.inner.ink/search`
  const response = await axios.get(url, {
    params: {
      keywords: event.keywords
    }
  })
  // const response = await got(url)
  return response.data
}