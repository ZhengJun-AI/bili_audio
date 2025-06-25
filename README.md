# BiliAudio - Bilibili音频下载器

一个基于Next.js的Bilibili音频下载工具，支持从B站视频和音频中提取音频文件。

## 功能特性

- 🎵 **视频音频提取**: 从B站视频中提取音频
- 🎧 **纯音频下载**: 直接下载B站音频区内容
- 🔒 **隐私保护**: 无需登录，不需要Cookie
- ⚡ **快速解析**: 支持多种链接格式
- 📱 **响应式设计**: 适配移动端和桌面端
- 📝 **本地历史**: 记录下载历史（仅本地存储）

## 支持的链接格式

### 视频链接
- `https://www.bilibili.com/video/BV1xx411c7mD`
- `https://www.bilibili.com/video/av123456`
- `https://b23.tv/xxxxxx` (短链接)
- `BV1xx411c7mD` (直接输入BV号)
- `av123456` (直接输入AV号)

### 音频链接
- `https://www.bilibili.com/audio/au123456`
- `au123456` (直接输入AU号)

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **类型检查**: TypeScript
- **图标**: Lucide React
- **加密**: CryptoJS (WBI签名)
- **HTTP客户端**: Axios
- **部署平台**: Vercel

## 本地开发

### 环境要求

- Node.js 18.0+
- npm 或 yarn

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

## 部署到Vercel

### 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ZhengJun-AI/bili_audio)

### 手动部署

1. Fork 本仓库
2. 在 [Vercel](https://vercel.com) 中导入项目
3. 配置环境变量（如需要）
4. 部署

## 项目结构

```
bili-audio-downloader/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API路由
│   │   │   ├── download/   # 音频下载API
│   │   │   ├── info/       # 媒体信息API
│   │   │   ├── resolve-url/# 短链接解析API
│   │   │   └── health/     # 健康检查API
│   │   ├── globals.css     # 全局样式
│   │   ├── layout.tsx      # 根布局
│   │   └── page.tsx        # 首页
│   ├── components/         # React组件
│   │   ├── AudioDownloader.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── HistorySection.tsx
│   └── utils/              # 工具函数
│       ├── api.ts          # API调用
│       ├── storage.ts      # 本地存储
│       ├── urlParser.ts    # URL解析
│       └── wbi.ts          # WBI签名
├── public/                 # 静态资源
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## API接口

### POST /api/download

下载音频

**请求体:**
```json
{
  "url": "https://www.bilibili.com/video/BV1xx411c7mD"
}
```

**响应:**
```json
{
  "success": true,
  "data": {
    "title": "视频标题",
    "cover": "封面URL",
    "duration": 180,
    "author": "作者名",
    "downloadUrl": "音频下载链接",
    "sourceType": "video",
    "sourceId": "BV1xx411c7mD"
  }
}
```

### POST /api/info

获取媒体信息

**请求体:**
```json
{
  "type": "video",
  "id": "BV1xx411c7mD"
}
```

### POST /api/resolve-url

解析短链接

**请求体:**
```json
{
  "url": "https://b23.tv/xxxxxx"
}
```

### GET /api/health

健康检查

## 注意事项

1. **合规使用**: 请遵守B站的使用条款，仅用于个人学习和研究
2. **版权声明**: 下载的内容请勿用于商业用途
3. **技术限制**: 部分视频可能因为版权保护无法下载
4. **稳定性**: B站API可能会变化，如遇问题请及时反馈

## 常见问题

### Q: 为什么有些视频无法下载？
A: 可能是因为视频有版权保护、需要大会员权限或者视频不存在。

### Q: 下载的音频质量如何？
A: 系统会自动选择可用的最高质量音频流。

### Q: 是否需要登录B站账号？
A: 不需要，本工具使用WBI签名技术，无需Cookie即可访问公开内容。

### Q: 下载速度慢怎么办？
A: 下载速度取决于B站CDN和您的网络环境，建议在网络较好时使用。

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

MIT License

## 免责声明

本工具仅供学习和研究使用，请勿用于商业用途。使用本工具下载的内容，请遵守相关法律法规和版权规定。开发者不承担任何法律责任。