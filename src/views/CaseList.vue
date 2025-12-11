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
            <el-option label="自媒体" value="自媒体" />
            <el-option label="艺术设计" value="艺术设计" />
            <el-option label="潮玩" value="潮玩" />
            <el-option label="酒类" value="酒类" />
            <el-option label="食品" value="食品" />
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
            <el-option label="元宵节" value="元宵节" />
            <el-option label="情人节" value="情人节" />
            <el-option label="妇女节" value="妇女节" />
            <el-option label="植树节" value="植树节" />
            <el-option label="愚人节" value="愚人节" />
            <el-option label="清明节" value="清明节" />
            <el-option label="劳动节" value="劳动节" />
            <el-option label="青年节" value="青年节" />
            <el-option label="母亲节" value="母亲节" />
            <el-option label="儿童节" value="儿童节" />
            <el-option label="端午节" value="端午节" />
            <el-option label="父亲节" value="父亲节" />
            <el-option label="建党节" value="建党节" />
            <el-option label="建军节" value="建军节" />
            <el-option label="七夕节" value="七夕节" />
            <el-option label="中秋节" value="中秋节" />
            <el-option label="教师节" value="教师节" />
            <el-option label="国庆节" value="国庆节" />
            <el-option label="重阳节" value="重阳节" />
            <el-option label="万圣节" value="万圣节" />
            <el-option label="感恩节" value="感恩节" />
            <el-option label="圣诞节" value="圣诞节" />
            <el-option label="双十一" value="双十一" />
            <el-option label="双十二" value="双十二" />
            <el-option label="618购物节" value="618购物节" />
            <el-option label="无特定节日" value="无特定节日" />
          </el-select>

          <el-select
            v-model="filters.month"
            placeholder="选择月份"
            clearable
            style="width: 120px; margin-right: 10px;"
            @change="handleFilter"
          >
            <el-option label="1月" value="1" />
            <el-option label="2月" value="2" />
            <el-option label="3月" value="3" />
            <el-option label="4月" value="4" />
            <el-option label="5月" value="5" />
            <el-option label="6月" value="6" />
            <el-option label="7月" value="7" />
            <el-option label="8月" value="8" />
            <el-option label="9月" value="9" />
            <el-option label="10月" value="10" />
            <el-option label="11月" value="11" />
            <el-option label="12月" value="12" />
          </el-select>

          <el-button @click="clearFilters">清空筛选</el-button>
        </div>

        <div class="actions">
          <el-button 
            type="danger" 
            :disabled="selectedRows.length === 0"
            @click="handleBatchDelete"
            style="margin-right: 10px"
          >
            <el-icon><Delete /></el-icon>
            批量删除
          </el-button>

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
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
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
          <el-descriptions-item label="使用组件" :span="2">{{ toText(currentCase.components) }}</el-descriptions-item>
          <el-descriptions-item label="额外标签" :span="2">{{ toText(currentCase.tags) }}</el-descriptions-item>
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
        <el-form-item label="公众号名称" prop="wechatName">
          <el-input v-model="editForm.wechatName" />
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
              <el-option label="自媒体" value="自媒体" />
              <el-option label="艺术设计" value="艺术设计" />
              <el-option label="潮玩" value="潮玩" />
              <el-option label="酒类" value="酒类" />
              <el-option label="食品" value="食品" />
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
          <el-select v-model="editForm.holiday" style="width: 100%" filterable allow-create default-first-option>
            <el-option label="元旦" value="元旦" />
            <el-option label="春节" value="春节" />
            <el-option label="元宵节" value="元宵节" />
            <el-option label="情人节" value="情人节" />
            <el-option label="妇女节" value="妇女节" />
            <el-option label="植树节" value="植树节" />
            <el-option label="愚人节" value="愚人节" />
            <el-option label="清明节" value="清明节" />
            <el-option label="劳动节" value="劳动节" />
            <el-option label="青年节" value="青年节" />
            <el-option label="母亲节" value="母亲节" />
            <el-option label="儿童节" value="儿童节" />
            <el-option label="端午节" value="端午节" />
            <el-option label="父亲节" value="父亲节" />
            <el-option label="建党节" value="建党节" />
            <el-option label="建军节" value="建军节" />
            <el-option label="七夕节" value="七夕节" />
            <el-option label="中秋节" value="中秋节" />
            <el-option label="教师节" value="教师节" />
            <el-option label="国庆节" value="国庆节" />
            <el-option label="重阳节" value="重阳节" />
            <el-option label="万圣节" value="万圣节" />
            <el-option label="感恩节" value="感恩节" />
            <el-option label="圣诞节" value="圣诞节" />
            <el-option label="双十一" value="双十一" />
            <el-option label="双十二" value="双十二" />
            <el-option label="618购物节" value="618购物节" />
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
import { Search, Plus, ArrowDown, Delete } from '@element-plus/icons-vue'
import { StorageManager } from '../utils/storage'
import { ExportManager } from '../utils/export'

