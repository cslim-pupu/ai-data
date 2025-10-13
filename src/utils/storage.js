import dayjs from 'dayjs'

const STORAGE_KEY = 'case_data_list'
const BACKUP_KEY = 'case_data_backup'

export class StorageManager {
  // 获取所有案例数据
  static getCaseList() {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  }

  // 保存案例数据
  static saveCaseList(caseList) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(caseList))
    this.autoBackup()
  }

  // 添加新案例
  static addCase(caseData) {
    const caseList = this.getCaseList()
    const newCase = {
      id: Date.now().toString(),
      ...caseData,
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
    }
    caseList.push(newCase)
    this.saveCaseList(caseList)
    return newCase
  }

  // 更新案例
  static updateCase(id, caseData) {
    const caseList = this.getCaseList()
    const index = caseList.findIndex(item => item.id === id)
    if (index !== -1) {
      caseList[index] = {
        ...caseList[index],
        ...caseData,
        updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
      this.saveCaseList(caseList)
      return caseList[index]
    }
    return null
  }

  // 删除案例
  static deleteCase(id) {
    const caseList = this.getCaseList()
    const filteredList = caseList.filter(item => item.id !== id)
    this.saveCaseList(filteredList)
    return filteredList
  }

  // 自动备份（每天一次）
  static autoBackup() {
    const today = dayjs().format('YYYY-MM-DD')
    const lastBackupDate = localStorage.getItem('last_backup_date')
    
    if (lastBackupDate !== today) {
      const caseList = this.getCaseList()
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
      this.saveCaseList(backupData.data)
      return true
    }
    return false
  }
}