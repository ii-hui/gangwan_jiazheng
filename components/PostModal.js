import { useEffect } from 'react'
import Image from 'next/image'

export default function PostModal({ posts, currentIndex, onClose, onNext, onPrev }) {
  const currentPost = posts[currentIndex]

  useEffect(() => {
    // 防止背景滚动
    document.body.style.overflow = 'hidden'

    // 键盘事件监听
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, onNext, onPrev])

  if (!currentPost) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* 关闭按钮 */}
        <button className="modal-close" onClick={onClose} aria-label="关闭">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* 左箭头按钮 */}
        {posts.length > 1 && (
          <button
            className="modal-arrow modal-arrow-left"
            onClick={onPrev}
            aria-label="上一个"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        )}

        {/* 右箭头按钮 */}
        {posts.length > 1 && (
          <button
            className="modal-arrow modal-arrow-right"
            onClick={onNext}
            aria-label="下一个"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        )}

        {/* 内容区域 */}
        <div className="modal-body">
          {currentPost.image_url && (
            <div className="modal-image-wrapper">
              <Image
                src={currentPost.image_url}
                alt={currentPost.image_alt || currentPost.title}
                width={800}
                height={500}
                className="modal-image"
                priority
              />
            </div>
          )}

          <div className="modal-text">
            <h2>{currentPost.title}</h2>
            <p>{currentPost.content}</p>
          </div>

          {/* 指示器 */}
          {posts.length > 1 && (
            <div className="modal-indicator">
              {currentIndex + 1} / {posts.length}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
