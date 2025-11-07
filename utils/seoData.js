// ==================== utils/seoData.js ====================
// 完整的SEO数据配置

export const SITE_INFO = {
  name: '秦皇岛港湾家政',
  phone: '18533552006',
  description: '秦皇岛本地专业家政服务公司，提供保姆、育儿嫂、老年护理、医院护工等高品质家政服务，24小时在线客服，严格筛选，专业培训。',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://qhdgwjz.cn',
  logo: '/LOGO.png',
  address: '河北省秦皇岛市海港区',
  email: 'contact@gangwanjiazhen.com', // 替换为实际邮箱
}

// 每个页面的SEO元数据（H1优化）
export const PAGE_SEO = {
  home: {
    title: '秦皇岛港湾家政-专业保姆育儿嫂服务-18533552006',
    description: '秦皇岛港湾家政是本地高端家政服务公司，提供专业保姆、育儿嫂、老年护理、医院护工服务。所有员工经过严格筛选和专业培训，24小时在线客服，应急支持。咨询电话：18533552006',
    keywords: '秦皇岛家政,秦皇岛保姆,秦皇岛育儿嫂,秦皇岛老年护理,秦皇岛医院护工,秦皇岛家政公司,港湾家政',
    canonical: '/',
  },
  baomu: {
    title: '秦皇岛保姆服务-住家保姆4500起-港湾家政',
    description: '秦皇岛港湾家政提供专业保姆服务，包括住家保姆、钟点工、育儿保姆等。价格透明4500-6000元/月，所有保姆经过背景审查和专业培训，持证上岗。24小时应急支持，让您安心省心。咨询电话：18533552006',
    keywords: '秦皇岛保姆,秦皇岛住家保姆,秦皇岛保姆价格,秦皇岛保姆公司,秦皇岛找保姆,秦皇岛保姆服务',
    canonical: '/baomu',
  },
  yuerso: {
    title: '秦皇岛育儿嫂月嫂-新生儿护理5500起-港湾家政',
    description: '秦皇岛港湾家政提供专业育儿嫂和月嫂服务，擅长新生儿护理、产妇护理、辅食添加、早教启蒙。价格5500-8000元/月，所有育儿嫂均持有母婴护理证书，经验丰富，口碑良好。咨询电话：18533552006',
    keywords: '秦皇岛育儿嫂,秦皇岛月嫂,秦皇岛育儿嫂价格,秦皇岛月嫂公司,秦皇岛新生儿护理,秦皇岛找育儿嫂',
    canonical: '/yuerso',
  },
  laorenghuli: {
    title: '秦皇岛老年护理-养老护理员4000起-港湾家政',
    description: '秦皇岛港湾家政提供专业老年护理服务，包括日常照料、医疗协助、康复护理、心理陪伴等。护理员经过专业培训，持有养老护理员证书，价格4000-7000元/月，24小时应急支持。咨询电话：18533552006',
    keywords: '秦皇岛老年护理,秦皇岛养老护理,秦皇岛老人陪护,秦皇岛老年照护,秦皇岛养老护理员',
    canonical: '/laorenghuli',
  },
  yiyuanhugong: {
    title: '秦皇岛医院护工-24小时陪护200起-港湾家政',
    description: '秦皇岛港湾家政提供专业医院护工服务，24小时陪护，擅长术后护理、重症监护、康复协助。所有护工持有护理证书，熟悉医院流程，价格200-350元/天，随叫随到。咨询电话：18533552006',
    keywords: '秦皇岛医院护工,秦皇岛护工,秦皇岛24小时护工,秦皇岛医院陪护,秦皇岛术后护理,秦皇岛护工价格',
    canonical: '/yiyuanhugong',
  },
  about: {
    title: '关于港湾家政-秦皇岛专业家政服务公司-品质服务值得信赖',
    description: '秦皇岛港湾家政成立于2018年，是秦皇岛本地专业家政服务公司。我们坚持严格筛选、专业培训、品质服务的理念，为数千家庭提供优质家政服务，客户满意度98%以上。',
    keywords: '港湾家政,秦皇岛家政公司,秦皇岛家政服务,家政公司介绍',
    canonical: '/about',
  },
  contact: {
    title: '联系我们-秦皇岛港湾家政-咨询热线18533552006-在线预约',
    description: '联系秦皇岛港湾家政，咨询热线18533552006，24小时在线客服。我们提供保姆、育儿嫂、老年护理、医院护工等家政服务预约咨询，欢迎随时联系。',
    keywords: '秦皇岛家政电话,港湾家政联系方式,秦皇岛家政预约,秦皇岛家政咨询',
    canonical: '/contact',
  },
  tuanduifengcai: {
    title: '团队风采-秦皇岛港湾家政优秀员工展示-专业保姆育儿嫂老年护理医院护工',
    description: '秦皇岛港湾家政优秀团队成员展示，包括经验丰富的保姆、育儿嫂、老年护理和医院护工。查看真实员工照片、服务作品和客户评价，选择您满意的家政服务人员。',
    keywords: '秦皇岛家政团队,保姆照片,育儿嫂展示,老年护理员,医院护工,家政服务人员,家政阿姨',
    canonical: '/tuanduifengcai',
  },
}

