# 港湾家政网站 - 项目功能总结文档

> 项目仓库：https://github.com/ii-hui/gangwan_jiazheng.git
> 部署平台：Netlify
> 线上地址：https://qhdgwjz.cn
> 最后更新：2025-01-05

---

## 目录

1. [项目概述](#项目概述)
2. [技术栈](#技术栈)
3. [核心功能模块](#核心功能模块)
4. [数据库设计](#数据库设计)
5. [环境配置](#环境配置)
6. [部署说明](#部署说明)
7. [功能实现细节](#功能实现细节)
8. [待开发功能](#待开发功能)

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
- **CSS** (全局样式，无CSS-in-JS)

### 后端服务
- **Supabase** (PostgreSQL数据库 + 图片存储)
- **Next.js API Routes** (服务端API)

### 第三方集成
- **企业微信Webhook** (消息推送)
- **Netlify** (自动部署)
- **next-sitemap** (自动生成sitemap)

### SEO工具
- Schema.org结构化数据
- Open Graph标签
- 自动sitemap生成

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

### 5. 导航与布局系统 ✅

**文件位置**：
- `components/Layout.js` - 全局布局
- `components/Navbar.js` - 导航栏

**固定元素**：
- 顶部导航栏（固定）
- 右侧电话按钮（桌面端）
- 右侧微信按钮（桌面端）
- 底部拨号按钮（移动端）
- 回到顶部按钮

**导航菜单**：
- 首页 `/`
- 保姆 `/baomu`
- 育儿嫂 `/yuerso`
- 老年护理 `/laorenghuli`
- 医院护工 `/yiyuanhugong`
- 关于我们 `/about`
- 联系我们 `/contact`

---

## 数据库设计

### Supabase表结构

#### 1. submissions表 - 表单提交记录

| 字段名 | 类型 | 说明 | 必填 |
|--------|------|------|------|
| id | uuid | 主键 | ✅ |
| created_at | timestamp | 创建时间 | ✅ |
| name | varchar | 客户姓名 | ✅ |
| phone | varchar | 手机号 | ✅ |
| email | varchar | 邮箱 | ❌ |
| category | varchar(50) | 服务类型 | ✅ |
| message | text | 留言内容 | ❌ |

**SQL创建语句**：
```sql
-- 添加category字段
ALTER TABLE submissions
ADD COLUMN IF NOT EXISTS category VARCHAR(50);

-- email字段改为可选
ALTER TABLE submissions
ALTER COLUMN email DROP NOT NULL;
```

#### 2. posts表 - 服务内容（预留）

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | uuid | 主键 |
| title | varchar | 标题 |
| content | text | 内容 |
| category | varchar | 分类 |
| image_url | varchar | 图片URL |
| created_at | timestamp | 创建时间 |

#### 3. team_members表 - 服务人员（预留）

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | uuid | 主键 |
| name | varchar | 姓名 |
| category | varchar | 服务类型 |
| experience | varchar | 工作经验 |
| skills | text[] | 技能标签 |
| status | varchar | 状态（在岗/待岗） |

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
module.exports = {
  images: {
    domains: ['tlxczsxuubwoeigyhmou.supabase.co'], // Supabase图片域名
  },
}
```

#### next-sitemap.config.js
```javascript
module.exports = {
  siteUrl: 'https://gwjz.netlify.app',
  generateRobotsTxt: true,
  priority: 0.7,
  changefreq: 'daily',
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

### v1.2.0 (2025-01-05)
- ✅ 添加微信悬浮按钮和二维码弹窗
- ✅ 修改联系页面微信号为 gwjz_qhd
- ✅ 完善私域引流入口

### v1.1.0 (2025-01-04)
- ✅ 添加企业微信通知功能
- ✅ 集成表单自动推送到企业微信群
- ✅ 修复Supabase表结构问题

### v1.0.0 (2024-12-XX)
- ✅ 网站基础功能上线
- ✅ SEO优化完成
- ✅ 服务页面搭建
- ✅ 联系表单实现

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
