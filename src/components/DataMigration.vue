<template>
  <div class="data-migration">
    <el-card class="migration-card">
      <template #header>
        <div class="card-header">
          数据迁移
          <el-tag :type="connectionStatus ? 'success' : 'danger'">
            {{ connectionStatus ? '云端连接正常' : '云端连接异常' }}
          </el-tag>
        </div>
      </template>
      
      <div class="migration-content">
        <!-- 状态显示 -->
        <div class="status-section">
          <h4>数据统计</h4>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="status-item">
                <div class="status-label">本地数据</div>
                <div class="status-value">{{ localDataCount }} 条</div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="status-item">
                <div class="status-label">云端数据</div>
                <div class="status-value">{{ cloudDataCount }} 条</div>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 迁移操作 -->
        <div class="migration-section">
          <h4>本地数据迁移</h4>
          <div class="migration-info">
            <el-alert
              title="迁移说明"
              type="info"
              :closable="false"
            >
              <template #default>
                <p>• 将本地存储的案例数据迁移到云端数据库</p>
                <p>• 迁移过程中会自动去重，避免重复数据</p>
                <p>• 迁移完成后本地数据仍会保留</p>
                <p>• 请确保网络连接正常</p>
              </template>
            </el-alert>
          </div>
          
          <div class="migration-actions">
            <el-button
              type="primary"
              @click="startMigration"
              :loading="migrating"
              :disabled="localDataCount === 0 || !connectionStatus"
              size="large"
            >
              <el-icon><Upload /></el-icon>
              开始迁移数据
            </el-button>
            
            <el-button
              @click="checkConnection"
              :loading="checking"
              size="large"
            >
              <el-icon><Refresh /></el-icon>
              检查连接
            </el-button>
          </div>
          
          <div v-if="migrationResult" class="migration-result">
            <el-alert
              :title="migrationResult.success ? '迁移成功' : '迁移失败'"
              :type="migrationResult.success ? 'success' : 'error'"
              :closable="false"
            >
              <template #default>
                <p v-if="migrationResult.success">
                  成功迁移 {{ migrationResult.imported }} 条数据到云端
                  <span v-if="migrationResult.skipped > 0">
                    ，跳过 {{ migrationResult.skipped }} 条重复数据
                  </span>
                </p>
                <p v-else>{{ migrationResult.error }}</p>
              </template>
            </el-alert>
          </div>
        </div>

        <!-- 文件导入 -->
        <div class="file-import-section">
          <h4>文件导入</h4>
          <div class="import-info">
            <el-alert
              title="导入说明"
              type="info"
              :closable="false"
            >
              <template #default>
                <p>• 支持导入Excel (.xlsx, .xls) 和CSV (.csv) 格式文件</p>
                <p>• 文件应包含：标题、公众号名称、公众号链接、案例链接等列</p>
                <p>• 导入前会显示数据预览，确认无误后再导入到云端</p>
              </template>
            </el-alert>
          </div>
          
          <div class="file-upload-area">
            <el-upload
              ref="uploadRef"
              class="upload-demo"
              drag
              :auto-upload="false"
              :on-change="handleFileChange"
              :before-upload="beforeUpload"
              accept=".xlsx,.xls,.csv"
              :limit="1"
              :file-list="fileList"
            >
              <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
              <div class="el-upload__text">
                将Excel或CSV文件拖拽到此处，或<em>点击选择文件</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  支持 .xlsx, .xls, .csv 格式，文件大小不超过10MB
                </div>
              </template>
            </el-upload>
          </div>

          <!-- 数据预览 -->
          <div v-if="parsedData.length > 0" class="data-preview">
            <h5>数据预览 (前5条)</h5>
            <el-table :data="parsedData.slice(0, 5)" style="width: 100%" max-height="300">
                <el-table-column prop="title" label="案例名称" width="200" show-overflow-tooltip />
                <el-table-column prop="wechat_link" label="公众号链接" width="250" show-overflow-tooltip />
                <el-table-column prop="industry" label="所属行业" width="100" show-overflow-tooltip />
                <el-table-column prop="holiday" label="节日标签" width="100" show-overflow-tooltip />
                <el-table-column prop="member_type" label="会员类型" width="100" show-overflow-tooltip />
                <el-table-column prop="description" label="使用组件" width="150" show-overflow-tooltip />
              </el-table>
            <div v-if="parsedData.length > 5" class="preview-note">
              共解析到 {{ parsedData.length }} 条数据，仅显示前5条预览
            </div>
          </div>

          <!-- 导入操作 -->
          <div v-if="parsedData.length > 0" class="import-actions">
            <el-button
              type="success"
              @click="importData"
              :loading="importing"
              :disabled="!connectionStatus"
              size="large"
            >
              <el-icon><Check /></el-icon>
              确认导入数据
            </el-button>
            
            <el-button
              @click="clearImportData"
              size="large"
            >
              <el-icon><Close /></el-icon>
              清空数据
            </el-button>
          </div>
          
          <div v-if="importResult" class="import-result">
            <el-alert
              :title="importResult.success ? '导入成功' : '导入失败'"
              :type="importResult.success ? 'success' : 'error'"
              :closable="false"
            >
              <template #default>
                <p v-if="importResult.success">
                  成功导入 {{ importResult.imported }} 条数据到云端
                  <span v-if="importResult.skipped > 0">，跳过 {{ importResult.skipped }} 条重复数据</span>
                </p>
                <p v-else>{{ importResult.error }}</p>
              </template>
            </el-alert>
          </div>
        </div>

        <!-- 数据备份 -->
        <div class="backup-section">
          <h4>数据备份</h4>
          <div class="backup-info">
            <p>最后备份时间：{{ lastBackupDate || '暂无备份' }}</p>
          </div>
          <div class="backup-actions">
            <el-button @click="createBackup" :loading="backing">
              <el-icon><Download /></el-icon>
              创建备份
            </el-button>
            <el-button @click="restoreBackup" :disabled="!hasBackup">
              <el-icon><RefreshLeft /></el-icon>
              恢复备份
            </el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Upload, Refresh, UploadFilled, Check, Close, Download, RefreshLeft } from '@element-plus/icons-vue'
