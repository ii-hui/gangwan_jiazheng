// ==================== components/Navbar.js ====================
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false)
  const router = useRouter()

  const navItems = [
    { name: '保姆', path: '/baomu' },
    { name: '育儿嫂', path: '/yuerso' },
    { name: '老年护理', path: '/laorenghuli' },
    { name: '医院护工', path: '/yiyuanhugong' },
    { name: '团队风采', path: '/tuanduifengcai' },
    { name: '关于我们', path: '/about' },
    { name: '联系我们', path: '/contact' },
  ]

  const isActive = (path) => router.pathname === path

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-brand">
          <Image
            src="/LOGO.png"
            alt="秦皇岛港湾家政-专业家政服务公司Logo"
            width={50}
            height={50}
            className="navbar-logo"
            priority
          />
          <span className="brand-text">秦皇岛港湾家政</span>
        </Link>

        {/* 汉堡菜单按钮 */}
        <button
          className="hamburger"
          onClick={() => setNavOpen(!navOpen)}
          aria-label="切换菜单"
          aria-expanded={navOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* 导航菜单 */}
        <ul className={`nav-menu ${navOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => setNavOpen(false)}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
