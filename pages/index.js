import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'
import SEOHead from '../components/SEOHead'
import Hero from '../components/Hero'
import ServiceCard from '../components/ServiceCard'
import TeamMemberCard from '../components/TeamMemberCard'
import ContactForm from '../components/ContactForm'
import AdvantageGrid from '../components/AdvantageGrid'
import { PAGE_SEO, generateOrganizationSchema, generateBreadcrumbSchema } from '../utils/seoData'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [featuredMembers, setFeaturedMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('保姆')

  const categories = ['保姆', '育儿嫂', '老年护理', '医院护工']

  useEffect(() => {
    fetchPosts()
    fetchFeaturedMembers()
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
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFeaturedMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('status', '在职')
        .eq('is_featured', true)
        .order('display_order', { ascending: true })
        .limit(6)

      if (error) throw error
      setFeaturedMembers(data || [])
    } catch (error) {
      console.error('Error fetching featured members:', error)
    }
  }

  const filteredPosts = posts.filter((post) => post.category === activeCategory)

  // 生成结构化数据
  const organizationSchema = generateOrganizationSchema()
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: '首页', url: '/' },
  ])

  const combinedSchema = [organizationSchema, breadcrumbSchema]

  if (loading) {
    return <div className="loading">加载中...</div>
  }

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
        title="专注于本地服务的高端家政"
        subtitle="我们的联系电话是：18533552006"
        showLogo={true}
      />

      <div className="main-container">
        {/* 分类切换 */}
        <div className="category-header">
          <h2>{activeCategory}服务</h2>
          <p>为您提供专业、可靠的{activeCategory}服务</p>
          
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
          {filteredPosts.length === 0 ? (
            <div className="empty-state">
              <p>暂无{activeCategory}相关内容</p>
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

        {/* 团队风采预览 */}
        {featuredMembers.length > 0 && (
          <section className="team-preview-section">
            <div className="section-header">
              <h2>我们的优秀团队</h2>
              <p>经验丰富、专业培训、值得信赖</p>
            </div>
            <div className="team-preview-grid">
              {featuredMembers.map((member) => (
                <Link
                  key={member.id}
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
      </div>
    </>
  )
}