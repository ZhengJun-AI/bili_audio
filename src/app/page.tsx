'use client'

import { useState } from 'react'
import { Download, Music, Video, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import AudioDownloader from '@/components/AudioDownloader'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HistorySection from '@/components/HistorySection'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <Header />
      
      {/* 主要功能区域 */}
      <div className="mb-12">
        <AudioDownloader />
      </div>
      
      {/* 功能介绍 */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="card text-center">
          <Video className="w-12 h-12 text-bili-blue mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">视频音频提取</h3>
          <p className="text-gray-600 text-sm">
            从B站视频中提取高质量音频，支持多种格式和码率
          </p>
        </div>
        
        <div className="card text-center">
          <Music className="w-12 h-12 text-bili-pink mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">纯音频下载</h3>
          <p className="text-gray-600 text-sm">
            直接下载B站音频区的音乐内容，保持原始音质
          </p>
        </div>
        
        <div className="card text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">隐私保护</h3>
          <p className="text-gray-600 text-sm">
            无需登录，不收集个人信息，所有处理在服务端完成
          </p>
        </div>
      </div>
      
      {/* 历史记录 */}
      <HistorySection />
      
      <Footer />
    </main>
  )
}