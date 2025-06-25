'use client'

import { useState } from 'react'
import { Download, Music, Video, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import AudioDownloader from '@/components/AudioDownloader'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HistorySection from '@/components/HistorySection'

export default function Home() {
  return (
    <>
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            BiliAudio Downloader
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            免费在线B站音频下载器
          </p>
          <p className="text-lg text-gray-500 mb-8">
            支持从Bilibili视频和音频中提取高质量MP3音频文件，无需注册，隐私安全
          </p>
        </section>
        
        {/* 主要功能区域 */}
        <section className="mb-12" aria-label="音频下载工具">
          <AudioDownloader />
        </section>
        
        {/* 功能介绍 */}
        <section className="mb-12" aria-label="功能特色">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            为什么选择 BiliAudio Downloader？
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <article className="card text-center">
              <Video className="w-12 h-12 text-bili-blue mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-lg font-semibold mb-2">视频音频提取</h3>
              <p className="text-gray-600 text-sm">
                从B站视频中提取高质量音频，支持多种格式和码率，保持原始音质
              </p>
            </article>
            
            <article className="card text-center">
              <Music className="w-12 h-12 text-bili-pink mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-lg font-semibold mb-2">纯音频下载</h3>
              <p className="text-gray-600 text-sm">
                直接下载B站音频区的音乐内容，支持MP3格式，快速便捷
              </p>
            </article>
            
            <article className="card text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-lg font-semibold mb-2">隐私保护</h3>
              <p className="text-gray-600 text-sm">
                无需登录注册，不收集个人信息，所有处理在服务端安全完成
              </p>
            </article>
          </div>
        </section>
        
        {/* 使用说明 */}
        <section className="mb-12" aria-label="使用说明">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            如何使用？
          </h2>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <ol className="space-y-4">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-bili-blue text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4">1</span>
                <div>
                  <h4 className="font-semibold text-gray-900">复制B站链接</h4>
                  <p className="text-gray-600 text-sm">复制您想要下载音频的B站视频或音频链接</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-bili-blue text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4">2</span>
                <div>
                  <h4 className="font-semibold text-gray-900">粘贴并解析</h4>
                  <p className="text-gray-600 text-sm">将链接粘贴到输入框中，点击解析按钮</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-bili-blue text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4">3</span>
                <div>
                  <h4 className="font-semibold text-gray-900">下载音频</h4>
                  <p className="text-gray-600 text-sm">解析完成后，点击下载按钮即可获取MP3音频文件</p>
                </div>
              </li>
            </ol>
          </div>
        </section>
        
        {/* 历史记录 */}
        <section aria-label="下载历史">
          <HistorySection />
        </section>
      </main>
      
      <Footer />
    </>
  )
}