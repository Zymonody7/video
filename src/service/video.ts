// import { bData } from './barrage'

import { timeUtil } from '../utils/time'

const video = document.querySelector<HTMLVideoElement>('#video')!

let asideWidth = 360
let minWidth = 500
let maxWidth = 1400
// 小窗口模式及宽度
let isSmall = false
let smallWidth = 300
// 进度条宽度
let progressWidth = 600
let ratio: number

// 设置小窗模式
const setSmall = () => {
  if (isSmall) return
  let height = smallWidth / ratio
  isSmall = true
  video.height = height
  video.width = smallWidth
  const videobox = document.querySelector<HTMLDivElement>('.videobox')!
  videobox.className = 'videobox vsmall'
  videobox.style.width = smallWidth + 'px'
  videobox.style.height = height + 'px'
  const vplay = document.querySelector<HTMLDivElement>('#vplay')!
  vplay.style.width = smallWidth + 'px'
  vplay.style.height = height + 'px'
}
const exitSmall = () => {
  if (!isSmall) return
  isSmall = false
  document.querySelector('.videobox')!.className = 'videobox'
  setSize()
}
const setSize = () => {
  let sideWidth
  if (isWideScreen) {
    sideWidth = 0
  } else {
    sideWidth = asideWidth
  }
  let dw = 80
  let width = document.body.clientWidth - dw - sideWidth
  if (width < minWidth + dw) width = minWidth + dw
  else if (width > maxWidth + dw) width = maxWidth + dw
  let height = width / ratio
  video.height = height
  video.width = width
  progressWidth = width
  const playwindow = document.querySelector<HTMLDivElement>('.videowindow')!
  playwindow.style.width = width + 20 + sideWidth + 'px'
  const playbox = document.querySelector<HTMLDivElement>('.videocontainer')!
  playbox.style.width = width + 'px'
  playbox.style.height = height + 48 + 'px'
  const videobox = document.querySelector<HTMLDivElement>('.videobox')!
  videobox.style.height = height + 'px'
  const progress = document.querySelector<HTMLDivElement>('.progress')!
  progress.style.width = width + 'px'
  const aside = document.querySelector<HTMLDivElement>('.chatcontainer')!
  aside.style.width = asideWidth + 'px'
  const vplay = document.querySelector<HTMLDivElement>('#vplay')!
  vplay.style.width = width + 'px'
  vplay.style.height = height + 'px'
}

video.oncanplay = () => {
  ratio = video.clientWidth / video.clientHeight
  setSize()
  let totalTime = video.duration
  document.querySelector('.total-time')!.innerHTML = timeUtil(totalTime)
  curTime()
  // getBarrage()
}

window.addEventListener('resize', () => {
  if (!isSmall) setSize()
})

window.addEventListener('scroll', () => {
  let playbox = document.querySelector<HTMLDivElement>('.videocontainer')!
  let height = parseInt(playbox.style.height) + playbox.offsetTop
  let top = document.documentElement.scrollTop
  if (top > height - 50) setSmall()
  else exitSmall()
})

document.querySelector<HTMLDivElement>('#fullscreen')!.onclick = () => {
  if (video.requestFullscreen) {
    video.requestFullscreen()
  } else if (video.webkitRequestFullScreen) {
    video.webkitRequestFullScreen()
  } else if (video.mozRequestFullScreen) {
    video.mozRequestFullScreen()
  }
}
// 宽屏模式
let isWideScreen = false

const widescreen = document.querySelector<HTMLDivElement>('#expand')!
widescreen.onclick = function () {
  isWideScreen = !isWideScreen
  if (isWideScreen) {
    // this.class
    widescreen.className = 'iconfont icon-shrinkHorizontal'
    widescreen.title = '取消宽屏'
    document.querySelector<HTMLDivElement>('.chatcontainer')!.style.display =
      'none'
  } else {
    widescreen.className = 'iconfont icon-expandHorizontal'
    widescreen.title = '宽屏'
    document.querySelector<HTMLDivElement>('.chatcontainer')!.style.display =
      'flex'
  }
  setSize()
}

const play = () => {
  document.querySelector('#play')!.className = 'iconfont icon-pause'
  document.querySelector<HTMLDivElement>('#vplay-btn')!.className =
    'iconfont icon-pauseCircle'
  video.play()
  ctid = setInterval(() => {
    curTime()
    setProgress()
  }, 1000)
}

const pause = () => {
  document.querySelector('.icon-pause')!.className = 'iconfont icon-play'
  document.querySelector<HTMLDivElement>('#vplay-btn')!.className =
    'iconfont icon-playCircle'
  video.pause()
  clearInterval(ctid)
}

