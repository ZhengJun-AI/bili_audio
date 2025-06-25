import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BiliAudio Downloader - B站音频下载器',
  description: '一个轻量、快速、注重隐私的 Bilibili 音频内容下载工具',
  keywords: ['bilibili', 'audio', 'download', 'B站', '音频下载'],
  authors: [{ name: 'BiliAudio Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'BiliAudio Downloader',
    description: '从B站视频和音频中提取高质量音频文件',
    type: 'website',
    locale: 'zh_CN',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
          {children}
        </div>
      </body>
    </html>
  )
}