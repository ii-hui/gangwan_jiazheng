// ==================== next-sitemap.config.js ====================
// 在项目根目录创建此文件
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://qhdgwjz.cn',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
  },
  exclude: ['/api/*', '/_next/*'],
  changefreq: 'weekly',
  priority: 0.7,
  transform: async (config, path) => {
    // 自定义每个页面的优先级
    const customPriority = {
      '/': 1.0,
      '/baomu': 0.9,
      '/yuerso': 0.9,
      '/laorenghuli': 0.9,
      '/yiyuanhugong': 0.9,
      '/about': 0.6,
      '/contact': 0.7,
    }

    return {
      loc: path,
      changefreq: 'weekly',
      priority: customPriority[path] || 0.5,
      lastmod: new Date().toISOString(),
    }
  },
}