export default {
  name: 'CaseList',
  components: {
    Search,
    Plus,
    ArrowDown,
    Delete
  },
  setup() {
    const loading = ref(false)
    const saveLoading = ref(false)
    const caseList = ref([])
    const searchKeyword = ref('')
    const currentPage = ref(1)
    const pageSize = ref(20)
    const selectedRows = ref([])
    
    // 筛选条件
    const filters = reactive({
      industry: '',
      memberType: '',
      holiday: '',
      month: ''
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
      wechatName: '',
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
      wechatName: [
        { required: true, message: '请输入公众号名称', trigger: 'blur' },
        { min: 2, max: 50, message: '公众号名称长度在 2 到 50 个字符', trigger: 'blur' }
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
    // 统计数据计算 - 基于筛选后的数据
    
    // 统一解析组件字段，兼容数组或用顿号分隔的字符串
    const parseComponents = (val) => {
      if (!val) return []
      if (Array.isArray(val)) return val.map(c => String(c).trim()).filter(Boolean)
      if (typeof val === 'string') return val.split('、').map(c => c.trim()).filter(Boolean)
      return []
    }
    
    const toText = (val) => {
      if (!val) return ''
      if (Array.isArray(val)) return val.map(v => String(v).trim()).filter(Boolean).join('、')
      return String(val)
    }
    
    const totalCases = computed(() => filteredList.value.length)
    
    const industryCount = computed(() => {
      const industries = new Set(filteredList.value.map(item => item.industry).filter(Boolean))
      return industries.size
    })
    
    const componentCount = computed(() => {
      const components = new Set()
      filteredList.value.forEach(item => {
        const list = parseComponents(item.components)
        list.forEach(comp => {
          components.add(comp)
        })
      })
      return components.size
    })
    
    const recentCases = computed(() => {
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()
      
      return filteredList.value.filter(item => {
        if (!item.createTime) return false
        const createDate = new Date(item.createTime)
        return createDate.getMonth() === currentMonth && createDate.getFullYear() === currentYear
      }).length
    })
    
    // 行业分布统计 - 基于筛选后的数据
    const industryStats = computed(() => {
      const industryMap = {}
      filteredList.value.forEach(item => {
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
    
    // 组件使用统计 - 基于筛选后的数据
    const componentStats = computed(() => {
      const componentMap = {}
      filteredList.value.forEach(item => {
        const list = parseComponents(item.components)
        list.forEach(comp => {
          const component = comp.trim()
          if (component) {
            componentMap[component] = (componentMap[component] || 0) + 1
          }
        })
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
          toText(item.caseName).toLowerCase().includes(keyword) ||
          toText(item.components).toLowerCase().includes(keyword) ||
          toText(item.tags).toLowerCase().includes(keyword) ||
          toText(item.holiday).toLowerCase().includes(keyword)
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
      if (filters.month) {
        result = result.filter(item => {
          // 优先使用发布时间，如果没有则使用创建时间
          const dateToCheck = item.publishDate || item.createTime
          if (dateToCheck) {
            const date = new Date(dateToCheck)
            const month = date.getMonth() + 1 // getMonth()返回0-11，需要+1
            return month.toString() === filters.month
          }
          return false
        })
      }
      
      return result
    })

    const paginatedList = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return filteredList.value.slice(start, end)
    })

    const handleSelectionChange = (val) => {
      selectedRows.value = val
    }

    const handleBatchDelete = () => {
      if (selectedRows.value.length === 0) return

      ElMessageBox.confirm(
        `确定要删除选中的 ${selectedRows.value.length} 条案例吗？此操作不可恢复！`,
        '批量删除警告',
        {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(async () => {
        loading.value = true
        try {
          const ids = selectedRows.value.map(row => row.id)
          await StorageManager.batchDeleteCases(ids)
          ElMessage.success('批量删除成功')
          await loadData()
          selectedRows.value = []
        } catch (error) {
          console.error('批量删除失败:', error)
          ElMessage.error('删除失败，请重试')
        } finally {
          loading.value = false
        }
      }).catch(() => {
        // 取消删除
      })
    }
    
    // 方法
    const loadData = async () => {
      loading.value = true
      try {
        const data = await StorageManager.getCaseList()
        // 统一字段映射，确保表格列有值
        caseList.value = (data || []).map(item => ({
          ...item,
          caseName: item.caseName || item.title || '',
          wechatName: item.wechatName || item.wechat_name || '',
          publishDate: item.publishDate || item.publish_date || '',
          author: item.author || item.created_by || ''
        }))
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
      filters.month = ''
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
      const normalized = {
        ...row,
        components: Array.isArray(row.components) ? row.components.join('、') : (row.components || ''),
        tags: Array.isArray(row.tags) ? row.tags.join('、') : (row.tags || ''),
        wechatName: row.wechatName || row.wechat_name || ''
      }
      Object.assign(editForm, normalized)
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
        
        console.log('=== 编辑保存调试信息 ===')
        console.log('editForm 完整数据:', JSON.stringify(editForm, null, 2))
        console.log('wechatLink:', editForm.wechatLink)
        console.log('wechatName:', editForm.wechatName)
        console.log('========================')
        
        const updatedCase = await StorageManager.updateCase(editForm.id, editForm)
        
        // 更新本地列表数据
        const index = caseList.value.findIndex(item => item.id === editForm.id)
        if (index !== -1) {
          caseList.value[index] = { ...caseList.value[index], ...updatedCase }
        }
        
        editVisible.value = false
        ElMessage.success('案例更新成功')
        
        // 刷新数据以确保同步
        await loadData()
      } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error('保存失败: ' + error.message)
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
      ).then(async () => {
        await StorageManager.deleteCase(caseItem.id)
        ElMessage.success('案例删除成功！')
        await loadData()
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
      handleExport,
      // 暴露 toText 用于模板渲染数组字段
      toText,
      selectedRows,
      handleSelectionChange,
      handleBatchDelete
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