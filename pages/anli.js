import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import SEOHead from '../components/SEOHead'
import Hero from '../components/Hero'
import Image from 'next/image'
import PostModal from '../components/PostModal'
import { generateBreadcrumbSchema } from '../utils/seoData'

export default function AnliPage() {
  const router = useRouter()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [selectedPostIndex, setSelectedPostIndex] = useState(null)

  const categories = ['全部', '保姆', '育儿嫂', '老年护理', '医院护工']

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: '首页', url: '/' },
    { name: '精选案例', url: '/anli' },
  ])

  // 从URL读取category参数
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

      // 查询 posts 表的案例
      let postsQuery = supabase
        .from('posts')
        .select('*')
        .eq('content_type', '案例')
        .order('created_at', { ascending: false })

      if (selectedCategory !== '全部') {
        postsQuery = postsQuery.eq('category', selectedCategory)
      }

      // 查询 case_studies 表的案例
      let casesQuery = supabase
        .from('case_studies')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (selectedCategory !== '全部') {
        casesQuery = casesQuery.eq('service_type', selectedCategory)
      }

      // 并行查询两个表
      const [postsResult, casesResult] = await Promise.all([
        postsQuery,
        casesQuery
      ])

      if (postsResult.error) throw postsResult.error
      if (casesResult.error && process.env.NODE_ENV === 'development') {
        console.error('Error fetching case studies:', casesResult.error)
      }

      // 转换 case_studies 数据格式，统一为 posts 格式
      const transformedCases = (casesResult.data || []).map(caseItem => {
        // 处理 screenshots 字段
        let screenshots = []
        if (typeof caseItem.screenshots === 'string') {
          try {
            screenshots = JSON.parse(caseItem.screenshots)
          } catch (e) {
            console.error('解析截图数据失败:', e)
          }
        } else if (Array.isArray(caseItem.screenshots)) {
          screenshots = caseItem.screenshots
        }

        // 获取第一张截图作为主图
        const firstScreenshot = screenshots.length > 0 ? screenshots[0] : null

        return {
          id: `case_${caseItem.id}`, // 添加前缀避免ID冲突
          title: caseItem.title,
          content: caseItem.description || '',
          category: caseItem.service_type || '未分类',
          image_url: firstScreenshot ? firstScreenshot.url : null,
          image_alt: firstScreenshot ? firstScreenshot.alt : caseItem.title,
          created_at: caseItem.created_at,
          source: 'case_studies', // 标记数据来源
          location: caseItem.location,
          screenshots: screenshots // 保留所有截图数据
        }
      })

      // 合并两个表的数据，按创建时间排序
      const allPosts = [...(postsResult.data || []).map(p => ({ ...p, source: 'posts' })), ...transformedCases]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

      setPosts(allPosts)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    // 更新URL参数但不刷新页面
    router.push(
      category === '全部' ? '/anli' : `/anli?category=${category}`,
      undefined,
      { shallow: true }
    )
  }

  const handlePostClick = (index) => {
    setSelectedPostIndex(index)
  }

  const handleCloseModal = () => {
    setSelectedPostIndex(null)
  }

  const handleNextPost = () => {
    setSelectedPostIndex((prev) => (prev + 1) % posts.length)
  }

  const handlePrevPost = () => {
    setSelectedPostIndex((prev) => (prev - 1 + posts.length) % posts.length)
  }

  return (
    <>
      <SEOHead
        title="精选服务案例-秦皇岛港湾家政成功案例分享"
        description="秦皇岛港湾家政精选服务案例，真实客户体验分享，包括保姆、育儿嫂、老年护理、医院护工等成功服务案例。"
        keywords="家政案例,保姆案例,育儿嫂案例,老年护理案例,护工案例,秦皇岛家政"
        canonical="/anli"
        schema={breadcrumbSchema}
      />

      <Hero
        title="秦皇岛家政服务精选案例"
        subtitle="真实服务案例，见证专业品质"
      />

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
                {cat !== '全部' && posts.length > 0 && selectedCategory === cat &&
                  ` (${posts.length})`
                }
              </button>
            ))}
          </div>
        </div>

        {/* 内容展示 */}
        {loading ? (
          <div className="loading">加载中...</div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <p>暂无{selectedCategory === '全部' ? '' : selectedCategory}服务案例</p>
            <p style={{ fontSize: '0.9em', color: '#999', marginTop: '10px' }}>
              敬请期待更多精彩内容
            </p>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map((post, index) => (
              <article
                key={post.id}
                className="post-card clickable"
                onClick={() => handlePostClick(index)}
              >
                {post.image_url && (
                  <Image
                    src={post.image_url}
                    alt={post.image_alt || `${post.category}案例-${post.title}`}
                    width={400}
                    height={200}
                    className="post-image"
                    loading="lazy"
                  />
                )}
                <div className="post-content">
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="post-category-tag">{post.category}</span>
                    {post.source === 'case_studies' && post.location && (
                      <span className="post-location-tag">📍 {post.location}</span>
                    )}
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content}</p>
                  {post.source === 'case_studies' && (
                    <span className="case-verified-badge">✓ 真实案例</span>
                  )}
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
          onClose={handleCloseModal}
          onNext={handleNextPost}
          onPrev={handlePrevPost}
        />
      )}
    </>
  )
}
