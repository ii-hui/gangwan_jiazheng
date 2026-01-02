-- 添加首页展示标记字段
-- 在Supabase SQL Editor中执行此脚本

ALTER TABLE job_seekers
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- 添加注释
COMMENT ON COLUMN job_seekers.is_featured IS '是否在首页展示';

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_job_seekers_featured
  ON job_seekers(is_featured, is_approved, is_active)
  WHERE is_featured = true;

-- 查看结果
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'job_seekers'
  AND column_name = 'is_featured';
