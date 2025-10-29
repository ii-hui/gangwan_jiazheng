import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import SEOHead from '../components/SEOHead'
import Hero from '../components/Hero'
import Image from 'next/image'
import PostModal from '../components/PostModal'
import SkeletonCard from '../components/SkeletonCard'
import { generateBreadcrumbSchema } from '../utils/seoData'

export default function ZixunPage() {
  const router = useRouter()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [selectedPostIndex, setSelectedPostIndex] = useState(null)

  const categories = ['全部', '保姆', '育儿嫂', '老年护理', '医院护工']

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: '首页', url: '/' },
    { name: '行业资讯', url: '/zixun' },
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
        .eq('content_type', '资讯')
        .order('created_at', { ascending: false })

      if (selectedCategory !== '全部') {
        query = query.eq('category', selectedCategory)
      }

      const { data, error } = await query

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    // 更新URL参数但不刷新页面
    router.push(
      category === '全部' ? '/zixun' : `/zixun?category=${category}`,
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
        title="行业资讯-秦皇岛港湾家政最新动态"
        description="秦皇岛港湾家政行业资讯，家政行业最新动态、政策解读、市场趋势等专业资讯内容。"
        keywords="家政资讯,行业动态,家政政策,市场趋势,秦皇岛家政"
        canonical="/zixun"
        schema={breadcrumbSchema}
      />

      <Hero
        title="秦皇岛家政行业资讯"
        subtitle="了解家政行业最新动态和趋势"
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
          <div className="posts-grid">
            {[...Array(6)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <p>暂无{selectedCategory === '全部' ? '' : selectedCategory}行业资讯</p>
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
                    alt={post.image_alt || `${post.category}资讯-${post.title}`}
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
