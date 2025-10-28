import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function TeamMemberModal({ members, currentIndex, onClose, onNext, onPrev }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const member = members[currentIndex]

  useEffect(() => {
    // 重置图片索引当成员改变时
    setCurrentImageIndex(0)
  }, [currentIndex])

  useEffect(() => {
    // 防止背景滚动
    document.body.style.overflow = 'hidden'

    // 键盘事件监听
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && members.length > 1) onPrev()
      if (e.key === 'ArrowRight' && members.length > 1) onNext()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, onNext, onPrev, members.length])

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleNextImage = () => {
    if (member.gallery_images && currentImageIndex < member.gallery_images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  const displayImages = member.gallery_images || []
  const displayAlts = member.gallery_alts || []

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content team-modal">
        {/* 关闭按钮 */}
        <button className="modal-close" onClick={onClose} aria-label="关闭">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* 切换成员按钮 */}
        {members.length > 1 && (
          <>
            <button className="modal-arrow modal-arrow-left" onClick={onPrev} aria-label="上一位">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button className="modal-arrow modal-arrow-right" onClick={onNext} aria-label="下一位">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}

        <div className="modal-body">
          {/* 头像区域 */}
          <div className="team-modal-header">
            <div className="team-modal-avatar">
              {member.avatar_url ? (
                <Image
                  src={member.avatar_url}
                  alt={member.avatar_alt || `秦皇岛${member.category}-${member.name}`}
                  width={150}
                  height={150}
                  className="modal-avatar-img"
                />
              ) : (
                <div className="modal-avatar-placeholder">
                  <span>{member.name?.charAt(0) || '?'}</span>
                </div>
              )}
            </div>

            <div className="team-modal-basic">
              <h2>{member.name}</h2>
              <div className="team-modal-meta">
                <span className="category-badge">{member.category}</span>
                {member.age && <span>·{member.age}岁</span>}
                {member.experience_years && <span>·{member.experience_years}年经验</span>}
              </div>
              {member.highlight && <p className="modal-highlight">{member.highlight}</p>}
            </div>
          </div>

          {/* 技能标签 */}
          {member.skills && member.skills.length > 0 && (
            <div className="team-modal-skills">
              <h3>擅长技能</h3>
              <div className="skills-tags">
                {member.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* 个人简介 */}
          {member.description && (
            <div className="team-modal-description">
              <h3>个人简介</h3>
              <p>{member.description}</p>
            </div>
          )}

          {/* 作品集图片 */}
          {displayImages.length > 0 && (
            <div className="team-modal-gallery">
              <h3>作品展示</h3>
              <div className="gallery-main">
                <Image
                  src={displayImages[currentImageIndex]}
                  alt={displayAlts[currentImageIndex] || `${member.name}的作品${currentImageIndex + 1}`}
                  width={800}
                  height={600}
                  className="gallery-image"
                />

                {displayImages.length > 1 && (
                  <>
                    {currentImageIndex > 0 && (
                      <button className="gallery-arrow gallery-arrow-left" onClick={handlePrevImage}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="15 18 9 12 15 6" />
                        </svg>
                      </button>
                    )}
                    {currentImageIndex < displayImages.length - 1 && (
                      <button className="gallery-arrow gallery-arrow-right" onClick={handleNextImage}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </button>
                    )}
                    <div className="gallery-indicator">
                      {currentImageIndex + 1} / {displayImages.length}
                    </div>
                  </>
                )}
              </div>

              {/* 缩略图 */}
              {displayImages.length > 1 && (
                <div className="gallery-thumbnails">
                  {displayImages.map((img, index) => (
                    <div
                      key={index}
                      className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <Image
                        src={img}
                        alt={`缩略图${index + 1}`}
                        width={100}
                        height={75}
                        className="thumbnail-img"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 底部提示 */}
          {members.length > 1 && (
            <div className="modal-indicator">
              第 {currentIndex + 1} / {members.length} 位团队成员
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
