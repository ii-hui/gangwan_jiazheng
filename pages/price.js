import SEOHead from '../components/SEOHead'
import Hero from '../components/Hero'
import { PAGE_SEO, generateBreadcrumbSchema } from '../utils/seoData'

export default function Price() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: '首页', url: '/' },
    { name: '价格', url: '/price' },
  ])

  return (
    <>
      <SEOHead
        title="秦皇岛家政价格一览表 | 保姆育儿嫂老年护理医院护工收费标准-港湾家政"
        description="秦皇岛港湾家政价格透明公开，保姆4500-6000元/月，育儿嫂5500-8000元/月，老年护理4000-7000元/月，医院护工200-350元/天。提供基础版、标准版、高级版多种服务套餐，满足不同需求。"
        keywords="秦皇岛家政价格,保姆多少钱一个月,育儿嫂价格,老年护理收费,医院护工费用,秦皇岛家政收费标准"
        canonical="/price"
        schema={breadcrumbSchema}
      />

      <Hero
        title="价格透明 | 服务分级 | 满足不同需求"
        subtitle="秦皇岛港湾家政价格一览表"
      />

      <div className="main-container">
        <section className="price-intro-section">
          <h2>价格说明</h2>
          <p>我们提供基础版、标准版、高级版三种服务等级，价格透明，明码标价，让您放心选择。所有价格均为参考价，具体费用根据服务内容、工作时长、人员经验等因素综合确定。</p>
        </section>

        {/* 保姆服务价格 */}
        <section className="price-table-section">
          <h2>保姆服务价格</h2>
          <div className="price-table-wrapper">
            <table className="price-table">
              <thead>
                <tr>
                  <th>服务等级</th>
                  <th>价格范围</th>
                  <th>工作内容</th>
                  <th>服务时间</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>基础版</strong></td>
                  <td className="price-highlight">4500-5000元/月</td>
                  <td>家庭清洁、洗衣做饭、日常采购</td>
                  <td>住家或白班8小时</td>
                </tr>
                <tr>
                  <td><strong>标准版</strong></td>
                  <td className="price-highlight">5000-5500元/月</td>
                  <td>基础服务+老人陪护+简单护理</td>
                  <td>住家或白班8-10小时</td>
                </tr>
                <tr>
                  <td><strong>高级版</strong></td>
                  <td className="price-highlight">5500-6000元/月</td>
                  <td>全方位家庭服务+营养配餐+专业护理</td>
                  <td>住家24小时随叫随到</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="price-note">
            <p>💡 住家保姆包吃住，白班保姆按小时计算。秦皇岛海港区、山海关区、北戴河区、抚宁区均可服务。</p>
          </div>
        </section>

        {/* 育儿嫂价格 */}
        <section className="price-table-section">
          <h2>育儿嫂（月嫂）价格</h2>
          <div className="price-table-wrapper">
            <table className="price-table">
              <thead>
                <tr>
                  <th>服务等级</th>
                  <th>价格范围</th>
                  <th>工作内容</th>
                  <th>适用年龄</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>基础版</strong></td>
                  <td className="price-highlight">5500-6500元/月</td>
                  <td>婴儿日常护理、辅食添加、早教启蒙</td>
                  <td>3个月-3岁</td>
                </tr>
                <tr>
                  <td><strong>标准版（月嫂）</strong></td>
                  <td className="price-highlight">6500-7500元/月</td>
                  <td>新生儿护理+产妇护理+月子餐</td>
                  <td>0-3个月</td>
                </tr>
                <tr>
                  <td><strong>高级版（金牌月嫂）</strong></td>
                  <td className="price-highlight">7500-8000元/月</td>
                  <td>专业催乳+心理疏导+科学育儿</td>
                  <td>0-3个月</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="price-note">
            <p>💡 所有育儿嫂均持证上岗，具备育婴师、催乳师等专业资格。提供26天或30天住家服务。</p>
          </div>
        </section>

        {/* 老年护理价格 */}
        <section className="price-table-section">
          <h2>老年护理服务价格</h2>
          <div className="price-table-wrapper">
            <table className="price-table">
              <thead>
                <tr>
                  <th>服务等级</th>
                  <th>价格范围</th>
                  <th>工作内容</th>
                  <th>护理程度</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>基础版</strong></td>
                  <td className="price-highlight">4000-5000元/月</td>
                  <td>生活照料、陪伴聊天、协助活动</td>
                  <td>自理老人</td>
                </tr>
                <tr>
                  <td><strong>标准版</strong></td>
                  <td className="price-highlight">5000-6000元/月</td>
                  <td>基础服务+喂饭喂药+翻身拍背</td>
                  <td>半自理老人</td>
                </tr>
                <tr>
                  <td><strong>高级版</strong></td>
                  <td className="price-highlight">6000-7000元/月</td>
                  <td>全方位护理+康复训练+褥疮预防</td>
                  <td>失能/失智老人</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="price-note">
            <p>💡 提供住家和白班两种服务方式。针对失能老人可提供24小时轮班护理，价格另议。</p>
          </div>
        </section>

        {/* 医院护工价格 */}
        <section className="price-table-section">
          <h2>医院护工服务价格</h2>
          <div className="price-table-wrapper">
            <table className="price-table">
              <thead>
                <tr>
                  <th>服务等级</th>
                  <th>价格范围</th>
                  <th>工作内容</th>
                  <th>服务时间</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>白班护工</strong></td>
                  <td className="price-highlight">200-250元/天</td>
                  <td>病人陪护、协助医护、生活照料</td>
                  <td>8:00-18:00（10小时）</td>
                </tr>
                <tr>
                  <td><strong>夜班护工</strong></td>
                  <td className="price-highlight">250-300元/天</td>
                  <td>夜间陪护、翻身拍背、应急处理</td>
                  <td>18:00-次日8:00（14小时）</td>
                </tr>
                <tr>
                  <td><strong>24小时护工</strong></td>
                  <td className="price-highlight">300-350元/天</td>
                  <td>全天候陪护、专业护理、紧急应对</td>
                  <td>24小时不间断</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="price-note">
            <p>💡 与秦皇岛第一医院、中医医院、海港医院等多家医院合作，护工可直达病房。急需可1-2小时内到岗。</p>
          </div>
        </section>

        {/* 价格对比总结 */}
        <section className="price-summary-section">
          <h2>服务价格对比总结</h2>
          <div className="price-comparison-grid">
            <div className="comparison-card">
              <h3>保姆服务</h3>
              <p className="comparison-price">4500-6000元/月</p>
              <ul className="comparison-list">
                <li>✓ 住家或白班可选</li>
                <li>✓ 家务清洁做饭</li>
                <li>✓ 老人儿童照护</li>
              </ul>
              <a href="/baomu" className="comparison-btn">了解详情</a>
            </div>
            <div className="comparison-card">
              <h3>育儿嫂/月嫂</h3>
              <p className="comparison-price">5500-8000元/月</p>
              <ul className="comparison-list">
                <li>✓ 新生儿专业护理</li>
                <li>✓ 产妇月子照护</li>
                <li>✓ 持证上岗</li>
              </ul>
              <a href="/yuerso" className="comparison-btn">了解详情</a>
            </div>
            <div className="comparison-card">
              <h3>老年护理</h3>
              <p className="comparison-price">4000-7000元/月</p>
              <ul className="comparison-list">
                <li>✓ 自理到失能全覆盖</li>
                <li>✓ 康复训练指导</li>
                <li>✓ 24小时可选</li>
              </ul>
              <a href="/laorenghuli" className="comparison-btn">了解详情</a>
            </div>
            <div className="comparison-card">
              <h3>医院护工</h3>
              <p className="comparison-price">200-350元/天</p>
              <ul className="comparison-list">
                <li>✓ 1-2小时快速到岗</li>
                <li>✓ 医院直达病房</li>
                <li>✓ 白班/夜班/24小时</li>
              </ul>
              <a href="/yiyuanhugong" className="comparison-btn">了解详情</a>
            </div>
          </div>
        </section>

        {/* 常见问题 */}
        <section className="price-faq-section">
          <h2>价格相关常见问题</h2>
          <div className="faq-list">
            <div className="faq-item">
              <h3>Q: 价格包含哪些费用？</h3>
              <p>A: 价格包含人员工资、基础保险、服务管理费。住家服务需雇主提供食宿，白班服务按小时计费不含餐食。</p>
            </div>
            <div className="faq-item">
              <h3>Q: 可以试用吗？</h3>
              <p>A: 可以！我们提供1-7天免费试工期，不满意可随时更换，直到您满意为止。</p>
            </div>
            <div className="faq-item">
              <h3>Q: 如何支付费用？</h3>
              <p>A: 支持月付、季付、年付。通常首月预付，次月服务满意后结算。支持微信、支付宝、银行转账。</p>
            </div>
            <div className="faq-item">
              <h3>Q: 价格会涨吗？</h3>
              <p>A: 合同期内价格不变。续约时根据市场行情和服务年限适当调整，一般涨幅不超过10%。</p>
            </div>
            <div className="faq-item">
              <h3>Q: 有优惠活动吗？</h3>
              <p>A: 有！新客户首月立减200元，签约半年以上享9.5折，推荐新客户成功后返现300元。</p>
            </div>
          </div>
        </section>

        {/* 联系咨询 */}
        <section className="price-contact-section">
          <div className="contact-cta-box">
            <h2>想了解更精准的报价？</h2>
            <p>根据您的具体需求，我们可以提供个性化定制方案</p>
            <div className="contact-buttons">
              <a href="tel:18533552006" className="contact-primary-btn">
                📞 立即拨打 18533552006
              </a>
              <a href="/contact" className="contact-secondary-btn">
                在线咨询
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
