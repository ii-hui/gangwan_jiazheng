import SEOHead from '../components/SEOHead'
import Hero from '../components/Hero'
import ContactForm from '../components/ContactForm'
import AdvantageGrid from '../components/AdvantageGrid'
import RecommendedTeam from '../components/RecommendedTeam'
import Image from 'next/image'
import Link from 'next/link'
import {
  PAGE_SEO,
  SERVICE_CONTENT,
  generateServiceSchema,
  generateBreadcrumbSchema
} from '../utils/seoData'

export default function LaorenghuliPage() {
  const service = SERVICE_CONTENT.laorenghuli

  const serviceSchema = generateServiceSchema(
    '秦皇岛老年护理服务',
    '老年护理',
    service.price,
    service.description
  )

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: '首页', url: '/' },
    { name: '老年护理服务', url: '/laorenghuli' },
  ])

  return (
    <>
      <SEOHead
        title={PAGE_SEO.laorenghuli.title}
        description={PAGE_SEO.laorenghuli.description}
        keywords={PAGE_SEO.laorenghuli.keywords}
        canonical={PAGE_SEO.laorenghuli.canonical}
        schema={[serviceSchema, breadcrumbSchema]}
      />

      <Hero title={service.title} subtitle={service.subtitle} />

      <div className="main-container">
        <article className="service-detail">
          <section className="service-intro">
            <h2>服务介绍</h2>
            <div className="service-description">
              {service.description.split('\n\n').map((para, index) => (
                <p key={index}>{para}</p>
              ))}
            </div>
          </section>

          <section className="service-items">
            <h2>服务内容</h2>
            <div className="service-items-grid">
              {service.services.map((item, index) => (
                <div key={index} className="service-item-card">
                  <div className="service-item-image">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      width={300}
                      height={200}
                      className="service-img"
                      loading="lazy"
                    />
                  </div>
                  <h3>{item.name}</h3>
                </div>
              ))}
            </div>
          </section>

          <section className="service-price">
            <h2>服务价格</h2>
            <p className="price-value">{service.price}</p>
            <p className="price-note">{service.priceNote}</p>
          </section>

          <section className="service-process">
            <h2>服务流程</h2>
            <ol className="process-list">
              {service.process.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </section>

          {/* 推荐团队成员 */}
          <RecommendedTeam category="老年护理" limit={4} />

          {/* 内容类型导航 */}
          <section className="content-type-navigation">
            <h2>了解更多专业内容</h2>
            <p className="content-nav-subtitle">更多老年护理相关的专业知识和案例分享</p>
            <div className="content-type-buttons">
              <Link href="/kepu?category=老年护理" className="content-type-btn">
                <div className="content-icon">📚</div>
                <h3>科普知识</h3>
                <p>专业的老年护理服务知识</p>
              </Link>
              <Link href="/anli?category=老年护理" className="content-type-btn">
                <div className="content-icon">⭐</div>
                <h3>精选案例</h3>
                <p>真实的服务案例分享</p>
              </Link>
              <Link href="/zixun?category=老年护理" className="content-type-btn">
                <div className="content-icon">📰</div>
                <h3>行业资讯</h3>
                <p>最新的行业动态资讯</p>
              </Link>
            </div>
          </section>
        </article>

        <div className="contact-advantages-wrapper">
          <ContactForm />
          <AdvantageGrid />
        </div>
      </div>
    </>
  )
}