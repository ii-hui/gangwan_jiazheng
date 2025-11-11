# 更新日志 (CHANGELOG)

所有重要的项目变更都会记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)

---

## [1.2.0] - 2025-01-05

### ✨ 新增功能
- **微信悬浮按钮**: 页面右侧固定显示绿色微信按钮
- **二维码弹窗**: 点击微信按钮弹出二维码，引导用户添加微信
- **私域引流**: 完善从网站到微信的转化路径
- **项目文档**: 添加 PROJECT_SUMMARY.md 和 QUICK_REFERENCE.md

### 🔧 修改
- 更新联系页面微信号为 `gwjz_qhd`
- 优化微信按钮样式，与电话按钮保持一致
- 调整按钮位置，微信按钮位于电话按钮下方

### 📝 文件变更
```
新增:
  components/WeChatFloating.js
  public/images/WXEWM.jpg
  PROJECT_SUMMARY.md
  QUICK_REFERENCE.md
  CHANGELOG.md

修改:
  components/Layout.js (添加微信按钮)
  pages/contact.js (更新微信号)
  styles/globals.css (添加微信按钮样式)
```

### 🚀 部署
- 提交到GitHub: commit 9563969
- Netlify自动部署: ✅ 成功

---

## [1.1.0] - 2025-01-04

### ✨ 新增功能
- **企业微信通知**: 表单提交后自动发送通知到企业微信群
- **API路由**: 创建 `/api/wechat-notify` 处理企业微信推送
- **数据库迁移**: 为 submissions 表添加 category 字段

### 🐛 问题修复
- 修复 submissions 表缺少 category 字段导致的提交失败
- 修复 email 字段 NOT NULL 约束问题
- 解决企业微信通知失败不影响用户体验

### 🔧 修改
- ContactForm 组件集成企业微信通知功能
- 优化表单错误处理逻辑
- 添加占位符邮箱 `noreply@example.com`

### 📝 文件变更
```
新增:
  pages/api/wechat-notify.js
  supabase-submissions-fix.sql

修改:
  components/ContactForm.js
  .env.local (添加 WECHAT_WORK_WEBHOOK_URL)
```

### 📊 通知格式
```
📞 新的客户咨询
👤 姓名：在线咨询
📱 电话：13800138000
🏷️ 服务类型：保姆
💬 留言：咨询保姆服务
⏰ 时间：2025/01/04 14:30:00
```

### 🚀 部署
- 提交到GitHub: commit dae35ae
- 需要在Supabase执行SQL迁移
- Netlify自动部署: ✅ 成功

---

## [1.0.0] - 2024-12-XX

### ✨ 初始版本功能

#### 页面
- 首页 (/)
- 服务页面 (保姆、育儿嫂、老年护理、医院护工)
- 关于我们 (/about)
- 联系我们 (/contact)

#### 核心功能
- SEO优化系统 (Schema.org结构化数据)
- 联系表单 (Supabase存储)
- 响应式设计 (移动端适配)
- 固定联系按钮 (电话、回到顶部)

#### 技术栈
- Next.js 14.0.4 (Pages Router)
- React 18.2.0
- Supabase (数据库 + 存储)
- Netlify (部署)

#### SEO
- 每个页面独立的meta标签
- LocalBusiness结构化数据
- 自动生成sitemap
- 关键词优化

### 📝 初始文件结构
```
components/
  Layout.js
  Navbar.js
  SEOHead.js
  Hero.js
  ContactForm.js
  AdvantageGrid.js
  ServiceCard.js

pages/
  index.js
  baomu.js
  yuerso.js
  laorenghuli.js
  yiyuanhugong.js
  about.js
  contact.js

utils/
  seoData.js

lib/
  supabaseClient.js
```

### 🚀 部署
- GitHub仓库创建
- Netlify部署配置
- 域名配置完成

---

## 待开发功能 (Roadmap)

### v1.3.0 (计划中)
- [ ] 员工入职表单
- [ ] 服务人员展示页
- [ ] 后台管理系统（简易版）

### v1.4.0 (规划中)
- [ ] 客户评价系统
- [ ] 价格计算器
- [ ] 在线预约系统

### v2.0.0 (长期规划)
- [ ] 博客/资讯模块
- [ ] 多语言支持
- [ ] 小程序版本
- [ ] 抖音/快手引流页

---

## 修复记录

### 已修复的问题

#### 2025-01-04
- ✅ submissions表缺少category字段
- ✅ email字段NOT NULL约束过严
- ✅ 企业微信通知失败影响用户体验

#### 2024-12-XX
- ✅ Supabase图片路径配置问题
- ✅ Next.js swcMinify配置冗余
- ✅ SEO验证文件缺失

### 已知问题

#### 优先级：低
- 图片懒加载可以进一步优化
- 部分页面可以添加骨架屏
- 移动端导航可以添加动画

---

## 性能优化记录

### 已完成优化
- ✅ Next.js Image组件优化图片加载
- ✅ 关键资源使用priority属性
- ✅ 自动代码分割
- ✅ CSS文件压缩

### 待优化项
- ⏳ 字体文件本地化
- ⏳ 第三方脚本延迟加载
- ⏳ Service Worker缓存策略

---

## 数据库迁移记录

### 2025-01-04 - submissions表更新
```sql
-- 添加category字段
ALTER TABLE submissions
ADD COLUMN IF NOT EXISTS category VARCHAR(50);

-- email字段改为可选
ALTER TABLE submissions
ALTER COLUMN email DROP NOT NULL;
```
**状态**: ✅ 已执行
**影响**: 所有环境

### 未来计划的迁移
- team_members表创建 (员工管理)
- reviews表创建 (评价系统)
- appointments表创建 (预约系统)

---

## 依赖版本记录

### 主要依赖
```json
{
  "next": "14.0.4",
  "react": "18.2.0",
  "@supabase/supabase-js": "^2.x.x",
  "next-sitemap": "^4.x.x"
}
```

### 版本升级记录
- 暂无版本升级

---

## 贡献者

- **开发**: Claude Code
- **产品**: 港湾家政团队
- **维护**: 持续更新中

---

## 许可证

私有项目 - 版权所有

---

**文档维护**: 每次发布新版本时更新
**格式规范**: 遵循 Keep a Changelog
**最后更新**: 2025-01-05
