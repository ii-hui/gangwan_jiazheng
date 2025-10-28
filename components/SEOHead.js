// ==================== components/SEOHead.js ====================
import Head from 'next/head'
import { SITE_INFO } from '../utils/seoData'

export default function SEOHead({ 
  title, 
  description, 
  keywords, 
  canonical,
  ogImage,
  schema 
}) {
  const fullTitle = title || SITE_INFO.description
  const fullDescription = description || SITE_INFO.description
  const canonicalUrl = `${SITE_INFO.url}${canonical || ''}`
  const imageUrl = ogImage || `${SITE_INFO.url}${SITE_INFO.logo}`

  return (
    <Head>
      {/* 基础SEO标签（H1优化） */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* 移动端优化 */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#d4a574" />
      
      {/* Open Graph标签（社交分享） */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:locale" content="zh_CN" />
      <meta property="og:site_name" content={SITE_INFO.name} />
      
      {/* Twitter Card标签 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={imageUrl} />
      
      {/* 地理位置标签（本地SEO） */}
      <meta name="geo.region" content="CN-13" />
      <meta name="geo.placename" content="秦皇岛市" />
      <meta name="geo.position" content="39.9352;119.6003" />
      <meta name="ICBM" content="39.9352, 119.6003" />
      
      {/* 联系信息 */}
      <meta name="contact" content={SITE_INFO.phone} />
      
      {/* Favicon */}
      <link rel="icon" href="/LOGO.png" />
      <link rel="apple-touch-icon" href="/LOGO.png" />
      
      {/* 结构化数据（H4优化） */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </Head>
  )
}