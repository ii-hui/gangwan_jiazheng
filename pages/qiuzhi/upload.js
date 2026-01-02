import { useState } from 'react'
import SEOHead from '../../components/SEOHead'
import Hero from '../../components/Hero'

export default function UploadPage() {
  const [step, setStep] = useState(1)
  const [keyCode, setKeyCode] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    category: '保姆',
    experience: '',
    skills: '',
    description: ''
  })
  const [avatar, setAvatar] = useState(null)
  const [workPhotos, setWorkPhotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const compressImage = (file, maxSizeKB = 200) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height
          const maxDim = 800
          if (width > height && width > maxDim) {
            height = (height * maxDim) / width
            width = maxDim
          } else if (height > maxDim) {
            width = (width * maxDim) / height
            height = maxDim
          }
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)
          canvas.toBlob((blob) => {
            resolve(canvas.toDataURL('image/jpeg', 0.8))
          }, 'image/jpeg', 0.8)
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    })
  }

  const validateKey = async () => {
    if (!keyCode.trim()) {
      setMessage('请输入上传密钥')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyCode: keyCode.trim() })
      })
      const data = await res.json()
      if (data.valid) {
        setStep(2)
        setMessage('')
      } else {
        setMessage('密钥无效或已过期')
      }
    } catch (error) {
      setMessage('验证失败，请重试')
    }
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.phone || !formData.category) {
      setMessage('请填写必填字段')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/upload-seeker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyCode,
          ...formData,
          skills: formData.skills ? formData.skills.split(/[,，、]/).map(s => s.trim()) : [],
          avatarBase64: avatar,
          workPhotosBase64: workPhotos
        })
      })
      const data = await res.json()
      if (data.success) {
        setMessage('提交成功！等待管理员审核后即可展示')
        setStep(3)
      } else {
        setMessage(data.error || '提交失败')
      }
    } catch (error) {
      setMessage('提交失败，请重试')
    }
    setLoading(false)
  }

  return (
    <>
      <SEOHead
        title="求职者信息上传 - 秦皇岛港湾家政"
        description="上传您的求职信息到秦皇岛港湾家政平台"
      />
      <Hero title="求职者信息上传" subtitle="填写您的信息，让更多雇主看到您" />

      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px' }}>
        {step === 1 && (
          <div style={{ background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginBottom: '20px' }}>步骤 1: 验证上传密钥</h2>
            <input
              type="text"
              placeholder="请输入上传密钥"
              value={keyCode}
              onChange={(e) => setKeyCode(e.target.value)}
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}
            />
            <button
              onClick={validateKey}
              disabled={loading}
              style={{
                width: '100%',
                marginTop: '20px',
                padding: '12px',
                background: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? '验证中...' : '验证密钥'}
            </button>
            {message && <p style={{ marginTop: '15px', color: '#ef4444' }}>{message}</p>}
            <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
              没有密钥？请联系客服获取：18533552006
            </p>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} style={{ background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginBottom: '20px' }}>步骤 2: 填写个人信息</h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>姓名 *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>电话 *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>年龄</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>求职类别 *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                required
              >
                <option value="保姆">保姆</option>
                <option value="育儿嫂">育儿嫂</option>
                <option value="老年护理">老年护理</option>
                <option value="医院护工">医院护工</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>工作经验</label>
              <input
                type="text"
                placeholder="例如：5年家政经验"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>技能（用逗号分隔）</label>
              <input
                type="text"
                placeholder="例如：做饭,打扫,照顾老人"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>个人简介</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>头像照片</label>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files[0]
                  if (file) {
                    const compressed = await compressImage(file)
                    setAvatar(compressed)
                  }
                }}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>工作照片（最多3张）</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={async (e) => {
                  const files = Array.from(e.target.files).slice(0, 3)
                  const compressed = await Promise.all(files.map(f => compressImage(f)))
                  setWorkPhotos(compressed)
                }}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <button
              type="submit"
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
              {loading ? '提交中...' : '提交信息'}
            </button>
            {message && <p style={{ marginTop: '15px', color: message.includes('成功') ? '#10b981' : '#ef4444' }}>{message}</p>}
          </form>
        )}

        {step === 3 && (
          <div style={{ background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>✅</div>
            <h2 style={{ marginBottom: '15px', color: '#10b981' }}>提交成功！</h2>
            <p style={{ color: '#666', lineHeight: '1.8' }}>
              您的信息已提交，管理员审核通过后将在求职者列表中展示。<br />
              如有疑问，请联系客服：18533552006
            </p>
          </div>
        )}
      </div>
    </>
  )
}
