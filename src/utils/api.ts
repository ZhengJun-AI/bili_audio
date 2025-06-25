import { ParsedUrl } from './urlParser'

export interface AudioInfo {
  title: string
  cover: string
  duration?: number
  author?: string
  downloadUrl: string
  sourceType: 'video' | 'audio'
  sourceId: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * 调用后端API下载音频
 */
export async function downloadAudio(parsedUrl: ParsedUrl): Promise<AudioInfo> {
  try {
    const response = await fetch('/api/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: parsedUrl.type,
        id: parsedUrl.id,
        originalUrl: parsedUrl.originalUrl
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }

    const result: ApiResponse<AudioInfo> = await response.json()
    
    if (!result.success || !result.data) {
      throw new Error(result.error || '解析失败')
    }

    return result.data
  } catch (error) {
    console.error('API call failed:', error)
    
    if (error instanceof Error) {
      // 处理常见错误类型
      if (error.message.includes('fetch')) {
        throw new Error('网络连接失败，请检查网络连接')
      }
      if (error.message.includes('404')) {
        throw new Error('视频或音频不存在，请检查链接是否正确')
      }
      if (error.message.includes('403')) {
        throw new Error('访问被拒绝，可能是私有内容或地区限制')
      }
      if (error.message.includes('500')) {
        throw new Error('服务器内部错误，请稍后重试')
      }
      throw error
    }
    
    throw new Error('未知错误，请稍后重试')
  }
}

/**
 * 解析短链接
 */
export async function resolveShortUrl(shortUrl: string): Promise<string> {
  try {
    const response = await fetch('/api/resolve-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: shortUrl })
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const result: ApiResponse<{ resolvedUrl: string }> = await response.json()
    
    if (!result.success || !result.data) {
      throw new Error(result.error || '短链接解析失败')
    }

    return result.data.resolvedUrl
  } catch (error) {
    console.error('Short URL resolution failed:', error)
    throw new Error('短链接解析失败，请使用完整链接')
  }
}

/**
 * 获取视频/音频基本信息（不包含下载链接）
 */
export async function getMediaInfo(parsedUrl: ParsedUrl): Promise<Omit<AudioInfo, 'downloadUrl'>> {
  try {
    const response = await fetch('/api/info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: parsedUrl.type,
        id: parsedUrl.id
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const result: ApiResponse<Omit<AudioInfo, 'downloadUrl'>> = await response.json()
    
    if (!result.success || !result.data) {
      throw new Error(result.error || '获取信息失败')
    }

    return result.data
  } catch (error) {
    console.error('Get media info failed:', error)
    throw new Error('获取媒体信息失败')
  }
}

/**
 * 检查服务状态
 */
export async function checkServiceStatus(): Promise<boolean> {
  try {
    const response = await fetch('/api/health', {
      method: 'GET',
      cache: 'no-cache'
    })
    
    return response.ok
  } catch (error) {
    console.error('Service health check failed:', error)
    return false
  }
}