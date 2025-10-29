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
import supabase from '../lib/supabaseClient'

export default function LaorenghuliPage({ serviceItems }) {
  // 使用动态获取的服务项目，如果没有则回退到配置文件
  const service = {
    ...SERVICE_CONTENT.laorenghuli,
    services: serviceItems && serviceItems.length > 0 ? serviceItems : SERVICE_CONTENT.laorenghuli.services
  }

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

  const faqSchema = generateFAQSchema([
    {
      question: '秦皇岛老年护理多少钱一个月？',
      answer: '秦皇岛老年护理服务价格根据护理等级不同：生活自理老人4000-5000元/月，半自理老人5000-6500元/月，完全不能自理老人6500-8000元/月。特殊疾病护理（阿尔茨海默症、帕金森等）需单独评估报价。'
    },
    {
      question: '老年护理员具体做哪些工作？',
      answer: '老年护理服务包括：日常生活照料（饮食起居、个人卫生）、健康监测（血压、血糖测量）、康复训练辅助、用药提醒、心理陪护、安全看护、营养配餐、轮椅协助等全方位专业老年照护服务。'
    },
    {
      question: '护理员有专业资质吗？',
      answer: '所有老年护理员均持有：1）养老护理员职业资格证 2）健康证明和体检报告 3）急救培训证书 4）专业技能培训证明。针对特殊疾病护理的护理员还需额外专项培训资质。'
    },
    {
      question: '可以短期护理吗？',
      answer: '支持短期护理服务。最短7天起订，适合术后恢复、家人出差等临时需求。也提供长期护理服务，签订月度或年度合同价格更优惠。提供3天试工期，不满意免费更换。'
    }
  ])

  return (
    <>
      <SEOHead
        title={PAGE_SEO.laorenghuli.title}
        description={PAGE_SEO.laorenghuli.description}
        keywords={PAGE_SEO.laorenghuli.keywords}
        canonical={PAGE_SEO.laorenghuli.canonical}
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
                <summary>秦皇岛老年护理多少钱一个月？</summary>
                <p>秦皇岛老年护理服务价格根据护理等级不同：生活自理老人4000-5000元/月，半自理老人5000-6500元/月，完全不能自理老人6500-8000元/月。特殊疾病护理（阿尔茨海默症、帕金森等）需单独评估报价。</p>
              </details>
              <details className="faq-item">
                <summary>老年护理员具体做哪些工作？</summary>
                <p>老年护理服务包括：日常生活照料（饮食起居、个人卫生）、健康监测（血压、血糖测量）、康复训练辅助、用药提醒、心理陪护、安全看护、营养配餐、轮椅协助等全方位专业老年照护服务。</p>
              </details>
              <details className="faq-item">
                <summary>护理员有专业资质吗？</summary>
                <p>所有老年护理员均持有：1）养老护理员职业资格证 2）健康证明和体检报告 3）急救培训证书 4）专业技能培训证明。针对特殊疾病护理的护理员还需额外专项培训资质。</p>
              </details>
              <details className="faq-item">
                <summary>可以短期护理吗？</summary>
                <p>支持短期护理服务。最短7天起订，适合术后恢复、家人出差等临时需求。也提供长期护理服务，签订月度或年度合同价格更优惠。提供3天试工期，不满意免费更换。</p>
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
                <p>提供上门老年护理服务</p>
              </div>
              <div className="area-card">
                <h3>北戴河区</h3>
                <p>专业护理团队就近派遣</p>
              </div>
              <div className="area-card">
                <h3>抚宁区</h3>
                <p>覆盖抚宁城区及周边</p>
              </div>
            </div>
            <p style={{ textAlign: 'center', marginTop: '20px', color: '#888', fontSize: '0.95em' }}>
              📍 秦皇岛本地护理团队，熟悉周边医疗机构，配合就医更便利
            </p>
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

// 从 Supabase 获取服务项目数据（使用静态生成 + ISR）
export async function getStaticProps() {
  try {
    // 查询老年护理服务的所有启用项目
    const { data, error } = await supabase
      .from('service_items')
      .select('*')
      .eq('service_type', 'laorenghuli')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('获取服务项目失败:', error)
      return {
        props: {
          serviceItems: []
        },
        revalidate: 300
      }
    }

    const serviceItems = data.map(item => ({
      name: item.name,
      image: item.image_url,
      alt: item.image_alt
    }))

    return {
      props: {
        serviceItems
      },
      revalidate: 300
    }
  } catch (error) {
    console.error('获取服务项目异常:', error)
    return {
      props: {
        serviceItems: []
      },
      revalidate: 300
    }
  }
}