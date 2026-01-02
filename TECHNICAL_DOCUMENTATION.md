# 秦皇岛港湾家政 - 技术文档

## 目录
- [项目概述](#项目概述)
- [技术栈](#技术栈)
- [系统架构](#系统架构)
- [目录结构](#目录结构)
- [核心功能模块](#核心功能模块)
- [数据库设计](#数据库设计)
- [API接口文档](#api接口文档)
- [环境配置](#环境配置)
- [部署指南](#部署指南)
- [安全机制](#安全机制)
- [开发指南](#开发指南)

---

## 项目概述

秦皇岛港湾家政是一个基于Next.js的家政服务平台，提供保姆、育儿嫂、老年护理、医院护工等服务信息展示和求职者信息管理功能。

**项目特点：**
- SEO优化的静态页面生成
- 求职者自主上传信息系统
- 管理员审核和展示管理
- 响应式设计，支持移动端

**技术亮点：**
- Next.js 14 Pages Router架构
- Supabase后端服务（数据库+存储）
- 私有存储桶+签名URL安全方案
- 密钥系统控制上传权限

---

## 技术栈

### 前端技术
- **框架**: Next.js 14.0.4 (Pages Router)
- **UI库**: React 18.2.0
- **样式**: CSS (globals.css)
- **图片优化**: Next.js Image组件

### 后端服务
- **BaaS**: Supabase
  - PostgreSQL数据库
  - Storage存储服务
  - Row Level Security (RLS)
- **API**: Next.js API Routes

### 开发工具
- **包管理**: npm
- **代码规范**: ESLint
- **SEO**: next-sitemap

### 部署平台
- **推荐**: Vercel / Netlify
- **备选**: 任何支持Node.js的平台

---

## 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                      用户界面层                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ 首页展示 │  │ 服务页面 │  │ 求职上传 │  │ 管理后台│ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    Next.js应用层                         │
│  ┌──────────────┐         ┌──────────────┐             │
│  │ Pages Router │         │  API Routes  │             │
│  │  - SSR/SSG   │  ←───→  │  - 业务逻辑  │             │
│  │  - 客户端    │         │  - 数据处理  │             │
│  └──────────────┘         └──────────────┘             │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   Supabase服务层                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ PostgreSQL   │  │   Storage    │  │     Auth     │  │
│  │  - 数据存储  │  │  - 文件存储  │  │  - RLS策略   │  │
│  │  - RLS策略   │  │  - 签名URL   │  │  - 权限控制  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 数据流向

**求职者上传流程：**
```
用户填写表单 → 验证密钥 → 上传图片到Storage → 插入数据到数据库
→ 发送企业微信通知 → 等待管理员审核
```

**管理员审核流程：**
```
登录后台 → 查看待审核列表 → 审核通过/拒绝 → 更新数据库状态
→ 首页展示（如设为featured）
```

**首页展示流程：**
```
访问首页 → SSR获取featured数据 → 生成签名URL → 渲染卡片
→ 客户端加载图片
```

---

## 目录结构

```
gangwan-jiazhen/
├── pages/                      # 页面目录（Pages Router）
│   ├── index.js               # 首页
│   ├── _app.js                # 应用入口
│   ├── _document.js           # HTML文档结构
│   ├── baomu.js               # 保姆服务页
│   ├── yuerso.js              # 育儿嫂服务页
│   ├── laorenghuli.js         # 老年护理服务页
│   ├── yiyuanhugong.js        # 医院护工服务页
│   ├── about.js               # 关于我们
│   ├── contact.js             # 联系我们
│   ├── qiuzhi.js              # 求职者展示页
│   ├── tuanduifengcai.js      # 团队风采页
│   ├── qiuzhi/
│   │   └── upload.js          # 求职者上传页面
│   ├── admin/
│   │   └── dashboard.js       # 管理员后台
│   └── api/                   # API路由
│       ├── get-signed-url.js  # 获取签名URL
│       ├── upload-seeker.js   # 上传求职者信息
│       ├── validate-key.js    # 验证上传密钥
│       └── admin/             # 管理员API
│           ├── seekers.js     # 获取求职者列表
│           ├── approve.js     # 审核求职者
│           ├── toggle-featured.js  # 切换首页展示
│           └── generate-key.js     # 生成上传密钥
│
├── components/                # 组件目录
│   ├── Layout.js             # 布局组件
│   ├── Navbar.js             # 导航栏
│   ├── SEOHead.js            # SEO头部
│   ├── Hero.js               # 英雄区域
│   ├── ServiceCard.js        # 服务卡片
│   ├── TeamMemberCard.js     # 团队成员卡片
│   ├── ContactForm.js        # 联系表单
│   ├── AdvantageGrid.js      # 优势网格
│   └── SkeletonCard.js       # 骨架屏
│
├── lib/                      # 工具库
│   ├── supabaseClient.js     # Supabase客户端（匿名）
│   └── supabaseAdmin.js      # Supabase管理员客户端
│
├── utils/                    # 工具函数
│   └── seoData.js            # SEO数据和Schema生成
│
├── styles/                   # 样式文件
│   └── globals.css           # 全局样式
│
├── public/                   # 静态资源
│   ├── images/               # 图片资源
│   └── favicon.ico           # 网站图标
│
├── .env.local               # 环境变量（不提交到Git）
├── .gitignore               # Git忽略文件
├── next.config.js           # Next.js配置
├── next-sitemap.config.js   # Sitemap配置
├── package.json             # 项目依赖
└── README.md                # 项目说明
```

---

## 核心功能模块

### 1. 求职者上传系统

**功能描述：**
求职者通过密钥验证后，可以上传个人信息和照片。

**技术实现：**
- 前端：`pages/qiuzhi/upload.js`
- API：`pages/api/upload-seeker.js`
- 密钥验证：`pages/api/validate-key.js`

**流程：**
1. 用户输入密钥
2. 前端调用验证API检查密钥有效性
3. 用户填写个人信息（姓名、电话、年龄、类别、经验、技能等）
4. 上传头像和工作照片（可选）
5. 提交后，后端处理：
   - 验证密钥
   - 压缩并上传图片到Supabase Storage
   - 插入数据到job_seekers表
   - 更新密钥使用次数
   - 发送企业微信通知
6. 返回成功消息，等待审核

**关键代码：**
```javascript
// 图片上传到私有存储桶
const { error: uploadError } = await supabaseAdmin.storage
  .from('job-seekers')
  .upload(avatarPath, avatarBuffer, {
    contentType: 'image/jpeg',
    upsert: false,
    cacheControl: '3600',
    metadata: {
      alt: `秦皇岛${category}-${name}`,
      description: `秦皇岛${category}服务人员${name}的照片`
    }
  })
```

### 2. 管理员审核系统

**功能描述：**
管理员登录后台，审核求职者信息，设置首页展示。

**技术实现：**
- 前端：`pages/admin/dashboard.js`
- API：
  - `pages/api/admin/seekers.js` - 获取求职者列表
  - `pages/api/admin/approve.js` - 审核操作
  - `pages/api/admin/toggle-featured.js` - 切换首页展示

**功能模块：**
1. **审核管理**：查看待审核求职者，通过/拒绝/下架
2. **首页展示**：选择8-12人在首页展示
3. **密钥生成**：生成上传密钥，设置有效期和使用次数

**权限控制：**
- 密码验证：通过环境变量`NEXT_PUBLIC_ADMIN_PASSWORD`
- 使用Service Role Key绕过RLS策略

### 3. 签名URL系统

**功能描述：**
为私有存储桶中的图片生成临时访问URL。

**技术实现：**
- API：`pages/api/get-signed-url.js`
- 有效期：1小时（3600秒）

**使用场景：**
- 首页展示求职者头像
- 求职者列表页展示
- 管理后台查看图片

**关键代码：**
```javascript
const { data, error } = await supabaseAdmin.storage
  .from('job-seekers')
  .createSignedUrl(path, 3600)
```

### 4. SEO优化系统

**功能描述：**
自动生成SEO友好的meta标签和结构化数据。

**技术实现：**
- 组件：`components/SEOHead.js`
- 数据：`utils/seoData.js`

**优化内容：**
- 页面标题、描述、关键词
- Open Graph标签
- Schema.org结构化数据（LocalBusiness、Service、Breadcrumb）
- 自动生成sitemap

---

## 数据库设计

### 表结构

#### 1. job_seekers（求职者表）

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | uuid | 主键 | PK, DEFAULT uuid_generate_v4() |
| name | text | 姓名 | NOT NULL |
| phone | text | 电话 | NOT NULL |
| age | integer | 年龄 | |
| category | text | 类别 | NOT NULL |
| experience | text | 工作经验 | |
| skills | text[] | 技能列表 | |
| description | text | 个人简介 | |
| avatar_url | text | 头像路径 | |
| work_photos | jsonb | 工作照片 | |
| work_status | text | 工作状态 | DEFAULT '求职中' |
| is_approved | boolean | 是否审核通过 | DEFAULT false |
| is_active | boolean | 是否激活 | DEFAULT true |
| is_featured | boolean | 是否首页展示 | DEFAULT false |
| display_order | integer | 显示顺序 | DEFAULT 0 |
| upload_key | text | 上传密钥 | |
| uploaded_by | text | 上传者电话 | |
| reject_reason | text | 拒绝原因 | |
| created_at | timestamptz | 创建时间 | DEFAULT now() |
| updated_at | timestamptz | 更新时间 | DEFAULT now() |

#### 2. upload_keys（上传密钥表）

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | uuid | 主键 | PK, DEFAULT uuid_generate_v4() |
| key_code | text | 密钥代码 | UNIQUE, NOT NULL |
| max_uses | integer | 最大使用次数 | DEFAULT 1 |
| current_uses | integer | 当前使用次数 | DEFAULT 0 |
| expires_at | timestamptz | 过期时间 | NOT NULL |
| is_active | boolean | 是否激活 | DEFAULT true |
| notes | text | 备注 | |
| used_at | timestamptz | 最后使用时间 | |
| used_by_phone | text | 使用者电话 | |
| created_at | timestamptz | 创建时间 | DEFAULT now() |

#### 3. team_members（团队成员表）

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | uuid | 主键 | PK |
| name | text | 姓名 | NOT NULL |
| category | text | 类别 | NOT NULL |
| avatar_url | text | 头像URL | |
| status | text | 状态 | |
| age | integer | 年龄 | |
| experience_years | integer | 工作年限 | |
| highlight | text | 亮点介绍 | |
| skills | text[] | 技能列表 | |
| is_featured | boolean | 是否首页展示 | DEFAULT false |
| display_order | integer | 显示顺序 | DEFAULT 0 |

#### 4. posts（文章表）

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | uuid | 主键 | PK |
| title | text | 标题 | NOT NULL |
| content | text | 内容 | |
| category | text | 分类 | NOT NULL |
| image_url | text | 图片URL | |
| image_alt | text | 图片alt文本 | |
| is_featured | boolean | 是否首页展示 | DEFAULT false |
| display_order | integer | 显示顺序 | DEFAULT 0 |
| created_at | timestamptz | 创建时间 | DEFAULT now() |

### RLS策略

**job_seekers表：**
- 读取：仅允许读取已审核且激活的记录（`is_approved = true AND is_active = true`）
- 写入：禁止直接写入（通过API使用Service Role Key）

**upload_keys表：**
- 读取：禁止（通过API验证）
- 写入：禁止（仅管理员通过API）

### 数据库函数

**validate_upload_key：**
```sql
CREATE OR REPLACE FUNCTION validate_upload_key(key_code_input text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM upload_keys
    WHERE key_code = key_code_input
      AND is_active = true
      AND expires_at > now()
      AND current_uses < max_uses
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## API接口文档

### 公开API

#### 1. 验证上传密钥
```
POST /api/validate-key
Content-Type: application/json

Request:
{
  "keyCode": "ABCD1234"
}

Response:
{
  "valid": true
}
```

#### 2. 上传求职者信息
```
POST /api/upload-seeker
Content-Type: application/json

Request:
{
  "keyCode": "ABCD1234",
  "name": "张三",
  "phone": "13800138000",
  "age": 35,
  "category": "保姆",
  "experience": "5年经验",
  "skills": ["做饭", "打扫"],
  "description": "经验丰富",
  "avatarBase64": "data:image/jpeg;base64,...",
  "workPhotosBase64": ["data:image/jpeg;base64,..."]
}

Response:
{
  "success": true,
  "message": "提交成功，等待审核",
  "seekerId": "uuid"
}
```

#### 3. 获取签名URL
```
GET /api/get-signed-url?path=avatars/xxx.jpg

Response:
{
  "signedUrl": "https://...supabase.co/storage/v1/object/sign/..."
}
```

### 管理员API

所有管理员API都需要密码验证（通过query参数或body传递）。

#### 1. 获取求职者列表
```
GET /api/admin/seekers?password=xxx

Response:
{
  "success": true,
  "seekers": [...]
}
```

#### 2. 审核求职者
```
POST /api/admin/approve
Content-Type: application/json

Request:
{
  "password": "xxx",
  "seekerId": "uuid",
  "action": "approve|reject|deactivate",
  "rejectReason": "原因"  // action为reject时必填
}

Response:
{
  "success": true,
  "message": "操作成功"
}
```

#### 3. 切换首页展示
```
POST /api/admin/toggle-featured
Content-Type: application/json

Request:
{
  "password": "xxx",
  "seekerId": "uuid",
  "featured": true
}

Response:
{
  "success": true,
  "message": "设置成功"
}
```

#### 4. 生成上传密钥
```
POST /api/admin/generate-key
Content-Type: application/json

Request:
{
  "password": "xxx",
  "expiresInDays": 7,
  "maxUses": 1,
  "notes": "发给张三"
}

Response:
{
  "success": true,
  "keyCode": "ABCD1234",
  "expiresAt": "2024-01-10T00:00:00Z"
}
```

---

## 环境配置

### 必需的环境变量

创建 `.env.local` 文件：

```env
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 网站配置
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# 管理员密码
NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-password

# 企业微信通知（可选）
WECHAT_WORK_WEBHOOK_URL=https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxx
```

### 获取Supabase密钥

1. 登录 [Supabase Dashboard](https://app.supabase.com)
2. 选择项目
3. 进入 Settings → API
4. 复制：
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role → `SUPABASE_SERVICE_ROLE_KEY`（⚠️ 保密）

---

## 部署指南

### Vercel部署（推荐）

1. **连接GitHub仓库**
   ```bash
   # 推送代码到GitHub
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/your-repo.git
   git push -u origin main
   ```

2. **导入到Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "Import Project"
   - 选择GitHub仓库
   - 配置环境变量（从`.env.local`复制）

3. **配置环境变量**
   在Vercel项目设置中添加所有环境变量

4. **部署**
   - Vercel会自动部署
   - 每次push到main分支都会自动重新部署

### Netlify部署

1. **构建设置**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

2. **环境变量**
   在Netlify项目设置中添加所有环境变量

3. **部署**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

### 自托管部署

1. **构建项目**
   ```bash
   npm run build
   ```

2. **启动服务**
   ```bash
   npm start
   # 或使用PM2
   pm2 start npm --name "gangwan-jiazhen" -- start
   ```

3. **Nginx配置**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## 安全机制

### 1. 环境变量保护
- 所有敏感信息存储在`.env.local`
- `.gitignore`防止提交到版本控制
- 生产环境使用平台环境变量

### 2. 数据库安全
- **RLS策略**：限制客户端直接访问
- **Service Role Key**：仅在服务端API使用
- **密码验证**：管理员操作需要密码

### 3. 存储安全
- **私有存储桶**：图片不可公开访问
- **签名URL**：临时访问链接（1小时有效）
- **图片元数据**：包含SEO优化的alt文本

### 4. 上传控制
- **密钥系统**：限制上传权限
- **使用次数**：防止滥用
- **过期时间**：自动失效
- **审核机制**：人工审核后才展示

### 5. API安全
- **密码验证**：管理员API需要密码
- **输入验证**：检查必填字段
- **错误处理**：不泄露敏感信息

---

## 开发指南

### 本地开发

1. **克隆项目**
   ```bash
   git clone https://github.com/your-username/gangwan-jiazhen.git
   cd gangwan-jiazhen
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   ```bash
   cp .env.example .env.local
   # 编辑.env.local，填入实际配置
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```
   访问 http://localhost:3000

### 代码规范

- **组件命名**：PascalCase（如`TeamMemberCard.js`）
- **文件命名**：kebab-case或camelCase
- **CSS类名**：kebab-case（如`team-member-card`）
- **注释**：关键逻辑添加中文注释

### 添加新页面

1. 在`pages/`目录创建新文件
2. 使用`SEOHead`组件添加SEO
3. 在`utils/seoData.js`添加页面SEO数据
4. 在`Navbar.js`添加导航链接（如需要）

### 添加新API

1. 在`pages/api/`目录创建新文件
2. 导出默认的handler函数
3. 添加错误处理
4. 如需管理员权限，添加密码验证

### 调试技巧

- **查看数据库**：Supabase Dashboard → Table Editor
- **查看存储**：Supabase Dashboard → Storage
- **查看日志**：浏览器控制台 + Vercel/Netlify日志
- **测试API**：使用Postman或curl

---

## 常见问题

### Q1: 图片无法显示
**原因**：私有存储桶需要签名URL
**解决**：确保使用`/api/get-signed-url`生成访问链接

### Q2: 本地开发图片显示"private IP"错误
**原因**：Next.js安全限制
**解决**：使用`unoptimized={true}`属性

### Q3: 管理员无法登录
**原因**：密码不正确
**解决**：检查`.env.local`中的`NEXT_PUBLIC_ADMIN_PASSWORD`

### Q4: 求职者上传失败
**原因**：密钥无效或已过期
**解决**：生成新密钥，检查有效期和使用次数

### Q5: 部署后环境变量不生效
**原因**：未在部署平台配置
**解决**：在Vercel/Netlify设置中添加环境变量

---

## 维护建议

### 定期任务
- **每周**：检查待审核求职者
- **每月**：清理过期密钥
- **每季度**：更新管理员密码
- **每年**：更新依赖包

### 监控指标
- 网站访问量
- 求职者提交数量
- 审核通过率
- 页面加载速度

### 备份策略
- **数据库**：Supabase自动备份
- **代码**：GitHub版本控制
- **环境变量**：安全存储备份

---

## 技术支持

- **项目文档**：本文档
- **用户手册**：USER_MANUAL.md
- **Supabase文档**：https://supabase.com/docs
- **Next.js文档**：https://nextjs.org/docs

---

**文档版本**: 1.0
**最后更新**: 2024年1月
**维护者**: 开发团队
