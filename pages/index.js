import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'
import SEOHead from '../components/SEOHead'
import Hero from '../components/Hero'
import ServiceCard from '../components/ServiceCard'
import TeamMemberCard from '../components/TeamMemberCard'
import ContactForm from '../components/ContactForm'
import AdvantageGrid from '../components/AdvantageGrid'
import SkeletonCard from '../components/SkeletonCard'
import { PAGE_SEO, generateOrganizationSchema, generateBreadcrumbSchema } from '../utils/seoData'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [featuredMembers, setFeaturedMembers] = useState([])
  const [featuredSeekers, setFeaturedSeekers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('保姆')
  const [adminClickCount, setAdminClickCount] = useState(0)

  const categories = ['保姆', '育儿嫂', '老年护理', '医院护工']

  useEffect(() => {
    fetchPosts()
    fetchFeaturedMembers()
    fetchFeaturedSeekers()
  }, [])

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('is_featured', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFeaturedMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_featured', true)
        .order('display_order', { ascending: true })
        .limit(6)

      if (error) throw error
      setFeaturedMembers(data || [])
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Error fetching featured members:', error)
    }
  }

  const fetchFeaturedSeekers = async () => {
    try {
      const { data, error } = await supabase
        .from('job_seekers')
        .select('*')
        .eq('is_featured', true)
        .eq('is_approved', true)
        .eq('is_active', true)
        .order('display_order', { ascending: false })
        .limit(12)

      if (error) throw error

      // 转换为TeamMemberCard期望的格式，并生成签名URL
      const seekersFormatted = await Promise.all((data || []).map(async (seeker) => {
        let avatarUrl = null
        if (seeker.avatar_url) {
          // 使用API获取签名URL
          try {
            console.log('原始路径:', seeker.avatar_url)
            const res = await fetch(`/api/get-signed-url?path=${encodeURIComponent(seeker.avatar_url)}`)
            const urlData = await res.json()
            console.log('API响应:', urlData)
            avatarUrl = urlData.signedUrl
            console.log('最终URL:', avatarUrl)
          } catch (err) {
            console.error('获取签名URL失败:', err)
          }
        } else {
          console.log('求职者无头像:', seeker.name)
        }

        return {
          id: seeker.id,
          name: seeker.name,
          category: seeker.category,
          avatar_url: avatarUrl,
          avatar_alt: `秦皇岛${seeker.category}-${seeker.name}`,
          status: seeker.work_status || '求职中',
          age: seeker.age,
          experience_years: seeker.experience,
          highlight: seeker.description,
          skills: seeker.skills || []
        }
      }))

      console.log('格式化后的求职者数据:', seekersFormatted)
      setFeaturedSeekers(seekersFormatted)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Error fetching featured seekers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter((post) => post.category === activeCategory)

  // 管理员入口点击处理
  const handleAdminClick = () => {
    const newCount = adminClickCount + 1
    setAdminClickCount(newCount)
    if (newCount >= 6) {
      window.location.href = '/admin/dashboard'
    }
  }

  // 生成结构化数据
  const organizationSchema = generateOrganizationSchema()
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: '首页', url: '/' },
  ])

  const combinedSchema = [organizationSchema, breadcrumbSchema]

  return (
    <>
      <SEOHead
        title={PAGE_SEO.home.title}
        description={PAGE_SEO.home.description}
        keywords={PAGE_SEO.home.keywords}
        canonical={PAGE_SEO.home.canonical}
        schema={combinedSchema}
      />

      <Hero
        title="秦皇岛本地家政 | 1-2小时响应 | 已服务3000+家庭"
        subtitle="专业家政服务，让生活更轻松"
        showLogo={true}
        showCTA={true}
      />

      {/* 社会证明横幅 */}
      <div className="social-proof-banner">
        <div className="stat-item">
          <strong>3000+</strong>
          <span>秦皇岛服务家庭</span>
        </div>
        <div className="stat-item">
          <strong>98%</strong>
          <span>客户满意度</span>
        </div>
        <div className="stat-item">
          <strong>1-2h</strong>
          <span>秦皇岛快速响应</span>
        </div>
        <div className="stat-item">
          <strong>24h</strong>
          <span>在线服务</span>
        </div>
      </div>

      <div className="main-container">
        {/* 分类切换 */}
        <div className="category-header">
          <h2>秦皇岛{activeCategory}服务</h2>
          <p>为秦皇岛市民提供专业、可靠的{activeCategory}服务</p>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`nav-link ${activeCategory === category ? 'active' : ''}`}
                style={{ margin: 0 }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 文章列表 */}
        <main className="posts-grid">
          {loading ? (
            [...Array(4)].map((_, index) => <SkeletonCard key={index} />)
          ) : filteredPosts.length === 0 ? (
            <div className="empty-state">
              <p>暂无秦皇岛{activeCategory}相关内容</p>
            </div>
          ) : (
            filteredPosts.slice(0, 4).map((post) => (
              <ServiceCard
                key={post.id}
                title={post.title}
                description={post.content}
                image={post.image_url}
                imageAlt={post.image_alt || `秦皇岛${activeCategory}服务-${post.title}`}
                category={post.category}
              />
            ))
          )}
        </main>

        {/* 家政知识库模块 */}
        <section className="knowledge-base-section">
          <div className="section-header">
            <h2>秦皇岛家政百科</h2>
            <p>专业知识 | 秦皇岛精选案例 | 秦皇岛行业资讯</p>
          </div>
          <div className="knowledge-base-grid">
            <Link href="/kepu" className="knowledge-card">
              <div className="knowledge-icon">📚</div>
              <h3>科普知识</h3>
              <p>专业的育儿、养老、护理知识</p>
            </Link>
            <Link href="/anli" className="knowledge-card">
              <div className="knowledge-icon">⭐</div>
              <h3>秦皇岛案例</h3>
              <p>真实秦皇岛服务案例分享</p>
            </Link>
            <Link href="/zixun" className="knowledge-card">
              <div className="knowledge-icon">📰</div>
              <h3>行业资讯</h3>
              <p>最新秦皇岛家政行业动态</p>
            </Link>
          </div>
        </section>


        {/* 团队风采预览 */}
        {(featuredSeekers.length > 0 || featuredMembers.length > 0) && (
          <section className="team-preview-section">
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
              <div>
                <h2>秦皇岛优秀团队</h2>
                <p>经验丰富、专业培训、秦皇岛本地值得信赖</p>
              </div>
              <Link href="/qiuzhi/upload" style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.3s ease',
                }}>
                  📝 我要求职
                </button>
              </Link>
            </div>
            <div className="team-preview-grid">
              {/* 先展示求职者 */}
              {featuredSeekers.map((member) => (
                <Link
                  key={`seeker-${member.id}`}
                  href="/qiuzhi"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <TeamMemberCard member={member} unoptimized={true} />
                </Link>
              ))}
              {/* 再展示团队成员 */}
              {featuredMembers.map((member) => (
                <Link
                  key={`member-${member.id}`}
                  href={`/tuanduifengcai?category=${member.category}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <TeamMemberCard member={member} />
                </Link>
              ))}
            </div>
            <div className="team-preview-footer">
              <Link href="/tuanduifengcai" className="view-all-team-btn">
                查看更多团队成员 →
              </Link>
            </div>
          </section>
        )}

        {/* 联系表单和优势卡片 */}
        <div className="contact-advantages-wrapper">
          <ContactForm />
          <AdvantageGrid />
        </div>

        {/* 隐藏的管理员入口 */}
        <div style={{ textAlign: 'center', padding: '30px 0 20px', borderTop: '1px solid #f0f0f0', marginTop: '40px' }}>
          <p
            onClick={handleAdminClick}
            style={{
              color: '#999',
              fontSize: '14px',
              cursor: 'default',
              userSelect: 'none',
              margin: 0
            }}
          >
            © 2024 秦皇岛港湾家政 版权所有
          </p>
        </div>
      </div>
    </>
  )
}