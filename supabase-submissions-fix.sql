-- 修复 submissions 表结构
-- 1. 添加 category 字段
-- 2. 将 email 字段改为可选（允许为空）

-- 添加 category 字段（如果不存在）
ALTER TABLE submissions
ADD COLUMN IF NOT EXISTS category VARCHAR(50);

-- 将 email 字段改为可空
ALTER TABLE submissions
ALTER COLUMN email DROP NOT NULL;

-- 添加字段注释
COMMENT ON COLUMN submissions.category IS '服务类型：保姆 | 育儿嫂 | 老年护理 | 医院护工';
COMMENT ON COLUMN submissions.email IS '邮箱地址（可选）';

-- 验证更新
SELECT
  column_name,
  data_type,
  character_maximum_length,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'submissions'
ORDER BY ordinal_position;
