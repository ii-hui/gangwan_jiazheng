import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'
import TeamMemberCard from './TeamMemberCard'

export default function RecommendedTeam({ category, limit = 4 }) {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMembers()
  }, [category])

  const fetchMembers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('category', category)
        .eq('status', '在职')
        .order('display_order', { ascending: true })
        .limit(limit)

      if (error) throw error
      setMembers(data || [])
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Error fetching recommended team members:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="recommended-team-section">
        <div className="section-header">
          <h2>我们的优秀{category}</h2>
          <p>查看为您精心挑选的优秀{category}团队成员</p>
        </div>
        <div className="loading" style={{ padding: '40px 0', textAlign: 'center' }}>
          加载中...
        </div>
      </section>
    )
  }

  if (members.length === 0) {
    return null // 如果没有团队成员，不显示这个section
  }

  return (
    <section className="recommended-team-section">
      <div className="section-header">
        <h2>我们的优秀{category}</h2>
        <p>查看为您精心挑选的优秀{category}团队成员</p>
      </div>
      <div className="recommended-team-grid">
        {members.map((member) => (
          <Link
            key={member.id}
            href={`/tuanduifengcai?category=${category}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <TeamMemberCard member={member} />
          </Link>
        ))}
      </div>
      <div className="recommended-team-footer">
        <Link href={`/tuanduifengcai?category=${category}`} className="view-more-team-btn">
          查看更多{category}团队 →
        </Link>
      </div>
    </section>
  )
}
