import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="zh-CN">
      <Head>
        {/* 预连接到外部资源 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        
        {/* 字体优化 */}
        <link rel="preload" href="/LOGO.png" as="image" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}