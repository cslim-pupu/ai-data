-- 添加缺失的列到 cases 表
-- 这些列在建表脚本中定义了，但可能在实际数据库中缺失

-- 检查并添加 wechat_name 列
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cases' AND column_name = 'wechat_name') THEN
        ALTER TABLE cases ADD COLUMN wechat_name TEXT;
        RAISE NOTICE 'Added wechat_name column';
    ELSE
        RAISE NOTICE 'wechat_name column already exists';
    END IF;
END $$;

-- 检查并添加 wechat_link 列
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cases' AND column_name = 'wechat_link') THEN
        ALTER TABLE cases ADD COLUMN wechat_link TEXT;
        RAISE NOTICE 'Added wechat_link column';
    ELSE
        RAISE NOTICE 'wechat_link column already exists';
    END IF;
END $$;

-- 检查并添加 case_link 列
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cases' AND column_name = 'case_link') THEN
        ALTER TABLE cases ADD COLUMN case_link TEXT;
        RAISE NOTICE 'Added case_link column';
    ELSE
        RAISE NOTICE 'case_link column already exists';
    END IF;
END $$;

-- 验证所有列是否存在
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'cases' 
  AND column_name IN ('wechat_name', 'wechat_link', 'case_link')
ORDER BY column_name;