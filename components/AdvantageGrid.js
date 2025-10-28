import Image from 'next/image'

const advantages = [
  {
    title: '专业培训',
    description: '所有员工均经过专业培训认证',
    image: '/images/card-training.png',
    alt: '秦皇岛港湾家政员工专业培训认证-持证上岗',
  },
  {
    title: '严格筛选',
    description: '背景审查 + 多轮面试',
    image: '/images/card-screening.png',
    alt: '秦皇岛港湾家政严格筛选员工-背景审查健康体检',
  },
  {
    title: '24小时在线客服',
    description: '随时为您解答问题',
    image: '/images/card-service.png',
    alt: '秦皇岛港湾家政24小时在线客服-随时响应',
  },
  {
    title: '安心保障',
    description: '24小时应急支持',
    image: '/images/card-support.png',
    alt: '秦皇岛港湾家政安心保障-24小时应急支持服务',
  },
]

export default function AdvantageGrid() {
  return (
    <div className="advantages-grid">
      {advantages.map((advantage, index) => (
        <div key={index} className="advantage-card">
          <div className="advantage-image">
            <Image
              src={advantage.image}
              alt={advantage.alt}
              width={200}
              height={200}
              className="card-img"
              loading="lazy"
            />
          </div>
          <h3>{advantage.title}</h3>
          <p>{advantage.description}</p>
        </div>
      ))}
    </div>
  )
}