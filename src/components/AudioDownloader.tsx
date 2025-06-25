'use client'

import { useState } from 'react'
import { Download, Loader2, AlertCircle, ExternalLink, Music, Video, ImageIcon } from 'lucide-react'
import { parseUrl, validateUrl } from '@/utils/urlParser'
import { downloadAudio } from '@/utils/api'
import { saveToHistory } from '@/utils/storage'

interface AudioInfo {
  title: string
  cover: string
  duration?: number
  author?: string
  downloadUrl: string
  sourceType: 'video' | 'audio'
  sourceId: string
}

export default function AudioDownloader() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [audioInfo, setAudioInfo] = useState<AudioInfo | null>(null)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setLoading(true)
    setError('')
    setAudioInfo(null)
    setImageError(false)

    try {
      // 验证和解析URL
      const validation = validateUrl(url)
      if (!validation.isValid) {
        throw new Error(validation.error || '链接格式不正确')
      }

      const parsedUrl = parseUrl(url)
      if (!parsedUrl) {
        throw new Error('无法解析链接，请检查链接格式')
      }

      // 调用API获取音频信息
      const result = await downloadAudio(parsedUrl)
      setAudioInfo(result)

      // 保存到历史记录
      saveToHistory({
        id: parsedUrl.id,
        title: result.title,
        cover: result.cover,
        sourceType: result.sourceType,
        timestamp: Date.now()
      })

    } catch (err) {
      setError(err instanceof Error ? err.message : '解析失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!audioInfo) return

    setDownloading(true)
    try {
      // 创建下载链接
      const link = document.createElement('a')
      link.href = audioInfo.downloadUrl
      link.download = `${audioInfo.title}.mp3`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      setError('下载失败，请稍后重试')
    } finally {
      setDownloading(false)
    }
  }

  const resetForm = () => {
    setUrl('')
    setAudioInfo(null)
    setError('')
    setImageError(false)
  }

  return (
    <div className="card">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          B站音频下载器
        </h2>
        <p className="text-gray-600">
          支持视频音频提取和纯音频下载
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            粘贴B站链接
          </label>
          <div className="flex gap-2">
            <input
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.bilibili.com/video/BV... 或 https://www.bilibili.com/audio/au..."
              className="input-field flex-1"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="btn-primary px-6 flex items-center gap-2 whitespace-nowrap"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              解析
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            支持 bilibili.com 和 b23.tv 短链接
          </p>
        </div>
      </form>

      {/* 错误提示 */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">解析失败</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* 音频信息展示 */}
      {audioInfo && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-4">
            {!imageError && audioInfo.cover ? (
              <img
                src={audioInfo.cover}
                alt={audioInfo.title}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {audioInfo.sourceType === 'video' ? (
                  <Video className="w-4 h-4 text-bili-blue" />
                ) : (
                  <Music className="w-4 h-4 text-bili-pink" />
                )}
                <span className="text-xs text-gray-500 uppercase">
                  {audioInfo.sourceType === 'video' ? '视频音频' : '纯音频'}
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                {audioInfo.title}
              </h3>
              {audioInfo.author && (
                <p className="text-sm text-gray-600 mb-2">
                  UP主: {audioInfo.author}
                </p>
              )}
              {audioInfo.duration && (
                <p className="text-sm text-gray-500">
                  时长: {Math.floor(audioInfo.duration / 60)}:{(audioInfo.duration % 60).toString().padStart(2, '0')}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="btn-primary flex items-center gap-2 flex-1"
            >
              {downloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {downloading ? '下载中...' : '下载音频'}
            </button>
            <button
              onClick={resetForm}
              className="btn-secondary"
            >
              重新解析
            </button>
          </div>
          
          {/* 格式说明 */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-blue-800 font-medium mb-1">文件格式说明</p>
                <p className="text-blue-700 mb-2">
                  下载的文件为 <code className="bg-blue-100 px-1 rounded text-xs">.m4s</code> 格式，这是B站的原始音频格式。
                </p>
                <p className="text-blue-700 mb-2">如需转换为常用格式（如MP3），推荐使用以下工具：</p>
                <ul className="text-blue-700 text-xs space-y-1 ml-4">
                  <li>• <strong>在线转换：</strong> 
                    <a href="https://convertio.co/zh/m4s-mp3/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                      Convertio
                    </a> 或 
                    <a href="https://www.aconvert.com/cn/audio/m4s-to-mp3/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                      AConvert
                    </a>
                  </li>
                  <li>• <strong>桌面软件：</strong> FFmpeg、格式工厂、VLC媒体播放器</li>
                  <li>• <strong>命令行：</strong> <code className="bg-blue-100 px-1 rounded">ffmpeg -i input.m4s output.mp3</code></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}