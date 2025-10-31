import Link from 'next/link'

export default function RelatedServices({ currentService }) {
  const allServices = [
    {
      title: '保姆服务',
      description: '专业保姆，家务清洁、做饭烧菜、老人陪护一站式服务',
      price: '4500-6000元/月',
      url: '/baomu',
      icon: '🏠'
    },
    {
      title: '育儿嫂/月嫂',
      description: '专业月嫂、育儿嫂，新生儿护理、产妇照护、科学育儿',
      price: '5500-8000元/月',
      url: '/yuerso',
      icon: '👶'
    },
    {
      title: '老年护理',
      description: '专业老年护理，自理、半自理、失能老人全方位照护',
      price: '4000-7000元/月',
      url: '/laorenghuli',
      icon: '👴'
    },
    {
      title: '医院护工',
      description: '医院陪护服务，1-2小时快速到岗，24小时贴心照护',
      price: '200-350元/天',
      url: '/yiyuanhugong',
      icon: '🏥'
    }
  ]

  // 过滤掉当前服务，显示其他3个服务
  const relatedServices = allServices.filter(service => service.title !== currentService).slice(0, 3)

  return (
    <section className="related-services-section">
      <div className="section-header">
        <h2>您可能还需要</h2>
        <p>更多秦皇岛家政服务推荐</p>
      </div>

      <div className="related-services-grid">
        {relatedServices.map((service) => (
          <Link href={service.url} key={service.title} className="related-service-card">
            <div className="service-icon">{service.icon}</div>
            <h3>{service.title}</h3>
            <p className="service-desc">{service.description}</p>
            <div className="service-price-tag">{service.price}</div>
            <div className="service-cta">查看详情 →</div>
          </Link>
        ))}
      </div>
    </section>
  )
}
