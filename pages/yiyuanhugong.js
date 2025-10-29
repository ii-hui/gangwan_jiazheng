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
  generateBreadcrumbSchema,
  generateFAQSchema
} from '../utils/seoData'

export default function YiyuanhugongPage() {
  const service = SERVICE_CONTENT.yiyuanhugong

  const serviceSchema = generateServiceSchema(
    '秦皇岛医院护工服务',
    '医院护工',
    service.price,
    service.description
  )

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: '首页', url: '/' },
    { name: '医院护工服务', url: '/yiyuanhugong' },
  ])

  const faqSchema = generateFAQSchema([
    {
      question: '秦皇岛医院护工多少钱一天？',
      answer: '秦皇岛医院护工服务价格根据护理类型：普通陪护180-220元/天（12小时），24小时陪护280-350元/天。专业医疗护理（ICU、术后等）350-450元/天。长期预订（7天以上）有优惠，具体价格可电话咨询。'
    },
    {
      question: '医院护工主要负责什么？',
      answer: '医院护工提供：病人日常生活照料（饮食、洗漱、翻身）、协助医疗护理（输液陪伴、用药提醒）、病房环境维护、康复训练辅助、心理安慰陪护、家属沟通协调等全方位住院陪护服务。'
    },
    {
      question: '护工有医护资质吗？',
      answer: '所有医院护工均经过：1）专业医疗护理培训 2）病患护理实操考核 3）健康证和无犯罪记录证明 4）部分护工持有护理员证、养老护理员证等资质。定期参加医院护理技能培训。'
    },
    {
      question: '可以指定具体护工吗？',
      answer: '支持指定护工服务。如果您之前使用过我们的护工并满意，可以提前预约指定。首次使用建议先沟通需求，我们根据病人情况推荐最合适的护工。不满意可随时免费更换。'
    }
  ])

  return (
    <>
      <SEOHead
        title={PAGE_SEO.yiyuanhugong.title}
        description={PAGE_SEO.yiyuanhugong.description}
        keywords={PAGE_SEO.yiyuanhugong.keywords}
        canonical={PAGE_SEO.yiyuanhugong.canonical}
        schema={[serviceSchema, breadcrumbSchema, faqSchema]}
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

          {/* 常见问题 */}
          <section className="faq-section">
            <h2>常见问题</h2>
            <div className="faq-list">
              <details className="faq-item">
                <summary>秦皇岛医院护工多少钱一天？</summary>
                <p>秦皇岛医院护工服务价格根据护理类型：普通陪护180-220元/天（12小时），24小时陪护280-350元/天。专业医疗护理（ICU、术后等）350-450元/天。长期预订（7天以上）有优惠，具体价格可电话咨询。</p>
              </details>
              <details className="faq-item">
                <summary>医院护工主要负责什么？</summary>
                <p>医院护工提供：病人日常生活照料（饮食、洗漱、翻身）、协助医疗护理（输液陪伴、用药提醒）、病房环境维护、康复训练辅助、心理安慰陪护、家属沟通协调等全方位住院陪护服务。</p>
              </details>
              <details className="faq-item">
                <summary>护工有医护资质吗？</summary>
                <p>所有医院护工均经过：1）专业医疗护理培训 2）病患护理实操考核 3）健康证和无犯罪记录证明 4）部分护工持有护理员证、养老护理员证等资质。定期参加医院护理技能培训。</p>
              </details>
              <details className="faq-item">
                <summary>可以指定具体护工吗？</summary>
                <p>支持指定护工服务。如果您之前使用过我们的护工并满意，可以提前预约指定。首次使用建议先沟通需求，我们根据病人情况推荐最合适的护工。不满意可随时免费更换。</p>
              </details>
            </div>
          </section>

          {/* 服务区域 */}
          <section className="service-area-section">
            <h2>服务覆盖区域</h2>
            <div className="service-areas">
              <div className="area-card">
                <h3>海港区医院</h3>
                <p>秦皇岛市第一医院、第三医院等</p>
              </div>
              <div className="area-card">
                <h3>山海关区医院</h3>
                <p>山海关人民医院等医疗机构</p>
              </div>
              <div className="area-card">
                <h3>北戴河区医院</h3>
                <p>北戴河医院等各级医疗机构</p>
              </div>
              <div className="area-card">
                <h3>抚宁区医院</h3>
                <p>抚宁区人民医院等</p>
              </div>
            </div>
            <p style={{ textAlign: 'center', marginTop: '20px', color: '#888', fontSize: '0.95em' }}>
              📍 秦皇岛各大医院均有合作，护工熟悉医院流程，配合治疗更高效
            </p>
          </section>

          {/* 推荐团队成员 */}
          <RecommendedTeam category="医院护工" limit={4} />

          {/* 内容类型导航 */}
          <section className="content-type-navigation">
            <h2>了解更多专业内容</h2>
            <p className="content-nav-subtitle">更多医院护工相关的专业知识和案例分享</p>
            <div className="content-type-buttons">
              <Link href="/kepu?category=医院护工" className="content-type-btn">
                <div className="content-icon">📚</div>
                <h3>科普知识</h3>
                <p>专业的医院护工服务知识</p>
              </Link>
              <Link href="/anli?category=医院护工" className="content-type-btn">
                <div className="content-icon">⭐</div>
                <h3>精选案例</h3>
                <p>真实的服务案例分享</p>
              </Link>
              <Link href="/zixun?category=医院护工" className="content-type-btn">
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