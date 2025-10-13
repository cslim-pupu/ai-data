import * as XLSX from 'xlsx'
import dayjs from 'dayjs'

export class ExportManager {
  // 导出为Excel格式
  static exportToExcel(data, filename = '案例数据') {
    if (!data || data.length === 0) {
      throw new Error('没有数据可导出')
    }

    // 准备导出数据
    const exportData = data.map(item => ({
      '案例名称': item.caseName,
      '公众号链接': item.wechatLink,
      '使用组件': item.components,
      '所属行业': item.industry,
      '发布时间': item.publishDate,
      '节日标签': item.holiday,
      '会员类型': item.memberType,
      '额外标签': item.tags,
      '填写人': item.author,
      '创建时间': item.createTime,
      '更新时间': item.updateTime || ''
    }))

    // 创建工作簿
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(exportData)

    // 设置列宽
    const colWidths = [
      { wch: 20 }, // 案例名称
      { wch: 40 }, // 公众号链接
      { wch: 30 }, // 使用组件
      { wch: 10 }, // 所属行业
      { wch: 12 }, // 发布时间
      { wch: 12 }, // 节日标签
      { wch: 12 }, // 会员类型
      { wch: 25 }, // 额外标签
      { wch: 10 }, // 填写人
      { wch: 20 }, // 创建时间
      { wch: 20 }  // 更新时间
    ]
    ws['!cols'] = colWidths

    // 添加工作表到工作簿
    XLSX.utils.book_append_sheet(wb, ws, '案例数据')

    // 生成文件名
    const timestamp = dayjs().format('YYYY-MM-DD_HH-mm-ss')
    const finalFilename = `${filename}_${timestamp}.xlsx`

    // 导出文件
    XLSX.writeFile(wb, finalFilename)
    
    return finalFilename
  }

  // 导出为CSV格式
  static exportToCSV(data, filename = '案例数据') {
    if (!data || data.length === 0) {
      throw new Error('没有数据可导出')
    }

    // 准备CSV头部
    const headers = [
      '案例名称',
      '公众号链接',
      '使用组件',
      '所属行业',
      '发布时间',
      '节日标签',
      '会员类型',
      '额外标签',
      '填写人',
      '创建时间',
      '更新时间'
    ]

    // 准备CSV数据
    const csvData = data.map(item => [
      item.caseName,
      item.wechatLink,
      item.components,
      item.industry,
      item.publishDate,
      item.holiday,
      item.memberType,
      item.tags,
      item.author,
      item.createTime,
      item.updateTime || ''
    ])

    // 组合CSV内容
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => 
        row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
      )
    ].join('\n')

    // 创建Blob对象
    const blob = new Blob(['\uFEFF' + csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    })

    // 生成文件名
    const timestamp = dayjs().format('YYYY-MM-DD_HH-mm-ss')
    const finalFilename = `${filename}_${timestamp}.csv`

    // 创建下载链接
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', finalFilename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }

    return finalFilename
  }

  // 根据筛选条件导出数据
  static exportFilteredData(allData, filters, format = 'excel', filename = '案例数据') {
    let filteredData = [...allData]

    // 应用筛选条件
    if (filters.industry && filters.industry !== '') {
      filteredData = filteredData.filter(item => item.industry === filters.industry)
    }
    
    if (filters.memberType && filters.memberType !== '') {
      filteredData = filteredData.filter(item => item.memberType === filters.memberType)
    }
    
    if (filters.holiday && filters.holiday !== '') {
      filteredData = filteredData.filter(item => item.holiday === filters.holiday)
    }

    // 根据格式导出
    if (format === 'csv') {
      return this.exportToCSV(filteredData, filename)
    } else {
      return this.exportToExcel(filteredData, filename)
    }
  }
}