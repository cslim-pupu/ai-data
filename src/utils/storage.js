import dayjs from 'dayjs'
import { supabase } from './supabase.js'

const STORAGE_KEY = 'case_data_list'
const BACKUP_KEY = 'case_data_backup'

// 使用 Vercel API 代理地址
const API_URL = '/api/cases'

export class StorageManager {
  // 获取所有案例数据
  static async getCaseList() {
    try {
      // 优先尝试从 Vercel API 获取（通过代理连接 Supabase）
      const response = await fetch(API_URL)
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      const data = await response.json()
      
      // 字段名映射：数据库字段 -> 前端字段
      const mappedData = (data || []).map(item => ({
        ...item,
        caseName: item.title,
        wechatName: item.wechat_name,
        wechatLink: item.wechat_link || item.case_link,
        caseLink: item.case_link || item.wechat_link,
        industry: item.industry,
        holiday: item.holiday || '',
        tags: Array.isArray(item.tags) ? item.tags : (typeof item.tags === 'string' ? item.tags.split(',').map(t => t.trim()).filter(Boolean) : []),
        components: Array.isArray(item.components) ? item.components : (typeof item.components === 'string' ? item.components.split(/[、,，]/).map(s => s.trim()).filter(Boolean) : []),
        memberType: item.member_type,
        publishDate: item.publish_date,
        createTime: item.create_time,
        updateTime: item.update_time,
        author: item.created_by || '',
        member_type: item.member_type,
        publish_date: item.publish_date,
        create_time: item.create_time,
        update_time: item.update_time
      }))
      
      // 成功获取后，更新本地缓存
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedData))
      
