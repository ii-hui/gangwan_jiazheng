# 港湾家政 - 代码结构说明文档

> 详细的代码组织和架构说明
> 最后更新：2025-11-11

---

## 目录

1. [项目文件树](#项目文件树)
2. [目录结构说明](#目录结构说明)
3. [核心代码模块](#核心代码模块)
4. [数据流图](#数据流图)
5. [命名规范](#命名规范)
6. [开发指南](#开发指南)

---

## 项目文件树

```
gangwan-jiazhen/
├── pages/                          # Next.js页面路由
│   ├── _app.js                    # 应用入口，全局Layout
│   ├── _document.js               # HTML文档结构
│   ├── index.js                   # 首页 (/)
│   ├── 404.js                     # 404错误页
│   ├── about.js                   # 关于我们 (/about)
│   ├── contact.js                 # 联系我们 (/contact)
│   ├── price.js                   # 价格表 (/price)
│   ├── baomu.js                   # 保姆服务 (/baomu)
│   ├── yuerso.js                  # 育儿嫂服务 (/yuerso)
│   ├── laorenghuli.js             # 老年护理 (/laorenghuli)
│   ├── yiyuanhugong.js            # 医院护工 (/yiyuanhugong)
│   ├── kepu.js                    # 科普知识 (/kepu)
│   ├── zixun.js                   # 行业资讯 (/zixun)
│   ├── anli.js                    # 案例展示 (/anli)
│   ├── tuanduifengcai.js          # 团队风采 (/tuanduifengcai)
│   └── api/                       # API路由
│       └── wechat-notify.js       # 企业微信通知API
│
├── components/                     # React组件库
│   ├── Layout.js                  # 全局布局组件
│   ├── Navbar.js                  # 导航栏组件
│   ├── Hero.js                    # 页面头图组件
│   ├── SEOHead.js                 # SEO头部组件
│   ├── ContactForm.js             # 联系表单组件
│   ├── WeChatFloating.js          # 微信悬浮按钮
│   ├── ServiceCard.js             # 服务卡片
│   ├── TeamMemberCard.js          # 团队成员卡片
│   ├── TeamMemberModal.js         # 成员详情弹窗
│   ├── PostModal.js               # 内容详情弹窗
│   ├── AdvantageGrid.js           # 优势展示网格
│   ├── SkeletonCard.js            # 骨架屏
│   ├── RelatedServices.js         # 相关服务推荐
│   ├── RecommendedTeam.js         # 推荐团队成员
│   └── Testimonials.js            # 客户评价（已废弃）
│
├── lib/                            # 工具库
│   └── supabaseClient.js          # Supabase客户端配置
│
├── utils/                          # 工具函数
│   └── seoData.js                 # SEO配置和数据
│
├── styles/                         # 样式文件
│   └── globals.css                # 全局CSS样式
│
├── public/                         # 静态资源
│   ├── LOGO.png                   # 网站Logo
│   ├── images/                    # 图片资源
│   │   ├── WXEWM.jpg             # 微信二维码
│   │   └── service-*.jpg         # 服务图片
│   ├── sitemap-0.xml             # 网站地图
│   └── robots.txt                # 爬虫规则
│
├── .env.local                     # 环境变量（本地）
├── .gitignore                     # Git忽略文件
├── next.config.js                 # Next.js配置
├── next-sitemap.config.js         # Sitemap配置
├── package.json                   # 项目依赖
├── netlify.toml                   # Netlify部署配置
│
└── *.md                           # 项目文档
    ├── README.md                  # 项目说明
    ├── PROJECT_SUMMARY.md         # 项目总结
    ├── CODE_STRUCTURE.md          # 代码结构（本文档）
    ├── QUICK_REFERENCE.md         # 快速参考
    ├── CLAUDE.md                  # Claude Code使用指南
    ├── DEPLOYMENT-GUIDE.md        # 部署指南
    ├── CHANGELOG.md               # 更新日志
    └── SUPABASE_MIGRATION.md      # 数据库迁移说明
```

---

## 目录结构说明

### `/pages` - 页面路由目录

Next.js使用文件系统路由，`pages/`目录下的每个文件自动对应一个路由。

**特殊文件**：
- `_app.js` - 应用入口，所有页面的根组件，包含Layout
- `_document.js` - HTML文档结构，自定义`<html>`和`<body>`标签

**页面分类**：

| 分类 | 文件 | 路由 | 数据源 |
|------|------|------|--------|
| **静态页面** | - | - | - |
| 首页 | index.js | / | Supabase动态数据 |
| 关于 | about.js | /about | 静态内容 |
| 联系 | contact.js | /contact | 静态内容+表单 |
| 价格 | price.js | /price | 静态内容 |
| 404 | 404.js | /404 | 静态内容 |
| **服务页面** | - | - | - |
| 保姆 | baomu.js | /baomu | SERVICE_CONTENT |
| 育儿嫂 | yuerso.js | /yuerso | SERVICE_CONTENT |
| 老年护理 | laorenghuli.js | /laorenghuli | SERVICE_CONTENT |
| 医院护工 | yiyuanhugong.js | /yiyuanhugong | SERVICE_CONTENT |
| **内容页面** | - | - | - |
| 科普知识 | kepu.js | /kepu | posts表 |
| 行业资讯 | zixun.js | /zixun | posts表 |
| 案例展示 | anli.js | /anli | posts表+case_studies表 |
| 团队风采 | tuanduifengcai.js | /tuanduifengcai | team_members表 |

---

### `/components` - 组件库目录

所有React组件都是函数式组件（Function Components），使用Hooks管理状态。

**组件分类**：

#### 1. 布局组件（Layout Components）

| 组件 | Props | 功能 |
|------|-------|------|
| `Layout` | `children` | 全局布局容器，包含Navbar、Footer、WeChatFloating |
| `Navbar` | 无 | 顶部导航栏，响应式菜单 |
| `Hero` | `title`, `subtitle`, `showLogo`, `showCTA` | 页面头图，可选显示Logo和CTA |
| `SEOHead` | `title`, `description`, `keywords`, `canonical`, `schema` | SEO优化组件 |

#### 2. 展示组件（Display Components）

| 组件 | Props | 功能 |
|------|-------|------|
| `ServiceCard` | `title`, `description`, `image`, `imageAlt`, `category` | 服务卡片 |
| `TeamMemberCard` | `member`, `onClick` | 团队成员卡片 |
| `AdvantageGrid` | 无 | 公司优势网格 |
| `SkeletonCard` | 无 | Loading骨架屏 |
| `RelatedServices` | `currentService` | 相关服务推荐 |
| `RecommendedTeam` | `category` | 推荐团队成员 |

#### 3. 交互组件（Interactive Components）

| 组件 | Props | 功能 |
|------|-------|------|
| `ContactForm` | 无 | 联系表单，提交到Supabase和企业微信 |
| `WeChatFloating` | 无 | 微信悬浮按钮+二维码弹窗 |
| `PostModal` | `posts`, `currentIndex`, `onClose`, `onNext`, `onPrev` | 内容详情弹窗 |
| `TeamMemberModal` | `members`, `currentIndex`, `onClose`, `onNext`, `onPrev` | 成员详情弹窗 |

---

### `/lib` - 工具库目录

**`supabaseClient.js`**：
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**使用方式**：
```javascript
import { supabase } from '../lib/supabaseClient'

// 查询数据
const { data, error } = await supabase
  .from('posts')
  .select('*')
  .eq('category', '保姆')
```

---

### `/utils` - 工具函数目录

**`seoData.js`**：

包含以下导出：

1. **SITE_INFO** - 网站基本信息
   ```javascript
   {
     name: '秦皇岛港湾家政',
     phone: '18533552006',
     url: 'https://qhdgwjz.cn',
     address: '河北省秦皇岛市海港区',
     ...
   }
   ```

2. **PAGE_SEO** - 每个页面的SEO配置
   ```javascript
   {
     home: { title, description, keywords, canonical },
     baomu: { ... },
     ...
   }
   ```

3. **SERVICE_CONTENT** - 服务页面内容
   ```javascript
   {
     baomu: { title, subtitle, description, services, price, ... },
     yuerso: { ... },
     ...
   }
   ```

4. **Schema生成函数**：
   - `generateOrganizationSchema()` - 生成LocalBusiness结构化数据
   - `generateServiceSchema()` - 生成Service结构化数据
   - `generateBreadcrumbSchema()` - 生成面包屑结构化数据
   - `generateFAQSchema()` - 生成FAQ结构化数据

---

### `/styles` - 样式目录

**`globals.css`**：

包含以下样式模块：

1. **CSS Reset** - 浏览器样式重置
2. **全局变量** - 颜色、字体、间距
3. **布局样式** - 容器、网格、间距
4. **组件样式** - 导航栏、卡片、按钮、表单
5. **响应式样式** - 移动端适配（`@media`）
6. **动画** - 淡入、滑动、加载动画

**CSS类命名规范**：
- BEM命名法：`.block__element--modifier`
- 示例：`.post-card`, `.post-card__title`, `.post-card--featured`

---

## 核心代码模块

### 1. 页面渲染流程

```
用户访问URL
  ↓
Next.js路由匹配 (pages/xxx.js)
  ↓
_app.js包装 (Layout组件)
  ↓
页面组件渲染
  ↓
SEOHead设置meta标签
  ↓
useEffect调用Supabase获取数据
  ↓
数据填充到组件
  ↓
HTML输出到浏览器
```

### 2. 表单提交流程

```
用户填写ContactForm
  ↓
handleSubmit触发
  ↓
并行执行两个操作：
  ├─ 1. 提交到Supabase submissions表
  └─ 2. 调用/api/wechat-notify推送企业微信
  ↓
显示成功提示
  ↓
3秒后自动关闭提示
```

### 3. 模态框交互流程

```
用户点击卡片
  ↓
setSelectedIndex(index)
  ↓
Modal组件渲染
  ↓
body overflow='hidden' (防止背景滚动)
  ↓
用户点击关闭/ESC键
  ↓
setSelectedIndex(null)
  ↓
body overflow='unset'
```

### 4. Supabase查询模式

**基础查询**：
```javascript
const { data, error } = await supabase
  .from('posts')
  .select('*')
  .eq('category', '保姆')
  .order('created_at', { ascending: false })
```

**条件查询**：
```javascript
let query = supabase.from('posts').select('*')

if (category !== '全部') {
  query = query.eq('category', category)
}

const { data } = await query
```

**关联查询**（案例页面）：
```javascript
// 并行查询两个表
const [postsResult, casesResult] = await Promise.all([
  supabase.from('posts').select('*').eq('content_type', '案例'),
  supabase.from('case_studies').select('*').eq('is_active', true)
])

// 合并数据
const allData = [...postsResult.data, ...casesResult.data]
```

---

## 数据流图

### 首页数据流

```
index.js
  ↓ useEffect
  ├─ fetchPosts() → Supabase posts表 → setPosts(data)
  └─ fetchFeaturedMembers() → Supabase team_members表 → setFeaturedMembers(data)
  ↓
ServiceCard渲染（显示posts数据）
TeamMemberCard渲染（显示members数据）
```

### 内容列表页数据流（科普/资讯/案例）

```
页面组件 (kepu.js / zixun.js / anli.js)
  ↓ useEffect监听selectedCategory
fetchPosts(selectedCategory)
  ↓ Supabase查询
  ├─ .eq('content_type', '科普/资讯/案例')
  └─ .eq('category', selectedCategory) // 如果不是"全部"
  ↓
setPosts(data)
  ↓
map()渲染PostCard
  ↓ 点击卡片
PostModal显示详情
```

---

## 命名规范

### 文件命名

- **页面文件**：小写，连字符分隔（如 `laorenghuli.js`）
- **组件文件**：大驼峰命名（如 `ContactForm.js`）
- **工具文件**：小驼峰命名（如 `supabaseClient.js`）

### 变量命名

- **React状态**：小驼峰（如 `selectedCategory`, `isModalOpen`）
- **常量**：大写下划线（如 `SITE_INFO`, `PAGE_SEO`）
- **组件Props**：小驼峰（如 `currentIndex`, `onClose`）

### CSS类命名

- **BEM规范**：`.block__element--modifier`
- **示例**：
  - `.post-card` - 块
  - `.post-card__title` - 元素
  - `.post-card--featured` - 修饰符

---

## 开发指南

### 添加新页面

1. 在`pages/`目录创建新文件（如 `newpage.js`）
2. 在`utils/seoData.js`的`PAGE_SEO`添加SEO配置
3. 在`components/Navbar.js`添加导航链接
4. 在`next-sitemap.config.js`添加页面优先级

### 添加新组件

1. 在`components/`目录创建组件文件
2. 使用函数式组件+Hooks
3. 添加PropTypes（可选）
4. 在`globals.css`添加样式

### 添加新的数据表

1. 在Supabase创建新表
2. 在`PROJECT_SUMMARY.md`更新数据库设计文档
3. 创建对应的查询函数
4. 创建对应的展示组件

### 调试技巧

1. **开发环境日志**：
   ```javascript
   if (process.env.NODE_ENV === 'development') {
     console.log('Debug info:', data)
   }
   ```

2. **Supabase错误处理**：
   ```javascript
   const { data, error } = await supabase.from('posts').select('*')
   if (error) {
     console.error('Supabase error:', error)
     return
   }
   ```

3. **Next.js调试**：
   - 开发服务器：`npm run dev`
   - 生产构建：`npm run build && npm start`

---

**文档维护**: 代码结构变更时需更新本文档
**最后更新人**: Claude Code
**更新日期**: 2025-11-11
