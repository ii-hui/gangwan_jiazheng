import { useState, useEffect } from 'react'
import SEOHead from '../../components/SEOHead'
import { supabase } from '../../lib/supabaseClient'

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('review')
  const [seekers, setSeekers] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // 密钥生成相关
  const [expiresInDays, setExpiresInDays] = useState(7)
  const [maxUses, setMaxUses] = useState(1)
  const [notes, setNotes] = useState('')
  const [generatedKey, setGeneratedKey] = useState(null)

  const login = () => {
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
    if (password === adminPassword) {
      setAuthenticated(true)
      setMessage('')
      loadSeekers()
    } else {
      setMessage('密码错误')
    }
  }

  const loadSeekers = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/seekers?password=${encodeURIComponent(password)}`)
      const data = await res.json()
      if (data.success) {
        setSeekers(data.seekers || [])
      } else {
        setMessage(data.error || '加载失败')
      }
    } catch (error) {
      setMessage('加载失败')
    }
    setLoading(false)
  }

  const handleAction = async (seekerId, action, rejectReason = '') => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, seekerId, action, rejectReason })
      })
      const data = await res.json()
      if (data.success) {
        setMessage(data.message)
        loadSeekers()
      } else {
        setMessage(data.error)
      }
    } catch (error) {
      setMessage('操作失败')
    }
    setLoading(false)
  }

  const toggleFeatured = async (seekerId, currentFeatured) => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/toggle-featured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, seekerId, featured: !currentFeatured })
      })
      const data = await res.json()
      if (data.success) {
        setMessage(data.message)
        loadSeekers()
      } else {
        setMessage(data.error)
      }
    } catch (error) {
      setMessage('操作失败')
    }
    setLoading(false)
  }

  const generateKey = async () => {
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch('/api/admin/generate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, expiresInDays: parseInt(expiresInDays), maxUses: parseInt(maxUses), notes })
      })
      const data = await res.json()
      if (data.success) {
        setGeneratedKey(data)
        setMessage('密钥生成成功！')
      } else {
        setMessage(data.error)
      }
    } catch (error) {
      setMessage('生成失败')
    }
    setLoading(false)
  }

  if (!authenticated) {
    return (
      <>
        <SEOHead title="管理后台 - 秦皇岛港湾家政" />
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '40px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>管理员登录</h2>
          <input
            type="password"
            placeholder="请输入管理员密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && login()}
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}
          />
          <button onClick={login} style={{ width: '100%', marginTop: '20px', padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' }}>
            登录
          </button>
          {message && <p style={{ marginTop: '15px', color: '#ef4444', textAlign: 'center' }}>{message}</p>}
        </div>
      </>
    )
  }

  return (
    <>
      <SEOHead title="管理后台 - 秦皇岛港湾家政" />
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>管理后台</h1>
          <button onClick={() => setAuthenticated(false)} style={{ padding: '8px 16px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            退出登录
          </button>
        </div>

        {/* 标签页 */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e5e7eb' }}>
          <button onClick={() => setActiveTab('review')} style={{ padding: '10px 20px', background: activeTab === 'review' ? '#2563eb' : 'transparent', color: activeTab === 'review' ? 'white' : '#666', border: 'none', borderRadius: '4px 4px 0 0', cursor: 'pointer' }}>
            审核管理
          </button>
          <button onClick={() => setActiveTab('featured')} style={{ padding: '10px 20px', background: activeTab === 'featured' ? '#2563eb' : 'transparent', color: activeTab === 'featured' ? 'white' : '#666', border: 'none', borderRadius: '4px 4px 0 0', cursor: 'pointer' }}>
            首页展示
          </button>
          <button onClick={() => setActiveTab('keys')} style={{ padding: '10px 20px', background: activeTab === 'keys' ? '#2563eb' : 'transparent', color: activeTab === 'keys' ? 'white' : '#666', border: 'none', borderRadius: '4px 4px 0 0', cursor: 'pointer' }}>
            生成密钥
          </button>
        </div>

        {message && (
          <div style={{ padding: '15px', marginBottom: '20px', background: message.includes('成功') ? '#d1fae5' : '#fee2e2', borderRadius: '4px', color: message.includes('成功') ? '#065f46' : '#991b1b' }}>
            {message}
          </div>
        )}

        {/* 审核管理标签页 */}
        {activeTab === 'review' && (
          <div>
            <h2 style={{ marginBottom: '20px' }}>求职者审核</h2>
            {loading && <p>加载中...</p>}
            <div style={{ display: 'grid', gap: '15px' }}>
              {seekers.filter(s => s.is_active || (!s.is_approved && s.is_active !== false)).map(seeker => (
                <div key={seeker.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '15px', background: 'white', display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '15px', alignItems: 'center' }}>
                  <div>
                    <h3>{seeker.name}</h3>
                    <p style={{ fontSize: '14px', color: '#666' }}>电话：{seeker.phone}</p>
                    <p style={{ fontSize: '14px', color: '#666' }}>类别：{seeker.category}</p>
                    <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '12px', background: seeker.is_approved ? '#d1fae5' : '#fef3c7', color: seeker.is_approved ? '#065f46' : '#92400e' }}>
                      {seeker.is_approved ? '已通过' : '待审核'}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    <p>经验：{seeker.experience || '无'}</p>
                    <p>技能：{seeker.skills?.join('、') || '无'}</p>
                    <p>简介：{seeker.description || '无'}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {!seeker.is_approved && (
                      <>
                        <button onClick={() => handleAction(seeker.id, 'approve')} disabled={loading} style={{ padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
                          通过
                        </button>
                        <button onClick={() => { const reason = prompt('拒绝原因：'); if (reason) handleAction(seeker.id, 'reject', reason) }} disabled={loading} style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
                          拒绝
                        </button>
                      </>
                    )}
                    {seeker.is_approved && seeker.is_active && (
                      <button onClick={() => handleAction(seeker.id, 'deactivate')} disabled={loading} style={{ padding: '8px 16px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
                        下架
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 首页展示标签页 */}
        {activeTab === 'featured' && (
          <div>
            <h2 style={{ marginBottom: '20px' }}>首页展示管理（建议8-12人）</h2>
            <p style={{ marginBottom: '20px', color: '#666' }}>当前首页展示：{seekers.filter(s => s.is_featured).length} 人</p>
            {loading && <p>加载中...</p>}
            <div style={{ display: 'grid', gap: '15px' }}>
              {seekers.filter(s => s.is_approved && s.is_active).map(seeker => (
                <div key={seeker.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '15px', background: seeker.is_featured ? '#eff6ff' : 'white', display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '15px', alignItems: 'center' }}>
                  <div>
                    <h3>{seeker.name}</h3>
                    <p style={{ fontSize: '14px', color: '#666' }}>电话：{seeker.phone}</p>
                    <p style={{ fontSize: '14px', color: '#666' }}>类别：{seeker.category}</p>
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    <p>经验：{seeker.experience || '无'}</p>
                    <p>技能：{seeker.skills?.join('、') || '无'}</p>
                  </div>
                  <button onClick={() => toggleFeatured(seeker.id, seeker.is_featured)} disabled={loading} style={{ padding: '8px 16px', background: seeker.is_featured ? '#ef4444' : '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
                    {seeker.is_featured ? '取消展示' : '设为展示'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 生成密钥标签页 */}
        {activeTab === 'keys' && (
          <div style={{ maxWidth: '600px' }}>
            <h2 style={{ marginBottom: '20px' }}>生成上传密钥</h2>
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>有效期（天）</label>
                <input type="number" value={expiresInDays} onChange={(e) => setExpiresInDays(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>最大使用次数</label>
                <input type="number" value={maxUses} onChange={(e) => setMaxUses(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>备注</label>
                <input type="text" placeholder="例如：发给张三" value={notes} onChange={(e) => setNotes(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              <button onClick={generateKey} disabled={loading} style={{ width: '100%', padding: '10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                {loading ? '生成中...' : '生成密钥'}
              </button>
              {generatedKey && (
                <div style={{ marginTop: '20px', padding: '15px', background: '#f3f4f6', borderRadius: '4px' }}>
                  <h3 style={{ marginBottom: '10px' }}>生成的密钥</h3>
                  <div style={{ padding: '10px', background: 'white', border: '2px solid #2563eb', borderRadius: '4px', fontSize: '18px', fontWeight: 'bold', color: '#2563eb', textAlign: 'center', userSelect: 'all' }}>
                    {generatedKey.keyCode}
                  </div>
                  <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>有效期至：{new Date(generatedKey.expiresAt).toLocaleString('zh-CN')}</p>
                  <p style={{ fontSize: '14px', color: '#ef4444', marginTop: '10px' }}>⚠️ 请将此密钥发送给求职者，密钥只显示一次！</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
