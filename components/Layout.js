import Navbar from './Navbar'
import WeChatFloating from './WeChatFloating'
import { useState, useEffect } from 'react'

export default function Layout({ children }) {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-wrapper">
      <Navbar />
      <main>{children}</main>

      {/* 移动端底部拨号按钮 */}
      <a
        href="tel:18533552006"
        className="mobile-sticky-call"
        aria-label="立即拨打电话"
      >
        📞 立即拨打 18533552006
      </a>

      {/* 桌面端右侧固定电话按钮 */}
      <a
        href="tel:18533552006"
        className="desktop-sticky-call"
        aria-label="拨打电话"
      >
        <span className="phone-icon">📞</span>
        <span className="phone-text">18533552006</span>
      </a>

      {/* 微信悬浮按钮 */}
      <WeChatFloating />

      {/* 回到顶部按钮 */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="scroll-to-top"
          aria-label="回到顶部"
        >
          ↑
        </button>
      )}
    </div>
  )
}