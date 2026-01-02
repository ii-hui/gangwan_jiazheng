# 港湾家政 - 快速参考手册

> 快速查找代码位置和使用方法
> 最后更新：2025-11-11

---

## 📁 核心文件速查

### 组件文件
```
components/
├── Layout.js              # 全局布局（导航+底部+微信浮窗）
├── Navbar.js              # 顶部导航栏（响应式菜单）
├── SEOHead.js             # SEO头部组件
├── Hero.js                # 页面头图（可选Logo和CTA）
├── ContactForm.js         # 联系表单（Supabase+企业微信）
├── WeChatFloating.js      # 微信悬浮按钮+二维码弹窗
├── AdvantageGrid.js       # 优势展示网格
├── ServiceCard.js         # 服务卡片
├── TeamMemberCard.js      # 团队成员卡片
├── TeamMemberModal.js     # 成员详情弹窗（支持左右切换）
├── PostModal.js           # 内容详情弹窗（支持左右切换）
├── SkeletonCard.js        # Loading骨架屏
├── RelatedServices.js     # 相关服务推荐
└── RecommendedTeam.js     # 推荐团队成员
```

### 页面文件
```
pages/
├── index.js               # 首页（动态内容+团队预览）
├── baomu.js               # 保姆服务详情页
├── yuerso.js              # 育儿嫂服务详情页
├── laorenghuli.js         # 老年护理详情页
├── yiyuanhugong.js        # 医院护工详情页
├── kepu.js                # 科普知识列表页（支持分类筛选）
├── zixun.js               # 行业资讯列表页（支持分类筛选）
├── anli.js                # 案例展示列表页（posts+case_studies）
├── tuanduifengcai.js      # 团队风采展示页（支持分类筛选）
├── price.js               # 价格表页面（三档服务等级）
├── about.js               # 关于我们
├── contact.js             # 联系我们+表单
├── 404.js                 # 404错误页
└── api/
    └── wechat-notify.js   # 企业微信通知API
```

### 配置与工具
```
utils/seoData.js           # SEO配置中心（PAGE_SEO、SERVICE_CONTENT、Schema生成）
lib/supabaseClient.js      # Supabase客户端配置
styles/globals.css         # 全局样式（3000+行）
next.config.js             # Next.js配置（图片优化、安全头、压缩）
next-sitemap.config.js     # Sitemap配置（优先级、频率）
.env.local                 # 环境变量（勿提交）
```

---

## 🔧 常用代码片段

### 1. 添加新的列表页面（科普/资讯/案例）

```javascript
// pages/new-content.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import SEOHead from '../components/SEOHead'
import Hero from '../components/Hero'
import Image from 'next/image'
import PostModal from '../components/PostModal'
import SkeletonCard from '../components/SkeletonCard'

export default function NewContentPage() {
  const router = useRouter()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [selectedPostIndex, setSelectedPostIndex] = useState(null)

  const categories = ['全部', '保姆', '育儿嫂', '老年护理', '医院护工']

  useEffect(() => {
    if (router.isReady) {
      const { category } = router.query
      if (category && categories.includes(category)) {
        setSelectedCategory(category)
      }
    }
  }, [router.isReady, router.query])

  useEffect(() => {
    fetchPosts()
  }, [selectedCategory])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('posts')
        .select('*')
        .eq('content_type', '新类型')
        .order('created_at', { ascending: false })

      if (selectedCategory !== '全部') {
        query = query.eq('category', selectedCategory)
      }

      const { data, error } = await query
      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    router.push(
      category === '全部' ? '/new-content' : `/new-content?category=${category}`,
      undefined,
      { shallow: true }
    )
  }

  return (
    <>
      <SEOHead
        title="新内容 - 秦皇岛港湾家政"
        description="描述..."
        keywords="关键词"
        canonical="/new-content"
      />
      <Hero title="新内容标题" subtitle="副标题" />

      <div className="main-container">
        {/* 分类筛选 */}
        <div className="category-filter">
          <h2>按服务类型筛选</h2>
          <div className="filter-buttons">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 内容展示 */}
        {loading ? (
          <div className="posts-grid">
            {[...Array(6)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <p>暂无内容</p>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map((post, index) => (
              <article
                key={post.id}
                className="post-card clickable"
                onClick={() => setSelectedPostIndex(index)}
              >
                {post.image_url && (
                  <Image
                    src={post.image_url}
                    alt={post.image_alt || post.title}
                    width={400}
                    height={200}
                    className="post-image"
                    loading="lazy"
                  />
                )}
                <div className="post-content">
                  <span className="post-category-tag">{post.category}</span>
                  <h3>{post.title}</h3>
                  <p>{post.content.substring(0, 150)}...</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* 模态框 */}
      {selectedPostIndex !== null && (
        <PostModal
          posts={posts}
          currentIndex={selectedPostIndex}
          onClose={() => setSelectedPostIndex(null)}
          onNext={() => setSelectedPostIndex((prev) => (prev + 1) % posts.length)}
          onPrev={() => setSelectedPostIndex((prev) => (prev - 1 + posts.length) % posts.length)}
        />
      )}
    </>
  )
}
```

### 2. 发送企业微信通知

```javascript
// 在表单提交后调用
const response = await fetch('/api/wechat-notify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: '在线咨询',
    phone: '13800138000',
    category: '保姆',
    message: '咨询保姆服务'
  })
})

const result = await response.json()
if (result.success) {
  console.log('通知发送成功')
}
```

### 3. Supabase数据查询模式

