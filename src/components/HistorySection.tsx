'use client'

import { useState, useEffect } from 'react'
import { Clock, Download, Trash2, Music, Video } from 'lucide-react'
import { getHistory, clearHistory, HistoryItem } from '@/utils/storage'

export default function HistorySection() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    const loadHistory = () => {
      const historyData = getHistory()
      setHistory(historyData)
    }
    
    loadHistory()
    
    // 监听 storage 事件，当其他标签页更新历史记录时同步
    const handleStorageChange = () => {
      loadHistory()
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleClearHistory = () => {
    if (confirm('确定要清空所有历史记录吗？')) {
      clearHistory()
      setHistory([])
    }
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60000) {
      return '刚刚'
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}分钟前`
    } else if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)}小时前`
    } else {
      return date.toLocaleDateString('zh-CN')
    }
  }

  if (history.length === 0) {
    return null
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-800">
            最近下载
          </h3>
          <span className="text-sm text-gray-500">({history.length})</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-sm text-bili-pink hover:text-pink-600 transition-colors"
          >
            {showHistory ? '收起' : '展开'}
          </button>
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-sm text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              清空
            </button>
          )}
        </div>
      </div>

      {showHistory && (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {history.map((item) => (
            <div
              key={`${item.id}-${item.timestamp}`}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <img
                src={item.cover}
                alt={item.title}
                className="w-12 h-12 rounded object-cover flex-shrink-0"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {item.sourceType === 'video' ? (
                    <Video className="w-3 h-3 text-bili-blue" />
                  ) : (
                    <Music className="w-3 h-3 text-bili-pink" />
                  )}
                  <span className="text-xs text-gray-500 uppercase">
                    {item.sourceType === 'video' ? '视频' : '音频'}
                  </span>
                </div>
                <h4 className="font-medium text-gray-800 text-sm line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500">
                  {formatTime(item.timestamp)}
                </p>
              </div>
              
              <button
                onClick={() => {
                  // 重新解析这个链接
                  const url = item.sourceType === 'video' 
                    ? `https://www.bilibili.com/video/${item.id}`
                    : `https://www.bilibili.com/audio/${item.id}`
                  
                  // 可以触发重新解析或者直接跳转
                  window.open(url, '_blank')
                }}
                className="p-2 text-gray-400 hover:text-bili-pink transition-colors"
                title="重新下载"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}