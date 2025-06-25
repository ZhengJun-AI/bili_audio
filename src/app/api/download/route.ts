import { NextRequest, NextResponse } from 'next/server'
import { getWbiKeys, encWbi, generateHeaders, buildSignedUrl } from '@/utils/wbi'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    let type: string
    let id: string
    
    // 支持两种格式：新格式 {type, id, originalUrl} 和旧格式 {url}
    if (body.type && body.id) {
      // 新格式：前端已经解析好的数据
      type = body.type
      id = body.id
    } else if (body.url && typeof body.url === 'string') {
      // 旧格式：需要后端解析URL
      const parsed = parseMediaUrl(body.url)
      if (!parsed.type || !parsed.id) {
        return NextResponse.json(
          {
            success: false,
            error: '无法解析URL，请检查链接格式'
          },
          { status: 400 }
        )
      }
      type = parsed.type
      id = parsed.id
    } else {
      return NextResponse.json(
        {
          success: false,
          error: '请提供有效的URL或解析数据'
        },
        { status: 400 }
      )
    }
    
    let audioInfo
    
    if (type === 'video') {
      audioInfo = await getVideoAudio(id)
    } else if (type === 'audio') {
      audioInfo = await getAudioDownload(id)
    } else {
      return NextResponse.json(
        {
          success: false,
          error: '不支持的媒体类型'
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: audioInfo
    })
  } catch (error) {
    console.error('Download audio error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '音频下载失败'
      },
      { status: 500 }
    )
  }
}

/**
 * 解析媒体URL
 */
function parseMediaUrl(url: string): { type: string; id: string } | { type: null; id: null } {
  try {
    const trimmedUrl = url.trim()
    
    // 处理短链接 b23.tv
    if (trimmedUrl.includes('b23.tv')) {
      return {
        type: 'video',
        id: trimmedUrl // 服务端会进一步解析
      }
    }
    
    // 视频链接匹配 - 更全面的模式
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
          id: id
        }
      }
    }
    
    // 音频链接匹配
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
          id: id
        }
      }
    }
    
    return { type: null, id: null }
  } catch (error) {
    console.error('Parse URL error:', error)
    return { type: null, id: null }
  }
}

/**
 * 获取视频的音频流
 */
async function getVideoAudio(bvid: string) {
  try {
    // 1. 获取视频基本信息
    const videoInfo = await getVideoBasicInfo(bvid)
    
    // 2. 获取视频播放信息
    const playInfo = await getVideoPlayInfo(bvid, videoInfo.cid)
    
    // 3. 提取音频流URL
    const audioUrl = extractAudioUrl(playInfo)
    
    return {
      title: videoInfo.title,
      cover: videoInfo.cover,
      duration: videoInfo.duration,
      author: videoInfo.author,
      downloadUrl: audioUrl,
      sourceType: 'video' as const,
      sourceId: bvid
    }
  } catch (error) {
    console.error('Get video audio failed:', error)
    throw new Error('获取视频音频失败')
  }
}

/**
 * 获取音频下载链接
 */
async function getAudioDownload(auid: string) {
  try {
    // 提取数字ID
    const audioId = auid.replace('au', '')
    
    // 1. 获取音频基本信息
    const audioInfo = await getAudioBasicInfo(audioId)
    
    // 2. 获取音频播放URL
    const playUrl = await getAudioPlayUrl(audioId)
    
    return {
      title: audioInfo.title,
      cover: audioInfo.cover,
      duration: audioInfo.duration,
      author: audioInfo.author,
      downloadUrl: playUrl,
      sourceType: 'audio' as const,
      sourceId: auid
    }
  } catch (error) {
    console.error('Get audio download failed:', error)
    throw new Error('获取音频下载链接失败')
  }
}

/**
 * 获取视频基本信息
 */
async function getVideoBasicInfo(bvid: string) {
  const url = 'https://api.bilibili.com/x/web-interface/view'
  const params = { bvid }
  
  const response = await fetch(`${url}?${new URLSearchParams(params)}`, {
    headers: generateHeaders()
  })
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  
  const data = await response.json()
  
  if (data.code !== 0) {
    throw new Error(data.message || '获取视频信息失败')
  }
  
  const videoData = data.data
  
  return {
    title: videoData.title,
    cover: videoData.pic,
    duration: videoData.duration,
    author: videoData.owner?.name,
    cid: videoData.cid
  }
}

/**
 * 获取视频播放信息
 */
async function getVideoPlayInfo(bvid: string, cid: number) {
  try {
    const wbiKeys = await getWbiKeys()
    const url = 'https://api.bilibili.com/x/player/playurl'
    const params = {
      bvid,
      cid: cid.toString(),
      qn: '80',
      fnval: '16',
      fnver: '0',
      fourk: '1'
    }
    
    const signedUrl = buildSignedUrl(url, params, wbiKeys)
    
    const response = await fetch(signedUrl, {
      headers: generateHeaders()
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.code !== 0) {
      throw new Error(data.message || '获取播放信息失败')
    }
    
    return data.data
  } catch (error) {
    console.error('Get video play info failed:', error)
    throw new Error('获取视频播放信息失败')
  }
}

/**
 * 从播放信息中提取音频URL
 */
function extractAudioUrl(playInfo: any): string {
  try {
    // 优先选择音频流
    if (playInfo.dash && playInfo.dash.audio && playInfo.dash.audio.length > 0) {
      // 选择最高质量的音频流
      const audioStreams = playInfo.dash.audio.sort((a: any, b: any) => b.bandwidth - a.bandwidth)
      return audioStreams[0].baseUrl || audioStreams[0].base_url
    }
    
    // 如果没有单独的音频流，尝试从视频流中提取
    if (playInfo.durl && playInfo.durl.length > 0) {
      return playInfo.durl[0].url
    }
    
    throw new Error('未找到可用的音频流')
  } catch (error) {
    console.error('Extract audio URL failed:', error)
    throw new Error('提取音频URL失败')
  }
}

/**
 * 获取音频基本信息
 */
async function getAudioBasicInfo(audioId: string) {
  const url = 'https://api.bilibili.com/audio/music-service-c/songs/playing'
  const params = { song_id: audioId }
  
  const response = await fetch(`${url}?${new URLSearchParams(params)}`, {
    headers: generateHeaders()
  })
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  
  const data = await response.json()
  
  if (data.code !== 0) {
    throw new Error(data.message || '获取音频信息失败')
  }
  
  const audioData = data.data
  
  return {
    title: audioData.title,
    cover: audioData.cover,
    duration: audioData.duration,
    author: audioData.author
  }
}

/**
 * 获取音频播放URL
 */
async function getAudioPlayUrl(audioId: string): Promise<string> {
  try {
    const wbiKeys = await getWbiKeys()
    const url = 'https://api.bilibili.com/audio/music-service-c/url'
    const params = {
      songid: audioId,
      quality: '2',
      privilege: '2',
      mid: '0'
    }
    
    const signedUrl = buildSignedUrl(url, params, wbiKeys)
    
    const response = await fetch(signedUrl, {
      headers: generateHeaders()
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.code !== 0) {
      throw new Error(data.message || '获取音频播放URL失败')
    }
    
    if (!data.data || !data.data.cdns || data.data.cdns.length === 0) {
      throw new Error('未找到可用的音频下载链接')
    }
    
    return data.data.cdns[0]
  } catch (error) {
    console.error('Get audio play URL failed:', error)
    throw new Error('获取音频播放URL失败')
  }
}