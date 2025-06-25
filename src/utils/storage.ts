export interface HistoryItem {
  id: string
  title: string
  cover: string
  sourceType: 'video' | 'audio'
  timestamp: number
}

const STORAGE_KEY = 'bili_audio_history'
const MAX_HISTORY_ITEMS = 10

/**
 * 获取历史记录
 */
export function getHistory(): HistoryItem[] {
  if (typeof window === 'undefined') {
    return []
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return []
    }
    
    const history = JSON.parse(stored) as HistoryItem[]
    
    // 按时间戳降序排序
    return history.sort((a, b) => b.timestamp - a.timestamp)
  } catch (error) {
    console.error('Failed to load history:', error)
    return []
  }
}

/**
 * 保存到历史记录
 */
export function saveToHistory(item: HistoryItem): void {
  if (typeof window === 'undefined') {
    return
  }
  
  try {
    const currentHistory = getHistory()
    
    // 检查是否已存在相同的项目（基于ID和类型）
    const existingIndex = currentHistory.findIndex(
      h => h.id === item.id && h.sourceType === item.sourceType
    )
    
    let newHistory: HistoryItem[]
    
    if (existingIndex >= 0) {
      // 如果已存在，更新时间戳并移到最前面
      newHistory = [...currentHistory]
      newHistory[existingIndex] = { ...item, timestamp: Date.now() }
      // 移到最前面
      const updatedItem = newHistory.splice(existingIndex, 1)[0]
      newHistory.unshift(updatedItem)
    } else {
      // 如果不存在，添加到最前面
      newHistory = [item, ...currentHistory]
    }
    
    // 限制历史记录数量
    if (newHistory.length > MAX_HISTORY_ITEMS) {
      newHistory = newHistory.slice(0, MAX_HISTORY_ITEMS)
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
    
    // 触发storage事件，通知其他组件更新
    window.dispatchEvent(new Event('storage'))
  } catch (error) {
    console.error('Failed to save history:', error)
  }
}

/**
 * 清空历史记录
 */
export function clearHistory(): void {
  if (typeof window === 'undefined') {
    return
  }
  
  try {
    localStorage.removeItem(STORAGE_KEY)
    
    // 触发storage事件，通知其他组件更新
    window.dispatchEvent(new Event('storage'))
  } catch (error) {
    console.error('Failed to clear history:', error)
  }
}

/**
 * 从历史记录中删除指定项目
 */
export function removeFromHistory(id: string, sourceType: 'video' | 'audio'): void {
  if (typeof window === 'undefined') {
    return
  }
  
  try {
    const currentHistory = getHistory()
    const newHistory = currentHistory.filter(
      item => !(item.id === id && item.sourceType === sourceType)
    )
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
    
    // 触发storage事件，通知其他组件更新
    window.dispatchEvent(new Event('storage'))
  } catch (error) {
    console.error('Failed to remove from history:', error)
  }
}

/**
 * 获取历史记录统计信息
 */
export function getHistoryStats(): {
  total: number
  videoCount: number
  audioCount: number
  oldestTimestamp?: number
  newestTimestamp?: number
} {
  const history = getHistory()
  
  if (history.length === 0) {
    return {
      total: 0,
      videoCount: 0,
      audioCount: 0
    }
  }
  
  const videoCount = history.filter(item => item.sourceType === 'video').length
  const audioCount = history.filter(item => item.sourceType === 'audio').length
  
  const timestamps = history.map(item => item.timestamp)
  const oldestTimestamp = Math.min(...timestamps)
  const newestTimestamp = Math.max(...timestamps)
  
  return {
    total: history.length,
    videoCount,
    audioCount,
    oldestTimestamp,
    newestTimestamp
  }
}