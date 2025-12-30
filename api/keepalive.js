import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

export default async function handler(req, res) {
  // 设置 CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return res.status(500).json({ error: 'Environment variables missing' })
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  try {
    // 执行一个极轻量的查询来触发数据库活动
    // 使用 head: true 只获取数量，不返回实际数据，节省流量
    const { count, error } = await supabase
      .from('cases')
      .select('*', { count: 'exact', head: true })

    if (error) throw error

    return res.status(200).json({ 
      status: 'alive', 
      timestamp: new Date().toISOString(),
      db_check: 'success',
      count: count
    })
  } catch (error) {
    return res.status(500).json({ 
      status: 'error', 
      error: error.message 
    })
  }
}
