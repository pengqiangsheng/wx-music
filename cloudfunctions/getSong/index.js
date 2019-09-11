const cloud = require('wx-server-sdk')
const axios = require('axios')
cloud.init()

exports.main = async (event, context) => {
  let songUrl = `http://api.inner.ink/song/url?id=${event.id}`
  if(event.mode && event.mode === 1) {
  
    let lyricUrl = `http://api.inner.ink/lyric?id=${event.id}`
    const song = await axios.get(songUrl)
    const lyric = await axios.get(lyricUrl)
    let s = song.data
    let l = lyric.data.lrc.lyric
    s.data[0].lyric = l
    return s
  } else {
    const song = await axios.get(songUrl)
    console.log(song.data)
    return song.data
  }
}