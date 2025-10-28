import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    category: '保姆',
    message: '',
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
      const { error } = await supabase.from('submissions').insert([formData])

      if (error) throw error

      setSubmitted(true)
      setFormData({ name: '', phone: '', category: '保姆', message: '' })

      setTimeout(() => setSubmitted(false), 3000)
    } catch (error) {
      setError('提交失败，请重试：' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="contact-form">
      <h2>相信我们是专业的 - 告诉我们您的需求</h2>
      <p className="form-subtitle">我们将尽快为您安排最合适的服务人员</p>

      {submitted && <p className="success">提交完成，我们将尽快联系您！</p>}
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="name"
          placeholder="您的姓名"
          value={formData.name}
          onChange={handleChange}
          required
          aria-label="您的姓名"
        />

        <input
          type="tel"
          name="phone"
          placeholder="您的电话"
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
              {cat}
            </option>
          ))}
        </select>

        <textarea
          name="message"
          placeholder="留下您的详细需求，我们将为您匹配最优质的工作人员"
          value={formData.message}
          onChange={handleChange}
          rows="5"
          aria-label="您的需求"
        />

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? '提交中...' : '提交需求'}
        </button>
      </form>
    </section>
  )
}