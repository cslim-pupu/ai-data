import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

export default async function handler(req, res) {
  // 1. 设置 CORS 头，允许前端跨域访问
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  // 处理 OPTIONS 请求（预检请求）
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // 2. 检查环境变量
  if (!supabaseUrl || !supabaseAnonKey) {
    return res.status(500).json({ error: '服务器环境变量未配置' })
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  try {
    // 3. 根据请求方法分发操作
    if (req.method === 'GET') {
      // 获取列表
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('is_active', true)
        .order('create_time', { ascending: false })
      
      if (error) throw error
      return res.status(200).json(data)
    } 
    
    else if (req.method === 'POST') {
      // 新增数据
      const { data, error } = await supabase
        .from('cases')
        .insert([req.body])
        .select()
        .single()
        
      if (error) throw error
      return res.status(200).json(data)
    }

    else if (req.method === 'PUT') {
      // 更新数据
      const { id, ...updateData } = req.body
      if (!id) return res.status(400).json({ error: '缺少 ID' })

      const { data, error } = await supabase
        .from('cases')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return res.status(200).json(data)
    }

    else if (req.method === 'DELETE') {
      // 删除数据（软删除）
      // 支持单个删除（Query Params: ?id=1）或批量删除（Body: { ids: [1, 2] }）
      
      let ids = []
      
      if (req.query.id) {
        ids = [req.query.id]
      } else if (req.body && Array.isArray(req.body.ids)) {
        ids = req.body.ids
      }

      if (ids.length === 0) {
        return res.status(400).json({ error: '未提供要删除的 ID' })
      }

      const { data, error } = await supabase
        .from('cases')
        .update({ is_active: false })
        .in('id', ids)
        .select()

      if (error) throw error
      return res.status(200).json(data)
    }

    else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: error.message })
  }
}
