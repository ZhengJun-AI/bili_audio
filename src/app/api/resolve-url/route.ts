import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: '请提供有效的URL'
        },
        { status: 400 }
      )
    }
    
    // 解析短链接
    const resolvedUrl = await resolveShortUrl(url)
    
    return NextResponse.json({
      success: true,
      data: {
        resolvedUrl
      }
    })
  } catch (error) {
    console.error('Resolve URL error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '短链接解析失败'
      },
      { status: 500 }
    )
  }
}

/**
 * 解析B站短链接
 */
async function resolveShortUrl(shortUrl: string): Promise<string> {
  try {
    // 对于b23.tv短链接，通过HEAD请求获取重定向地址
    if (shortUrl.includes('b23.tv')) {
      const response = await fetch(shortUrl, {
        method: 'HEAD',
        redirect: 'manual',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
        }
      })
      
      const location = response.headers.get('location')
      if (location) {
        return location
      }
      
      // 如果没有重定向，尝试GET请求
      const getResponse = await fetch(shortUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
        }
      })
      
      return getResponse.url
    }
    
    // 如果不是短链接，直接返回
    return shortUrl
  } catch (error) {
    console.error('Short URL resolution failed:', error)
    throw new Error('短链接解析失败')
  }
}