import * as XLSX from 'xlsx'
import dayjs from 'dayjs'
import Papa from 'papaparse'
import { StorageManager } from '../utils/storage.js'

defineOptions({
  name: 'DataMigration',
})

// 响应式数据
const connectionStatus = ref(false)
const localDataCount = ref(0)
const cloudDataCount = ref(0)
const migrating = ref(false)
const checking = ref(false)
const importing = ref(false)
const backing = ref(false)
const migrationResult = ref(null)
const importResult = ref(null)
const hasBackup = ref(false)
const lastBackupDate = ref('')

// 文件上传相关
const uploadRef = ref()
const fileList = ref([])
const parsedData = ref([])

// 文件上传前的验证
const beforeUpload = (file) => {
  const isValidType = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    file.type === 'application/vnd.ms-excel' ||
    file.type === 'text/csv' ||
    file.name.endsWith('.xlsx') ||
    file.name.endsWith('.xls') ||
    file.name.endsWith('.csv')

  if (!isValidType) {
    ElMessage.error('只支持 Excel (.xlsx, .xls) 和 CSV (.csv) 格式文件!')
    return false
  }

  if (file.size > 10 * 1024 * 1024) {
    ElMessage.error('文件大小不能超过 10MB!')
    return false
  }

  return false // 阻止自动上传
}

// 文件选择处理
const handleFileChange = (file) => {
  if (!file.raw) return
  
  const fileName = file.name
  migrationResult.value = null
  importResult.value = null
  
  try {
    if (fileName.endsWith('.csv')) {
      parseCSV(file.raw)
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      parseExcel(file.raw)
    } else {
      ElMessage.error('不支持的文件格式')
    }
  } catch (error) {
    console.error('文件解析错误:', error)
    ElMessage.error('文件解析失败: ' + error.message)
  }
}

// 解析CSV文件
const parseCSV = (file) => {
  console.log('开始解析CSV文件:', file.name)
  Papa.parse(file, {
    header: true,
    encoding: 'UTF-8',
    complete: (results) => {
      console.log('CSV解析结果:', results)
      if (results.errors.length > 0) {
        console.error('CSV解析错误:', results.errors)
        ElMessage.error('CSV文件解析失败: ' + results.errors[0].message)
        return
      }
      
      const validData = results.data.filter(row => {
        return Object.values(row).some(value => value && value.toString().trim())
      })
      
      console.log('有效数据行数:', validData.length)
      
      if (validData.length === 0) {
        ElMessage.warning('文件中没有找到有效的数据')
        return
      }
      
      const normalizedData = validData.map(normalizeRowData).filter(row => row.title)
      console.log('标准化后的数据:', normalizedData)
      parsedData.value = normalizedData
      
      if (normalizedData.length > 0) {
        ElMessage.success(`成功解析 ${normalizedData.length} 条数据`)
      } else {
        ElMessage.warning('没有找到包含标题的有效数据行')
      }
    },
    error: (error) => {
      console.error('CSV解析错误:', error)
      ElMessage.error('CSV文件解析失败: ' + error.message)
    }
  })
}

