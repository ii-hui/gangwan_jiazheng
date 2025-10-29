-- 创建服务项目表
-- 用于存储每个服务类型的具体服务项目和图片

CREATE TABLE IF NOT EXISTS service_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- 服务类型（对应页面）
  service_type VARCHAR(50) NOT NULL,  -- 'baomu', 'yuerso', 'laorenghuli', 'yiyuanhugong'

  -- 服务项目信息
  name VARCHAR(100) NOT NULL,         -- 服务项目名称，如 '日常家务清洁'
  image_url TEXT NOT NULL,            -- 图片URL（可以是本地路径或 Supabase Storage URL）
  image_alt TEXT NOT NULL,            -- 图片 alt 文本（SEO优化）

  -- 排序和显示
  display_order INTEGER DEFAULT 0,    -- 显示顺序（数字越小越靠前）
  is_active BOOLEAN DEFAULT true,     -- 是否启用显示

  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX idx_service_items_type ON service_items(service_type);
CREATE INDEX idx_service_items_active ON service_items(is_active);
CREATE INDEX idx_service_items_order ON service_items(display_order);

-- 创建组合索引（最常用的查询）
CREATE INDEX idx_service_items_type_active_order
  ON service_items(service_type, is_active, display_order);

-- 添加约束：service_type 只能是四种服务之一
ALTER TABLE service_items
  ADD CONSTRAINT check_service_type
  CHECK (service_type IN ('baomu', 'yuerso', 'laorenghuli', 'yiyuanhugong'));

-- 创建更新时间戳的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为 service_items 表添加自动更新时间戳的触发器
DROP TRIGGER IF EXISTS update_service_items_updated_at ON service_items;
CREATE TRIGGER update_service_items_updated_at
  BEFORE UPDATE ON service_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 插入现有的保姆服务数据
INSERT INTO service_items (service_type, name, image_url, image_alt, display_order) VALUES
  ('baomu', '日常家务清洁', '/images/service-cleaning.jpg', '秦皇岛保姆日常家务清洁服务', 1),
  ('baomu', '一日三餐烹饪', '/images/service-cooking.jpg', '秦皇岛保姆烹饪做饭服务', 2),
  ('baomu', '衣物洗涤熨烫', '/images/service-laundry.jpg', '秦皇岛保姆衣物洗涤熨烫服务', 3),
  ('baomu', '家居物品整理', '/images/service-organize.jpg', '秦皇岛保姆家居物品整理服务', 4),
  ('baomu', '代购日常用品', '/images/service-shopping.jpg', '秦皇岛保姆代购日常用品服务', 5),
  ('baomu', '简单育儿协助', '/images/service-childcare.jpg', '秦皇岛保姆育儿协助服务', 6);

-- 插入育儿嫂服务数据（来自实际配置）
INSERT INTO service_items (service_type, name, image_url, image_alt, display_order) VALUES
  ('yuerso', '新生儿日常护理', '/images/service-newborn.jpg', '秦皇岛育儿嫂新生儿日常护理服务', 1),
  ('yuerso', '科学喂养指导', '/images/service-feeding.jpg', '秦皇岛育儿嫂科学喂养指导服务', 2),
  ('yuerso', '辅食制作添加', '/images/service-babyfood.jpg', '秦皇岛育儿嫂辅食制作添加服务', 3),
  ('yuerso', '生长发育监测', '/images/service-growth.jpg', '秦皇岛育儿嫂婴儿生长发育监测服务', 4),
  ('yuerso', '早教游戏启蒙', '/images/service-earlyedu.jpg', '秦皇岛育儿嫂早教游戏启蒙服务', 5),
  ('yuerso', '产妇月子护理', '/images/service-postpartum.jpg', '秦皇岛月嫂产妇月子护理服务', 6);

-- 插入老年护理服务数据（来自实际配置）
INSERT INTO service_items (service_type, name, image_url, image_alt, display_order) VALUES
  ('laorenghuli', '日常生活照料', '/images/service-eldercare.jpg', '秦皇岛老年护理日常生活照料服务', 1),
  ('laorenghuli', '饮食营养调理', '/images/service-nutrition.jpg', '秦皇岛老年护理饮食营养调理服务', 2),
  ('laorenghuli', '用药提醒协助', '/images/service-medication.jpg', '秦皇岛老年护理用药提醒协助服务', 3),
  ('laorenghuli', '康复训练陪同', '/images/service-rehabilitation.jpg', '秦皇岛老年护理康复训练陪同服务', 4),
  ('laorenghuli', '心理陪伴疏导', '/images/service-companion.jpg', '秦皇岛老年护理心理陪伴疏导服务', 5),
  ('laorenghuli', '就医陪同协助', '/images/service-hospital.jpg', '秦皇岛老年护理就医陪同协助服务', 6);

-- 插入医院护工服务数据（来自实际配置）
INSERT INTO service_items (service_type, name, image_url, image_alt, display_order) VALUES
  ('yiyuanhugong', '24小时床边陪护', '/images/service-bedside.jpg', '秦皇岛医院护工24小时床边陪护服务', 1),
  ('yiyuanhugong', '协助生活护理', '/images/service-dailycare.jpg', '秦皇岛医院护工协助生活护理服务', 2),
  ('yiyuanhugong', '术后康复协助', '/images/service-recovery.jpg', '秦皇岛医院护工术后康复协助服务', 3),
  ('yiyuanhugong', '病情观察反馈', '/images/service-monitor.jpg', '秦皇岛医院护工病情观察反馈服务', 4),
  ('yiyuanhugong', '协助翻身擦洗', '/images/service-bathing.jpg', '秦皇岛医院护工协助翻身擦洗服务', 5),
  ('yiyuanhugong', '配合医护工作', '/images/service-medical.jpg', '秦皇岛医院护工配合医护工作服务', 6);

-- 查询示例：获取某个服务类型的所有启用项目
-- SELECT * FROM service_items
-- WHERE service_type = 'baomu' AND is_active = true
-- ORDER BY display_order ASC;
