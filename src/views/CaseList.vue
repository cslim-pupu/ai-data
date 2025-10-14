<template>
  <div class="case-list">
    <!-- 操作栏 -->
    <el-card class="operation-card">
      <div class="operation-bar">
        <div class="filters">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索图文标题、组件、标签..."
            style="width: 300px; margin-right: 10px"
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          
          <el-select
            v-model="filters.industry"
            placeholder="选择行业"
            clearable
            filterable
            style="width: 120px; margin-right: 10px;"
            @change="handleFilter"
          >
            <el-option label="工业" value="工业" />
            <el-option label="珠宝" value="珠宝" />
            <el-option label="教育" value="教育" />
            <el-option label="高校" value="高校" />
            <el-option label="餐饮" value="餐饮" />
            <el-option label="零售" value="零售" />
            <el-option label="政务" value="政务" />
            <el-option label="媒体" value="媒体" />
            <el-option label="快消" value="快消" />
            <el-option label="3C数码" value="3C数码" />
            <el-option label="奢侈品" value="奢侈品" />
            <el-option label="美妆" value="美妆" />
            <el-option label="医疗健康" value="医疗健康" />
            <el-option label="金融" value="金融" />
            <el-option label="房地产" value="房地产" />
            <el-option label="汽车" value="汽车" />
            <el-option label="旅游" value="旅游" />
            <el-option label="体育" value="体育" />
            <el-option label="娱乐" value="娱乐" />
            <el-option label="科技" value="科技" />
            <el-option label="服装" value="服装" />
            <el-option label="家居" value="家居" />
            <el-option label="母婴" value="母婴" />
            <el-option label="宠物" value="宠物" />
            <el-option label="其他" value="其他" />
          </el-select>

          <el-select
            v-model="filters.memberType"
            placeholder="选择会员类型"
            clearable
            style="width: 140px; margin-right: 10px;"
            @change="handleFilter"
          >
            <el-option label="普通会员" value="普通会员" />
            <el-option label="专业会员" value="专业会员" />
            <el-option label="企业会员" value="企业会员" />
          </el-select>

          <el-select
            v-model="filters.holiday"
            placeholder="选择节日"
            clearable
            style="width: 120px; margin-right: 10px;"
            @change="handleFilter"
          >
            <el-option label="元旦" value="元旦" />
            <el-option label="春节" value="春节" />
            <el-option label="中秋" value="中秋" />
            <el-option label="国庆" value="国庆" />
            <el-option label="无特定节日" value="无特定节日" />
          </el-select>

          <el-button @click="clearFilters">清空筛选</el-button>
        </div>

        <div class="actions">
          <el-button type="primary" @click="$router.push('/form')">
            <el-icon><Plus /></el-icon>
            添加案例
          </el-button>
          
          <el-dropdown @command="handleExport">
            <el-button type="success">
              导出数据
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="excel">导出为 Excel</el-dropdown-item>
                <el-dropdown-item command="csv">导出为 CSV</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-card>

    <!-- 数据统计面板 -->
    <div class="statistics-panel">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-item">
              <div class="stat-value">{{ totalCases }}</div>
              <div class="stat-label">总案例数</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-item">
              <div class="stat-value">{{ industryCount }}</div>
              <div class="stat-label">涉及行业</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-item">
              <div class="stat-value">{{ componentCount }}</div>
              <div class="stat-label">使用组件</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-item">
              <div class="stat-value">{{ recentCases }}</div>
              <div class="stat-label">本月新增</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      
      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="12">
          <el-card>
            <template #header>
              <span>行业分布</span>
            </template>
            <div class="chart-container">
              <div v-for="item in industryStats" :key="item.name" class="chart-item">
                <div class="chart-label">{{ item.name }}</div>
                <div class="chart-bar">
                  <div class="chart-progress" :style="{ width: item.percentage + '%' }"></div>
                </div>
                <div class="chart-value">{{ item.count }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <template #header>
              <span>热门组件</span>
            </template>
            <div class="chart-container">
              <div v-for="item in componentStats" :key="item.name" class="chart-item">
                <div class="chart-label">{{ item.name }}</div>
                <div class="chart-bar">
                  <div class="chart-progress" :style="{ width: item.percentage + '%' }"></div>
                </div>
                <div class="chart-value">{{ item.count }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 筛选结果统计 -->
    <el-card class="stats-card">
      <div class="stats">
        <div class="stat-item">
          <span class="stat-label">筛选结果：</span>
          <span class="stat-value">{{ filteredList.length }}</span>
        </div>
      </div>
    </el-card>

    <!-- 案例列表 -->
    <el-card class="list-card">
      <el-table
        :data="paginatedList"
        style="width: 100%"
        stripe
        border
        v-loading="loading"
      >
        <el-table-column prop="caseName" label="图文标题" width="200" show-overflow-tooltip />
        <el-table-column prop="wechatName" label="公众号名称" width="150" show-overflow-tooltip />
        <el-table-column prop="industry" label="行业" width="100" />
        <el-table-column prop="memberType" label="会员类型" width="120" />
        <el-table-column prop="publishDate" label="发布时间" width="100" />
        <el-table-column prop="holiday" label="节日" width="100" />
        <el-table-column prop="author" label="填写人" width="100" />
        <el-table-column prop="createTime" label="创建时间" width="160" />
        
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="viewDetail(row)">详情</el-button>
            <el-button size="small" type="primary" @click="editCase(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteCase(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredList.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="案例详情"
      width="60%"
      :before-close="handleCloseDetail"
    >
      <div v-if="currentCase" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="图文标题">{{ currentCase.caseName }}</el-descriptions-item>
          <el-descriptions-item label="所属行业">{{ currentCase.industry }}</el-descriptions-item>
          <el-descriptions-item label="会员类型">{{ currentCase.memberType }}</el-descriptions-item>
          <el-descriptions-item label="发布时间">{{ currentCase.publishDate }}</el-descriptions-item>
          <el-descriptions-item label="节日标签">{{ currentCase.holiday }}</el-descriptions-item>
          <el-descriptions-item label="填写人">{{ currentCase.author }}</el-descriptions-item>
          <el-descriptions-item label="公众号名称" :span="2">{{ currentCase.wechatName }}</el-descriptions-item>
          <el-descriptions-item label="公众号链接" :span="2">
            <el-link :href="currentCase.wechatLink" target="_blank" type="primary">
              {{ currentCase.wechatLink }}
            </el-link>
          </el-descriptions-item>
          <el-descriptions-item label="使用组件" :span="2">{{ currentCase.components }}</el-descriptions-item>
          <el-descriptions-item label="额外标签" :span="2">{{ currentCase.tags }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentCase.createTime }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ currentCase.updateTime || '未更新' }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="editVisible"
      title="编辑案例"
      width="70%"
      :before-close="handleCloseEdit"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="rules"
        label-width="120px"
        v-if="editVisible"
      >
      <el-form-item label="图文标题" prop="caseName">
            <el-input v-model="editForm.caseName" placeholder="请输入图文标题" />
          </el-form-item>
        <el-form-item label="公众号链接" prop="wechatLink">
          <el-input v-model="editForm.wechatLink" />
        </el-form-item>
        <el-form-item label="使用组件" prop="components">
          <el-input v-model="editForm.components" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="所属行业" prop="industry">
            <el-select v-model="editForm.industry" style="width: 100%" filterable>
              <el-option label="工业" value="工业" />
              <el-option label="珠宝" value="珠宝" />
              <el-option label="教育" value="教育" />
              <el-option label="高校" value="高校" />
              <el-option label="餐饮" value="餐饮" />
              <el-option label="零售" value="零售" />
              <el-option label="政务" value="政务" />
              <el-option label="媒体" value="媒体" />
              <el-option label="快消" value="快消" />
              <el-option label="3C数码" value="3C数码" />
              <el-option label="奢侈品" value="奢侈品" />
              <el-option label="美妆" value="美妆" />
              <el-option label="医疗健康" value="医疗健康" />
              <el-option label="金融" value="金融" />
              <el-option label="房地产" value="房地产" />
              <el-option label="汽车" value="汽车" />
              <el-option label="旅游" value="旅游" />
              <el-option label="体育" value="体育" />
              <el-option label="娱乐" value="娱乐" />
              <el-option label="科技" value="科技" />
              <el-option label="服装" value="服装" />
              <el-option label="家居" value="家居" />
              <el-option label="母婴" value="母婴" />
              <el-option label="宠物" value="宠物" />
              <el-option label="其他" value="其他" />
            </el-select>
          </el-form-item>
        <el-form-item label="发布时间" prop="publishDate">
          <el-date-picker
            v-model="editForm.publishDate"
            type="date"
            format="MM-DD"
            value-format="MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="节日标签" prop="holiday">
          <el-select v-model="editForm.holiday" style="width: 100%">
            <el-option label="元旦" value="元旦" />
            <el-option label="春节" value="春节" />
            <el-option label="中秋" value="中秋" />
            <el-option label="国庆" value="国庆" />
            <el-option label="无特定节日" value="无特定节日" />
          </el-select>
        </el-form-item>
        <el-form-item label="会员类型" prop="memberType">
          <el-select v-model="editForm.memberType" style="width: 100%">
            <el-option label="普通会员" value="普通会员" />
            <el-option label="专业会员" value="专业会员" />
            <el-option label="企业会员" value="企业会员" />
          </el-select>
        </el-form-item>
        <el-form-item label="额外标签" prop="tags">
          <el-input v-model="editForm.tags" />
        </el-form-item>
        <el-form-item label="填写人" prop="author">
          <el-input v-model="editForm.author" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取消</el-button>
          <el-button type="primary" @click="saveEdit" :loading="saveLoading">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, ArrowDown } from '@element-plus/icons-vue'
