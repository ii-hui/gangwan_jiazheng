import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import SEOHead from '../components/SEOHead'
import Hero from '../components/Hero'
import Image from 'next/image'
import PostModal from '../components/PostModal'
import { generateBreadcrumbSchema } from '../utils/seoData'

export default function KepuPage() {
  const router = useRouter()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [selectedPostIndex, setSelectedPostIndex] = useState(null)

  const categories = ['全部', '保姆', '育儿嫂', '老年护理', '医院护工']

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: '首页', url: '/' },
    { name: '科普知识', url: '/kepu' },
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
      let query = supabase
        .from('posts')
        .select('*')
        .eq('content_type', '科普')
        .order('created_at', { ascending: false })

      if (selectedCategory !== '全部') {
        query = query.eq('category', selectedCategory)
      }

      const { data, error } = await query

      if (error) throw error
      setPosts(data || [])
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
      category === '全部' ? '/kepu' : `/kepu?category=${category}`,
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
        title="家政服务科普知识-秦皇岛港湾家政专业指南"
        description="秦皇岛港湾家政提供专业的家政服务科普知识，包括保姆、育儿嫂、老年护理、医院护工等领域的专业知识和实用技巧。"
        keywords="家政科普,保姆知识,育儿知识,老年护理知识,护工知识,秦皇岛家政"
        canonical="/kepu"
        schema={breadcrumbSchema}
      />

      <Hero
        title="秦皇岛家政服务科普知识"
        subtitle="专业的家政服务知识，助您做出明智选择"
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
            <p>暂无{selectedCategory === '全部' ? '' : selectedCategory}科普内容</p>
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
                    alt={post.image_alt || `${post.category}科普-${post.title}`}
                    width={400}
                    height={200}
                    className="post-image"
                    loading="lazy"
                  />
                )}
                <div className="post-content">
                  <span className="post-category-tag">{post.category}</span>
                  <h3>{post.title}</h3>
                  <p>{post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content}</p>
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
