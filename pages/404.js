import Link from 'next/link'
import SEOHead from '../components/SEOHead'
import { SITE_INFO } from '../utils/seoData'

export default function Custom404() {
  return (
    <>
      <SEOHead
        title="页面未找到 - 秦皇岛港湾家政"
        description="抱歉，您访问的页面不存在。秦皇岛港湾家政提供保姆、育儿嫂、老年护理、医院护工等专业家政服务。"
        keywords="404,页面未找到,秦皇岛家政"
        noindex={true}
      />

      <div className="error-page">
        <div className="error-container">
          <div className="error-code">404</div>
          <h1 className="error-title">页面未找到</h1>
          <p className="error-description">
            抱歉，您访问的页面不存在或已被移除
          </p>

          <div className="error-services">
            <h2>您可能在寻找这些服务：</h2>
            <div className="error-services-grid">
              <Link href="/baomu" className="error-service-link">
                保姆服务
              </Link>
              <Link href="/yuerso" className="error-service-link">
                育儿嫂服务
              </Link>
              <Link href="/laorenghuli" className="error-service-link">
                老年护理服务
              </Link>
              <Link href="/yiyuanhugong" className="error-service-link">
                医院护工服务
              </Link>
            </div>
          </div>

          <div className="error-actions">
            <Link href="/" className="error-btn primary">
              返回首页
            </Link>
            <a href={`tel:${SITE_INFO.phone}`} className="error-btn secondary">
              📞 联系我们：{SITE_INFO.phone}
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .error-page {
          min-height: calc(100vh - 70px);
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #fef5ef 0%, #f5ede4 100%);
          padding: 40px 20px;
          margin-top: 70px;
        }

        .error-container {
          max-width: 600px;
          width: 100%;
          text-align: center;
          background: white;
          border-radius: 16px;
          padding: 60px 40px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }

        .error-code {
          font-size: 120px;
          font-weight: 800;
          background: linear-gradient(135deg, #f4d4a8 0%, #e8c9a0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          margin-bottom: 20px;
        }

        .error-title {
          font-size: 2em;
          color: #333;
          margin-bottom: 16px;
          font-weight: 700;
        }

        .error-description {
          font-size: 1.1em;
          color: #666;
          margin-bottom: 40px;
          line-height: 1.6;
        }

        .error-services {
          margin-bottom: 40px;
        }

        .error-services h2 {
          font-size: 1.3em;
          color: #333;
          margin-bottom: 20px;
          font-weight: 600;
        }

        .error-services-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }

        .error-service-link {
          padding: 14px 20px;
          background: #fef5ef;
          border: 2px solid #f4d4a8;
          border-radius: 8px;
          text-decoration: none;
          color: #d4a574;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .error-service-link:hover {
          background: linear-gradient(135deg, #f4d4a8 0%, #e8c9a0 100%);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(212, 165, 116, 0.3);
        }

        .error-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: center;
        }

        .error-btn {
          padding: 14px 32px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 1em;
          transition: all 0.3s ease;
          display: inline-block;
          min-width: 200px;
        }

        .error-btn.primary {
          background: linear-gradient(135deg, #f4d4a8 0%, #e8c9a0 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(212, 165, 116, 0.3);
        }

        .error-btn.primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(212, 165, 116, 0.4);
        }

        .error-btn.secondary {
          background: white;
          color: #d4a574;
          border: 2px solid #f4d4a8;
        }

        .error-btn.secondary:hover {
          background: #fef5ef;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .error-container {
            padding: 40px 24px;
          }

          .error-code {
            font-size: 80px;
          }

          .error-title {
            font-size: 1.5em;
          }

          .error-services-grid {
            grid-template-columns: 1fr;
          }

          .error-btn {
            min-width: 100%;
          }
        }
      `}</style>
    </>
  )
}
