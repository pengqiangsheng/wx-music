// 云函数入口文件
const cloud = require('wx-server-sdk')
const got = require('got')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let url = `http://api.inner.ink/user/playlist?uid=${event.id}`
  const response = await got(url)
  return response.body
}