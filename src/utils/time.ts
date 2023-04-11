export const timeUtil = (time: number): string => {
  time = Math.floor(time)
  let haveHour = time >= 3600
  let h: string | number = Math.floor(time / 3600)
  let m: string | number = Math.floor((time - h * 3600) / 60)
  let s: string | number = time - h * 3600 - m * 60
  m = m < 10 ? '0' + m : m
  s = s < 10 ? '0' + s : s
  if (haveHour) {
    h = h < 10 ? '0' + h : h
    return h + ':' + m + ':' + s
  }
  return m + ':' + s
}
