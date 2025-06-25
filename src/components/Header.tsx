'use client'

import { Music, Github, Heart } from 'lucide-react'

export default function Header() {
  return (
    <header className="text-center mb-12">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="p-3 bg-gradient-to-r from-bili-pink to-bili-blue rounded-full">
          <Music className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-bili-pink to-bili-blue bg-clip-text text-transparent">
          BiliAudio
        </h1>
      </div>
      
      <p className="text-xl text-gray-600 mb-6">
        轻量、快速、隐私友好的 B站音频下载工具
      </p>
      
      <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-red-500" />
          <span>免费开源</span>
        </div>
        <div className="flex items-center gap-2">
          <Github className="w-4 h-4" />
          <a 
            href="https://github.com/your-username/bili-audio-downloader" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-bili-pink transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  )
}