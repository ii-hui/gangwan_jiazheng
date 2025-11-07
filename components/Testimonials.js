import { useState, useEffect } from 'react'
import Image from 'next/image'
import { supabase } from '../lib/supabaseClient'

export default function Testimonials() {
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0) // 案例索引
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)

  // 图片预览Modal状态
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 从Supabase获取案例数据
  useEffect(() => {
    fetchCases()
  }, [])

  const fetchCases = async () => {
    try {
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) {
        console.error('获取案例数据失败:', error)
        setCases(getDefaultCases())
      } else {
        // 处理截图数组数据
        const processedData = (data || []).map(caseItem => {
          // 确保 screenshots 是数组格式
          let screenshots = []
          if (typeof caseItem.screenshots === 'string') {
            try {
              screenshots = JSON.parse(caseItem.screenshots)
            } catch (e) {
              console.error('解析截图数据失败:', e)
            }
          } else if (Array.isArray(caseItem.screenshots)) {
            screenshots = caseItem.screenshots
          }

          return {
            ...caseItem,
            screenshots: screenshots
          }
        })

        setCases(processedData.length > 0 ? processedData : getDefaultCases())
      }
    } catch (error) {
      console.error('获取案例数据异常:', error)
      setCases(getDefaultCases())
    } finally {
      setLoading(false)
    }
  }

  // 默认数据（当数据库为空或查询失败时使用）
  const getDefaultCases = () => [{
    id: '1',
    title: '秦皇岛-海港区-找保姆-刘女士',
    screenshots: [
      {
        url: '/images/placeholder-chat.jpg',
        alt: '秦皇岛案例展示'
      }
    ],
    description: '暂无案例数据，请在Supabase后台添加案例内容。',
    service_type: '保姆',
    location: '海港区'
  }]

  // 自动轮播案例
  useEffect(() => {
    if (cases.length === 0 || isModalOpen) return

    const timer = setInterval(() => {
      setCurrentCaseIndex((prev) => (prev + 1) % cases.length)
    }, 8000) // 8秒切换一次案例

    return () => clearInterval(timer)
  }, [cases.length, isModalOpen])

  // 案例导航
  const handlePrevCase = () => {
    setCurrentCaseIndex((prev) => (prev - 1 + cases.length) % cases.length)
  }

  const handleNextCase = () => {
    setCurrentCaseIndex((prev) => (prev + 1) % cases.length)
  }

  // 打开图片预览Modal
  const openModal = () => {
    setIsModalOpen(true)
    // 禁止body滚动
    document.body.style.overflow = 'hidden'
  }

  // 关闭Modal
  const closeModal = () => {
    setIsModalOpen(false)
    document.body.style.overflow = 'auto'
  }

  // ESC键关闭Modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isModalOpen])

  if (loading) {
    return (
      <section className="testimonials-section">
        <div className="section-header">
          <h2>秦皇岛真实案例</h2>
          <p>客户聊天记录 | 真实服务见证</p>
        </div>
        <div className="case-loading">
          <p>加载中...</p>
        </div>
      </section>
    )
  }

  if (cases.length === 0) {
    return null
  }

  const currentCase = cases[currentCaseIndex]
  // 只显示第一张截图
  const firstScreenshot = (currentCase.screenshots && currentCase.screenshots.length > 0)
    ? currentCase.screenshots[0]
    : null

  return (
    <>
      <section className="testimonials-section case-studies-section">
        <div className="section-header">
          <h2>秦皇岛真实案例</h2>
          <p>客户聊天记录 | 真实服务见证</p>
        </div>

        <div className="testimonials-carousel case-carousel">
          {/* 案例切换按钮（外层） */}
          {cases.length > 1 && (
            <>
              <button
                onClick={handlePrevCase}
                className="carousel-arrow carousel-arrow-left case-arrow"
                aria-label="上一个案例"
              >
                ‹
              </button>
              <button
                onClick={handleNextCase}
                className="carousel-arrow carousel-arrow-right case-arrow"
                aria-label="下一个案例"
              >
                ›
              </button>
            </>
          )}

          <div className="case-card">
            {/* 案例标题 */}
            <div className="case-header">
              <h3 className="case-title">{currentCase.title}</h3>
              {currentCase.service_type && (
                <span className="case-badge">{currentCase.service_type}</span>
              )}
            </div>

            {/* 微信聊天截图展示区 */}
            <div className="case-screenshot-wrapper">
              <div
                className="case-screenshot"
                onClick={openModal}
                style={{ cursor: 'pointer' }}
                title="点击查看大图"
              >
                {firstScreenshot && (
                  <Image
                    src={firstScreenshot.url}
                    alt={firstScreenshot.alt || currentCase.title}
                    width={375}
                    height={0}
                    style={{ width: '100%', height: 'auto' }}
                    className="screenshot-image"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = '/images/placeholder-wechat.jpg'
                    }}
                  />
                )}
              </div>
            </div>

            {/* 案例说明 */}
            {currentCase.description && (
              <div className="case-description">
                <p>{currentCase.description}</p>
              </div>
            )}

            {/* 案例标签 */}
            <div className="case-footer">
              {currentCase.location && (
                <span className="case-location">📍 {currentCase.location}</span>
              )}
              <span className="case-verified">✓ 真实案例</span>
            </div>
          </div>
        </div>

        {/* 案例轮播指示点 */}
        {cases.length > 1 && (
          <div className="carousel-dots">
            {cases.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentCaseIndex(index)}
                className={`carousel-dot ${index === currentCaseIndex ? 'active' : ''}`}
                aria-label={`查看第${index + 1}个案例`}
              />
            ))}
          </div>
        )}
      </section>

      {/* 图片预览Modal */}
      {isModalOpen && (
        <div className="case-image-modal-overlay" onClick={closeModal}>
          <div className="case-image-modal-content" onClick={(e) => e.stopPropagation()}>
            {/* 关闭按钮 */}
            <button
              onClick={closeModal}
              className="case-modal-close"
              aria-label="关闭预览"
            >
              ✕
            </button>

            {/* 预览图片 */}
            <div className="case-modal-image-wrapper">
              {firstScreenshot && (
                <img
                  src={firstScreenshot.url}
                  alt={firstScreenshot.alt || currentCase.title}
                  className="case-modal-image"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
