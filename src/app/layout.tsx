import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'BiliAudio Downloader - B站音频下载器 | 免费在线提取B站音频',
    template: '%s | BiliAudio Downloader'
  },
  description: '免费在线B站音频下载器，支持从Bilibili视频和音频中提取高质量MP3音频文件。无需注册，隐私安全，快速便捷的B站音频下载工具。',
  keywords: [
    'bilibili音频下载', 'B站音频提取', 'bilibili下载器', 'B站视频转音频', 
    'MP3下载', '在线音频下载', 'bilibili audio downloader', 'B站音频工具',
    '免费音频下载', 'bilibili音频转换', 'B站音频保存', '哔哩哔哩音频下载'
  ],
  authors: [{ name: 'BiliAudio Team', url: 'https://github.com/ZhengJun-AI/bili_audio' }],
  creator: 'BiliAudio Team',
  publisher: 'BiliAudio Team',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://bili-audio.vercel.app'),
  alternates: {
    canonical: '/',
    languages: {
      'zh-CN': '/zh-CN',
      'en-US': '/en-US',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://bili-audio.vercel.app',
    title: 'BiliAudio Downloader - 免费B站音频下载器',
    description: '免费在线B站音频下载器，支持从Bilibili视频和音频中提取高质量MP3音频文件。无需注册，隐私安全，快速便捷。',
    siteName: 'BiliAudio Downloader',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BiliAudio Downloader - B站音频下载器',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BiliAudio Downloader - 免费B站音频下载器',
    description: '免费在线B站音频下载器，支持从Bilibili视频和音频中提取高质量MP3音频文件',
    images: ['/og-image.png'],
    creator: '@BiliAudio',
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'BiliAudio Downloader',
    description: '免费在线B站音频下载器，支持从Bilibili视频和音频中提取高质量MP3音频文件',
    url: 'https://bili-audio.vercel.app',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    author: {
      '@type': 'Organization',
      name: 'BiliAudio Team',
      url: 'https://github.com/ZhengJun-AI/bili_audio'
    },
    featureList: [
      '支持Bilibili视频音频提取',
      '高质量MP3格式输出',
      '无需注册使用',
      '隐私安全保护',
      '免费在线服务'
    ],
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    softwareVersion: '1.0.0',
    datePublished: '2024-01-01',
    inLanguage: 'zh-CN'
  }

  return (
    <html lang="zh-CN">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//api.bilibili.com" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BiliAudio" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
          {children}
        </div>
        <Analytics mode="production" />
      </body>
    </html>
  )
}