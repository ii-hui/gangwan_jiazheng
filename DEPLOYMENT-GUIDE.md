# 服务项目动态管理功能 - 部署和使用指南

## 📋 功能概述

已成功将服务页面中的服务项目（如"日常家务清洁"等）从硬编码改为可在 Supabase 后台动态管理。

### 改造范围
- ✅ 保姆服务页面 (baomu.js)
- ✅ 育儿嫂服务页面 (yuerso.js)
- ✅ 老年护理服务页面 (laorenghuli.js)
- ✅ 医院护工服务页面 (yiyuanhugong.js)

---

## 🚀 部署步骤

### 第一步：在 Supabase 创建数据库表

1. **登录 Supabase 后台**
   - 访问: https://supabase.com
   - 登录您的账号
   - 选择项目: tlxczsxuubwoeigyhmou

2. **执行 SQL 脚本**
   - 点击左侧菜单 `SQL Editor`
   - 点击 `New Query`
   - 复制粘贴文件内容: `supabase-migration-service-items.sql`
   - 点击 `Run` 执行

3. **验证表创建成功**
   - 点击左侧菜单 `Table Editor`
   - 应该看到新表: `service_items`
   - 表中已自动插入 24 条数据（每个服务6条）

### 第二步：部署代码到生产环境

#### 方式A：通过 Netlify（推荐）

1. **提交代码到 Git**
   ```bash
   cd "C:\Users\Administrator\Desktop\58\gangwan-jiazhen"
   git add .
   git commit -m "添加服务项目动态管理功能"
   git push
   ```

2. **Netlify 自动部署**
   - Netlify 会自动检测到代码更新
   - 等待约 2-3 分钟自动构建和部署
   - 访问 https://gwjz.netlify.app 验证

#### 方式B：手动构建测试

```bash
cd "C:\Users\Administrator\Desktop\58\gangwan-jiazhen"

# 安装依赖（如果还没安装）
npm install

# 本地开发测试
npm run dev
# 访问 http://localhost:3000

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

---

## 📝 如何管理服务项目

### 在 Supabase 后台添加新服务项目

1. **打开 Supabase 后台**
   - 点击 `Table Editor`
   - 选择 `service_items` 表
   - 点击 `Insert row`

2. **填写字段**
   | 字段 | 说明 | 示例 |
   |------|------|------|
   | service_type | 服务类型 | `baomu` / `yuerso` / `laorenghuli` / `yiyuanhugong` |
   | name | 服务项目名称 | `日常家务清洁` |
   | image_url | 图片路径 | `/images/service-cleaning.jpg` |
   | image_alt | SEO描述文本 | `秦皇岛保姆日常家务清洁服务` |
   | display_order | 显示顺序（数字） | `1`, `2`, `3` ... |
   | is_active | 是否启用显示 | `true` / `false` |

3. **点击 Save**

### 修改现有服务项目

1. 在 `service_items` 表中找到要修改的行
2. 点击该行可直接编辑
3. 修改完成后点击保存

### 删除服务项目

**方式1**: 软删除（推荐）
- 将 `is_active` 字段改为 `false`
- 服务项目会隐藏但数据保留

**方式2**: 硬删除
- 点击行左侧的删除按钮
- 数据会永久删除

### 修改显示顺序

- 修改 `display_order` 字段的数字
- 数字越小越靠前显示
- 建议使用: 1, 2, 3, 4, 5, 6 ...

---

## 🖼️ 如何添加图片

### 选项1: 使用本地图片（简单）

1. **上传图片到项目**
   - 将图片文件放到: `public/images/` 目录
   - 例如: `public/images/service-new.jpg`

2. **在 Supabase 中配置路径**
   - `image_url` 填写: `/images/service-new.jpg`

### 选项2: 使用 Supabase Storage（推荐）

1. **上传到 Supabase Storage**
   - 打开 Supabase 后台
   - 点击 `Storage`
   - 选择或创建 bucket（如 `images`）
   - 上传图片文件

2. **获取图片 URL**
   - 上传成功后，点击图片
   - 复制 `Public URL`
   - 例如: `https://tlxczsxuubwoeigyhmou.supabase.co/storage/v1/object/public/images/service-new.jpg`

