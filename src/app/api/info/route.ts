import { NextRequest, NextResponse } from 'next/server'
import { getWbiKeys, encWbi, generateHeaders } from '@/utils/wbi'

export async function POST(request: NextRequest) {
  try {
    const { type, id } = await request.json()
    
    if (!type || !id) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少必要参数'
        },
        { status: 400 }
      )
    }
    
    let mediaInfo
    
    if (type === 'video') {
      mediaInfo = await getVideoInfo(id)
    } else if (type === 'audio') {
      mediaInfo = await getAudioInfo(id)
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
      data: mediaInfo
    })
  } catch (error) {
    console.error('Get media info error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '获取媒体信息失败'
      },
      { status: 500 }
    )
  }
}

/**
 * 获取视频信息
 */
async function getVideoInfo(bvid: string) {
  try {
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
      sourceType: 'video' as const,
      sourceId: bvid
    }
  } catch (error) {
    console.error('Get video info failed:', error)
    throw new Error('获取视频信息失败')
  }
}

/**
 * 获取音频信息
 */
async function getAudioInfo(auid: string) {
  try {
    // 提取数字ID
    const audioId = auid.replace('au', '')
    
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
      author: audioData.author,
      sourceType: 'audio' as const,
      sourceId: auid
    }
  } catch (error) {
    console.error('Get audio info failed:', error)
    throw new Error('获取音频信息失败')
  }
}