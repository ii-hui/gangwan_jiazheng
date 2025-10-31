import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import SEOHead from '../components/SEOHead'
import Hero from '../components/Hero'
import TeamMemberCard from '../components/TeamMemberCard'
import TeamMemberModal from '../components/TeamMemberModal'
import SkeletonCard from '../components/SkeletonCard'
import { generateBreadcrumbSchema } from '../utils/seoData'

export default function TuanduifengcaiPage() {
  const router = useRouter()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [selectedMemberIndex, setSelectedMemberIndex] = useState(null)

  const categories = ['全部', '保姆', '育儿嫂', '老年护理', '医院护工']

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: '首页', url: '/' },
    { name: '团队风采', url: '/tuanduifengcai' },
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
    fetchMembers()
  }, [selectedCategory])

  const fetchMembers = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('team_members')
        .select('*')
        .eq('status', '在职')
        .order('display_order', { ascending: true })

      if (selectedCategory !== '全部') {
        query = query.eq('category', selectedCategory)
      }

      const { data, error } = await query

      if (error) throw error
      setMembers(data || [])
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Error fetching team members:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    // 更新URL参数但不刷新页面
    router.push(
      category === '全部' ? '/tuanduifengcai' : `/tuanduifengcai?category=${category}`,
      undefined,
      { shallow: true }
    )
  }

  const handleMemberClick = (index) => {
    setSelectedMemberIndex(index)
  }

  const handleCloseModal = () => {
    setSelectedMemberIndex(null)
  }

  const handleNextMember = () => {
    setSelectedMemberIndex((prev) => (prev + 1) % members.length)
  }

  const handlePrevMember = () => {
    setSelectedMemberIndex((prev) => (prev - 1 + members.length) % members.length)
  }

  return (
    <>
      <SEOHead
        title="团队风采-秦皇岛港湾家政优秀员工展示"
        description="秦皇岛港湾家政优秀团队成员展示，包括经验丰富的保姆、育儿嫂、老年护理和医院护工，查看真实照片和服务作品。"
        keywords="秦皇岛家政团队,保姆照片,育儿嫂展示,老年护理员,医院护工,家政服务人员"
        canonical="/tuanduifengcai"
        schema={breadcrumbSchema}
      />

      <Hero
        title="秦皇岛港湾家政团队风采"
        subtitle="经验丰富、专业培训、值得信赖"
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
                {cat !== '全部' && members.length > 0 && selectedCategory === cat &&
                  ` (${members.length})`
                }
              </button>
            ))}
          </div>
        </div>

        {/* 团队成员展示 */}
        {loading ? (
          <div className="team-members-grid">
            {[...Array(8)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : members.length === 0 ? (
          <div className="empty-state">
            <p>暂无{selectedCategory === '全部' ? '' : selectedCategory}团队成员</p>
            <p style={{ fontSize: '0.9em', color: '#999', marginTop: '10px' }}>
              我们正在招募更多优秀人才
            </p>
          </div>
        ) : (
          <div className="team-members-grid">
            {members.map((member, index) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                onClick={() => handleMemberClick(index)}
              />
            ))}
          </div>
        )}

        {/* 底部提示 */}
        <div className="team-footer-note">
          <p>
            💡 点击任意团队成员查看详细信息和作品展示
          </p>
          <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#888' }}>
            如需预约具体团队成员，请联系客服：<a href="tel:18533552006" style={{ color: '#d4a574', fontWeight: 600 }}>18533552006</a>
          </p>
        </div>
      </div>

      {/* 模态框 */}
      {selectedMemberIndex !== null && (
        <TeamMemberModal
          members={members}
          currentIndex={selectedMemberIndex}
          onClose={handleCloseModal}
          onNext={handleNextMember}
          onPrev={handlePrevMember}
        />
      )}
    </>
  )
}
