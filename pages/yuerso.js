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

export default function YuersoPage() {
  const service = SERVICE_CONTENT.yuerso

  const serviceSchema = generateServiceSchema(
    '秦皇岛育儿嫂服务',
    '育儿嫂',
    service.price,
    service.description
  )

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: '首页', url: '/' },
    { name: '育儿嫂服务', url: '/yuerso' },
  ])

  const faqSchema = generateFAQSchema([
    {
      question: '秦皇岛育儿嫂多少钱一个月？',
      answer: '秦皇岛育儿嫂服务价格一般在5500-8000元/月，具体价格根据工作年限、技能证书、经验等因素调整。新生儿护理专业育儿嫂6000-8000元/月，普通育儿嫂5500-6500元/月。我们价格合理透明。'
    },
    {
      question: '育儿嫂主要负责哪些工作？',
      answer: '专业育儿嫂主要负责：新生儿日常护理、科学喂养指导、婴儿洗澡抚触、辅食制作添加、早期智力开发、婴儿常见病观察、产妇月子餐制作、产妇心理疏导等全方位母婴护理服务。'
    },
    {
      question: '育儿嫂需要什么资质？',
      answer: '我们的育儿嫂均持有：1）母婴护理师证书 2）育婴师职业资格证 3）健康证明 4）身份背景审查 5）专业培训结业证。部分高级育儿嫂还持有催乳师、营养师等额外资质。'
    },
    {
      question: '可以试用吗？',
      answer: '提供3-7天试用期，试用期内可全面考察育儿嫂的专业技能、工作态度和与家庭的匹配度。试用期按天计费，满意后签订正式合同，不满意可免费更换。'
    }
  ])

  return (
    <>
      <SEOHead
        title={PAGE_SEO.yuerso.title}
        description={PAGE_SEO.yuerso.description}
        keywords={PAGE_SEO.yuerso.keywords}
        canonical={PAGE_SEO.yuerso.canonical}
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
                <summary>秦皇岛育儿嫂多少钱一个月？</summary>
                <p>秦皇岛育儿嫂服务价格一般在5500-8000元/月，具体价格根据工作年限、技能证书、经验等因素调整。新生儿护理专业育儿嫂6000-8000元/月，普通育儿嫂5500-6500元/月。我们价格合理透明。</p>
              </details>
              <details className="faq-item">
                <summary>育儿嫂主要负责哪些工作？</summary>
                <p>专业育儿嫂主要负责：新生儿日常护理、科学喂养指导、婴儿洗澡抚触、辅食制作添加、早期智力开发、婴儿常见病观察、产妇月子餐制作、产妇心理疏导等全方位母婴护理服务。</p>
              </details>
              <details className="faq-item">
                <summary>育儿嫂需要什么资质？</summary>
                <p>我们的育儿嫂均持有：1）母婴护理师证书 2）育婴师职业资格证 3）健康证明 4）身份背景审查 5）专业培训结业证。部分高级育儿嫂还持有催乳师、营养师等额外资质。</p>
              </details>
              <details className="faq-item">
                <summary>可以试用吗？</summary>
                <p>提供3-7天试用期，试用期内可全面考察育儿嫂的专业技能、工作态度和与家庭的匹配度。试用期按天计费，满意后签订正式合同，不满意可免费更换。</p>
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
                <p>提供上门育儿嫂服务</p>
              </div>
              <div className="area-card">
                <h3>北戴河区</h3>
                <p>专业育儿嫂团队就近派遣</p>
              </div>
              <div className="area-card">
                <h3>抚宁区</h3>
                <p>覆盖抚宁城区及周边</p>
              </div>
            </div>
            <p style={{ textAlign: 'center', marginTop: '20px', color: '#888', fontSize: '0.95em' }}>
              📍 秦皇岛本地育儿嫂，了解当地医疗资源，紧急情况处理更及时
            </p>
          </section>

          {/* 推荐团队成员 */}
          <RecommendedTeam category="育儿嫂" limit={4} />

          {/* 内容类型导航 */}
          <section className="content-type-navigation">
            <h2>了解更多专业内容</h2>
            <p className="content-nav-subtitle">更多育儿嫂相关的专业知识和案例分享</p>
            <div className="content-type-buttons">
              <Link href="/kepu?category=育儿嫂" className="content-type-btn">
                <div className="content-icon">📚</div>
                <h3>科普知识</h3>
                <p>专业的育儿嫂服务知识</p>
              </Link>
              <Link href="/anli?category=育儿嫂" className="content-type-btn">
                <div className="content-icon">⭐</div>
                <h3>精选案例</h3>
                <p>真实的服务案例分享</p>
              </Link>
              <Link href="/zixun?category=育儿嫂" className="content-type-btn">
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