// 解析Excel文件
const parseExcel = (file) => {
  console.log('开始解析Excel文件:', file.name)
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const arrayBuffer = new Uint8Array(e.target.result)
      const workbook = XLSX.read(arrayBuffer, { type: 'array' })
      
      console.log('Excel工作簿:', workbook)
      
      // 获取第一个工作表
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      
      // 转换为JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      
      console.log('Excel原始数据:', jsonData)
      
      if (jsonData.length < 2) {
        ElMessage.warning('Excel文件中没有找到有效的数据')
        return
      }
      
      // 获取表头
      const headers = jsonData[0]
      console.log('表头:', headers)
      
      // 转换数据
      const processedData = []
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i]
        const rowObj = {}
        headers.forEach((header, index) => {
          rowObj[header] = row[index] || ''
        })
        
        // 检查是否有有效数据
        if (Object.values(rowObj).some(value => value && value.toString().trim())) {
          processedData.push(rowObj)
        }
      }
      
      console.log('处理后的数据:', processedData)
      
      if (processedData.length === 0) {
        ElMessage.warning('Excel文件中没有找到有效的数据')
        return
      }
      
      const normalizedData = processedData.map(normalizeRowData).filter(row => row.title)
      console.log('标准化后的数据:', normalizedData)
      parsedData.value = normalizedData
      
      if (normalizedData.length > 0) {
        ElMessage.success(`成功解析 ${normalizedData.length} 条数据`)
      } else {
        ElMessage.warning('没有找到包含标题的有效数据行')
      }
    } catch (error) {
      console.error('Excel解析错误:', error)
      ElMessage.error('Excel文件解析失败: ' + error.message)
    }
  }
  reader.readAsArrayBuffer(file)
}

// 标准化行数据
const normalizeRowData = (row) => {
  // 日期归一化工具，返回 'YYYY-MM-DD' 或空字符串
  const normalizeDate = (value) => {
    if (value === undefined || value === null || value === '') return ''
    // 处理 Excel 序列号
    if (typeof value === 'number') {
      const date = new Date(Math.round((value - 25569) * 86400 * 1000))
      return dayjs(date).format('YYYY-MM-DD')
    }
    const s = String(value).trim()
      .replace(/[./]/g, '-')
      .replace(/年|月/g, '-')
      .replace(/日/g, '')
    // 处理仅有月-日的情况，如 '07-10'，默认补全年份为当前年份
    const mdOnly = s.match(/^\s*(\d{1,2})-(\d{1,2})\s*$/)
    if (mdOnly) {
      const y = dayjs().year()
      const mm = mdOnly[1].padStart(2, '0')
      const dd = mdOnly[2].padStart(2, '0')
      return `${y}-${mm}-${dd}`
    }
    const d = dayjs(s)
    return d.isValid() ? d.format('YYYY-MM-DD') : ''
  }

  console.log('正在标准化行数据:', row)
  
  // 根据实际Excel文件的列名进行映射
  const titleKeys = ['案例名称', '标题', 'title', '名称', '案例标题']
  const wechatLinkKeys = ['公众号链接', 'wechatLink', '公众号地址', 'account_link']
  const componentsKeys = ['使用组件', '组件', 'components']
  const industryKeys = ['所属行业', '行业', 'industry']
  const festivalKeys = ['节日标签', '节日', 'festival']
  const extraTagsKeys = ['额外标签', '标签', 'tags', '分类']
  const memberTypeKeys = ['会员类型', '会员', 'member_type']
  const wechatNameKeys = ['公众号名称', 'wechatName', 'account_name']
  const publishDateKeys = ['发布时间', 'publishDate', '发布日期', 'date']
  const authorKeys = ['填写人', 'author', 'created_by']

  const findValue = (keys) => {
    for (const key of keys) {
      if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
        return String(row[key]).trim()
      }
    }
    return ''
  }

  // 获取各个字段的值
  const title = findValue(titleKeys)
  const wechatLink = findValue(wechatLinkKeys)
  const components = findValue(componentsKeys)
  const industry = findValue(industryKeys)
  const festival = findValue(festivalKeys)
  const extraTags = findValue(extraTagsKeys)
  const memberType = findValue(memberTypeKeys)
  const wechatName = findValue(wechatNameKeys)
  const rawPublishDate = findValue(publishDateKeys)
  const publishDate = normalizeDate(rawPublishDate)
  const author = findValue(authorKeys)

  // 处理额外标签 - 只使用真正的额外标签，不包含行业、节日、会员类型
  const processedExtraTags = extraTags ? extraTags.split(/[、,，]/).map(tag => tag.trim()).filter(Boolean) : []
  
  // 构建描述信息
  const description = components ? `使用组件: ${components}` : ''

  // 处理组件字段 - 支持顿号、逗号、分号等分隔符
  let componentArray = []
  if (components) {
    // 先尝试顿号分隔，再尝试逗号分隔
    if (components.includes('、')) {
      componentArray = components.split('、').map(comp => comp.trim()).filter(Boolean)
    } else if (components.includes(',')) {
      componentArray = components.split(',').map(comp => comp.trim()).filter(Boolean)
    } else if (components.includes('，')) {
      componentArray = components.split('，').map(comp => comp.trim()).filter(Boolean)
    } else {
      // 如果没有分隔符，作为单个组件
      componentArray = [components.trim()].filter(Boolean)
    }
  }

  const result = {
     title: title,
     wechat_name: wechatName || '',
     wechat_link: wechatLink,
     case_link: wechatLink, // 使用公众号链接作为案例链接
     // 与云端数据库字段类型保持一致（TEXT[]），只存储额外标签
     tags: processedExtraTags,
     components: componentArray,
     description: description,
     industry: industry || '',
     holiday: festival || '',
     member_type: memberType || '',
     publish_date: publishDate || null,
     created_by: author || '',
     createdAt: new Date().toISOString()
   }
  
  console.log('标准化结果:', result)
  return result
}

