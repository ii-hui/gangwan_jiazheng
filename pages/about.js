import SEOHead from '../components/SEOHead'
import Hero from '../components/Hero'
import { PAGE_SEO, generateBreadcrumbSchema, SITE_INFO } from '../utils/seoData'

export default function AboutPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: '首页', url: '/' },
    { name: '关于我们', url: '/about' },
  ])

  return (
    <>
      <SEOHead
        title={PAGE_SEO.about.title}
        description={PAGE_SEO.about.description}
        keywords={PAGE_SEO.about.keywords}
        canonical={PAGE_SEO.about.canonical}
        schema={breadcrumbSchema}
      />

      <Hero title="关于港湾家政" subtitle="专业、可靠、值得信赖的家政服务" />

      <div className="main-container">
        <article className="about-content">
          <section className="about-section">
            <h2>公司简介</h2>
            <p>
              秦皇岛港湾家政成立于2018年，是秦皇岛本地专业的家政服务公司。我们专注于为秦皇岛及周边地区的家庭提供高品质的家政服务，包括保姆、育儿嫂、老年护理和医院护工等服务。
            </p>
            <p>
              多年来，我们始终坚持"专业、诚信、用心"的服务理念，为数千个家庭提供了优质的家政服务，赢得了广大客户的信赖和好评。客户满意度达到98%以上，转介绍率超过70%。
            </p>
          </section>

          <section className="about-section">
            <h2>我们的优势</h2>
            <div className="advantages-list">
              <div className="advantage-item">
                <h3>🎓 专业培训体系</h3>
                <p>
                  所有员工入职前必须经过系统的专业培训，包括理论知识学习和实操技能训练。我们与多家专业培训机构合作，确保每位员工都能持证上岗，具备专业的服务技能。
                </p>
              </div>

              <div className="advantage-item">
                <h3>🔍 严格筛选机制</h3>
                <p>
                  我们对每一位应聘者进行严格的背景审查，包括身份验证、健康体检、犯罪记录查询等。通过多轮面试和技能考核，确保只有最优秀、最可靠的人员才能加入我们的团队。
                </p>
              </div>

              <div className="advantage-item">
                <h3>💝 贴心服务保障</h3>
                <p>
                  我们提供24小时在线客服支持，随时解答您的疑问。如果服务过程中遇到任何问题，我们承诺在2小时内响应，24小时内解决。不满意随时更换，直到您满意为止。
                </p>
              </div>

              <div className="advantage-item">
                <h3>🏆 本地化服务</h3>
                <p>
                  作为秦皇岛本地企业，我们深入了解本地家庭的需求和习惯。我们的员工大多来自秦皇岛及周边地区，沟通无障碍，服务更贴心，应急响应更迅速。
                </p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>服务承诺</h2>
            <ul className="promise-list">
              <li>✓ 所有员工持证上岗，经过专业培训</li>
              <li>✓ 严格背景审查，确保安全可靠</li>
              <li>✓ 不满意随时更换，无需额外费用</li>
              <li>✓ 24小时应急支持，及时响应需求</li>
              <li>✓ 透明收费，无隐性消费</li>
              <li>✓ 定期回访，持续改进服务质量</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>联系我们</h2>
            <div className="contact-info">
              <p><strong>公司名称：</strong>{SITE_INFO.name}</p>
              <p><strong>联系电话：</strong><a href={`tel:${SITE_INFO.phone}`}>{SITE_INFO.phone}</a></p>
              <p><strong>服务区域：</strong>秦皇岛市及周边地区</p>
              <p><strong>营业时间：</strong>24小时在线服务</p>
            </div>
          </section>
        </article>
      </div>
    </>
  )
}