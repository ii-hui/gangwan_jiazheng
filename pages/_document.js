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

        {/* 百度站长自动推送 - 无需验证站点即可使用 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
    var bp = document.createElement('script');
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
    }
    else {
        bp.src = 'http://push.zhanzhang.baidu.com/push.js';
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
})();
            `
          }}
        />
      </body>
    </Html>
  )
}