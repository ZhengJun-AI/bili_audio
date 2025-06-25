import CryptoJS from 'crypto-js'

// WBI签名相关常量
const mixinKeyEncTab = [
  46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49,
  33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40,
  61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11,
  36, 20, 34, 44, 52
]

// 默认的img_key和sub_key（备用）
const DEFAULT_IMG_KEY = "7cd084941338484aae1ad9425b84077c"
const DEFAULT_SUB_KEY = "4932caff0ff746eab6f01bf08b70ac45"

export interface WbiKeys {
  img_key: string
  sub_key: string
}

export interface SignedParams {
  [key: string]: string | number
  wts: number
  w_rid: string
}

/**
 * 对 imgKey 和 subKey 进行字符顺序打乱编码
 */
function getMixinKey(orig: string): string {
  return mixinKeyEncTab.reduce((s, i) => s + orig[i], '').slice(0, 32)
}

/**
 * 为请求参数进行 wbi 签名
 */
export function encWbi(
  params: Record<string, string | number>, 
  imgKey: string, 
  subKey: string
): SignedParams {
  const mixinKey = getMixinKey(imgKey + subKey)
  const currTime = Math.round(Date.now() / 1000)
  
  // 添加 wts 字段
  const newParams: Record<string, string | number> = { ...params, wts: currTime }
  
  // 按照 key 重排参数
  const sortedParams = Object.keys(newParams)
    .sort()
    .reduce((result, key) => {
      result[key] = newParams[key]
      return result
    }, {} as Record<string, string | number>)
  
  // 过滤 value 中的 "!'()*" 字符
  const filteredParams = Object.keys(sortedParams).reduce((result, key) => {
    const value = String(sortedParams[key])
    result[key] = value.replace(/[!'()*]/g, '')
    return result
  }, {} as Record<string, string>)
  
  // 序列化参数
  const query = Object.keys(filteredParams)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(filteredParams[key])}`)
    .join('&')
  
  // 计算 w_rid
  const wbiSign = CryptoJS.MD5(query + mixinKey).toString()
  
  return {
    ...filteredParams,
    wts: currTime,
    w_rid: wbiSign
  }
}

/**
 * 获取最新的 img_key 和 sub_key
 */
export async function getWbiKeys(): Promise<WbiKeys> {
  try {
    const response = await fetch('https://api.bilibili.com/x/web-interface/nav', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Referer': 'https://www.bilibili.com/'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.code !== 0) {
      throw new Error(`API Error: ${data.message}`)
    }
    
    const imgUrl = data.data.wbi_img.img_url
    const subUrl = data.data.wbi_img.sub_url
    
    const imgKey = imgUrl.split('/').pop()?.split('.')[0] || DEFAULT_IMG_KEY
    const subKey = subUrl.split('/').pop()?.split('.')[0] || DEFAULT_SUB_KEY
    
    return { img_key: imgKey, sub_key: subKey }
  } catch (error) {
    console.error('Failed to get WBI keys:', error)
    // 返回默认密钥
    return { img_key: DEFAULT_IMG_KEY, sub_key: DEFAULT_SUB_KEY }
  }
}

/**
 * 生成标准的请求头
 */
export function generateHeaders(cookie?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Referer': 'https://www.bilibili.com/'
  }
  
  if (cookie) {
    headers['Cookie'] = cookie
  }
  
  return headers
}

/**
 * 构建带WBI签名的URL
 */
export function buildSignedUrl(
  baseUrl: string, 
  params: Record<string, string | number>, 
  wbiKeys: WbiKeys
): string {
  const signedParams = encWbi(params, wbiKeys.img_key, wbiKeys.sub_key)
  const query = Object.keys(signedParams)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(signedParams[key])}`)
    .join('&')
  
  return `${baseUrl}?${query}`
}