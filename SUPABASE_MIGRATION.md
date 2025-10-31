# Supabase 数据库更新指南

本文档包含需要在 Supabase 数据库中运行的 SQL 语句，以支持新增的功能。

## 更新说明

本次优化新增了以下功能，需要对数据库表进行相应更新：

1. **team_members 表**：添加状态和期望薪资字段
2. **posts 表**：添加视频 URL 字段和价格、状态字段

## 执行步骤

1. 登录 Supabase Dashboard
2. 进入你的项目
3. 点击左侧菜单的 "SQL Editor"
4. 复制下面的 SQL 语句并执行

---

## SQL 更新脚本

### 1. 更新 team_members 表

```sql
-- 为 team_members 表添加新字段
ALTER TABLE team_members
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT '在岗' CHECK (status IN ('在岗', '待岗')),
ADD COLUMN IF NOT EXISTS expected_salary VARCHAR(100);

-- 为现有记录设置默认值
UPDATE team_members
SET status = '在岗'
WHERE status IS NULL;

-- 添加字段注释
COMMENT ON COLUMN team_members.status IS '员工状态：在岗 | 待岗';
COMMENT ON COLUMN team_members.expected_salary IS '期望薪资范围，如：4500-6000元/月';
```

### 2. 更新 posts 表

```sql
-- 为 posts 表添加新字段
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS video_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS price VARCHAR(100),
ADD COLUMN IF NOT EXISTS status VARCHAR(20) CHECK (status IN ('在岗', '待岗'));

-- 添加字段注释
COMMENT ON COLUMN posts.video_url IS '服务介绍视频URL（可选）';
COMMENT ON COLUMN posts.price IS '服务价格，如：4500-6000元/月';
COMMENT ON COLUMN posts.status IS '服务人员状态：在岗 | 待岗（可选）';
```

---

## 字段说明

### team_members 表新增字段

| 字段名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| status | VARCHAR(20) | 员工当前状态 | '在岗' 或 '待岗' |
| expected_salary | VARCHAR(100) | 期望薪资范围 | '5000-6000元/月' |

### posts 表新增字段

| 字段名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| video_url | VARCHAR(500) | 视频介绍URL | 'https://...' |
| price | VARCHAR(100) | 服务价格 | '4500-6000元/月' |
| status | VARCHAR(20) | 服务状态 | '在岗' 或 '待岗' |

---

## 使用示例

### 插入带有新字段的 team_member 数据

```sql
INSERT INTO team_members (
  name,
  category,
  experience,
  skills,
  highlight,
  description,
  status,
  expected_salary,
  is_featured
) VALUES (
  '李阿姨',
  '保姆',
  '8年',
  ARRAY['家务清洁', '烹饪', '老人照护'],
  '专业保姆，擅长家务和烹饪',
  '李阿姨从事保姆工作8年，经验丰富...',
  '在岗',
  '5000-5500元/月',
  true
);
```

### 更新 posts 数据添加价格和状态

```sql
UPDATE posts
SET
  price = '4500-6000元/月',
  status = '在岗'
WHERE
  category = '保姆'
  AND id = 'your-post-id';
```

### 添加视频URL到现有 post

```sql
UPDATE posts
SET video_url = 'https://your-video-hosting-url.com/video.mp4'
WHERE id = 'your-post-id';
```

---

## 验证更新

执行以下查询验证字段已成功添加：

```sql
-- 验证 team_members 表
SELECT
  column_name,
  data_type,
  character_maximum_length
FROM information_schema.columns
WHERE table_name = 'team_members'
  AND column_name IN ('status', 'expected_salary');

-- 验证 posts 表
SELECT
  column_name,
  data_type,
  character_maximum_length
FROM information_schema.columns
WHERE table_name = 'posts'
  AND column_name IN ('video_url', 'price', 'status');
```

---

## 注意事项

1. **数据备份**：在执行 SQL 更新前，建议先备份数据库
2. **环境隔离**：建议先在开发环境测试，确认无误后再在生产环境执行
3. **RLS 策略**：新增字段会自动继承表的 Row Level Security 策略
4. **索引优化**（可选）：如果 status 字段查询频繁，可以添加索引：
   ```sql
   CREATE INDEX IF NOT EXISTS idx_team_members_status ON team_members(status);
   CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
   ```

---

## 代码中的使用

更新数据库后，前端代码已经支持这些新字段：

### ServiceCard 组件
现在支持显示价格和状态：
```jsx
<ServiceCard
  title="保姆服务"
  price="4500-6000元/月"
  status="在岗"
  // ... 其他 props
/>
```

### team_members 查询示例
```javascript
const { data, error } = await supabase
  .from('team_members')
  .select('*')
  .eq('status', '在岗')
  .order('display_order', { ascending: true });
```

---

## 问题排查

如果执行 SQL 时遇到错误：

1. **权限问题**：确保你有表的 ALTER 权限
2. **字段已存在**：使用 `ADD COLUMN IF NOT EXISTS` 可以安全地重复执行
3. **约束冲突**：如果现有数据不符合新约束，需要先清理数据

如有问题，请查看 Supabase Dashboard 的 SQL Editor 错误提示。
