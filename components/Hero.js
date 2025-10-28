import Image from 'next/image'

export default function Hero({ title, subtitle, showLogo = false }) {
  return (
    <header className="hero">
      <div className="hero-content">
        {showLogo && (
          <div className="hero-logo">
            <Image
              src="/LOGO.png"
              alt="秦皇岛港湾家政-本地专业家政服务-保姆育儿嫂老年护理医院护工"
              width={480}
              height={480}
              className="hero-logo-img"
              priority
            />
          </div>
        )}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </header>
  )
}