// 导入数据到云端
const importData = async () => {
  if (parsedData.value.length === 0) {
    ElMessage.warning('没有数据可以导入')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确认导入 ${parsedData.value.length} 条数据到云端数据库吗？`,
      '确认导入',
      {
        confirmButtonText: '确定导入',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    importing.value = true
    importResult.value = null

    console.log('开始导入数据，总数:', parsedData.value.length);
    console.log('解析后的数据:', parsedData.value);

    // 获取现有数据，用于去重
    const existingData = await StorageManager.getCloudData()
    console.log('现有云端数据:', existingData);
    const existingTitles = new Set(existingData.map(item => item.title))
    const existingByTitle = new Map(existingData.map(item => [item.title, item]))

    let imported = 0
    let updated = 0
    let skipped = 0

    for (const item of parsedData.value) {
      console.log('正在处理数据项:', item);
      
      if (!item.title) {
        console.log('跳过：没有标题的数据项');
        continue;
      }

      if (existingTitles.has(item.title)) {
        const existing = existingByTitle.get(item.title)
        const newLink = item.wechat_link || item.case_link
        const oldLink = (existing?.wechat_link) || (existing?.case_link)
        // 如果云端该条记录缺链接，而导入数据有链接，则执行补齐更新
        if (!oldLink && newLink) {
          try {
            const patchCaseData = {
              title: existing.title,
              description: existing.description || '',
              industry: existing.industry || '',
              memberType: existing.member_type || '',
              holiday: existing.holiday || '',
              components: Array.isArray(existing.components) ? existing.components : (typeof existing.components === 'string' ? existing.components.split(/[、,，]/).map(s => s.trim()).filter(Boolean) : []),
              tags: Array.isArray(existing.tags) ? existing.tags : (typeof existing.tags === 'string' ? existing.tags.split(',').map(t => t.trim()).filter(Boolean) : []),
              publishDate: existing.publish_date || '',
              wechatName: existing.wechat_name || '',
              wechatLink: item.wechat_link || existing.wechat_link || '',
              caseLink: item.case_link || existing.case_link || '',
              author: existing.created_by || ''
            }
            await StorageManager.updateCase(existing.id, patchCaseData)
            console.log('补齐公众号链接成功:', existing.title)
            updated++
          } catch (e) {
            console.error('补齐链接失败:', e)
            skipped++
          }
        } else {
          console.log('跳过：重复的标题', item.title);
          skipped++
        }
        continue
      }

      try {
        console.log('准备保存到云端:', item);
        await StorageManager.saveToCloud(item)
        console.log('成功保存:', item.title);
        imported++
        existingTitles.add(item.title)
        existingByTitle.set(item.title, item)
      } catch (error) {
        console.error('导入单条数据失败:', error)
      }
    }

    importResult.value = {
      success: true,
      imported,
      updated,
      skipped
    }

    // 刷新数据统计
    await loadDataCounts()
    
    ElMessage.success(`导入完成！新导入 ${imported} 条，更新补齐 ${updated} 条${skipped > 0 ? `，跳过 ${skipped} 条重复数据` : ''}`)
    
    // 清空导入数据
    clearImportData()
  } catch (error) {
    if (error !== 'cancel') {
      importResult.value = {
        success: false,
        error: error.message
      }
      ElMessage.error('导入失败：' + error.message)
    }
  } finally {
    importing.value = false
  }
}

// 清空导入数据
const clearImportData = () => {
  parsedData.value = []
  fileList.value = []
  uploadRef.value?.clearFiles()
}

// 检查云端连接
const checkConnection = async () => {
  checking.value = true
  try {
    const result = await StorageManager.testConnection()
    connectionStatus.value = result
    if (result) {
      ElMessage.success('云端连接正常')
      await loadDataCounts()
    } else {
      ElMessage.error('云端连接失败，请检查网络或配置')
    }
  } catch (error) {
    connectionStatus.value = false
    ElMessage.error('检查连接时出错：' + error.message)
  } finally {
    checking.value = false
  }
}

// 加载数据统计
const loadDataCounts = async () => {
  try {
    localDataCount.value = await StorageManager.getLocalDataCount()
    cloudDataCount.value = await StorageManager.getCloudDataCount()
  } catch (error) {
    console.error('获取云端数据数量失败:', error)
  }
}

// 开始迁移
const startMigration = async () => {
  if (localDataCount.value === 0) {
    ElMessage.info('没有本地数据需要迁移')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确认将 ${localDataCount.value} 条本地数据迁移到云端吗？`,
      '确认迁移',
      {
        confirmButtonText: '确定迁移',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    migrating.value = true
    migrationResult.value = null
    
    const result = await StorageManager.migrateToCloud()
    
    migrationResult.value = result
    
    if (result.success) {
      await loadDataCounts()
    } else {
      ElMessage.error('迁移失败：' + result.error)
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('迁移过程中出错：' + error.message)
    }
  } finally {
    migrating.value = false
  }
}

// 创建备份
const createBackup = async () => {
  backing.value = true
  try {
    await StorageManager.createBackup()
    ElMessage.success('备份创建成功')
  } catch (error) {
    ElMessage.error('创建备份失败：' + error.message)
  } finally {
    backing.value = false
    await checkBackupStatus()
  }
}

// 恢复备份
const restoreBackup = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要从备份恢复数据吗？这将覆盖当前的本地数据。',
      '确认恢复',
      {
        confirmButtonText: '确定恢复',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const success = await StorageManager.restoreFromBackup()
    
    if (success) {
      await loadDataCounts()
      ElMessage.success('数据恢复成功')
    } else {
      ElMessage.error('没有可用的备份数据')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('恢复备份失败：' + error.message)
    }
  }
}

