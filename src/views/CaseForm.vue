<template>
  <div class="case-form">
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <span>填写案例数据</span>
          <el-button type="primary" @click="$router.push('/list')">查看案例列表</el-button>
        </div>
      </template>
      
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        size="large"
      >
        <!-- 图文标题 -->
        <el-form-item label="图文标题" prop="caseName">
          <el-input 
            v-model="form.caseName" 
            placeholder="填写这篇公众号文章的标题"
            @blur="checkTitleDuplicate"
            :class="{ 'input-warning': titleWarning, 'input-success': titleChecked && !titleWarning }"
            clearable
          />
          <div v-if="titleWarning" class="validation-message warning">
            <el-icon><Warning /></el-icon>
            <span>{{ titleWarning }}</span>
          </div>
          <div v-if="titleChecked && !titleWarning" class="validation-message success">
            <el-icon><CircleCheck /></el-icon>
            <span>标题可用</span>
          </div>
          <div class="form-tip">填写这篇公众号文章的标题</div>
        </el-form-item>

        <!-- 推文公众号链接 -->
        <el-form-item label="公众号链接" prop="wechatLink">
          <el-input 
            v-model="form.wechatLink" 
            placeholder="请输入公众号文章链接"
            @blur="checkLinkDuplicate"
            :class="{ 'input-warning': linkWarning, 'input-success': linkChecked && !linkWarning }"
          />
          <div class="form-actions">
            <el-button 
              type="primary" 
              size="small" 
              @click="checkBothDuplicates"
              :loading="checkingDuplicates"
            >
              验证数据
            </el-button>
            <div v-if="linkWarning" class="validation-message warning inline">
              <el-icon><Warning /></el-icon>
              <span>{{ linkWarning }}</span>
            </div>
            <div v-if="linkChecked && !linkWarning" class="validation-message success inline">
              <el-icon><CircleCheck /></el-icon>
              <span>链接可用</span>
            </div>
          </div>
        </el-form-item>

        <!-- 公众号名称 -->
        <el-form-item label="公众号名称" prop="wechatName">
          <el-input 
            v-model="form.wechatName" 
            placeholder="请输入公众号名称"
            clearable
          />
          <div class="form-tip">填写该文章所属的公众号名称</div>
        </el-form-item>

        <!-- 用到的组件 -->
        <el-form-item label="使用组件" prop="components">
          <el-input
            v-model="form.components"
            type="textarea"
            :rows="3"
            placeholder="选或填该案例用的所有组件，用顿号分开，如：点击伸长组件、无线往返伸缩器"
          />
        </el-form-item>

        <!-- 用户所属行业 -->
        <el-form-item label="所属行业" prop="industry">
          <el-select v-model="form.industry" placeholder="请选择行业" style="width: 100%" filterable>
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
            <el-option label="其他" value="其他" />
          </el-select>
          <div class="form-tip">选案例所属的行业</div>
        </el-form-item>

        <!-- 发布时间 -->
        <el-form-item label="发布时间" prop="publishDate">
          <el-date-picker
            v-model="form.publishDate"
            type="date"
            placeholder="选择发布日期"
            format="MM-DD"
            value-format="MM-DD"
            style="width: 100%"
          />
          <div class="form-tip">选发布时间（月份 + 日期）</div>
        </el-form-item>

        <!-- 节日标签 -->
        <el-form-item label="节日标签" prop="holiday">
          <el-select 
            v-model="form.holiday" 
            placeholder="请选择节日或自定义输入" 
            style="width: 100%"
            filterable
            allow-create
            default-first-option
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
          <div class="form-tip">选对应的节日，也可以自定义输入其他节日</div>
        </el-form-item>

        <!-- 会员类型 -->
        <el-form-item label="会员类型" prop="memberType">
          <el-select v-model="form.memberType" placeholder="请选择会员类型" style="width: 100%">
            <el-option label="普通会员" value="普通会员" />
            <el-option label="专业会员" value="专业会员" />
            <el-option label="企业会员" value="企业会员" />
          </el-select>
          <div class="form-tip">选制作该案例需要的会员等级</div>
        </el-form-item>

        <!-- 额外标签 -->
        <el-form-item label="额外标签" prop="tags">
          <el-input
            v-model="form.tags"
            placeholder="请输入额外标签"
            clearable
          />
          <div class="form-tip">填 1-3 个关键词，用顿号分开，如："国庆促销、节日氛围、产品展示"</div>
        </el-form-item>

        <!-- 填写人 -->
        <el-form-item label="填写人" prop="author">
          <el-input
            v-model="form.author"
            placeholder="请输入填写人姓名"
            clearable
          />
          <div class="form-tip">避免后期找不到谁填的</div>
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="loading" size="large">
            提交案例数据
          </el-button>
          <el-button @click="resetForm" size="large">重置表单</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Warning, CircleCheck } from '@element-plus/icons-vue'
