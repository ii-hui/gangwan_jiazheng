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

export default function BaomuPage() {
  const service = SERVICE_CONTENT.baomu

  const serviceSchema = generateServiceSchema(
    '秦皇岛保姆服务',
    '保姆',
    service.price,
    service.description
  )

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: '首页', url: '/' },
    { name: '保姆服务', url: '/baomu' },
  ])

  const faqSchema = generateFAQSchema([
    {
      question: '秦皇岛保姆多少钱一个月？',
      answer: '秦皇岛保姆服务价格一般在4500-6000元/月，具体价格根据工作内容、时间、经验等因素调整。住家保姆通常5000-6000元/月，钟点工按小时计费约30-50元/小时。我们价格透明，无隐性消费。'
    },
    {
      question: '保姆的工作内容包括哪些？',
      answer: '我们的保姆服务包括：日常家务清洁、一日三餐烹饪、衣物洗涤熨烫、家居物品整理、代购日常用品、简单育儿协助等。可以根据您的实际需求灵活调整服务内容。'
    },
    {
      question: '如何确保保姆的可靠性？',
      answer: '所有保姆均经过严格筛选：1）背景审查和身份验证 2）健康体检证明 3）专业技能培训 4）持证上岗 5）试工期考察。我们承诺如有任何问题可随时免费更换。'
    },
    {
      question: '提供试工期吗？',
      answer: '提供1-3天试工期，试工期内您可以全面考察保姆的工作能力和态度。试工期费用按实际天数计算，满意后签订正式合同。'
    }
  ])

  return (
    <>
      <SEOHead
        title={PAGE_SEO.baomu.title}
        description={PAGE_SEO.baomu.description}
        keywords={PAGE_SEO.baomu.keywords}
        canonical={PAGE_SEO.baomu.canonical}
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
                <summary>秦皇岛保姆多少钱一个月？</summary>
                <p>秦皇岛保姆服务价格一般在4500-6000元/月，具体价格根据工作内容、时间、经验等因素调整。住家保姆通常5000-6000元/月，钟点工按小时计费约30-50元/小时。我们价格透明，无隐性消费。</p>
              </details>
              <details className="faq-item">
                <summary>保姆的工作内容包括哪些？</summary>
                <p>我们的保姆服务包括：日常家务清洁、一日三餐烹饪、衣物洗涤熨烫、家居物品整理、代购日常用品、简单育儿协助等。可以根据您的实际需求灵活调整服务内容。</p>
              </details>
              <details className="faq-item">
                <summary>如何确保保姆的可靠性？</summary>
                <p>所有保姆均经过严格筛选：1）背景审查和身份验证 2）健康体检证明 3）专业技能培训 4）持证上岗 5）试工期考察。我们承诺如有任何问题可随时免费更换。</p>
              </details>
              <details className="faq-item">
                <summary>提供试工期吗？</summary>
                <p>提供1-3天试工期，试工期内您可以全面考察保姆的工作能力和态度。试工期费用按实际天数计算，满意后签订正式合同。</p>
              </details>
            </div>
          </section>

          {/* 服务区域 */}
          <section className="service-area-section">
            <h2>服务覆盖区域</h2>
            <div className="service-areas">
              <div className="area-card">
                <h3>海港区</h3>
                <p>秦皇岛市中心区域全覆盖</p>
              </div>
              <div className="area-card">
                <h3>山海关区</h3>
                <p>提供上门保姆服务</p>
              </div>
              <div className="area-card">
                <h3>北戴河区</h3>
                <p>专业保姆团队就近派遣</p>
              </div>
              <div className="area-card">
                <h3>抚宁区</h3>
                <p>覆盖抚宁城区及周边</p>
              </div>
            </div>
            <p style={{ textAlign: 'center', marginTop: '20px', color: '#888', fontSize: '0.95em' }}>
              📍 秦皇岛本地家政公司，熟悉当地生活习惯，沟通更顺畅
            </p>
          </section>

          {/* 推荐团队成员 */}
          <RecommendedTeam category="保姆" limit={4} />

          {/* 内容类型导航 */}
          <section className="content-type-navigation">
            <h2>了解更多专业内容</h2>
            <p className="content-nav-subtitle">更多保姆相关的专业知识和案例分享</p>
            <div className="content-type-buttons">
              <Link href="/kepu?category=保姆" className="content-type-btn">
                <div className="content-icon">📚</div>
                <h3>科普知识</h3>
                <p>专业的保姆服务知识</p>
              </Link>
              <Link href="/anli?category=保姆" className="content-type-btn">
                <div className="content-icon">⭐</div>
                <h3>精选案例</h3>
                <p>真实的服务案例分享</p>
              </Link>
              <Link href="/zixun?category=保姆" className="content-type-btn">
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