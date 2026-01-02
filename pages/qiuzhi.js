import { useState } from 'react'
import SEOHead from '../components/SEOHead'
import Hero from '../components/Hero'
import { supabase } from '../lib/supabaseClient'
import { supabaseAdmin } from '../lib/supabaseAdmin'

export default function QiuzhiPage({ seekers }) {
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const categories = ['全部', '保姆', '育儿嫂', '老年护理', '医院护工']

  const filteredSeekers = selectedCategory === '全部'
    ? seekers
    : seekers.filter(s => s.category === selectedCategory)

  return (
    <>
      <SEOHead
        title="求职者信息 - 秦皇岛港湾家政"
        description="查看秦皇岛港湾家政求职者信息，包括保姆、育儿嫂、老年护理、医院护工等"
        keywords="秦皇岛求职,家政求职,保姆求职,育儿嫂求职"
      />

      <Hero
        title="求职者信息"
        subtitle="优质家政服务人员，等待您的选择"
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* 类别筛选 */}
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                margin: '0 10px',
                padding: '10px 20px',
                border: selectedCategory === cat ? '2px solid #2563eb' : '1px solid #ddd',
                background: selectedCategory === cat ? '#2563eb' : 'white',
                color: selectedCategory === cat ? 'white' : '#333',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 求职者列表 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {filteredSeekers.map(seeker => (
            <div key={seeker.id} style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '20px',
              background: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                <img
                  src={seeker.avatar_url || '/images/default-avatar.jpg'}
                  alt={seeker.name}
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid #f3f4f6'
                  }}
                />
              </div>
              <h3 style={{ fontSize: '20px', marginBottom: '10px', textAlign: 'center' }}>{seeker.name}</h3>
              <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.8' }}>
                <p><strong>年龄：</strong>{seeker.age}岁</p>
                <p><strong>类别：</strong>{seeker.category}</p>
                <p><strong>经验：</strong>{seeker.experience || '暂无'}</p>
                {seeker.skills && seeker.skills.length > 0 && (
                  <p><strong>技能：</strong>{seeker.skills.join('、')}</p>
                )}
                {seeker.description && (
                  <p style={{ marginTop: '10px', color: '#888' }}>{seeker.description}</p>
                )}
              </div>
              <div style={{ marginTop: '15px', textAlign: 'center' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '5px 15px',
                  background: seeker.work_status === '求职中' ? '#10b981' : '#6b7280',
                  color: 'white',
                  borderRadius: '20px',
                  fontSize: '14px'
                }}>
                  {seeker.work_status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredSeekers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
            <p style={{ fontSize: '18px' }}>暂无{selectedCategory === '全部' ? '' : selectedCategory}求职者信息</p>
          </div>
        )}
      </div>
    </>
  )
}

export async function getServerSideProps() {
  const { data: seekers, error } = await supabase
    .from('job_seekers')
    .select('*')
    .eq('is_approved', true)
    .eq('is_active', true)
    .order('display_order', { ascending: false })
    .order('created_at', { ascending: false })

  // 为每个求职者生成签名URL
  const seekersWithUrls = await Promise.all((seekers || []).map(async (seeker) => {
    let avatarUrl = null
    if (seeker.avatar_url) {
      const { data } = await supabaseAdmin.storage
        .from('job-seekers')
        .createSignedUrl(seeker.avatar_url, 3600)
      avatarUrl = data?.signedUrl || null
    }
    return {
      ...seeker,
      avatar_url: avatarUrl
    }
  }))

  return {
    props: {
      seekers: seekersWithUrls
    }
  }
}