3. **在 service_items 表中使用**
   - `image_url` 填写完整 URL

---

## 🔧 技术细节

### 数据流程

```
Supabase 数据库
  ↓
getStaticProps (构建时获取)
  ↓
页面组件 (props)
  ↓
用户浏览器 (静态 HTML)
```

### ISR (增量静态再生)

- 页面使用 ISR 技术，每 5 分钟自动更新
- 修改数据后，最多等待 5 分钟页面会自动更新
- 如需立即生效，可以在 Netlify 手动触发重新部署

### 回退机制

- 如果 Supabase 查询失败，会自动使用 `utils/seoData.js` 中的配置
- 保证网站始终可用

---

## 📊 数据库表结构

### service_items 表

```sql
CREATE TABLE service_items (
  id UUID PRIMARY KEY,
  service_type VARCHAR(50),      -- 服务类型
  name VARCHAR(100),              -- 服务项目名称
  image_url TEXT,                 -- 图片URL
  image_alt TEXT,                 -- 图片alt文本
  display_order INTEGER,          -- 显示顺序
  is_active BOOLEAN,              -- 是否启用
  created_at TIMESTAMP,           -- 创建时间
  updated_at TIMESTAMP            -- 更新时间
);
```

### 约束条件

- `service_type` 只能是: `baomu`, `yuerso`, `laorenghuli`, `yiyuanhugong`
- `display_order` 用于排序，数字越小越靠前
- `is_active` 为 `false` 时不显示

---

## ❓ 常见问题

### Q1: 修改了数据但页面没更新？

**A**: 等待 5 分钟后页面会自动更新。如需立即生效：
1. 访问 Netlify 后台
2. 点击 `Deploys`
3. 点击 `Trigger deploy` → `Clear cache and deploy site`

### Q2: 图片无法显示？

**A**: 检查以下几点：
1. 图片路径是否正确
2. 如果使用 Supabase Storage，URL 是否完整
3. 图片是否已上传到对应位置
4. 检查 `next.config.js` 中的域名白名单配置

### Q3: 可以添加超过 6 个服务项目吗？

**A**: 可以！没有数量限制。只需在 Supabase 中添加更多行即可。

### Q4: 如何恢复到旧的硬编码方式？

**A**:
1. 在组件中删除 `serviceItems` prop
2. 删除 `getStaticProps` 函数
3. 恢复使用 `SERVICE_CONTENT.{serviceName}` 直接读取配置

### Q5: 删除了 Supabase 表会怎样？

**A**: 不用担心！代码有回退机制，会自动使用 `utils/seoData.js` 中的配置，网站不会崩溃。

---

## 🔄 更新流程示例

### 示例1: 添加新的保姆服务项目

1. 准备图片: `service-pet-care.jpg`
2. 上传到 `public/images/`
3. 登录 Supabase → Table Editor → service_items
4. Insert row:
   ```
   service_type: baomu
   name: 宠物照看
   image_url: /images/service-pet-care.jpg
   image_alt: 秦皇岛保姆宠物照看服务
   display_order: 7
   is_active: true
   ```
5. 保存，等待 5 分钟或手动触发部署

### 示例2: 临时隐藏某个服务项目

1. Supabase → service_items 表
2. 找到要隐藏的服务项目
3. 将 `is_active` 改为 `false`
4. 保存

### 示例3: 修改服务项目图片

1. 上传新图片到 `public/images/` 或 Supabase Storage
2. Supabase → service_items 表
3. 找到对应行，修改 `image_url` 字段
4. 保存

---

## 📞 支持联系

如果在部署或使用过程中遇到问题，可以：
1. 查看 Netlify 构建日志
2. 查看浏览器控制台错误信息
3. 检查 Supabase 日志

---

## 📁 相关文件

- **SQL 脚本**: `supabase-migration-service-items.sql`
- **页面文件**:
  - `pages/baomu.js`
  - `pages/yuerso.js`
  - `pages/laorenghuli.js`
  - `pages/yiyuanhugong.js`
- **配置文件**: `utils/seoData.js` (作为回退)
- **数据库客户端**: `lib/supabaseClient.js`

---

**最后更新**: 2025-10-29
**版本**: 1.0
