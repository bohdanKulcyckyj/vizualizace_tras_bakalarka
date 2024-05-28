console.log('CHACHE IS CREATED')

declare global {
  interface Window {
    customCache: { [key: string]: any }
  }
}

window.customCache = window.customCache ?? {}

export const getCachedData = (url: string) => {
  if (window.customCache?.[url]) {
    console.log('loading from cache')
    console.log(window.customCache[url])
    return window.customCache[url]
  }
  return null
}

export const setCachedData = (url: string, data: any) => {
  console.log('setting cache')
  window.customCache[url] = data
}
