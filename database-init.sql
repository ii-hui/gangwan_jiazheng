-- ============================================
-- 求职者上传系统 - 数据库初始化脚本
-- ============================================
-- 项目: 秦皇岛港湾家政
-- 创建时间: 2025-12-31
-- 说明: 在Supabase SQL Editor中执行此脚本
-- ============================================

-- ============================================
-- 1. 创建 job_seekers 表（求职者信息）
-- ============================================

CREATE TABLE IF NOT EXISTS job_seekers (
  -- 主键和时间戳
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  -- 基本信息
  name VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  age INTEGER CHECK (age >= 18 AND age <= 70),
  category VARCHAR(50) NOT NULL CHECK (category IN ('保姆', '育儿嫂', '老年护理', '医院护工')),
  experience VARCHAR(200),
  skills TEXT[] DEFAULT '{}',
  description TEXT,

  -- 图片资源
  avatar_url VARCHAR(500),
  work_photos JSONB DEFAULT '[]'::jsonb,

  -- 状态管理
  work_status VARCHAR(20) DEFAULT '求职中' CHECK (work_status IN ('求职中', '已就业')),
  is_approved BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,

  -- 上传控制
  upload_key VARCHAR(100) NOT NULL,
  uploaded_by VARCHAR(100),

  -- 审核信息
  deactivated_at TIMESTAMP WITH TIME ZONE,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by VARCHAR(100),
  reject_reason TEXT,

  -- 显示控制
  display_order INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0
);

-- 添加注释
COMMENT ON TABLE job_seekers IS '求职者信息表';
COMMENT ON COLUMN job_seekers.work_photos IS 'JSONB数组格式: [{"url": "...", "alt": "...", "caption": "..."}]';
COMMENT ON COLUMN job_seekers.deactivated_at IS '下架时间，用于自动清理判断';

-- ============================================
-- 2. 创建 upload_keys 表（上传密钥管理）
-- ============================================

CREATE TABLE IF NOT EXISTS upload_keys (
  -- 主键和时间戳
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  -- 密钥信息
  key_code VARCHAR(100) UNIQUE NOT NULL,
  is_used BOOLEAN DEFAULT false,
  used_at TIMESTAMP WITH TIME ZONE,
  used_by_phone VARCHAR(20),

  -- 使用控制
  expires_at TIMESTAMP WITH TIME ZONE,
  max_uses INTEGER DEFAULT 1 CHECK (max_uses > 0),
  current_uses INTEGER DEFAULT 0 CHECK (current_uses >= 0),

  -- 管理信息
  created_by VARCHAR(100),
  notes TEXT
);

-- 添加注释
COMMENT ON TABLE upload_keys IS '上传密钥管理表';
COMMENT ON COLUMN upload_keys.max_uses IS '最大使用次数，默认1次';
COMMENT ON COLUMN upload_keys.current_uses IS '当前已使用次数';

-- ============================================
-- 3. 创建索引（性能优化）
-- ============================================

-- job_seekers 表索引
CREATE INDEX IF NOT EXISTS idx_job_seekers_status
  ON job_seekers(work_status, is_approved, is_active);

CREATE INDEX IF NOT EXISTS idx_job_seekers_category
  ON job_seekers(category, display_order DESC);

CREATE INDEX IF NOT EXISTS idx_job_seekers_deactivated
  ON job_seekers(deactivated_at)
  WHERE is_active = false;

CREATE INDEX IF NOT EXISTS idx_job_seekers_upload_key
  ON job_seekers(upload_key);

-- upload_keys 表索引
CREATE INDEX IF NOT EXISTS idx_upload_keys_code
  ON upload_keys(key_code);

CREATE INDEX IF NOT EXISTS idx_upload_keys_status
  ON upload_keys(is_used, expires_at);

-- ============================================
-- 4. 配置 Row Level Security (RLS)
-- ============================================

