-- 更新 submissions 表结构
-- 添加 category 字段用于存储用户选择的服务类型

-- 1. 添加 category 字段
ALTER TABLE submissions
ADD COLUMN IF NOT EXISTS category VARCHAR(50);

-- 2. 为现有记录设置默认值（如果需要）
UPDATE submissions
SET category = '保姆'
WHERE category IS NULL;

-- 3. 添加字段注释
COMMENT ON COLUMN submissions.category IS '服务类型：保姆 | 育儿嫂 | 老年护理 | 医院护工';

-- 4. 验证更新（查看表结构）
SELECT
  column_name,
  data_type,
  character_maximum_length,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'submissions'
ORDER BY ordinal_position;
