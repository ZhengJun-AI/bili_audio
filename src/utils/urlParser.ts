export interface ParsedUrl {
  type: 'video' | 'audio'
  id: string
  originalUrl: string
}

export interface UrlValidation {
  isValid: boolean
  error?: string
}

/**
 * 验证URL是否为有效的B站链接
 */
export function validateUrl(url: string): UrlValidation {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: '请输入有效的链接' }
  }

  const trimmedUrl = url.trim()
  
  // 检查是否包含有效域名
  const validDomains = [
    'bilibili.com',
    'www.bilibili.com', 
    'b23.tv',
    'm.bilibili.com',
    'space.bilibili.com'
  ]
  
  const hasValidDomain = validDomains.some(domain => 
    trimmedUrl.includes(domain)
  )
  
  // 检查是否是纯ID格式（BV号、AV号、AU号）
  const idPatterns = [
    /^BV[a-zA-Z0-9]+$/,
    /^av\d+$/i,
    /^au\d+$/i
  ]
  
  const isValidId = idPatterns.some(pattern => 
    pattern.test(trimmedUrl)
  )
  
  // 检查是否包含有效的视频或音频ID
  const containsValidContent = [
    /BV[a-zA-Z0-9]+/,
    /av\d+/i,
    /au\d+/i
  ].some(pattern => pattern.test(trimmedUrl))
  
  if (!hasValidDomain && !isValidId && !containsValidContent) {
    return { 
      isValid: false, 
      error: '请输入有效的B站链接或ID（支持 BV号、AV号、AU号）' 
    }
  }

  return { isValid: true }
}

/**
 * 解析B站URL，提取视频ID或音频ID
 */
export function parseUrl(url: string): ParsedUrl | null {
  try {
    const trimmedUrl = url.trim()
    
    // 处理短链接 b23.tv
    if (trimmedUrl.includes('b23.tv')) {
      // 短链接需要在服务端解析，这里先返回原始URL
      return {
        type: 'video', // 默认假设是视频，服务端会进一步解析
        id: trimmedUrl,
        originalUrl: trimmedUrl
      }
    }
    
    // 解析视频链接 - 更全面的模式匹配
    const videoPatterns = [
      // 标准视频链接
      /\/video\/(BV[a-zA-Z0-9]+)/,
      /\/video\/(av\d+)/,
      // URL参数形式
      /[?&]bvid=([a-zA-Z0-9]+)/,
      /[?&]aid=(\d+)/,
      // 直接的BV号或AV号
      /^(BV[a-zA-Z0-9]+)$/,
      /^(av\d+)$/i,
      // 包含BV号的任意位置
      /(BV[a-zA-Z0-9]+)/,
      /(av\d+)/i
    ]
    
    for (const pattern of videoPatterns) {
      const match = trimmedUrl.match(pattern)
      if (match) {
        let id = match[1]
        // 确保BV号格式正确
        if (id.match(/^[a-zA-Z0-9]+$/) && !id.startsWith('BV') && !id.startsWith('av')) {
          id = 'BV' + id
        }
        return {
          type: 'video',
          id: id,
          originalUrl: trimmedUrl
        }
      }
    }
    
    // 解析音频链接
    const audioPatterns = [
      /\/audio\/(au\d+)/,
      /[?&]auid=(\d+)/,
      /^(au\d+)$/,
      /(au\d+)/
    ]
    
    for (const pattern of audioPatterns) {
      const match = trimmedUrl.match(pattern)
      if (match) {
        let id = match[1]
        if (!id.startsWith('au')) {
          id = 'au' + id
        }
        return {
          type: 'audio',
          id: id,
          originalUrl: trimmedUrl
        }
      }
    }
    
    return null
  } catch (error) {
    console.error('URL parsing error:', error)
    return null
  }
}

/**
 * 标准化BVID格式
 */
export function normalizeBvid(id: string): string {
  if (id.startsWith('BV')) {
    return id
  }
  if (id.startsWith('av')) {
    // 如果是av号，保持原样，服务端会处理转换
    return id
  }
  return `BV${id}`
}

/**
 * 标准化音频ID格式
 */
export function normalizeAuid(id: string): string {
  if (id.startsWith('au')) {
    return id
  }
  return `au${id}`
}

/**
 * 从URL中提取干净的ID
 */
export function extractCleanId(parsedUrl: ParsedUrl): string {
  if (parsedUrl.type === 'video') {
    return normalizeBvid(parsedUrl.id)
  } else {
    return normalizeAuid(parsedUrl.id)
  }
}