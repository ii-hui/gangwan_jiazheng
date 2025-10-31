import { useState, useEffect } from 'react'

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      name: '刘女士',
      location: '秦皇岛海港区',
      service: '保姆服务',
      rating: 5,
      text: '港湾家政推荐的保姆阿姨特别好，在我们海港区这边工作很认真，家里打扫得特别干净，做饭也好吃。已经在我家干了半年了，非常满意！',
      date: '2024-10'
    },
    {
      name: '王先生',
      location: '秦皇岛北戴河区',
      service: '老年护理',
      rating: 5,
      text: '我父亲住在北戴河，行动不便需要专业护理。港湾家政的护理员很专业，每天按时给老人翻身、按摩，态度也特别好。作为儿女我们很放心。',
      date: '2024-09'
    },
    {
      name: '张女士',
      location: '秦皇岛山海关区',
      service: '育儿嫂',
      rating: 5,
      text: '月子期间请的育儿嫂，手法专业，对宝宝照顾得很细心。我在山海关家里，她来得很快，服务态度好，还教了我很多育儿知识。强烈推荐！',
      date: '2024-10'
    },
    {
      name: '李先生',
      location: '秦皇岛抚宁区',
      service: '医院护工',
      rating: 5,
      text: '母亲住院需要护工，港湾家政1小时就安排到位。护工很负责，在抚宁区人民医院照顾得很周到，让我们家属省心不少。价格也公道。',
      date: '2024-08'
    },
    {
      name: '赵女士',
      location: '秦皇岛开发区',
      service: '保姆服务',
      rating: 5,
      text: '我们在开发区上班比较忙，家里请了住家保姆。阿姨非常勤快，把家里收拾得井井有条，还会照顾老人和孩子。港湾家政的服务真不错！',
      date: '2024-09'
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [testimonials.length])

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="testimonials-section">
      <div className="section-header">
        <h2>秦皇岛客户评价</h2>
        <p>真实客户反馈 | 服务口碑见证</p>
      </div>

      <div className="testimonials-carousel">
        <button onClick={handlePrev} className="carousel-arrow carousel-arrow-left" aria-label="上一条评价">
          ‹
        </button>

        <div className="testimonial-card">
          <div className="testimonial-header">
            <div className="customer-info">
              <h3>{currentTestimonial.name}</h3>
              <p className="customer-location">📍 {currentTestimonial.location}</p>
              <p className="service-type">{currentTestimonial.service}</p>
            </div>
            <div className="rating">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="star">⭐</span>
              ))}
            </div>
          </div>

          <p className="testimonial-text">{currentTestimonial.text}</p>

          <div className="testimonial-footer">
            <span className="testimonial-date">{currentTestimonial.date}</span>
            <span className="testimonial-verified">✓ 已验证客户</span>
          </div>
        </div>

        <button onClick={handleNext} className="carousel-arrow carousel-arrow-right" aria-label="下一条评价">
          ›
        </button>
      </div>

      <div className="carousel-dots">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
            aria-label={`查看第${index + 1}条评价`}
          />
        ))}
      </div>
    </section>
  )
}
