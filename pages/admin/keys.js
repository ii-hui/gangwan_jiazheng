import { useState } from 'react'
import SEOHead from '../../components/SEOHead'

export default function AdminKeysPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [generatedKey, setGeneratedKey] = useState(null)
  const [expiresInDays, setExpiresInDays] = useState(7)
  const [maxUses, setMaxUses] = useState(1)
  const [notes, setNotes] = useState('')

  const login = () => {
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
    if (password === adminPassword) {
      setAuthenticated(true)
      setMessage('')
    } else {
      setMessage('密码错误')
    }
  }

  const generateKey = async () => {
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch('/api/admin/generate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          expiresInDays: parseInt(expiresInDays),
          maxUses: parseInt(maxUses),
          notes
        })
      })
      const data = await res.json()
      if (data.success) {
        setGeneratedKey(data)
        setMessage('密钥生成成功！')
      } else {
        setMessage(data.error || '生成失败')
      }
    } catch (error) {
      setMessage('生成失败，请重试')
    }
    setLoading(false)
  }

  if (!authenticated) {
    return (
      <>
        <SEOHead title="密钥管理 - 秦皇岛港湾家政" />
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
      <SEOHead title="密钥管理 - 秦皇岛港湾家政" />
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>上传密钥生成</h1>
          <button
            onClick={() => setAuthenticated(false)}
            style={{ padding: '8px 16px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            退出登录
          </button>
        </div>

        <div style={{ background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>有效期（天）</label>
            <input
              type="number"
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>最大使用次数</label>
            <input
              type="number"
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>备注</label>
            <input
              type="text"
              placeholder="例如：发给张三"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>

          <button
            onClick={generateKey}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '生成中...' : '生成密钥'}
          </button>

          {message && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              background: message.includes('成功') ? '#d1fae5' : '#fee2e2',
              borderRadius: '4px',
              color: message.includes('成功') ? '#065f46' : '#991b1b'
            }}>
              {message}
            </div>
          )}

          {generatedKey && (
            <div style={{ marginTop: '20px', padding: '20px', background: '#f3f4f6', borderRadius: '4px' }}>
              <h3 style={{ marginBottom: '15px' }}>生成的密钥</h3>
              <div style={{ marginBottom: '10px' }}>
                <strong>密钥：</strong>
                <div style={{
                  marginTop: '5px',
                  padding: '10px',
                  background: 'white',
                  border: '2px solid #2563eb',
                  borderRadius: '4px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#2563eb',
                  textAlign: 'center',
                  userSelect: 'all'
                }}>
                  {generatedKey.keyCode}
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#666' }}>
                <strong>有效期至：</strong>{new Date(generatedKey.expiresAt).toLocaleString('zh-CN')}
              </p>
              <p style={{ fontSize: '14px', color: '#666' }}>
                <strong>最大使用次数：</strong>{generatedKey.maxUses}
              </p>
              <p style={{ marginTop: '15px', fontSize: '14px', color: '#ef4444' }}>
                ⚠️ 请将此密钥发送给求职者，密钥只显示一次，请妥善保存！
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