      return mappedData
    } catch (err) {
      console.error('API 获取失败，降级使用本地缓存:', err)
      // 网络错误时从本地获取
      return this.getLocalCaseList()
    }
  }

  // 从本地存储获取数据（备用方案）
  static getLocalCaseList() {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  }

  // 保存案例数据到云端
  static async saveCaseList(caseList) {
    // 同时保存到本地作为备份
    localStorage.setItem(STORAGE_KEY, JSON.stringify(caseList))
    this.autoBackup()
  }

  // 添加新案例
  static async addCase(caseData) {
    try {
      const newCase = {
        title: caseData.title || caseData.caseName,
        description: caseData.description || '',
        industry: caseData.industry || '',
        member_type: caseData.memberType || caseData.member_type || '',
        holiday: caseData.holiday || '',
        components: Array.isArray(caseData.components) ? caseData.components : (typeof caseData.components === 'string' ? caseData.components.split(/[、,，]/).map(s => s.trim()).filter(Boolean) : []),
        tags: Array.isArray(caseData.tags) ? caseData.tags : (typeof caseData.tags === 'string' ? caseData.tags.split(',').map(t => t.trim()).filter(Boolean) : []),
        publish_date: normalizeDate(caseData.publishDate || caseData.publish_date),
        wechat_name: caseData.wechatName || caseData.wechat_name || '',
        wechat_link: caseData.wechatLink || caseData.wechat_link || '',
        case_link: caseData.caseLink || caseData.case_link || '',
        created_by: caseData.created_by || caseData.author || '',
        create_time: new Date().toISOString(),
        is_active: true
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCase)
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      const data = await response.json()

      // 同时保存到本地备份
      const localList = this.getLocalCaseList()
      // 映射回前端格式以便立即显示
      const mappedData = {
        ...data,
        caseName: data.title,
        wechatName: data.wechat_name,
        wechatLink: data.wechat_link || data.case_link,
        caseLink: data.case_link || data.wechat_link,
        industry: data.industry,
        holiday: data.holiday || '',
        tags: Array.isArray(data.tags) ? data.tags : (typeof data.tags === 'string' ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : []),
        components: Array.isArray(data.components) ? data.components : (typeof data.components === 'string' ? data.components.split(/[、,，]/).map(s => s.trim()).filter(Boolean) : []),
        memberType: data.member_type,
        publishDate: data.publish_date,
        createTime: data.create_time,
        updateTime: data.update_time,
        author: data.created_by || '',
      }
      
      localList.unshift(mappedData)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(localList))

      return mappedData
    } catch (err) {
      console.error('网络错误:', err)
      return this.addLocalCase(caseData)
    }
  }

  // 本地添加案例（备用方案）
  static addLocalCase(caseData) {
    const caseList = this.getLocalCaseList()
    const newCase = {
      id: Date.now().toString(),
      ...caseData,
      create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      is_active: true
    }
    caseList.unshift(newCase)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(caseList))
    return newCase
  }

  // 更新案例
  static async updateCase(id, caseData) {
    try {
      console.log('updateCase 接收到的数据:', { id, caseData });
      
      const updateData = {
        id: id, // 必须传 ID
        title: caseData.title || caseData.caseName,
        description: caseData.description || '',
        industry: caseData.industry || '',
        member_type: caseData.memberType || caseData.member_type || '',
        holiday: caseData.holiday || '',
        components: Array.isArray(caseData.components) ? caseData.components : (typeof caseData.components === 'string' ? caseData.components.split(/[、,，]/).map(s => s.trim()).filter(Boolean) : []),
        tags: Array.isArray(caseData.tags) ? caseData.tags : (typeof caseData.tags === 'string' ? caseData.tags.split(',').map(t => t.trim()).filter(Boolean) : []),
        publish_date: normalizeDate(caseData.publishDate || caseData.publish_date),
        wechat_name: caseData.wechatName || caseData.wechat_name || '',
        wechat_link: caseData.wechatLink || caseData.wechat_link || '',
        case_link: caseData.caseLink || caseData.case_link || '',
        created_by: caseData.created_by || caseData.author || '',
        update_time: new Date().toISOString()
      }

      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      const data = await response.json()
      
      // 更新成功后，刷新本地缓存
      const localList = this.getLocalCaseList()
      const index = localList.findIndex(item => item.id === id)
      if (index !== -1) {
        // 简单合并更新
        localList[index] = { ...localList[index], ...caseData }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(localList))
      }

      return data
    } catch (err) {
      console.error('网络错误:', err)
      // 如果网络失败，降级更新本地
      const localList = this.getLocalCaseList()
      const index = localList.findIndex(item => item.id === id)
      if (index !== -1) {
        localList[index] = { ...localList[index], ...caseData }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(localList))
      }
      return localList[index]
    }
  }

  // 本地更新案例（备用方案）
  static updateLocalCase(id, caseData) {
    const caseList = this.getLocalCaseList()
    const index = caseList.findIndex(item => item.id === id)
    if (index !== -1) {
      caseList[index] = {
        ...caseList[index],
        ...caseData,
        update_time: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(caseList))
      return caseList[index]
    }
    return null
  }

  // 删除案例（软删除）
  static async deleteCase(id) {
    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      // 同时从本地备份中删除
      const localList = this.getLocalCaseList()
      const filteredList = localList.filter(item => item.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredList))

      return filteredList
    } catch (err) {
      console.error('网络错误，尝试本地删除:', err)
      return this.deleteLocalCase(id)
    }
  }

  // 批量删除案例
  static async batchDeleteCases(ids) {
    if (!ids || ids.length === 0) return

    try {
      const response = await fetch(API_URL, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids })
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      // 同时从本地备份中删除
      const localList = this.getLocalCaseList()
      const filteredList = localList.filter(item => !ids.includes(item.id))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredList))

      return filteredList
    } catch (err) {
      console.error('网络错误，尝试本地批量删除:', err)
      
      // 本地批量删除逻辑
      const localList = this.getLocalCaseList()
      const filteredList = localList.filter(item => !ids.includes(item.id))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredList))
      
      return filteredList
    }
  }

  // 本地删除案例（备用方案）
  static deleteLocalCase(id) {
    const caseList = this.getLocalCaseList()
    const filteredList = caseList.filter(item => item.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredList))
    return filteredList
  }

  // 数据迁移：将本地数据迁移到云端
  static async migrateLocalDataToCloud() {
    try {
      const localData = this.getLocalCaseList()
      if (localData.length === 0) {
        console.log('没有本地数据需要迁移')
        return { success: true, migrated: 0 }
      }

      console.log(`开始迁移 ${localData.length} 条本地数据到云端...`)
      
      // 转换本地数据格式以匹配数据库结构（补齐公众号链接 & 统一日期）
      const migrateData = localData.map(item => ({
        title: item.title || item.caseName,
        description: item.description,
        industry: item.industry,
        member_type: item.memberType || item.member_type,
        holiday: item.holiday,
        components: item.components || [],
        tags: item.tags || [],
        publish_date: normalizeDate(item.publishDate || item.publish_date),
        wechat_link: item.wechatLink || item.wechat_link || '',
        case_link: item.caseLink || item.case_link || '',
        create_time: item.createTime || item.create_time || new Date().toISOString(),
        is_active: true
      }))

      const { data, error } = await supabase
        .from('cases')
        .insert(migrateData)
        .select()

      if (error) {
        console.error('数据迁移失败:', error)
        return { success: false, error: error.message }
      }

      console.log(`成功迁移 ${data.length} 条数据到云端`)
      
      return { success: true, migrated: data.length }
    } catch (err) {
      console.error('迁移过程中发生错误:', err)
      return { success: false, error: err.message }
    }
  }

  // 自动备份（每天一次）
  static autoBackup() {
    const today = dayjs().format('YYYY-MM-DD')
    const lastBackupDate = localStorage.getItem('last_backup_date')
    
    if (lastBackupDate !== today) {
      const caseList = this.getLocalCaseList()
      const backupData = {
        date: today,
        data: caseList
      }
      localStorage.setItem(BACKUP_KEY, JSON.stringify(backupData))
      localStorage.setItem('last_backup_date', today)
    }
  }

  // 获取备份数据
  static getBackupData() {
    const data = localStorage.getItem(BACKUP_KEY)
    return data ? JSON.parse(data) : null
  }

  // 恢复备份数据
  static restoreFromBackup() {
    const backupData = this.getBackupData()
    if (backupData && backupData.data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(backupData.data))
      return true
    }
    return false
  }

  // 检查网络连接状态
  static async checkConnection() {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('id')
        .limit(1)
      
      return !error
    } catch (err) {
      return false
    }
  }

  // 测试云端连接（别名方法）
  static async testConnection() {
    return this.checkConnection()
  }

  // 获取云端数据
  static async getCloudData() {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('is_active', true)
        .order('create_time', { ascending: false })
      
      if (error) {
        console.error('获取云端数据失败:', error)
        return []
      }
      
      return data || []
    } catch (err) {
      console.error('网络错误:', err)
      return []
    }
  }

  // 保存单条数据到云端
  static async saveToCloud(caseData) {
    try {
      console.log('saveToCloud 接收到的数据:', caseData);
      
      const newCase = {
        title: caseData.title || caseData.caseName,
        description: caseData.description || '',
        industry: caseData.industry || '',
        member_type: caseData.memberType || caseData.member_type || '',
        holiday: caseData.holiday || '',
        components: Array.isArray(caseData.components) ? caseData.components : (typeof caseData.components === 'string' ? caseData.components.split(/[、,，]/).map(s => s.trim()).filter(Boolean) : []),
        tags: Array.isArray(caseData.tags) ? caseData.tags : (typeof caseData.tags === 'string' ? caseData.tags.split(',').map(t => t.trim()).filter(Boolean) : []),
        publish_date: normalizeDate(caseData.publishDate || caseData.publish_date),
        wechat_name: caseData.wechatName || caseData.wechat_name || '',
        wechat_link: caseData.wechatLink || caseData.wechat_link || '',
        case_link: caseData.caseLink || caseData.case_link || '',
        created_by: caseData.created_by || caseData.author || '',
        create_time: caseData.createdAt || new Date().toISOString(),
        is_active: true
      }

      console.log('准备插入数据库的数据:', newCase);

      let { data, error } = await supabase
        .from('cases')
        .insert([newCase])
        .select()
        .single()

      if (error) {
        // 仅当明确命中“缺列”错误时才降级重试
        const downgraded = removeMissingColumnsAndLog(error, newCase)
        if (downgraded) {
          const retry = await supabase
            .from('cases')
            .insert([downgraded])
            .select()
            .single()
          if (retry.error) {
            console.error('降级重试仍失败:', retry.error)
            throw new Error(retry.error.message)
          }
          console.log('成功保存到数据库(降级字段集):', retry.data)
          return retry.data
        }
        // 未命中缺列，不做降级，直接抛错以便定位真实问题
        console.error('保存失败（未降级）:', error)
        throw new Error(error.message)
      }

      console.log('成功保存到数据库:', data);
      return data
    } catch (err) {
      console.error('网络错误:', err)
      throw err
    }
  }

  // 获取本地数据数量
  static async getLocalDataCount() {
    const localData = this.getLocalCaseList()
    return localData.length
  }

  // 获取云端数据数量
  static async getCloudDataCount() {
    try {
      const { count, error } = await supabase
        .from('cases')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
      
      if (error) {
        console.error('获取云端数据数量失败:', error)
        return 0
      }
      
      return count || 0
    } catch (err) {
      console.error('网络错误:', err)
      return 0
    }
  }

  // 迁移到云端（别名方法）
  static async migrateToCloud() {
    return this.migrateLocalDataToCloud()
  }

  // 创建备份
  static async createBackup() {
    const today = dayjs().format('YYYY-MM-DD')
    const caseList = this.getLocalCaseList()
    const backupData = {
      date: today,
      data: caseList
    }
    localStorage.setItem(BACKUP_KEY, JSON.stringify(backupData))
    localStorage.setItem('last_backup_date', today)
    return true
  }

  // 获取备份信息
  static async getBackupInfo() {
    const backupData = this.getBackupData()
    const lastBackupDate = localStorage.getItem('last_backup_date')
    
    return {
      hasBackup: !!backupData,
      lastBackupDate: lastBackupDate || ''
    }
  }
}

