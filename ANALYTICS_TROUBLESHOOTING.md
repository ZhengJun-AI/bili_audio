# Vercel Analytics 故障排除指南

## 问题描述
Vercel Analytics 无法正常工作，可能是对 `_vercel` 路径的访问被阻止。

## 已实施的解决方案

### 1. 修复 robots.txt 配置

**问题**: `robots.txt` 文件可能阻止了对 Analytics 相关路径的访问。

**解决方案**: 
- 在 `public/robots.txt` 中添加了 `Allow: /_vercel/` 规则
- 在 `src/app/robots.ts` 中更新了动态 robots 配置，移除了对 `/_next/` 的限制

### 2. 创建 vercel.json 配置

**问题**: 缺少 Vercel 部署配置可能影响 Analytics 功能。

**解决方案**: 创建了 `vercel.json` 文件，包含：
- API 路由的超时配置
- `/_vercel/` 路径的缓存头配置

### 3. 修复 Analytics 组件配置

**问题**: Analytics 组件可能使用了错误的导入路径或配置。

**解决方案**: 
- 使用正确的导入路径：`@vercel/analytics/next`
- 添加了调试模式配置：`debug={process.env.NODE_ENV === 'development'}`

### 4. 创建测试页面

**目的**: 验证 Analytics 是否正常工作。

**位置**: `/analytics-test`

**功能**: 
- 自动检测 Analytics 请求
- 在控制台显示调试信息
- 提供手动检查指南

## 验证步骤

### 1. 检查 Vercel 仪表板
1. 登录 Vercel 仪表板
2. 选择项目
3. 点击 "Analytics" 标签
4. 确保 Analytics 已启用

### 2. 部署并测试
1. 部署最新代码到 Vercel
2. 访问 `https://bili-audio-omega.vercel.app/analytics-test`
3. 打开浏览器开发者工具
4. 检查 Network 标签中是否有对 `/_vercel/insights/` 的请求

### 3. 检查网络请求
在浏览器开发者工具的 Network 标签中，应该看到：
- `/_vercel/insights/view` (POST 请求)
- `/_vercel/insights/script.js` (GET 请求)
- 状态码应该是 200 或 204

## 常见问题和解决方案

### 问题 1: 404 错误加载 script.js
**原因**: 在启用 Analytics 之前部署了跟踪代码。
**解决方案**: 
1. 确保在仪表板中启用了 Analytics
2. 重新部署应用
3. 将最新部署提升为生产环境

### 问题 2: 使用代理（如 Cloudflare）时 Analytics 不工作
**原因**: 代理配置可能阻止了 Analytics 请求。
**解决方案**: 
1. 检查代理配置
2. 确保所有对 `/_vercel/insights/*` 的请求都被正确转发到部署

### 问题 3: 数据在仪表板中不可见
**原因**: 可能需要等待数据收集和处理。
**解决方案**: 
1. 等待几分钟到几小时
2. 确保有真实的用户访问
3. 检查 Analytics 是否正确发送请求

## 环境变量

如果需要，可以设置以下环境变量：

```bash
# 禁用服务器端调试日志
VERCEL_WEB_ANALYTICS_DISABLE_LOGS=true

# 强制特定环境模式
NODE_ENV=production
```

## 联系支持

如果问题仍然存在，请：
1. 检查 Vercel 状态页面
2. 联系 Vercel 支持团队
3. 提供详细的错误信息和网络请求截图

## 更新日志

- **2024-01-XX**: 初始故障排除实施
- 修复了 robots.txt 配置
- 创建了 vercel.json 配置
- 更新了 Analytics 组件配置
- 添加了测试页面