# 港湾家政网站 - 项目功能总结文档

> 项目仓库：https://github.com/ii-hui/gangwan_jiazheng.git
> 部署平台：Netlify
> 线上地址：https://qhdgwjz.cn
> 最后更新：2025-11-11

---

## 目录

1. [项目概述](#项目概述)
2. [技术栈](#技术栈)
3. [页面结构](#页面结构)
4. [核心功能模块](#核心功能模块)
5. [组件库](#组件库)
6. [数据库设计](#数据库设计)
7. [环境配置](#环境配置)
8. [部署说明](#部署说明)
9. [功能实现细节](#功能实现细节)
10. [待开发功能](#待开发功能)

---

## 项目概述

港湾家政是一个面向秦皇岛市的家政服务平台，提供保姆、育儿嫂、老年护理、医院护工等服务。

### 业务目标
- **服务展示**：展示各类家政服务内容和价格
- **在线咨询**：用户通过表单提交需求
- **私域引流**：引导用户添加微信进入私域流量池
- **自动通知**：表单提交后自动通知企业微信群

### 核心竞争力
- SEO优化完善，本地搜索排名靠前
- 多渠道联系方式（电话、微信、表单）
- 企业微信自动通知，响应快速
- 完整的从展示到转化的业务闭环

---

## 技术栈

### 前端框架
- **Next.js 14.0.4** (Pages Router)
- **React 18.2.0**
- **Next/Image** (图片优化，支持AVIF和WebP格式)
- **CSS** (全局样式 `styles/globals.css`，无CSS-in-JS)

### 后端服务
- **Supabase** (@supabase/supabase-js v2.39.0)
  - PostgreSQL数据库
  - 图片存储 (Storage)
- **Next.js API Routes** (`pages/api/`)

### 第三方集成
- **企业微信Webhook** (消息推送到企业微信群)
- **Netlify** (自动部署 + CDN)
- **next-sitemap** (v4.2.3，自动生成sitemap.xml和robots.txt)

### SEO优化
- Schema.org结构化数据（LocalBusiness、Service、Breadcrumb、FAQ）
- Open Graph标签
- 自动sitemap生成（postbuild钩子）
- 完善的meta标签配置
- 地理位置标记（秦皇岛市）

### 性能优化
- 图片自动优化（AVIF、WebP）
- 图片懒加载
- 30天图片缓存
- Gzip压缩
- HTTP安全头（HSTS、X-Frame-Options等）

---

## 页面结构

### 主要页面 (pages/)

| 页面路径 | 文件 | 功能描述 | 数据源 |
|---------|------|----------|--------|
| `/` | index.js | 首页，展示服务概览和团队预览 | posts表、team_members表 |
| `/baomu` | baomu.js | 保姆服务详情页 | 静态内容（SERVICE_CONTENT） |
| `/yuerso` | yuerso.js | 育儿嫂服务详情页 | 静态内容（SERVICE_CONTENT） |
| `/laorenghuli` | laorenghuli.js | 老年护理服务详情页 | 静态内容（SERVICE_CONTENT） |
| `/yiyuanhugong` | yiyuanhugong.js | 医院护工服务详情页 | 静态内容（SERVICE_CONTENT） |
| `/kepu` | kepu.js | 科普知识列表页，支持分类筛选 | posts表(content_type='科普') |
| `/zixun` | zixun.js | 行业资讯列表页，支持分类筛选 | posts表(content_type='资讯') |
| `/anli` | anli.js | 案例展示列表页，支持分类筛选 | posts表+case_studies表 |
| `/tuanduifengcai` | tuanduifengcai.js | 团队风采展示页，支持分类筛选 | team_members表 |
| `/price` | price.js | 价格一览表页面 | 静态内容 |
| `/about` | about.js | 关于我们页面 | 静态内容 |
| `/contact` | contact.js | 联系我们页面+表单 | 静态内容 |
| `/404` | 404.js | 404错误页面 | 静态内容 |

### API路由 (pages/api/)

| 路由路径 | 文件 | 功能描述 |
|---------|------|----------|
| `/api/wechat-notify` | wechat-notify.js | 企业微信通知推送API |

---

## 核心功能模块

### 1. SEO优化系统 ✅

**文件位置**：
- `utils/seoData.js` - SEO配置中心
- `components/SEOHead.js` - Head组件

**功能说明**：
- 每个页面独立的meta标签配置
- Schema.org结构化数据（LocalBusiness、Service、Breadcrumb、FAQ）
- 动态sitemap生成
- 关键词优化（秦皇岛 + 服务类型）

**使用方式**：
```javascript
import { PAGE_SEO, generateOrganizationSchema } from '../utils/seoData'

<SEOHead
  title={PAGE_SEO.home.title}
  description={PAGE_SEO.home.description}
  keywords={PAGE_SEO.home.keywords}
  schema={[generateOrganizationSchema()]}
/>
```

---

### 2. 联系表单系统 ✅

**文件位置**：
- `components/ContactForm.js` - 表单组件
- `pages/api/wechat-notify.js` - 企业微信通知API

**功能说明**：
- 收集用户手机号和服务需求
- 数据保存到Supabase submissions表
- 自动发送通知到企业微信群
- 友好的成功/失败提示

**数据流程**：
```
用户填写表单
  → 提交到Supabase
  → 调用企业微信API
  → 发送通知到群
```

**通知内容格式**：
```
📞 新的客户咨询

👤 姓名：在线咨询
📱 电话：13800138000
🏷️ 服务类型：保姆
💬 留言：咨询保姆服务

⏰ 时间：2025/01/05 14:30:00
```

---

### 3. 微信悬浮按钮 ✅

**文件位置**：
- `components/WeChatFloating.js` - 悬浮按钮组件
- `public/images/WXEWM.jpg` - 微信二维码图片
- `styles/globals.css` (行2937-3099) - 样式定义

**功能说明**：
- 页面右侧固定绿色按钮
- 点击弹出微信二维码弹窗
- 引导用户添加微信：gwjz_qhd
- 仅桌面端显示，移动端隐藏

**样式特点**：
- 绿色渐变背景 `#09BB07 → #07C160`
- 与电话按钮样式一致
- 竖向排列（图标 + 文字）
- 圆角矩形设计

---

### 4. 服务内容管理 ✅

**文件位置**：
- `pages/baomu.js` - 保姆服务
- `pages/yuerso.js` - 育儿嫂服务
- `pages/laorenghuli.js` - 老年护理
- `pages/yiyuanhugong.js` - 医院护工

**内容来源**：
- **静态内容**：`utils/seoData.js` 中的 SERVICE_CONTENT
- **动态内容**：Supabase posts表（未来扩展）

**页面结构**：
1. Hero头图
2. 服务介绍
3. 服务内容列表
4. 价格说明
5. 联系表单

---

### 5. 内容管理系统 ✅

**文件位置**：
- `pages/kepu.js` - 科普知识页面
- `pages/zixun.js` - 行业资讯页面
- `pages/anli.js` - 案例展示页面
- `components/PostModal.js` - 内容详情弹窗

**功能说明**：
- 从Supabase posts表动态加载内容
- 支持按服务类型分类筛选（全部、保姆、育儿嫂、老年护理、医院护工）
- URL参数保持分类状态（`?category=保姆`）
- 点击卡片打开模态框查看详情
- 支持左右切换浏览其他内容
- 骨架屏loading状态
- 空状态友好提示

**案例页面特殊功能**：
- 整合posts表和case_studies表数据
- 显示地理位置标签
- 显示"真实案例"认证标记
- 支持多图展示

---

### 6. 团队展示系统 ✅

**文件位置**：
- `pages/tuanduifengcai.js` - 团队风采页面
- `components/TeamMemberCard.js` - 团队成员卡片
- `components/TeamMemberModal.js` - 成员详情弹窗

**功能说明**：
- 从Supabase team_members表动态加载数据
- 支持按服务类型分类筛选
- 按display_order字段排序
- 首页展示精选成员（is_featured=true，最多6个）
- 点击卡片查看详细信息和作品集
- 支持左右切换浏览其他成员

---

### 7. 价格展示系统 ✅

**文件位置**：
- `pages/price.js` - 价格页面

**功能说明**：
- 四大服务类型价格表格（保姆、育儿嫂、老年护理、医院护工）
- 三档服务等级（基础版、标准版、高级版）
- 价格对比卡片
- 常见问题FAQ
- 优惠活动说明
- 直接拨号和在线咨询CTA

---

## 组件库

### 布局组件

| 组件名 | 文件 | 功能描述 |
|-------|------|----------|
| Layout | Layout.js | 全局布局容器，包含导航栏、页脚、微信浮窗 |
| Navbar | Navbar.js | 顶部导航栏，支持移动端菜单 |
| Hero | Hero.js | 页面头图组件，支持显示LOGO和CTA按钮 |
| SEOHead | SEOHead.js | SEO meta标签和结构化数据组件 |

### 展示组件

| 组件名 | 文件 | 功能描述 |
|-------|------|----------|
| ServiceCard | ServiceCard.js | 服务卡片，用于首页服务展示 |
| TeamMemberCard | TeamMemberCard.js | 团队成员卡片 |
| AdvantageGrid | AdvantageGrid.js | 公司优势网格展示 |
| SkeletonCard | SkeletonCard.js | 骨架屏加载状态 |
| RelatedServices | RelatedServices.js | 相关服务推荐 |
| RecommendedTeam | RecommendedTeam.js | 推荐团队成员 |

### 交互组件

| 组件名 | 文件 | 功能描述 |
|-------|------|----------|
| ContactForm | ContactForm.js | 联系表单，提交到Supabase+企业微信通知 |
| WeChatFloating | WeChatFloating.js | 微信悬浮按钮+二维码弹窗 |
| PostModal | PostModal.js | 内容详情模态框，支持左右切换 |
| TeamMemberModal | TeamMemberModal.js | 团队成员详情模态框，支持左右切换 |
| Testimonials | Testimonials.js | 客户评价轮播（已移除） |

---

## 数据库设计

### Supabase表结构

#### 1. submissions表 - 表单提交记录 ✅

| 字段名 | 类型 | 说明 | 必填 | 默认值 |
|--------|------|------|------|--------|
| id | uuid | 主键 | ✅ | gen_random_uuid() |
| created_at | timestamp | 创建时间 | ✅ | now() |
| name | varchar | 客户姓名 | ✅ | - |
| phone | varchar | 手机号 | ✅ | - |
| email | varchar | 邮箱 | ❌ | noreply@example.com |
| category | varchar(50) | 服务类型 | ✅ | - |
| message | text | 留言内容 | ❌ | - |

**索引**：
- created_at (降序，用于查询最新提交)
- category (用于按类型筛选)

---

#### 2. posts表 - 内容管理 ✅

| 字段名 | 类型 | 说明 | 必填 | 默认值 |
|--------|------|------|------|--------|
| id | uuid | 主键 | ✅ | gen_random_uuid() |
| created_at | timestamp | 创建时间 | ✅ | now() |
| title | varchar | 标题 | ✅ | - |
| content | text | 内容 | ✅ | - |
| category | varchar | 分类 | ✅ | - |
| content_type | varchar | 内容类型 | ✅ | - |
| image_url | varchar | 图片URL | ❌ | - |
| image_alt | varchar | 图片alt文本 | ❌ | - |
| is_featured | boolean | 是否精选（首页展示） | ❌ | false |
| display_order | integer | 显示顺序 | ❌ | 0 |

**内容类型枚举**：
- `科普` - 家政知识科普
- `资讯` - 行业资讯动态
- `案例` - 服务案例（已部分迁移到case_studies表）

**分类枚举**：
- `保姆`
- `育儿嫂`
- `老年护理`
- `医院护工`

**索引**：
- (content_type, category, created_at)
- (is_featured, display_order)

---

#### 3. case_studies表 - 案例展示 ✅

| 字段名 | 类型 | 说明 | 必填 | 默认值 |
|--------|------|------|------|--------|
| id | uuid | 主键 | ✅ | gen_random_uuid() |
| created_at | timestamp | 创建时间 | ✅ | now() |
| title | varchar | 案例标题 | ✅ | - |
| description | text | 案例描述 | ✅ | - |
| service_type | varchar | 服务类型 | ✅ | - |
| location | varchar | 服务地点 | ❌ | - |
| screenshots | jsonb | 案例截图数组 | ❌ | '[]' |
| is_active | boolean | 是否激活 | ❌ | true |
| display_order | integer | 显示顺序 | ❌ | 0 |

**screenshots字段格式**：
```json
[
  {
    "url": "https://xxx.supabase.co/storage/...",
    "alt": "图片描述",
    "caption": "图片说明"
  }
]
```

**索引**：
- (is_active, service_type, display_order)

---

#### 4. team_members表 - 团队成员 ✅

| 字段名 | 类型 | 说明 | 必填 | 默认值 |
|--------|------|------|------|--------|
| id | uuid | 主键 | ✅ | gen_random_uuid() |
| created_at | timestamp | 创建时间 | ✅ | now() |
| name | varchar | 姓名 | ✅ | - |
| category | varchar | 服务类型 | ✅ | - |
| age | integer | 年龄 | ❌ | - |
| experience | varchar | 工作经验 | ❌ | - |
| skills | text[] | 技能标签数组 | ❌ | '{}' |
| description | text | 个人简介 | ❌ | - |
| avatar_url | varchar | 头像URL | ❌ | - |
| gallery | jsonb | 作品集图片数组 | ❌ | '[]' |
| is_featured | boolean | 是否首页展示 | ❌ | false |
| display_order | integer | 显示顺序 | ❌ | 0 |
| status | varchar | 状态 | ❌ | '在岗' |

**status枚举**：
- `在岗` - 当前在服务
- `待岗` - 可预约
- `休假` - 临时不可预约

**索引**：
- (category, display_order)
- (is_featured, display_order)

---

## 环境配置

### 环境变量 (.env.local)

```bash
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=https://tlxczsxuubwoeigyhmou.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 站点URL
NEXT_PUBLIC_SITE_URL=https://qhdgwjz.cn

# 企业微信Webhook（服务端使用）
WECHAT_WORK_WEBHOOK_URL=https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=your_webhook_key
```

### 关键配置文件

#### next.config.js
```javascript
const nextConfig = {
  reactStrictMode: true,

  // 图片优化配置
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tlxczsxuubwoeigyhmou.supabase.co',
        pathname: '/storage/v1/object/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30天缓存
  },

  // HTTP安全头配置
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ]
  },

  compress: true, // 启用Gzip压缩
}
```

#### next-sitemap.config.js
```javascript
module.exports = {
  siteUrl: 'https://qhdgwjz.cn',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,

  // 页面优先级配置
  transform: async (config, path) => {
    const priorities = {
      '/': 1.0,
      '/baomu': 0.9,
      '/yuerso': 0.9,
      '/laorenghuli': 0.9,
      '/yiyuanhugong': 0.9,
      '/contact': 0.7,
      '/about': 0.6,
    }

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: priorities[path] || config.priority,
      lastmod: new Date().toISOString(),
    }
  },
}
```

---

## 部署说明

### Netlify自动部署

**配置位置**：`netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

**部署流程**：
1. 推送代码到GitHub
2. Netlify自动检测更新
3. 执行构建命令 `npm run build`
4. 部署到CDN
5. 自动生成sitemap

**环境变量配置**：
在Netlify控制台添加所有 `.env.local` 中的变量

---

## 功能实现细节

### 1. 企业微信通知实现

**API路由**: `pages/api/wechat-notify.js`

**请求格式**:
```javascript
POST /api/wechat-notify
Content-Type: application/json

{
  "name": "在线咨询",
  "phone": "13800138000",
  "category": "保姆",
  "message": "咨询保姆服务"
}
```

**响应格式**:
```javascript
{
  "success": true,
  "message": "通知发送成功"
}
```

**错误处理**:
- 通知失败不影响表单提交
- 错误仅在控制台记录
- 用户始终看到成功提示

---

### 2. 微信二维码弹窗实现

**组件**: `components/WeChatFloating.js`

**状态管理**:
```javascript
const [isModalOpen, setIsModalOpen] = useState(false)
```

**防止背景滚动**:
```javascript
// 打开弹窗
document.body.style.overflow = 'hidden'

// 关闭弹窗
document.body.style.overflow = 'unset'
```

**图片优化**:
```javascript
<Image
  src="/images/WXEWM.jpg"
  width={280}
  height={280}
  priority  // 优先加载
/>
```

---

### 3. SEO结构化数据示例

**LocalBusiness Schema**:
```javascript
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "秦皇岛港湾家政服务",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "秦皇岛市",
    "addressRegion": "河北省",
    "addressCountry": "CN"
  },
  "telephone": "18533552006"
}
```

---

## 待开发功能

### 高优先级 🔴

#### 1. 员工入职表单
- **位置**: 新建 `pages/join.js`
- **功能**: 收集求职者信息
- **字段**: 姓名、手机、服务类型、经验、技能
- **通知**: 同样发送到企业微信

#### 2. 服务人员展示页
- **位置**: 新建 `pages/team.js`
- **数据源**: Supabase team_members表
- **功能**: 展示在岗/待岗人员
- **筛选**: 按服务类型、状态筛选

### 中优先级 🟡

#### 3. 客户评价系统
- **位置**: 新建 `components/Reviews.js`
- **数据源**: Supabase reviews表
- **展示**: 首页和服务页展示评价

#### 4. 价格计算器
- **位置**: 服务页内嵌
- **功能**: 根据需求计算预估价格
- **交互**: 选择服务项目、时长等

#### 5. 在线预约系统
- **功能**: 选择日期时间预约
- **日历**: 集成日历组件
- **提醒**: 预约成功发送短信

### 低优先级 🟢

#### 6. 博客/资讯模块
- **位置**: 新建 `pages/blog`
- **内容**: 家政知识、育儿技巧等
- **SEO**: 增加长尾关键词流量

#### 7. 多语言支持
- **工具**: next-i18next
- **语言**: 中文、英文
- **场景**: 面向外籍用户

---

## 联系方式

**客服电话**: 18533552006
**微信号**: gwjz_qhd
**服务区域**: 秦皇岛市（海港区、山海关区、北戴河区、开发区）
**企业微信群**: [通过webhook接收通知]

---

## 版本历史

### v1.5.0 (2025-11-11) ✨ 当前版本
- ✅ 更新LOGO图片为高分辨率版本
- ✅ 集成case_studies表数据到案例页面
- ✅ 案例页面支持显示地理位置和真实案例标记
- ✅ 添加完整的项目文档（PROJECT_SUMMARY、CHANGELOG、QUICK_REFERENCE等）
- ✅ 优化next.config.js配置（图片优化、安全头、压缩）
- ✅ 清理.next构建缓存，提升部署稳定性

### v1.4.0 (2025-01-07)
- ✅ 完善价格页面，添加三档服务等级
- ✅ 添加价格对比卡片和常见问题FAQ
- ✅ 优化团队展示页面，支持作品集查看
- ✅ 添加PostModal和TeamMemberModal详情弹窗
- ✅ 支持左右切换浏览内容

### v1.3.0 (2025-01-06)
- ✅ 添加科普知识页面（/kepu）
- ✅ 添加行业资讯页面（/zixun）
- ✅ 添加案例展示页面（/anli）
- ✅ 添加团队风采页面（/tuanduifengcai）
- ✅ 所有列表页面支持分类筛选和URL参数
- ✅ 添加骨架屏loading状态

### v1.2.0 (2025-01-05)
- ✅ 添加微信悬浮按钮和二维码弹窗
- ✅ 修改联系页面微信号为 gwjz_qhd
- ✅ 完善私域引流入口
- ✅ 移除Testimonials组件

### v1.1.0 (2025-01-04)
- ✅ 添加企业微信通知功能
- ✅ 集成表单自动推送到企业微信群
- ✅ 修复Supabase表结构问题
- ✅ submissions表email字段改为可选

### v1.0.0 (2024-12-XX)
- ✅ 网站基础功能上线
- ✅ SEO优化完成（meta标签、结构化数据）
- ✅ 四大服务页面搭建（保姆、育儿嫂、老年护理、医院护工）
- ✅ 联系表单实现
- ✅ Supabase数据库集成

---

## 技术支持

如需修改或扩展功能，请参考：
1. `CLAUDE.md` - Claude Code使用指南
2. `DEPLOYMENT-GUIDE.md` - 部署指南
3. `SUPABASE_MIGRATION.md` - 数据库迁移说明
4. 本文档 `PROJECT_SUMMARY.md` - 项目总结

---

**文档维护**: 每次重大功能更新后需更新本文档
**最后更新人**: Claude Code
**更新日期**: 2025-01-05
