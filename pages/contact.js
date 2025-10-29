import SEOHead from '../components/SEOHead'
import Hero from '../components/Hero'
import ContactForm from '../components/ContactForm'
import AdvantageGrid from '../components/AdvantageGrid'
import { PAGE_SEO, generateBreadcrumbSchema, generateFAQSchema, SITE_INFO } from '../utils/seoData'

export default function ContactPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: '首页', url: '/' },
    { name: '联系我们', url: '/contact' },
  ])

  const faqSchema = generateFAQSchema([
    {
      question: '如何预约家政服务？',
      answer: `您可以通过拨打我们的服务热线${SITE_INFO.phone}或填写在线表单预约。我们会在30分钟内与您联系，了解具体需求并为您推荐合适的服务人员。`
    },
    {
      question: '服务人员是否经过培训？',
      answer: '是的，我们所有服务人员都经过严格的专业培训，持有相关资格证书。包括背景审查、健康体检、技能培训和职业素养培训，确保为您提供专业、可靠的服务。'
    },
    {
      question: '如果对服务不满意怎么办？',
      answer: '如果您对服务不满意，可以随时联系我们的客服。我们承诺24小时内响应，并根据情况免费更换服务人员或提供其他解决方案，直到您满意为止。'
    },
    {
      question: '服务价格是如何计算的？',
      answer: '我们的服务价格透明公开，根据服务类型、工作内容和时长计算。保姆服务4500-6000元/月，育儿嫂5500-8000元/月，老年护理4000-7000元/月，医院护工200-350元/天。具体价格会根据实际需求调整。'
    },
    {
      question: '是否提供试工期？',
      answer: '是的，我们提供1-7天的试工期（根据服务类型不同）。试工期内您可以全面考察服务人员的工作能力和态度，满意后再签订正式合同。试工期费用按实际天数计算。'
    },
    {
      question: '紧急情况下多久能安排服务人员？',
      answer: '对于紧急需求，我们会优先安排。秦皇岛市区内通常1-2小时内可以安排服务人员到岗。如果是医院护工等紧急服务，我们会尽最大努力在最短时间内响应。'
    }
  ])

  return (
    <>
      <SEOHead
        title={PAGE_SEO.contact.title}
        description={PAGE_SEO.contact.description}
        keywords={PAGE_SEO.contact.keywords}
        canonical={PAGE_SEO.contact.canonical}
        schema={[breadcrumbSchema, faqSchema]}
      />

      <Hero title="联系我们" subtitle="随时为您提供专业咨询服务" />

      <div className="main-container">
        <section className="contact-info-section">
          <h2>联系方式</h2>
          <div className="contact-methods">
            <div className="contact-method">
              <h3>📞 电话咨询</h3>
              <p className="contact-value">
                <a href={`tel:${SITE_INFO.phone}`}>{SITE_INFO.phone}</a>
              </p>
              <p className="contact-desc">24小时服务热线，随时为您解答</p>
            </div>

            <div className="contact-method">
              <h3>📍 服务区域</h3>
              <p className="contact-value">秦皇岛市及周边地区</p>
              <p className="contact-desc">海港区、山海关区、北戴河区全覆盖</p>
            </div>

            <div className="contact-method">
              <h3>⏰ 营业时间</h3>
              <p className="contact-value">24小时在线服务</p>
              <p className="contact-desc">节假日正常服务，应急需求随叫随到</p>
            </div>

            <div className="contact-method">
              <h3>💬 微信咨询</h3>
              <p className="contact-value">添加微信号</p>
              <p className="contact-desc">扫描二维码或搜索手机号添加</p>
            </div>
          </div>
        </section>

        <section className="service-area-section">
          <h2>服务范围</h2>
          <div className="service-areas">
            <div className="area-card">
              <h3>海港区</h3>
              <p>全区域覆盖，1-2小时响应</p>
            </div>
            <div className="area-card">
              <h3>山海关区</h3>
              <p>主城区覆盖，2-3小时响应</p>
            </div>
            <div className="area-card">
              <h3>北戴河区</h3>
              <p>主要区域覆盖，2-3小时响应</p>
            </div>
            <div className="area-card">
              <h3>开发区</h3>
              <p>重点区域覆盖，1-2小时响应</p>
            </div>
          </div>
        </section>

        <section className="faq-section">
          <h2>常见问题</h2>
          <div className="faq-list">
            <details className="faq-item">
              <summary>如何预约家政服务？</summary>
              <p>
                您可以通过拨打我们的服务热线{SITE_INFO.phone}或填写下方在线表单预约。我们会在30分钟内与您联系，了解具体需求并为您推荐合适的服务人员。
              </p>
            </details>

            <details className="faq-item">
              <summary>服务人员是否经过培训？</summary>
              <p>
                是的，我们所有服务人员都经过严格的专业培训，持有相关资格证书。包括背景审查、健康体检、技能培训和职业素养培训，确保为您提供专业、可靠的服务。
              </p>
            </details>

            <details className="faq-item">
              <summary>如果对服务不满意怎么办？</summary>
              <p>
                如果您对服务不满意，可以随时联系我们的客服。我们承诺24小时内响应，并根据情况免费更换服务人员或提供其他解决方案，直到您满意为止。
              </p>
            </details>

            <details className="faq-item">
              <summary>服务价格是如何计算的？</summary>
              <p>
                我们的服务价格透明公开，根据服务类型、工作内容和时长计算。保姆服务4500-6000元/月，育儿嫂5500-8000元/月，老年护理4000-7000元/月，医院护工200-350元/天。具体价格会根据实际需求调整。
              </p>
            </details>

            <details className="faq-item">
              <summary>是否提供试工期？</summary>
              <p>
                是的，我们提供1-7天的试工期（根据服务类型不同）。试工期内您可以全面考察服务人员的工作能力和态度，满意后再签订正式合同。试工期费用按实际天数计算。
              </p>
            </details>

            <details className="faq-item">
              <summary>紧急情况下多久能安排服务人员？</summary>
              <p>
                对于紧急需求，我们会优先安排。秦皇岛市区内通常1-2小时内可以安排服务人员到岗。如果是医院护工等紧急服务，我们会尽最大努力在最短时间内响应。
              </p>
            </details>
          </div>
        </section>

        <div className="contact-advantages-wrapper">
          <ContactForm />
          <AdvantageGrid />
        </div>
      </div>
    </>
  )
}