const stopVideo = () => {
  pause()
  video.currentTime = 0
  curTime()
  setProgress()
}
video.onended = () => {
  stopVideo()
}

document.querySelector<HTMLDivElement>('#play')!.onclick = () => {
  if (video.paused) {
    play()
  } else {
    pause()
  }
}
document.querySelector<HTMLDivElement>('#vplay')!.onclick = () => {
  if (video.paused) {
    play()
  } else {
    pause()
  }
}

let ctid: number | undefined

const curTime = () => {
  document.querySelector('.crt-time')!.innerHTML = timeUtil(video.currentTime)
}
const setProgress = () => {
  let crt = (video.currentTime / video.duration) * progressWidth
  document.querySelector<HTMLDivElement>('.crt')!.style.width = crt + 'px'
}
document.querySelector<HTMLDivElement>('.progress')!.onclick = (e) => {
  if (video.currentTime <= 0) return
  let crt = e.offsetX / progressWidth
  video.currentTime = crt * video.duration
  document.querySelector<HTMLDivElement>('.crt')!.style.width = crt + 'px'
}

let speedList = document
  .querySelector<HTMLDivElement>('.speedList')!
  .querySelectorAll<HTMLDivElement>('div')
for (let i = 0; i < speedList.length; i++) {
  speedList[i].onclick = () => {
    let v = parseFloat(speedList[i].getAttribute('value') as string)
    document.querySelector('.curSpeed')!.innerHTML = '倍速&times;' + v
    video.playbackRate = v
  }
}

const mute = document.getElementById('mute')!

mute.onclick = function () {
  let muted = video.muted
  if (muted) {
    mute.className = 'iconfont icon-volume'
    mute.title = '静音'
  } else {
    mute.className = 'iconfont icon-volumeCross'
    mute.title = '取消静音'
  }
  video.muted = !muted
}

let volumeWidth = 60
let curPos = 60
let halfSlider = 6
let rflag = false

const setPos = (pos: number) => {
  if (pos < 0) pos = 0
  else if (pos > volumeWidth) pos = volumeWidth
  document.querySelector<HTMLDivElement>('.vnow')!.style.width = pos + 'px'
  document.querySelector<HTMLDivElement>('.slider')!.style.left =
    pos - halfSlider + 'px'
  curPos = pos
  video.volume = curPos / volumeWidth
}

document.querySelector<HTMLDivElement>('.volume')!.onclick = (e) => {
  if (!rflag) setPos(e.offsetX)
  rflag = false
}
document.querySelector<HTMLDivElement>('.slider')!.onclick = (e) => {
  rflag = true
  let x = e.clientX
  document.onmousemove = (ev) => {
    let mx = ev.clientX
    let ls = mx - x + curPos
    setPos(ls)
  }
  document.onmouseup = () => {
    document.onmousemove = null
  }
}
// type barrageType = {
//   time: number
//   username: string
//   text: string
// }
// let barrageData: Array<barrageType> = []
// let barrage = {
//   data: [] as Array<barrageType>,
//   curTime: 0
// }
// const getBarrage = () => {
//   if (typeof bData != 'undefined') {
//     barrageData = bData
//   }
//   if (barrageData.length === 0) return
//   barrage.data = barrage.data.concat(barrageData)
//   barrage.data.sort((a, b) => {
//     return a.time - b.time
//   })
// }

// const showBarrage = () => {
//   if (barrage.data.length === 0) return
//   if (barrage.data[0].time > barrage.curTime) return
//   let data = barrage.data.shift()
//   let div = document.createElement('div')
//   let span = document.createElement('span')
//   let name = document.createTextNode(data!.username + ': ')
//   span.appendChild(name)
//   div.appendChild(span)
//   let text = document.createElement(data!.text)
//   div.appendChild(text)
//   let blist = document.querySelector('.blist')
//   blist?.appendChild(div)
// }
// video.ontimeupdate = () => {
//   barrage.curTime = video.currentTime
//   showBarrage()
// }

// document.querySelector<HTMLDivElement>('.btn')!.onclick = () => {
//   if (video.currentTime <= 0) return
//   let t = document.querySelector<HTMLInputElement>('.text')!.value
//   if (t.length === 0) return
//   barrage.data.unshift({
//     time: video.currentTime,
//     username: '我',
//     text: t
//   })
//   let data = typeof bData === 'undefined' ? barrageData : bData
//   data.push({
//     time: video.currentTime,
//     username: '我',
//     text: t
//   })
//   document.querySelector<HTMLInputElement>('.text')!.value = ''
// }
