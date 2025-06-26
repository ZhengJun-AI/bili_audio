'use client'

import { useEffect } from 'react'

export default function AnalyticsTest() {
  useEffect(() => {
    // 检查是否有 _vercel/insights 请求
    console.log('Analytics test page loaded')
    
    // 检查网络请求
    const checkAnalytics = () => {
      fetch('/_vercel/insights/view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: window.location.href,
          referrer: document.referrer,
        })
      })
      .then(response => {
        console.log('Analytics request status:', response.status)
        if (response.ok) {
          console.log('✅ Analytics is working!')
        } else {
          console.log('❌ Analytics request failed')
        }
      })
      .catch(error => {
        console.log('❌ Analytics error:', error)
      })
    }
    
    // 延迟执行以确保页面完全加载
    setTimeout(checkAnalytics, 1000)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Analytics 测试页面</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">检查步骤：</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>打开浏览器开发者工具 (F12)</li>
            <li>切换到 Network (网络) 标签</li>
            <li>刷新此页面</li>
            <li>查找对 <code className="bg-gray-100 px-2 py-1 rounded">/_vercel/insights/</code> 的请求</li>
            <li>检查 Console (控制台) 中的日志信息</li>
          </ol>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">预期结果：</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>✅ 应该看到对 <code className="bg-gray-100 px-2 py-1 rounded">/_vercel/insights/view</code> 的 POST 请求</li>
            <li>✅ 请求状态应该是 200 或 204</li>
            <li>✅ 控制台应该显示 "Analytics is working!"</li>
          </ul>
        </div>
        
        <div className="mt-6">
          <a 
            href="/" 
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            返回首页
          </a>
        </div>
      </div>
    </div>
  )
}