import { StorageManager } from '../utils/storage.js'
import { ExportManager } from '../utils/export.js'

export default {
  name: 'CaseList',
  components: {
    Plus,
    ArrowDown
  },
  setup() {
    const loading = ref(false)
    const saveLoading = ref(false)
    const caseList = ref([])
    const searchKeyword = ref('')
    const currentPage = ref(1)
    const pageSize = ref(20)
    
    // 筛选条件
    const filters = reactive({
      industry: '',
      memberType: '',
      holiday: ''
    })

    // 详情对话框
    const detailVisible = ref(false)
    const currentCase = ref(null)

    // 编辑对话框
    const editVisible = ref(false)
    const editFormRef = ref()
    const editForm = reactive({
      id: '',
      caseName: '',
      wechatLink: '',
      components: '',
      industry: '',
      publishDate: '',
      holiday: '',
      memberType: '',
      tags: '',
      author: ''
    })

    // 表单验证规则
    const rules = {
      caseName: [{ required: true, message: '请输入案例名称', trigger: 'blur' }],
      wechatLink: [
        { required: true, message: '请输入公众号链接', trigger: 'blur' },
        { type: 'url', message: '请输入正确的链接格式', trigger: 'blur' }
      ],
      components: [{ required: true, message: '请输入使用的组件', trigger: 'blur' }],
      industry: [{ required: true, message: '请选择所属行业', trigger: 'change' }],
      publishDate: [{ required: true, message: '请选择发布时间', trigger: 'change' }],
      holiday: [{ required: true, message: '请选择节日标签', trigger: 'change' }],
      memberType: [{ required: true, message: '请选择会员类型', trigger: 'change' }],
      tags: [{ required: true, message: '请输入额外标签', trigger: 'blur' }],
      author: [{ required: true, message: '请输入填写人姓名', trigger: 'blur' }]
    }

    // 计算属性
    // 统计数据计算
      const totalCases = computed(() => caseList.value.length)
      
      const industryCount = computed(() => {
        const industries = new Set(caseList.value.map(item => item.industry).filter(Boolean))
        return industries.size
      })
      
      const componentCount = computed(() => {
        const components = new Set()
        caseList.value.forEach(item => {
          if (item.components) {
            item.components.split(',').forEach(comp => {
              components.add(comp.trim())
            })
          }
        })
        return components.size
      })
      
      const recentCases = computed(() => {
        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()
        
        return caseList.value.filter(item => {
          if (!item.createTime) return false
          const createDate = new Date(item.createTime)
          return createDate.getMonth() === currentMonth && createDate.getFullYear() === currentYear
        }).length
      })
      
      // 行业分布统计
      const industryStats = computed(() => {
        const industryMap = {}
        caseList.value.forEach(item => {
          if (item.industry) {
            industryMap[item.industry] = (industryMap[item.industry] || 0) + 1
          }
        })
        
        const stats = Object.entries(industryMap)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 8) // 只显示前8个
        
        const maxCount = Math.max(...stats.map(item => item.count))
        return stats.map(item => ({
          ...item,
          percentage: maxCount > 0 ? (item.count / maxCount) * 100 : 0
        }))
      })
      
      // 组件使用统计
      const componentStats = computed(() => {
        const componentMap = {}
        caseList.value.forEach(item => {
          if (item.components) {
            item.components.split(',').forEach(comp => {
              const component = comp.trim()
              if (component) {
                componentMap[component] = (componentMap[component] || 0) + 1
              }
            })
          }
        })
        
        const stats = Object.entries(componentMap)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 8) // 只显示前8个
        
        const maxCount = Math.max(...stats.map(item => item.count))
        return stats.map(item => ({
          ...item,
          percentage: maxCount > 0 ? (item.count / maxCount) * 100 : 0
        }))
      })

    const filteredList = computed(() => {
      let result = [...caseList.value]
      
      // 全局搜索
      if (searchKeyword.value) {
        const keyword = searchKeyword.value.toLowerCase()
        result = result.filter(item => 
          item.caseName.toLowerCase().includes(keyword) ||
          item.components.toLowerCase().includes(keyword) ||
          item.tags.toLowerCase().includes(keyword) ||
          item.holiday.toLowerCase().includes(keyword)
        )
      }
      
      if (filters.industry) {
        result = result.filter(item => item.industry === filters.industry)
      }
      if (filters.memberType) {
        result = result.filter(item => item.memberType === filters.memberType)
      }
      if (filters.holiday) {
        result = result.filter(item => item.holiday === filters.holiday)
      }
      
      return result
    })

    const paginatedList = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return filteredList.value.slice(start, end)
    })

    // 方法
    const loadData = () => {
      loading.value = true
      try {
        caseList.value = StorageManager.getCaseList()
      } catch (error) {
        ElMessage.error('加载数据失败')
      } finally {
        loading.value = false
      }
    }

    const handleSearch = () => {
      currentPage.value = 1
    }

    const handleFilter = () => {
      currentPage.value = 1
    }

    const clearFilters = () => {
      filters.industry = ''
      filters.memberType = ''
      filters.holiday = ''
      currentPage.value = 1
    }

    const handleSizeChange = (val) => {
      pageSize.value = val
      currentPage.value = 1
    }

    const handleCurrentChange = (val) => {
      currentPage.value = val
    }

    const viewDetail = (row) => {
      currentCase.value = row
      detailVisible.value = true
    }

    const handleCloseDetail = () => {
      detailVisible.value = false
      currentCase.value = null
    }

    const editCase = (row) => {
      Object.assign(editForm, row)
      editVisible.value = true
    }

    const handleCloseEdit = () => {
      editVisible.value = false
      if (editFormRef.value) {
        editFormRef.value.resetFields()
      }
    }

    const saveEdit = async () => {
      if (!editFormRef.value) return
      
      try {
        await editFormRef.value.validate()
        saveLoading.value = true
        
        // 检查公众号链接是否与其他案例重复（排除当前编辑的案例）
        const existingCases = StorageManager.getCaseList()
        const isDuplicate = existingCases.some(existingCase => 
          existingCase.wechatLink === editForm.wechatLink && existingCase.id !== editForm.id
        )
        
        if (isDuplicate) {
          ElMessage.error('该公众号链接已存在，请检查是否重复录入')
          return
        }
        
        const updatedCase = StorageManager.updateCase(editForm.id, editForm)
        if (updatedCase) {
          loadData()
          ElMessage.success('案例更新成功')
          editVisible.value = false
        } else {
          ElMessage.error('更新失败')
        }
      } catch (error) {
        ElMessage.error('请完善表单信息')
      } finally {
        saveLoading.value = false
      }
    }

    const deleteCase = (caseItem) => {
      ElMessageBox.confirm(
        `确定要删除图文标题为"${caseItem.caseName}"的案例吗？删除后无法恢复。`,
        '删除确认',
        {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: 'el-button--danger'
        }
      ).then(() => {
        StorageManager.deleteCase(caseItem.id)
        ElMessage.success('案例删除成功！')
        loadData()
      }).catch(() => {
        ElMessage.info('已取消删除')
      })
    }

    const handleExport = (command) => {
      try {
        const filename = ExportManager.exportFilteredData(
          caseList.value,
          filters,
          command,
          '案例数据'
        )
        ElMessage.success(`导出成功：${filename}`)
      } catch (error) {
        ElMessage.error('导出失败：' + error.message)
      }
    }

    // 生命周期
    onMounted(() => {
      loadData()
    })

    return {
      loading,
      saveLoading,
      caseList,
      searchKeyword,
      currentPage,
      pageSize,
      filters,
      detailVisible,
      currentCase,
      editVisible,
      editFormRef,
      editForm,
      rules,
      totalCases,
      industryCount,
      componentCount,
      recentCases,
      industryStats,
      componentStats,
      filteredList,
      paginatedList,
      loadData,
      handleSearch,
      handleFilter,
      clearFilters,
      handleSizeChange,
      handleCurrentChange,
      viewDetail,
      handleCloseDetail,
      editCase,
      handleCloseEdit,
      saveEdit,
      deleteCase,
      handleExport
    }
  }
}
</script>

