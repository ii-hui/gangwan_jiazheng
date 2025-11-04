import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    phone: '',
    category: '保姆',
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const categories = ['保姆', '育儿嫂', '老年护理', '医院护工']

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const submissionData = {
        ...formData,
        name: '在线咨询',
        email: 'noreply@example.com', // 占位符邮箱，因为数据库email字段不允许为空
        message: `咨询${formData.category}服务`
      }

      // 提交到Supabase
      const { error } = await supabase.from('submissions').insert([submissionData])

      if (error) throw error

      // 发送企业微信通知
      try {
        const notifyResponse = await fetch('/api/wechat-notify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData)
        })

        const notifyResult = await notifyResponse.json()

        if (!notifyResult.success) {
          console.error('企业微信通知失败:', notifyResult)
          // 不影响用户体验，只记录错误
        }
      } catch (notifyError) {
        console.error('发送企业微信通知时出错:', notifyError)
        // 不影响用户体验，只记录错误
      }

      setSubmitted(true)
      setFormData({ phone: '', category: '保姆' })

      setTimeout(() => setSubmitted(false), 3000)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        setError('提交失败，请重试：' + error.message)
      } else {
        setError('提交失败，请重试或直接拨打18533552006')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="contact-form">
      <h2>快速预约 - 1分钟获取专业服务</h2>
      <p className="form-subtitle">留下电话，我们立即为您安排最合适的服务人员</p>

      {submitted && <p className="success">提交成功！我们将在30分钟内联系您</p>}
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="form">
        <input
          type="tel"
          name="phone"
          placeholder="您的电话号码 *"
          value={formData.phone}
          onChange={handleChange}
          required
          aria-label="您的电话"
          pattern="[0-9]{11}"
          title="请输入11位手机号码"
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="form-select"
          aria-label="服务类型"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              需要{cat}服务
            </option>
          ))}
        </select>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? '提交中...' : '立即预约'}
        </button>
      </form>
    </section>
  )
}