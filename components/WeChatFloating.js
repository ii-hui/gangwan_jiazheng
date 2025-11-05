import { useState } from 'react'
import Image from 'next/image'

export default function WeChatFloating() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {
    setIsModalOpen(true)
    // 防止背景滚动
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setIsModalOpen(false)
    // 恢复背景滚动
    document.body.style.overflow = 'unset'
  }

  return (
    <>
      {/* 悬浮按钮 */}
      <div className="wechat-floating-btn" onClick={openModal}>
        <span className="wechat-icon">💬</span>
        <span className="wechat-text">微信扫码咨询</span>
      </div>

      {/* 弹窗遮罩层 */}
      {isModalOpen && (
        <div className="wechat-modal-overlay" onClick={closeModal}>
          <div className="wechat-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="wechat-modal-close" onClick={closeModal} aria-label="关闭">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
              </svg>
            </button>
            <div className="wechat-qr-container">
              <Image
                src="/images/WXEWM.jpg"
                alt="港湾家政微信二维码"
                width={280}
                height={280}
                priority
                className="wechat-qr-image"
              />
              <p className="wechat-qr-title">微信扫码，立享优惠</p>
              <p className="wechat-qr-subtitle">添加微信号：gwjz_qhd</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