// 服务详情内容（用于服务页面）
export const SERVICE_CONTENT = {
  baomu: {
    title: '秦皇岛专业保姆服务',
    subtitle: '本地家政公司 | 价格透明4500-6000元/月 | 电话18533552006',
    description: `想在秦皇岛找保姆？港湾家政是秦皇岛本地专业家政公司，提供住家保姆、钟点工、育儿保姆等服务。价格透明4500-6000元/月，所有秦皇岛保姆经过背景审查和专业培训，持证上岗，24小时应急支持，让您安心省心。

秦皇岛港湾家政的保姆团队经过严格筛选，具备丰富的家务经验和良好的职业素养。我们深知每个家庭的需求都是独特的，提供住家保姆和钟点工两种服务模式，可根据您的实际需求灵活选择。

无论是日常家务、烹饪料理还是家居保洁，我们的秦皇岛保姆都能胜任。作为本地家政公司，我们承诺海港区、开发区1-2小时快速响应，如遇紧急情况可随时更换，确保您的生活不受影响。`,
    services: [
      {
        name: '日常家务清洁',
        image: '/images/service-cleaning.jpg',
        alt: '秦皇岛保姆日常家务清洁服务'
      },
      {
        name: '一日三餐烹饪',
        image: '/images/service-cooking.jpg',
        alt: '秦皇岛保姆烹饪做饭服务'
      },
      {
        name: '衣物洗涤熨烫',
        image: '/images/service-laundry.jpg',
        alt: '秦皇岛保姆衣物洗涤熨烫服务'
      },
      {
        name: '家居物品整理',
        image: '/images/service-organize.jpg',
        alt: '秦皇岛保姆家居物品整理服务'
      },
      {
        name: '代购日常用品',
        image: '/images/service-shopping.jpg',
        alt: '秦皇岛保姆代购日常用品服务'
      },
      {
        name: '简单育儿协助',
        image: '/images/service-childcare.jpg',
        alt: '秦皇岛保姆育儿协助服务'
      },
    ],
    price: '4500-6000元/月',
    priceNote: '具体价格根据工作内容和时间灵活调整',
    process: [
      '咨询需求：电话或在线沟通您的具体需求',
      '推荐人选：根据需求匹配3-5名合适保姆',
      '面试试工：安排面试和1-3天试工期',
      '签订合同：满意后签订正式服务合同',
      '持续跟踪：定期回访，确保服务质量',
    ],
  },
  yuerso: {
    title: '秦皇岛专业育儿嫂服务',
    subtitle: '持证上岗 | 价格透明5500-8000元/月 | 新生儿护理专家',
    description: `秦皇岛育儿嫂价格多少合理？港湾家政提供专业育儿嫂和月嫂服务，价格透明5500-8000元/月。所有秦皇岛育儿嫂均持有母婴护理证书，经验丰富3年以上，擅长新生儿护理、产妇护理、辅食添加、早教启蒙，口碑良好。

秦皇岛港湾家政的育儿嫂团队由经验丰富的母婴护理专家组成。我们深知新手父母的焦虑和困惑，我们的育儿嫂不仅照顾宝宝，还会指导父母科学育儿，传授实用的护理技巧。从新生儿的脐带护理、黄疸观察到辅食添加、早教游戏，我们都有专业的方法。

作为秦皇岛本地家政公司，我们注重宝宝的身心发展，提供营养均衡的辅食制作、科学的睡眠引导和适龄的早教启蒙。让您的宝宝在专业呵护下健康快乐成长。`,
    services: [
      {
        name: '新生儿日常护理',
        image: '/images/service-newborn.jpg',
        alt: '秦皇岛育儿嫂新生儿日常护理服务'
      },
      {
        name: '科学喂养指导',
        image: '/images/service-feeding.jpg',
        alt: '秦皇岛育儿嫂科学喂养指导服务'
      },
      {
        name: '辅食制作添加',
        image: '/images/service-babyfood.jpg',
        alt: '秦皇岛育儿嫂辅食制作添加服务'
      },
      {
        name: '生长发育监测',
        image: '/images/service-growth.jpg',
        alt: '秦皇岛育儿嫂婴儿生长发育监测服务'
      },
      {
        name: '早教游戏启蒙',
        image: '/images/service-earlyedu.jpg',
        alt: '秦皇岛育儿嫂早教游戏启蒙服务'
      },
      {
        name: '产妇月子护理',
        image: '/images/service-postpartum.jpg',
        alt: '秦皇岛月嫂产妇月子护理服务'
      },
    ],
    price: '5500-8000元/月',
    priceNote: '资深育儿嫂和金牌月嫂价格略高',
    process: [
      '需求评估：了解宝宝月龄和具体需求',
      '推荐育儿嫂：匹配3-5名合适人选',
      '查看证书：核实母婴护理证书和健康证',
      '试工考察：安排3-7天试工期',
      '正式服务：签约后开始专业服务',
    ],
  },
  laorenghuli: {
    title: '秦皇岛专业老年护理服务',
    subtitle: '持证护理员 | 价格透明4000-7000元/月 | 24小时贴心陪护',
    description: `秦皇岛老人护理一个月多少钱？港湾家政提供专业老年护理服务，价格透明4000-7000元/月。所有秦皇岛养老护理员持有养老护理员证书，经验丰富，擅长失能半失能老人照护、术后康复护理、阿尔茨海默症患者护理，24小时应急支持。

秦皇岛港湾家政的护理员都经过系统的养老护理培训，具备丰富的老年照护经验。我们深知老年人的生理和心理特点，提供全方位的照护服务。从日常生活照料到医疗协助，从身体康复到心理陪伴，我们都能提供专业的支持。

作为秦皇岛本地家政公司，我们的护理员不仅关注老人的身体健康，更注重心理健康。通过耐心陪伴、适度活动和情感交流，让老人感受到家的温暖，安享幸福晚年。海港区、山海关区1-2小时快速响应。`,
    services: [
      {
        name: '日常生活照料',
        image: '/images/service-eldercare.jpg',
        alt: '秦皇岛老年护理日常生活照料服务'
      },
      {
        name: '饮食营养调理',
        image: '/images/service-nutrition.jpg',
        alt: '秦皇岛老年护理饮食营养调理服务'
      },
      {
        name: '用药提醒协助',
        image: '/images/service-medication.jpg',
        alt: '秦皇岛老年护理用药提醒协助服务'
      },
      {
        name: '康复训练陪同',
        image: '/images/service-rehabilitation.jpg',
        alt: '秦皇岛老年护理康复训练陪同服务'
      },
      {
        name: '心理陪伴疏导',
        image: '/images/service-companion.jpg',
        alt: '秦皇岛老年护理心理陪伴疏导服务'
      },
      {
        name: '就医陪同协助',
        image: '/images/service-hospital.jpg',
        alt: '秦皇岛老年护理就医陪同协助服务'
      },
    ],
    price: '4000-7000元/月',
    priceNote: '特殊护理需求价格另议',
    process: [
      '评估需求：了解老人身体状况和护理需求',
      '推荐护理员：匹配有相关经验的护理员',
      '试工观察：安排3-7天试工磨合期',
      '培训交接：详细交接老人习惯和注意事项',
      '定期回访：每周跟踪服务质量',
    ],
  },
  yiyuanhugong: {
    title: '秦皇岛专业医院护工服务',
    subtitle: '24小时陪护 | 价格透明200-350元/天 | 电话18533552006随叫随到',
    description: `秦皇岛医院护工怎么找？拨打港湾家政电话18533552006，提供专业医院护工服务，24小时陪护，价格透明200-350元/天。所有秦皇岛护工持有护理证书，熟悉医院流程，擅长术后护理、重症监护、康复协助，市区内1-2小时快速到岗，随叫随到。

秦皇岛港湾家政的护工团队熟悉第一医院、中医医院等本地各大医院环境和流程，具备丰富的医疗陪护经验。我们的护工擅长术后护理、重症监护和康复协助，能够协助医护人员完成基础护理工作。从翻身拍背、协助如厕到观察病情、及时反馈，我们都能专业应对。

作为秦皇岛本地家政公司，我们理解患者家属的辛劳和担忧。我们的护工不仅照顾患者，还会及时与家属沟通病情，让您安心工作。无论是临时需求还是长期陪护，秦皇岛市区内1-2小时内快速响应。`,
    services: [
      {
        name: '24小时床边陪护',
        image: '/images/service-bedside.jpg',
        alt: '秦皇岛医院护工24小时床边陪护服务'
      },
      {
        name: '协助生活护理',
        image: '/images/service-dailycare.jpg',
        alt: '秦皇岛医院护工协助生活护理服务'
      },
      {
        name: '术后康复协助',
        image: '/images/service-recovery.jpg',
        alt: '秦皇岛医院护工术后康复协助服务'
      },
      {
        name: '病情观察反馈',
        image: '/images/service-monitor.jpg',
        alt: '秦皇岛医院护工病情观察反馈服务'
      },
      {
        name: '协助翻身擦洗',
        image: '/images/service-bathing.jpg',
        alt: '秦皇岛医院护工协助翻身擦洗服务'
      },
      {
        name: '配合医护工作',
        image: '/images/service-medical.jpg',
        alt: '秦皇岛医院护工配合医护工作服务'
      },
    ],
    price: '200-350元/天',
    priceNote: 'ICU等特殊病房护工价格略高',
    process: [
      '电话预约：提前或临时预约均可',
      '快速响应：市区内1-2小时到岗',
      '交接病情：详细了解患者情况',
      '专业陪护：24小时床边守护',
      '持续服务：可长期或短期灵活安排',
    ],
  },
}

// 结构化数据生成函数（H4优化）
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE_INFO.name,
    image: `${SITE_INFO.url}${SITE_INFO.logo}`,
    '@id': SITE_INFO.url,
    url: SITE_INFO.url,
    telephone: SITE_INFO.phone,
    priceRange: '¥¥',
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_INFO.address,
      addressLocality: '秦皇岛市',
      addressRegion: '河北省',
      postalCode: '066000',
      addressCountry: 'CN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 39.9352,
      longitude: 119.6003,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
    sameAs: [
      // 添加你的社交媒体链接
    ],
  }
}

export function generateServiceSchema(serviceName, serviceType, price, description) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: serviceType,
    provider: {
      '@type': 'LocalBusiness',
      name: SITE_INFO.name,
      telephone: SITE_INFO.phone,
    },
    areaServed: {
      '@type': 'City',
      name: '秦皇岛市',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: serviceName,
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: serviceName,
            description: description,
          },
          price: price,
          priceCurrency: 'CNY',
        },
      ],
    },
  }
}

export function generateBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_INFO.url}${item.url}`,
    })),
  }
}

export function generateFAQSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}