// 检测并移除在云端不存在的列，返回降级后的payload；如果无需降级则返回null
const removeMissingColumnsAndLog = (error, payload) => {
  const msg = String(error?.message || '')
  // 仅在明确提示缺少 wechat_link/case_link/wechat_name 列时，进行降级移除
  const hit = /(\bwechat_link\b|\bcase_link\b|\bwechat_name\b)/i.test(msg)
  if (hit) {
    console.warn('检测到云端缺失列，统一移除可选列并降级重试: wechat_link, case_link, wechat_name')
    const downgraded = { ...payload }
    delete downgraded.wechat_link
    delete downgraded.case_link
    delete downgraded.wechat_name
    return downgraded
  }
  return null
}

const normalizeDate = (value) => {
  if (value === undefined || value === null || value === '') return null
  if (typeof value === 'number') {
    const date = new Date(Math.round((value - 25569) * 86400 * 1000))
    return dayjs(date).format('YYYY-MM-DD')
  }
  const s = String(value).trim()
    .replace(/[./]/g, '-')
    .replace(/年|月/g, '-')
    .replace(/日/g, '')
  const mdOnly = s.match(/^\s*(\d{1,2})-(\d{1,2})\s*$/)
  if (mdOnly) {
    const y = dayjs().year()
    const mm = mdOnly[1].padStart(2, '0')
    const dd = mdOnly[2].padStart(2, '0')
    return `${y}-${mm}-${dd}`
  }
  const d = dayjs(s)
  return d.isValid() ? d.format('YYYY-MM-DD') : null
}