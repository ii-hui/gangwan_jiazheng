import { useState, useEffect } from 'react'
import SEOHead from '../../components/SEOHead'
import { supabase } from '../../lib/supabaseClient'

export default function AdminReviewPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [seekers, setSeekers] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

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
    const { data, error } = await supabase
      .from('job_seekers')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) {
      setSeekers(data || [])
    }
    setLoading(false)
  }

  const handleAction = async (seekerId, action, rejectReason = '') => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          seekerId,
          action,
          rejectReason
        })
      })
      const data = await res.json()
      if (data.success) {
        setMessage(`操作成功：${data.message}`)
        loadSeekers()
      } else {
        setMessage(data.error || '操作失败')
      }
    } catch (error) {
      setMessage('操作失败，请重试')
    }
    setLoading(false)
  }

  if (!authenticated) {
    return (
      <>
        <SEOHead title="管理员审核 - 秦皇岛港湾家政" />
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
          <button
            onClick={login}
            style={{
              width: '100%',
              marginTop: '20px',
              padding: '12px',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            登录
          </button>
          {message && <p style={{ marginTop: '15px', color: '#ef4444', textAlign: 'center' }}>{message}</p>}
        </div>
      </>
    )
  }

  return (
    <>
      <SEOHead title="管理员审核 - 秦皇岛港湾家政" />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>求职者审核管理</h1>
          <button
            onClick={() => setAuthenticated(false)}
            style={{ padding: '8px 16px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            退出登录
          </button>
        </div>

        {message && (
          <div style={{ padding: '15px', marginBottom: '20px', background: message.includes('成功') ? '#d1fae5' : '#fee2e2', borderRadius: '4px' }}>
            {message}
          </div>
        )}

        {loading && <p>加载中...</p>}

        <div style={{ display: 'grid', gap: '20px' }}>
          {seekers.map(seeker => (
            <div key={seeker.id} style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '20px',
              background: 'white'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '20px' }}>
                <div>
                  <h3 style={{ marginBottom: '10px' }}>{seeker.name}</h3>
                  <p><strong>电话：</strong>{seeker.phone}</p>
                  <p><strong>年龄：</strong>{seeker.age}岁</p>
                  <p><strong>类别：</strong>{seeker.category}</p>
                  <p><strong>状态：</strong>
                    <span style={{
                      marginLeft: '5px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      background: seeker.is_approved ? '#d1fae5' : seeker.is_active ? '#fef3c7' : '#fee2e2',
                      color: seeker.is_approved ? '#065f46' : seeker.is_active ? '#92400e' : '#991b1b'
                    }}>
                      {seeker.is_approved ? '已通过' : seeker.is_active ? '待审核' : '已拒绝'}
                    </span>
                  </p>
                </div>

                <div>
                  <p><strong>经验：</strong>{seeker.experience || '无'}</p>
                  <p><strong>技能：</strong>{seeker.skills?.join('、') || '无'}</p>
                  <p><strong>简介：</strong>{seeker.description || '无'}</p>
                  <p><strong>提交时间：</strong>{new Date(seeker.created_at).toLocaleString('zh-CN')}</p>
                  {seeker.reject_reason && (
                    <p style={{ color: '#ef4444' }}><strong>拒绝原因：</strong>{seeker.reject_reason}</p>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {!seeker.is_approved && seeker.is_active && (
                    <>
                      <button
                        onClick={() => handleAction(seeker.id, 'approve')}
                        disabled={loading}
                        style={{
                          padding: '10px',
                          background: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                      >
                        ✓ 通过
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt('请输入拒绝原因：')
                          if (reason) handleAction(seeker.id, 'reject', reason)
                        }}
                        disabled={loading}
                        style={{
                          padding: '10px',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                      >
                        ✗ 拒绝
                      </button>
                    </>
                  )}
                  {seeker.is_approved && seeker.is_active && (
                    <button
                      onClick={() => handleAction(seeker.id, 'deactivate')}
                      disabled={loading}
                      style={{
                        padding: '10px',
                        background: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      下架
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {seekers.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
            <p>暂无求职者信息</p>
          </div>
        )}
      </div>
    </>
  )
}
