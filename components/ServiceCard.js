import Image from 'next/image'
import Link from 'next/link'

export default function ServiceCard({ title, description, image, imageAlt, category, price, status }) {
  // 截断内容到150字
  const truncatedDescription = description && description.length > 150
    ? description.substring(0, 150) + '...'
    : description

  // 根据分类确定链接路径
  const categoryLinks = {
    '保姆': '/baomu',
    '育儿嫂': '/yuerso',
    '老年护理': '/laorenghuli',
    '医院护工': '/yiyuanhugong'
  }

  const linkPath = categoryLinks[category] || '/'

  return (
    <article className="post-card">
      {image && (
        <div style={{ position: 'relative' }}>
          <Image
            src={image}
            alt={imageAlt}
            width={400}
            height={200}
            className="post-image"
            loading="lazy"
          />
          {status && (
            <div className={`service-status ${status === '在岗' ? 'status-available' : 'status-waiting'}`}>
              {status}
            </div>
          )}
        </div>
      )}
      <div className="post-content">
        <div className="service-card-header">
          <h3>{title}</h3>
          {price && <div className="service-price">{price}</div>}
        </div>
        <p>{truncatedDescription}</p>
        <Link href={linkPath} className="read-more-btn">
          查看更多
        </Link>
      </div>
    </article>
  )
}