<style scoped>
.case-list {
  padding: 20px;
}

.operation-card {
  margin-bottom: 20px;
}

.operation-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.actions {
  display: flex;
  gap: 10px;
}

.statistics-panel {
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
}

.stat-item {
  padding: 10px;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.chart-container {
  padding: 10px 0;
}

.chart-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 10px;
}

.chart-label {
  width: 80px;
  font-size: 12px;
  color: #606266;
  text-align: right;
  flex-shrink: 0;
}

.chart-bar {
  flex: 1;
  height: 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
  overflow: hidden;
}

.chart-progress {
  height: 100%;
  background: linear-gradient(90deg, #409EFF, #67C23A);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.chart-value {
  width: 30px;
  font-size: 12px;
  color: #409EFF;
  font-weight: bold;
  text-align: center;
  flex-shrink: 0;
}

.stats-card {
  margin-bottom: 20px;
}

.stats {
  display: flex;
  gap: 30px;
}

.stat-item {
  display: flex;
  align-items: center;
}

.stat-label {
  color: #606266;
  margin-right: 5px;
}

.stat-value {
  font-weight: bold;
  color: #409EFF;
  font-size: 18px;
}

.list-card {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.detail-content {
  max-height: 60vh;
  overflow-y: auto;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@media (max-width: 768px) {
  .operation-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filters {
    justify-content: center;
  }
  
  .actions {
    justify-content: center;
  }
}
</style>