```javascript
import { supabase } from '../lib/supabaseClient'

// 基础查询
const { data, error } = await supabase
  .from('posts')
  .select('*')
  .eq('category', '保姆')
  .order('created_at', { ascending: false })

// 条件查询
let query = supabase.from('posts').select('*')
if (category !== '全部') {
  query = query.eq('category', category)
}
const { data } = await query

// 插入数据
const { error } = await supabase
  .from('submissions')
  .insert([{
    name: '张三',
    phone: '13800138000',
    category: '保姆',
    message: '咨询服务'
  }])

// 更新数据
const { error } = await supabase
  .from('team_members')
  .update({ status: '在岗' })
  .eq('id', memberId)

// 删除数据
const { error } = await supabase
  .from('posts')
  .delete()
  .eq('id', postId)

// 并行查询多个表
const [postsResult, membersResult] = await Promise.all([
  supabase.from('posts').select('*').eq('is_featured', true),
  supabase.from('team_members').select('*').eq('is_featured', true)
])
```

---

## 🎨 常用样式类名

### 布局容器
```css
.main-container       /* 页面主容器，最大宽度1400px */
.section             /* 标准section间距 */
.hero                /* 头图区域 */
```

### 按钮样式
```css
.submit-btn          /* 主按钮（金色） */
.cta-button          /* CTA按钮 */
.desktop-sticky-call /* 固定电话按钮 */
.wechat-floating-btn /* 固定微信按钮 ⭐ */
```

### 表单相关
```css
.contact-form        /* 表单容器 */
.form-select         /* 下拉选择 */
.success             /* 成功提示 */
.error               /* 错误提示 */
```

---

## 🗄️ 数据库快速操作

### 查看表结构
```sql
-- 查看submissions表字段
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'submissions';
```

### 查询最近提交
```sql
SELECT * FROM submissions
ORDER BY created_at DESC
LIMIT 10;
```

### 统计各类服务咨询量
```sql
SELECT category, COUNT(*) as count
FROM submissions
GROUP BY category
ORDER BY count DESC;
```

---

## 🚀 常用命令

### 开发
```bash
npm run dev          # 启动开发服务器 localhost:3000
npm run build        # 构建生产版本
npm start            # 启动生产服务器
```

### Git操作
```bash
git status           # 查看状态
git add .            # 添加所有文件
git commit -m "xxx"  # 提交
git push             # 推送到GitHub
```

### 清理
```bash
rm -rf .next         # 删除构建缓存
rm -rf node_modules  # 删除依赖
npm install          # 重新安装
```

---

## 📞 联系方式配置

### 电话号码
- 代码位置：`utils/seoData.js` → `SITE_INFO.phone`
- 当前值：`18533552006`
- 影响范围：全站所有显示电话的位置

### 微信号
- 代码位置：`pages/contact.js:78`
- 当前值：`gwjz_qhd`
- 二维码：`public/images/WXEWM.jpg`

### 企业微信Webhook
- 配置位置：`.env.local`
- 变量名：`WECHAT_WORK_WEBHOOK_URL`
- 使用位置：`pages/api/wechat-notify.js`

---

## 🎯 SEO关键词策略

### 主关键词
- 秦皇岛家政
- 秦皇岛保姆
- 秦皇岛育儿嫂
- 秦皇岛老年护理
- 秦皇岛护工

### 长尾关键词
- 秦皇岛找保姆
- 秦皇岛住家保姆
- 秦皇岛育婴师
- 秦皇岛医院护工价格
- 秦皇岛老人护理服务

### 地域覆盖
- 海港区家政
- 山海关家政
- 北戴河家政
- 秦皇岛开发区家政

---

## 🐛 常见问题解决

### 1. 表单提交失败
```
错误：Could not find the 'category' column
解决：执行 supabase-submissions-fix.sql
```

### 2. 企业微信通知失败
```
检查项：
1. .env.local 中 webhook URL是否正确
2. 企业微信群机器人是否被删除
3. 网络是否可以访问企业微信API
```

### 3. 图片加载失败
```
检查项：
1. next.config.js 中是否配置了图片域名
2. Supabase存储桶是否公开
3. 图片路径是否正确
```

### 4. 开发服务器无法启动
```bash
# 删除锁文件
rm -f .next/dev/lock

# 杀掉占用端口的进程（Windows）
netstat -ano | findstr :3000
taskkill /F /PID <进程ID>

# 重新启动
npm run dev
```

---

## 📊 性能优化检查清单

- [ ] 图片使用Next.js Image组件
- [ ] 关键资源使用priority属性
- [ ] 未使用的CSS已清理
- [ ] JavaScript包大小合理（< 500KB）
- [ ] Lighthouse分数 > 90
- [ ] 首屏加载时间 < 3秒

---

## 🔒 安全检查清单

- [ ] .env.local 未提交到Git
- [ ] Supabase RLS策略已启用
- [ ] API路由有基本验证
- [ ] 表单有防XSS处理
- [ ] 敏感信息未硬编码
- [ ] HTTPS已启用

---

## 📝 待办事项模板

### 新功能开发
```markdown
## 功能名称

**优先级**: 高/中/低
**预计时间**: X小时
**负责人**: xxx

### 需求描述
- 功能1
- 功能2

### 技术方案
1. 创建组件/页面
2. 数据库设计
3. API开发
4. 前端集成
5. 测试

### 验收标准
- [ ] 功能正常
- [ ] 移动端适配
- [ ] 性能达标
- [ ] 已部署上线
```

---

## 🎓 学习资源

### Next.js文档
- 官网：https://nextjs.org/docs
- Pages Router：https://nextjs.org/docs/pages

### Supabase文档
- 官网：https://supabase.com/docs
- JavaScript客户端：https://supabase.com/docs/reference/javascript

### 企业微信
- Webhook文档：https://developer.work.weixin.qq.com/document/path/91770

---

**文档用途**: 日常开发快速查找
**维护建议**: 发现新的常用操作及时补充
**最后更新**: 2025-11-11
