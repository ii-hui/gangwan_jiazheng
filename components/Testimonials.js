import { useState, useEffect } from 'react'
import Image from 'next/image'
import { supabase } from '../lib/supabaseClient'

export default function Testimonials() {
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0) // 案例索引
  const [currentImageIndex, setCurrentImageIndex] = useState(0) // 图片索引
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)

  // 图片预览Modal状态
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalImageIndex, setModalImageIndex] = useState(0)

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

  // 自动轮播案例（外层）
  useEffect(() => {
    if (cases.length === 0 || isModalOpen) return

    const timer = setInterval(() => {
      setCurrentCaseIndex((prev) => {
        const nextIndex = (prev + 1) % cases.length
        setCurrentImageIndex(0) // 切换案例时重置图片索引
        return nextIndex
      })
    }, 8000) // 8秒切换一次案例

    return () => clearInterval(timer)
  }, [cases.length, isModalOpen])

  // 自动轮播图片（内层）
  useEffect(() => {
    if (cases.length === 0 || isModalOpen) return
    const currentCase = cases[currentCaseIndex]
    if (!currentCase || !currentCase.screenshots || currentCase.screenshots.length <= 1) return

    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % currentCase.screenshots.length)
    }, 4000) // 4秒切换一次图片

    return () => clearInterval(timer)
  }, [cases, currentCaseIndex, isModalOpen])

  // 案例导航（外层）
  const handlePrevCase = () => {
    setCurrentCaseIndex((prev) => {
      const prevIndex = (prev - 1 + cases.length) % cases.length
      setCurrentImageIndex(0)
      return prevIndex
    })
  }

  const handleNextCase = () => {
    setCurrentCaseIndex((prev) => {
      const nextIndex = (prev + 1) % cases.length
      setCurrentImageIndex(0)
      return nextIndex
    })
  }

  // 图片导航（内层）
  const handlePrevImage = () => {
    const currentCase = cases[currentCaseIndex]
    if (!currentCase || !currentCase.screenshots) return
    setCurrentImageIndex((prev) => (prev - 1 + currentCase.screenshots.length) % currentCase.screenshots.length)
  }

  const handleNextImage = () => {
    const currentCase = cases[currentCaseIndex]
    if (!currentCase || !currentCase.screenshots) return
    setCurrentImageIndex((prev) => (prev + 1) % currentCase.screenshots.length)
  }

  // 打开图片预览Modal
  const openModal = (imageIndex) => {
    setModalImageIndex(imageIndex)
    setIsModalOpen(true)
    // 禁止body滚动
    document.body.style.overflow = 'hidden'
  }

  // 关闭Modal
  const closeModal = () => {
    setIsModalOpen(false)
    document.body.style.overflow = 'auto'
  }

  // Modal中的图片导航
  const handleModalPrevImage = () => {
    const currentCase = cases[currentCaseIndex]
    if (!currentCase || !currentCase.screenshots) return
    setModalImageIndex((prev) => (prev - 1 + currentCase.screenshots.length) % currentCase.screenshots.length)
  }

  const handleModalNextImage = () => {
    const currentCase = cases[currentCaseIndex]
    if (!currentCase || !currentCase.screenshots) return
    setModalImageIndex((prev) => (prev + 1) % currentCase.screenshots.length)
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
  const currentScreenshots = currentCase.screenshots || []
  const currentScreenshot = currentScreenshots[currentImageIndex] || currentScreenshots[0]

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

            {/* 微信聊天截图轮播区 */}
            <div className="case-screenshot-wrapper">
              {/* 图片切换按钮（内层） */}
              {currentScreenshots.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="screenshot-arrow screenshot-arrow-left"
                    aria-label="上一张截图"
                  >
                    ‹
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="screenshot-arrow screenshot-arrow-right"
                    aria-label="下一张截图"
                  >
                    ›
                  </button>
                </>
              )}

              <div
                className="case-screenshot"
                onClick={() => openModal(currentImageIndex)}
                style={{ cursor: 'pointer' }}
                title="点击查看大图"
              >
                {currentScreenshot && (
                  <Image
                    src={currentScreenshot.url}
                    alt={currentScreenshot.alt || currentCase.title}
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

              {/* 图片指示点（内层） */}
              {currentScreenshots.length > 1 && (
                <div className="screenshot-dots">
                  {currentScreenshots.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`screenshot-dot ${index === currentImageIndex ? 'active' : ''}`}
                      aria-label={`查看第${index + 1}张截图`}
                    />
                  ))}
                </div>
              )}
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

        {/* 案例轮播指示点（外层） */}
        {cases.length > 1 && (
          <div className="carousel-dots">
            {cases.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentCaseIndex(index)
                  setCurrentImageIndex(0)
                }}
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

            {/* 图片导航箭头 */}
            {currentScreenshots.length > 1 && (
              <>
                <button
                  onClick={handleModalPrevImage}
                  className="case-modal-arrow case-modal-arrow-left"
                  aria-label="上一张"
                >
                  ‹
                </button>
                <button
                  onClick={handleModalNextImage}
                  className="case-modal-arrow case-modal-arrow-right"
                  aria-label="下一张"
                >
                  ›
                </button>
              </>
            )}

            {/* 预览图片 */}
            <div className="case-modal-image-wrapper">
              {currentScreenshots[modalImageIndex] && (
                <img
                  src={currentScreenshots[modalImageIndex].url}
                  alt={currentScreenshots[modalImageIndex].alt || currentCase.title}
                  className="case-modal-image"
                />
              )}
            </div>

            {/* 图片计数 */}
            {currentScreenshots.length > 1 && (
              <div className="case-modal-counter">
                {modalImageIndex + 1} / {currentScreenshots.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
