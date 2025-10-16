-- 创建案例表
CREATE TABLE cases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  industry TEXT,
  member_type TEXT,
  holiday TEXT,
  components TEXT[], -- 存储组件数组
  tags TEXT[], -- 存储标签数组
  publish_date DATE,
  wechat_name TEXT, -- 公众号名称
  wechat_link TEXT, -- 公众号链接
  case_link TEXT, -- 案例链接
  create_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  update_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT, -- 可选：记录创建者
  is_active BOOLEAN DEFAULT true
);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.update_time = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cases_updated_at 
    BEFORE UPDATE ON cases 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 创建索引以提高查询性能
CREATE INDEX idx_cases_industry ON cases(industry);
CREATE INDEX idx_cases_member_type ON cases(member_type);
CREATE INDEX idx_cases_holiday ON cases(holiday);
CREATE INDEX idx_cases_publish_date ON cases(publish_date);
CREATE INDEX idx_cases_create_time ON cases(create_time);
CREATE INDEX idx_cases_is_active ON cases(is_active);

-- 启用行级安全策略（RLS）
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

-- 创建允许所有用户读写的策略（您可以根据需要调整）
CREATE POLICY "Allow all operations for authenticated users" ON cases
    FOR ALL USING (true);

-- 如果需要匿名访问，可以使用这个策略
CREATE POLICY "Allow all operations for anonymous users" ON cases
    FOR ALL USING (true);