import { StorageManager } from '../utils/storage.js'

export default {
  name: 'CaseForm',
  setup() {
    const formRef = ref()
    const loading = ref(false)
    
    // 验证状态
    const titleWarning = ref('')
    const titleChecked = ref(false)
    const linkWarning = ref('')
    const linkChecked = ref(false)
    const checkingDuplicates = ref(false)

    const form = reactive({
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

    // 检查标题重复
    const checkTitleDuplicate = async () => {
      if (!form.caseName.trim()) {
        titleWarning.value = ''
        titleChecked.value = false
        return
      }
      
      try {
        const existingCases = await StorageManager.getCaseList()
        console.log('检查标题重复 - 现有案例:', existingCases)
        console.log('检查标题重复 - 当前标题:', form.caseName.trim())
        
        const isDuplicate = existingCases.some(caseItem => {
          console.log('比较标题:', caseItem.caseName, '===', form.caseName.trim())
          return caseItem.caseName === form.caseName.trim()
        })
        
        console.log('标题重复检查结果:', isDuplicate)
        
        if (isDuplicate) {
          titleWarning.value = '该标题已存在，请修改'
          titleChecked.value = false
        } else {
          titleWarning.value = ''
          titleChecked.value = true
        }
      } catch (error) {
        console.error('检查标题重复时出错:', error)
      }
    }
    
    // 检查链接重复
    const checkLinkDuplicate = async () => {
      if (!form.wechatLink.trim()) {
        linkWarning.value = ''
        linkChecked.value = false
        return
      }
      
      try {
        const existingCases = await StorageManager.getCaseList()
        console.log('检查链接重复 - 现有案例:', existingCases)
        console.log('检查链接重复 - 当前链接:', form.wechatLink.trim())
        
        const isDuplicate = existingCases.some(caseItem => {
          console.log('比较链接:', caseItem.wechatLink, '===', form.wechatLink.trim())
          return caseItem.wechatLink === form.wechatLink.trim()
        })
        
        console.log('链接重复检查结果:', isDuplicate)
        
        if (isDuplicate) {
          linkWarning.value = '该链接已存在，请检查'
          linkChecked.value = false
        } else {
          linkWarning.value = ''
          linkChecked.value = true
        }
      } catch (error) {
        console.error('检查链接重复时出错:', error)
      }
    }
    
    // 手动验证所有数据
    const checkBothDuplicates = async () => {
      checkingDuplicates.value = true
      
      try {
        // 检查是否填写了必要字段
        if (!form.caseName.trim() || !form.wechatLink.trim()) {
          ElMessage.info('请先填写标题和链接')
          return
        }
        
        await Promise.all([
          checkTitleDuplicate(),
          checkLinkDuplicate()
        ])
        
        if (!titleWarning.value && !linkWarning.value) {
          ElMessage.success('验证通过，数据无重复')
        } else {
          ElMessage.warning('发现重复数据，请修改后重试')
        }
      } catch (error) {
        ElMessage.error('验证过程中出现错误')
      } finally {
        checkingDuplicates.value = false
      }
    }
    const validateWechatLink = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入公众号链接'))
        return
      }
      
      // 微信公众号链接格式验证
      const wechatLinkPattern = /^https?:\/\/(mp\.weixin\.qq\.com|weixin\.qq\.com)/
      if (!wechatLinkPattern.test(value)) {
        callback(new Error('请输入有效的微信公众号链接'))
        return
      }
      
      callback()
    }

    const rules = {
      caseName: [
        { required: true, message: '请输入图文标题', trigger: 'blur' },
        { min: 2, max: 100, message: '图文标题长度在 2 到 100 个字符', trigger: 'blur' }
      ],
      wechatLink: [
        { required: true, validator: validateWechatLink, trigger: 'blur' }
      ],
      wechatName: [
        { required: true, message: '请输入公众号名称', trigger: 'blur' },
        { min: 2, max: 50, message: '公众号名称长度在 2 到 50 个字符', trigger: 'blur' }
      ],
      components: [
        { required: true, message: '请输入使用的组件', trigger: 'blur' },
        { min: 2, max: 200, message: '使用组件长度在 2 到 200 个字符', trigger: 'blur' }
      ],
      industry: [
        { required: true, message: '请选择所属行业', trigger: 'change' }
      ],
      publishDate: [
        { required: true, message: '请选择发布时间', trigger: 'change' }
      ],
      holiday: [
        { required: true, message: '请选择节日标签', trigger: 'change' }
      ],
      memberType: [
        { required: true, message: '请选择会员类型', trigger: 'change' }
      ],
      tags: [
        { required: true, message: '请输入额外标签', trigger: 'blur' }
      ],
      author: [
        { required: true, message: '请输入填写人姓名', trigger: 'blur' },
        { min: 2, max: 20, message: '填写人姓名长度在 2 到 20 个字符', trigger: 'blur' }
      ]
    }

    const submitForm = async () => {
      if (!formRef.value) return
      
      try {
        await formRef.value.validate()
        loading.value = true
        
        // 检查公众号链接是否已存在
        const existingCases = await StorageManager.getCaseList()
        const isDuplicate = existingCases.some(existingCase => 
          existingCase.wechatLink === form.wechatLink
        )
        
        if (isDuplicate) {
          ElMessage.error('该公众号链接已存在，请检查是否重复录入')
          return
        }
        
        const caseData = {
          ...form,
          id: Date.now().toString(),
          createTime: new Date().toISOString()
        }
        
        await StorageManager.addCase(caseData)
        ElMessage.success('案例添加成功！')
        resetForm()
        
      } catch (error) {
        console.error('提交表单时出错:', error)
        ElMessage.error('请完善表单信息')
      } finally {
        loading.value = false
      }
    }

    const resetForm = () => {
      if (!formRef.value) return
      formRef.value.resetFields()
    }

    return {
      form,
      rules,
      loading,
      formRef,
      titleWarning,
      titleChecked,
      linkWarning,
      linkChecked,
      checkingDuplicates,
      checkTitleDuplicate,
      checkLinkDuplicate,
      checkBothDuplicates,
      submitForm,
      resetForm
    }
  }
}
</script>

<style scoped>
.case-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.form-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
  line-height: 1.4;
}

.form-actions {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.validation-message {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
  font-size: 12px;
}

.validation-message.inline {
  margin-top: 0;
  margin-left: 10px;
}

.validation-message.warning {
  color: #E6A23C;
}

.validation-message.success {
  color: #67C23A;
}

.input-warning :deep(.el-input__wrapper) {
  border-color: #E6A23C;
  box-shadow: 0 0 0 1px #E6A23C inset;
}

.input-success :deep(.el-input__wrapper) {
  border-color: #67C23A;
  box-shadow: 0 0 0 1px #67C23A inset;
}

:deep(.el-form-item__label) {
  font-weight: 600;
}

:deep(.el-input__wrapper) {
  border-radius: 6px;
}

:deep(.el-select .el-input__wrapper) {
  border-radius: 6px;
}
</style>