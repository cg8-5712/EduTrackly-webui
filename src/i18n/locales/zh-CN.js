/**
 * 简体中文语言包
 */
export default {
  // 通用
  common: {
    confirm: '确认',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    add: '添加',
    search: '搜索',
    submit: '提交',
    reset: '重置',
    close: '关闭',
    back: '返回',
    next: '下一步',
    prev: '上一步',
    loading: '加载中...',
    noData: '暂无数据',
    success: '成功',
    error: '错误',
    warning: '警告',
    info: '信息',
    logout: '退出登录',
    login: '登录',
    username: '用户名',
    password: '密码',
    pleaseEnter: '请输入',
    pleaseSelect: '请选择',
    all: '全部',
    today: '今天',
    yesterday: '昨天',
    thisWeek: '本周',
    thisMonth: '本月',
    total: '总计',
    fullscreen: '全屏',
    exitFullscreen: '退出全屏'
  },

  // 导航菜单
  nav: {
    home: '首页',
    homework: '作业',
    submit: '提交',
    admin: '管理',
    student: '学生',
    class: '班级',
    attendance: '考勤',
    analysis: '分析',
    system: '系统'
  },

  // 主题
  theme: {
    title: '主题设置',
    light: '浅色',
    dark: '深色',
    oceanBlue: '海洋蓝',
    natureGreen: '自然绿',
    elegantPurple: '优雅紫',
    lightMode: '浅色模式',
    darkMode: '暗色模式',
    switchTo: '切换到'
  },

  // 语言
  language: {
    title: '语言设置',
    zhCN: '简体中文',
    zhTW: '繁体中文',
    en: 'English',
    ja: '日本語'
  },

  // 学生管理
  student: {
    title: '学生管理',
    list: '学生列表',
    add: '添加学生',
    edit: '编辑学生',
    delete: '删除学生',
    detail: '学生详情',
    name: '姓名',
    studentId: '学号',
    class: '班级',
    gender: '性别',
    age: '年龄',
    phone: '电话',
    email: '邮箱',
    address: '地址',
    status: '状态',
    male: '男',
    female: '女',
    active: '在校',
    inactive: '离校',
    searchPlaceholder: '搜索学生姓名或学号',
    noStudents: '暂无学生',
    selectStudent: '选择学生',
    studentInfo: '学生信息'
  },

  // 班级管理
  class: {
    title: '班级管理',
    list: '班级列表',
    add: '添加班级',
    edit: '编辑班级',
    delete: '删除班级',
    detail: '班级详情',
    name: '班级名称',
    classId: '班级编号',
    grade: '年级',
    teacher: '班主任',
    studentCount: '学生人数',
    selectClass: '选择班级',
    searchPlaceholder: '搜索班级',
    noClasses: '暂无班级',
    classInfo: '班级信息',
    switch: '切换班级'
  },

  // 作业管理
  homework: {
    title: '作业管理',
    list: '作业列表',
    add: '布置作业',
    edit: '编辑作业',
    delete: '删除作业',
    detail: '作业详情',
    submit: '提交作业',
    submitHomework: '提交作业',
    homeworkContent: '作业内容',
    dueDate: '截止日期',
    status: '状态',
    submitted: '已提交',
    notSubmitted: '未提交',
    today: '今日作业',
    todayHomework: '今日作业',
    noHomework: '暂无作业',
    noHomeworkToday: '今天没有布置作业哦～',
    pleaseEnterContent: '请输入作业内容',
    submitSuccess: '提交成功',
    submitFailed: '提交失败',
    fetchFailed: '获取作业失败，请稍后重试',

    // 学科
    subjects: {
      chinese: '语文',
      math: '数学',
      english: '英语',
      physics: '物理',
      chemistry: '化学',
      biology: '生物',
      history: '历史',
      geography: '地理',
      politics: '政治',
      others: '其他'
    }
  },

  // 考勤管理
  attendance: {
    title: '考勤管理',
    record: '考勤记录',
    statistics: '考勤统计',
    present: '出勤',
    absent: '缺勤',
    late: '迟到',
    leave: '请假',
    personalLeave: '事假',
    sickLeave: '病假',
    officialLeave: '公假',
    excused: '请假',
    date: '日期',
    time: '时间',
    status: '状态',
    reason: '原因',
    remark: '备注',
    todayAttendance: '今日考勤',
    attendanceRate: '出勤率',
    absentRate: '缺勤率',
    submitEvents: '提交事件',
    selectEvent: '选择事件类型'
  },

  // 分析统计
  analysis: {
    title: '数据分析',
    overview: '概览',
    statistics: '统计',
    chart: '图表',
    report: '报告',
    export: '导出',
    attendanceAnalysis: '考勤分析',
    homeworkAnalysis: '作业分析',
    performanceAnalysis: '成绩分析',
    trendAnalysis: '趋势分析',
    dateRange: '日期范围',
    selectDateRange: '选择日期范围'
  },

  // 管理员
  admin: {
    title: '管理员',
    login: '管理员登录',
    logout: '退出登录',
    dashboard: '控制台',
    settings: '设置',
    studentAdmin: '学生管理',
    classAdmin: '班级管理',
    homeworkAdmin: '作业管理',
    attendanceAdmin: '考勤管理',
    systemSettings: '系统设置',
    currentAdmin: '当前管理员',
    adminInfo: '管理员信息',
    lastLoginTime: '最后登录时间',
    lastLoginIp: '最后登录IP',
    pleaseEnterPassword: '请输入密码',
    loginSuccess: '登录成功',
    loginFailed: '登录失败',
    sessionExpired: '会话已过期，请重新登录'
  },

  // 系统设置
  system: {
    title: '系统设置',
    general: '常规设置',
    appearance: '外观设置',
    language: '语言设置',
    theme: '主题设置',
    notification: '通知设置',
    account: '账户设置',
    security: '安全设置',
    about: '关于',
    version: '版本',
    copyright: '版权信息'
  },

  // 通知消息
  notification: {
    title: '通知',
    success: '操作成功',
    error: '操作失败',
    warning: '警告',
    info: '提示',
    addSuccess: '添加成功',
    addFailed: '添加失败',
    editSuccess: '编辑成功',
    editFailed: '编辑失败',
    deleteSuccess: '删除成功',
    deleteFailed: '删除失败',
    saveSuccess: '保存成功',
    saveFailed: '保存失败',
    submitSuccess: '提交成功',
    submitFailed: '提交失败',
    loadSuccess: '加载成功',
    loadFailed: '加载失败',
    networkError: '网络错误',
    serverError: '服务器错误',
    unauthorized: '未授权',
    forbidden: '禁止访问',
    notFound: '未找到',
    confirmDelete: '确认删除吗？',
    confirmLogout: '确认退出登录吗？',
    dataRequired: '请填写必填项',
    invalidData: '数据格式不正确',
    operationCancelled: '操作已取消'
  },

  // 日期时间
  datetime: {
    year: '年',
    month: '月',
    day: '日',
    hour: '时',
    minute: '分',
    second: '秒',
    monday: '星期一',
    tuesday: '星期二',
    wednesday: '星期三',
    thursday: '星期四',
    friday: '星期五',
    saturday: '星期六',
    sunday: '星期日',
    selectDate: '选择日期',
    selectTime: '选择时间',
    startDate: '开始日期',
    endDate: '结束日期'
  },

  // 分页
  pagination: {
    total: '共 {total} 条',
    page: '第 {page} 页',
    perPage: '每页 {size} 条',
    goto: '跳转',
    prev: '上一页',
    next: '下一页',
    first: '首页',
    last: '末页'
  },

  // 错误消息
  error: {
    default: '发生错误',
    network: '网络连接失败',
    timeout: '请求超时',
    server: '服务器错误',
    notFound: '资源未找到',
    forbidden: '没有权限',
    unauthorized: '未登录或登录已过期',
    badRequest: '请求参数错误',
    formValidation: '表单验证失败',
    fileUpload: '文件上传失败',
    fileSizeExceeded: '文件大小超出限制',
    fileTypeNotSupported: '不支持的文件类型'
  },

  // 页脚
  footer: {
    copyright: '版权所有 © {year} EduTrackly. 保留所有权利。',
    version: '版本',
    build: '构建'
  }
}