-- 启用 RLS
ALTER TABLE job_seekers ENABLE ROW LEVEL SECURITY;
ALTER TABLE upload_keys ENABLE ROW LEVEL SECURITY;

-- job_seekers 表策略

-- 公开读取：仅显示已审核通过且激活的求职者
CREATE POLICY "公开读取已审核求职者" ON job_seekers
  FOR SELECT
  USING (is_approved = true AND is_active = true);

-- 允许插入：任何人都可以提交（需要密钥验证在应用层）
CREATE POLICY "允许提交求职信息" ON job_seekers
  FOR INSERT
  WITH CHECK (true);

-- 禁止公开更新和删除（仅通过service_role）
CREATE POLICY "禁止公开更新" ON job_seekers
  FOR UPDATE
  USING (false);

CREATE POLICY "禁止公开删除" ON job_seekers
  FOR DELETE
  USING (false);

-- upload_keys 表策略

-- 禁止公开读取密钥
CREATE POLICY "禁止公开读取密钥" ON upload_keys
  FOR SELECT
  USING (false);

-- 禁止公开操作
CREATE POLICY "禁止公开插入密钥" ON upload_keys
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "禁止公开更新密钥" ON upload_keys
  FOR UPDATE
  USING (false);

CREATE POLICY "禁止公开删除密钥" ON upload_keys
  FOR DELETE
  USING (false);

-- ============================================
-- 5. 创建辅助函数
-- ============================================

-- 生成上传密钥的函数
CREATE OR REPLACE FUNCTION generate_upload_key()
RETURNS VARCHAR(100) AS $$
DECLARE
  new_key VARCHAR(100);
BEGIN
  new_key := 'JOB-' ||
             UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6)) || '-' ||
             UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
  RETURN new_key;
END;
$$ LANGUAGE plpgsql;

-- 验证密钥的函数
CREATE OR REPLACE FUNCTION validate_upload_key(key_code_input VARCHAR(100))
RETURNS BOOLEAN AS $$
DECLARE
  key_record RECORD;
BEGIN
  SELECT * INTO key_record
  FROM upload_keys
  WHERE key_code = key_code_input;

  -- 密钥不存在
  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- 密钥已过期
  IF key_record.expires_at IS NOT NULL AND key_record.expires_at < NOW() THEN
    RETURN false;
  END IF;

  -- 密钥使用次数已达上限
  IF key_record.current_uses >= key_record.max_uses THEN
    RETURN false;
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. 插入测试数据（可选）
-- ============================================

-- 生成一个测试密钥（7天有效期）
INSERT INTO upload_keys (key_code, expires_at, max_uses, created_by, notes)
VALUES (
  generate_upload_key(),
  NOW() + INTERVAL '7 days',
  1,
  'system',
  '测试密钥 - 请在生产环境中删除'
);

-- ============================================
-- 7. 查看创建结果
-- ============================================

-- 查看表结构
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN ('job_seekers', 'upload_keys');

-- 查看索引
SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename IN ('job_seekers', 'upload_keys')
ORDER BY tablename, indexname;

-- 查看RLS策略
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('job_seekers', 'upload_keys')
ORDER BY tablename, policyname;

-- 查看测试密钥
SELECT
  key_code,
  expires_at,
  max_uses,
  current_uses,
  notes
FROM upload_keys
ORDER BY created_at DESC
LIMIT 5;

-- ============================================
-- 完成提示
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ 数据库初始化完成！';
  RAISE NOTICE '📋 已创建表: job_seekers, upload_keys';
  RAISE NOTICE '🔍 已创建索引: 6个性能优化索引';
  RAISE NOTICE '🔒 已配置RLS: 安全策略已启用';
  RAISE NOTICE '🔧 已创建函数: generate_upload_key(), validate_upload_key()';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  下一步:';
  RAISE NOTICE '1. 在Supabase Storage中创建 job-seekers bucket';
  RAISE NOTICE '2. 配置bucket为私有访问';
  RAISE NOTICE '3. 继续创建API路由';
END $$;
