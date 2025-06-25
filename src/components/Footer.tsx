'use client'

import { Shield, Zap, Users } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-16 pt-8 border-t border-gray-200">
      {/* 特性说明 */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="text-center">
          <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <h4 className="font-semibold text-gray-800 mb-1">隐私保护</h4>
          <p className="text-sm text-gray-600">
            无需登录，不收集个人信息
          </p>
        </div>
        
        <div className="text-center">
          <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <h4 className="font-semibold text-gray-800 mb-1">快速解析</h4>
          <p className="text-sm text-gray-600">
            基于 Vercel 边缘计算，全球加速
          </p>
        </div>
        
        <div className="text-center">
          <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <h4 className="font-semibold text-gray-800 mb-1">开源免费</h4>
          <p className="text-sm text-gray-600">
            完全开源，社区驱动开发
          </p>
        </div>
      </div>
      
      {/* 使用说明 */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-gray-800 mb-4">使用说明</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">支持的链接格式：</h4>
            <ul className="space-y-1">
              <li>• 视频: https://www.bilibili.com/video/BV...</li>
              <li>• 音频: https://www.bilibili.com/audio/au...</li>
              <li>• 短链: https://b23.tv/...</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">注意事项：</h4>
            <ul className="space-y-1">
              <li>• 仅支持公开可访问的内容</li>
              <li>• 请遵守版权法律法规</li>
              <li>• 建议仅用于个人学习和欣赏</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* 版权信息 */}
      <div className="text-center text-sm text-gray-500">
        <p className="mb-2">
          © 2024 BiliAudio Downloader. 本工具仅供学习交流使用。
        </p>
        <p>
          请遵守相关法律法规，尊重内容创作者的版权。
        </p>
      </div>
    </footer>
  )
}