-- ==================== 完整重建脚本：案例展示表 ====================
-- 用途：删除旧表并重新创建带有正确字段的新表
-- 创建时间：2025-11-07
-- 警告：此脚本会删除所有现有数据！请先备份！

-- ==================== 步骤1：删除旧表 ====================

-- 删除触发器（如果存在）
DROP TRIGGER IF EXISTS trigger_update_case_studies_updated_at ON case_studies;

-- 删除函数（如果存在）
DROP FUNCTION IF EXISTS update_case_studies_updated_at();

-- 删除表（如果存在）
DROP TABLE IF EXISTS case_studies CASCADE;

-- ==================== 步骤2：创建新表 ====================

CREATE TABLE case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 标题信息
  title VARCHAR(200) NOT NULL, -- 如：秦皇岛-XX小区-找保姆-XX女士/先生

  -- 截图信息（支持多张图片）
  screenshots JSONB NOT NULL DEFAULT '[]'::jsonb, -- 微信聊天截图URL数组 [{"url": "...", "alt": "..."}]

  -- 说明信息
  description TEXT, -- 案例说明/简介

  -- 分类标签
  service_type VARCHAR(50), -- 服务类型：保姆、育儿嫂、老年护理、医院护工
  location VARCHAR(100), -- 地区：海港区、山海关区等

  -- 显示控制
  display_order INTEGER DEFAULT 0, -- 显示顺序，数字越小越靠前
  is_active BOOLEAN DEFAULT true, -- 是否启用显示
  is_featured BOOLEAN DEFAULT false, -- 是否推荐案例

  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== 步骤3：添加索引 ====================

CREATE INDEX idx_case_studies_active ON case_studies(is_active);
CREATE INDEX idx_case_studies_order ON case_studies(display_order);
CREATE INDEX idx_case_studies_service_type ON case_studies(service_type);
CREATE INDEX idx_case_studies_featured ON case_studies(is_featured);

-- ==================== 步骤4：添加约束 ====================

ALTER TABLE case_studies
ADD CONSTRAINT check_service_type
CHECK (service_type IN ('保姆', '育儿嫂', '老年护理', '医院护工', NULL));

-- ==================== 步骤5：创建更新时间触发器 ====================

CREATE OR REPLACE FUNCTION update_case_studies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_case_studies_updated_at
  BEFORE UPDATE ON case_studies
  FOR EACH ROW
  EXECUTE FUNCTION update_case_studies_updated_at();

-- ==================== 步骤6：添加表和列注释 ====================

COMMENT ON TABLE case_studies IS '案例展示表，用于展示微信聊天截图案例';
COMMENT ON COLUMN case_studies.title IS '案例标题，格式：秦皇岛-XX小区-找XX-XX女士/先生';
COMMENT ON COLUMN case_studies.screenshots IS '微信聊天截图数组，格式：[{"url": "图片地址", "alt": "SEO描述"}]';
COMMENT ON COLUMN case_studies.description IS '案例说明/简介';
COMMENT ON COLUMN case_studies.display_order IS '显示顺序，数字越小越靠前';
COMMENT ON COLUMN case_studies.is_active IS '是否启用显示';
COMMENT ON COLUMN case_studies.is_featured IS '是否为推荐案例';

-- ==================== 步骤7：插入示例数据（可选） ====================

-- 示例1：保姆案例（多张截图）
INSERT INTO case_studies (title, screenshots, description, service_type, location, display_order, is_active, is_featured) VALUES
(
  '秦皇岛-海港区-找保姆-刘女士',
  '[
    {"url": "/images/cases/case-1-1.png", "alt": "秦皇岛海港区找保姆成功案例-刘女士-聊天记录1"},
    {"url": "/images/cases/case-1-2.png", "alt": "秦皇岛海港区找保姆成功案例-刘女士-聊天记录2"},
    {"url": "/images/cases/case-1-3.png", "alt": "秦皇岛海港区找保姆成功案例-刘女士-聊天记录3"}
  ]'::jsonb,
  '这个案例是成单时间最短的单，多亏了客户的信任。从咨询到签约只用了2小时，现在保姆阿姨已经服务3个月了，客户非常满意。',
  '保姆',
  '海港区',
  1,
  true,
  true
);

-- 示例2：育儿嫂案例（两张截图）
INSERT INTO case_studies (title, screenshots, description, service_type, location, display_order, is_active, is_featured) VALUES
(
  '秦皇岛-北戴河区-找育儿嫂-张女士',
  '[
    {"url": "/images/cases/case-2-1.png", "alt": "秦皇岛北戴河区找育儿嫂成功案例-张女士-聊天记录1"},
    {"url": "/images/cases/case-2-2.png", "alt": "秦皇岛北戴河区找育儿嫂成功案例-张女士-聊天记录2"}
  ]'::jsonb,
  '客户是二胎妈妈，对育儿嫂要求很高。我们推荐了3位候选人，客户最终选择了有5年经验的李阿姨，现在宝宝护理得很好。',
  '育儿嫂',
  '北戴河区',
  2,
  true,
  true
);

-- 示例3：老年护理案例（单张截图）
INSERT INTO case_studies (title, screenshots, description, service_type, location, display_order, is_active, is_featured) VALUES
(
  '秦皇岛-山海关区-找老年护理-王先生',
  '[
    {"url": "/images/cases/case-3-1.png", "alt": "秦皇岛山海关区找老年护理成功案例-王先生-聊天记录1"}
  ]'::jsonb,
  '王先生的父亲需要专业护理，我们安排了持证护理员上门服务。护理员非常专业，老人家属都很放心。',
  '老年护理',
  '山海关区',
  3,
  true,
  false
);

-- ==================== 完成 ====================

-- 查询验证
SELECT
  id,
  title,
  jsonb_array_length(screenshots) as "截图数量",
  service_type,
  location,
  is_active,
  display_order
FROM case_studies
ORDER BY display_order ASC;

-- ==================== 使用说明 ====================

/*
执行步骤：
1. 登录 Supabase (https://supabase.com)
2. 选择项目：tlxczsxuubwoeigyhmou
3. 点击左侧 SQL Editor
4. 点击 New Query
5. 复制粘贴本文件全部内容
6. 点击 Run 执行

执行后：
- 旧的 case_studies 表会被删除（包括所有数据）
- 创建新表，包含正确的 screenshots (JSONB) 列
- 插入3条示例数据
- 可在 Table Editor 中查看和编辑数据

添加自己的案例：
在 Table Editor 中，screenshots 列填写格式：
[
  {"url": "图片URL", "alt": "图片描述"},
  {"url": "图片URL", "alt": "图片描述"}
]

常用查询：
-- 查询所有启用的案例
SELECT * FROM case_studies WHERE is_active = true ORDER BY display_order ASC;

-- 查询特定服务类型
SELECT * FROM case_studies WHERE service_type = '保姆' AND is_active = true;

-- 统计每种服务类型的案例数
SELECT service_type, COUNT(*) as count
FROM case_studies
WHERE is_active = true
GROUP BY service_type;
*/