// 检查备份状态
const checkBackupStatus = async () => {
  try {
    const backupInfo = await StorageManager.getBackupInfo()
    hasBackup.value = backupInfo.hasBackup
    lastBackupDate.value = backupInfo.lastBackupDate
  } catch (error) {
    hasBackup.value = false
    lastBackupDate.value = ''
  }
}

// 组件挂载时初始化
onMounted(async () => {
  await checkConnection()
  await checkBackupStatus()
})
</script>

<style scoped>
.data-migration {
  padding: 20px;
}

.migration-card {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

.migration-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.status-section h4,
.migration-section h4,
.file-import-section h4,
.backup-section h4 {
  margin-bottom: 15px;
  color: #303133;
  border-bottom: 2px solid #e4e7ed;
  padding-bottom: 8px;
}

.status-item {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.status-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.status-value {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
}

.migration-info,
.import-info {
  margin-bottom: 20px;
}

.migration-actions,
.import-actions,
.backup-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.migration-result,
.import-result {
  margin-top: 20px;
}

.file-upload-area {
  margin: 20px 0;
}

.upload-demo {
  width: 100%;
}

.data-preview {
  margin: 20px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.data-preview h5 {
  margin-bottom: 15px;
  color: #303133;
}

.preview-note {
  margin-top: 10px;
  font-size: 12px;
  color: #909399;
  text-align: center;
}

.backup-info {
  margin-bottom: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.backup-info p {
  margin: 0;
  color: #606266;
}

@media (max-width: 768px) {
  .migration-actions,
  .import-actions,
  .backup-actions {
    flex-direction: column;
  }
  
  .migration-actions .el-button,
  .import-actions .el-button,
  .backup-actions .el-button {
    width: 100%;
  }
}
</style>