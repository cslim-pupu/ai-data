import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 检查环境变量是否配置
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase 环境变量未配置！')
  console.error('请确保在 Vercel 项目设置中配置以下环境变量：')
  console.error('- VITE_SUPABASE_URL')
  console.error('- VITE_SUPABASE_ANON_KEY')
  console.error('或在本地创建 .env.local 文件并配置这些变量')
  
  // 在开发环境显示更详细的错误信息
  if (import.meta.env.DEV) {
    alert('Supabase 环境变量未配置！请检查 .env.local 文件')
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)