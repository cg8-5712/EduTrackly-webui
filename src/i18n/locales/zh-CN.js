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
    exitFullscreen: '退出全屏',
    unknown: '未知',
    loginFailedRetry: '登录失败，请重试',
    passwordRequired: '请输入密码',
    passwordSafetyWarning: '请妥善保管您的管理员密码'
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
    system: '系统',
    currentadmin: '当前状态',
    classadmin: '班级管理',
    studentadmin: '学生管理',
    homeworkadmin: '作业管理'
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
    last: '末页',
    itemsUnit: '条',
    peopleUnit: '人'
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
    fileTypeNotSupported: '不支持的文件类型',

    // Service specific errors
    classIdRequired: '班级ID必填',
    studentDataEmpty: '学生数据不能为空',
    studentIdRequired: '学生ID必填',
    dateRequired: '日期必填',
    eventDataEmpty: '事件数据不能为空',
    classIdOrNameRequired: '班级ID或班级名称不能同时为空',
    classNameRequired: '班级名称不能为空',
    classIdEmpty: '班级ID不能为空',
    homeworkContentAndDateRequired: '班级ID、作业内容和截止日期不能为空',
    invalidThemeId: '无效的主题 ID',
    themeConfigNotFound: '未找到主题配置',
    notificationTypeNotSupported: 'Notification type "{type}" 不支持，默认使用 "info"',

    // Validation errors
    studentNameEmpty: '第{index}个学生姓名不能为空',
    studentNameTooLong: '第{index}个学生姓名不能超过50个字符',
    selectDateAndEventType: '请选择日期和事件类型',
    inSchoolCannotSelectTempLeave: '在校学生不能选择临时外出',
    atLeastOneSubjectRequired: '请至少填写一个科目的作业',

    // File upload errors
    fileTypesSupported: '仅支持上传 .txt、.csv、.xlsx 或 .xls 文件',
    fileSizeLimit: '文件大小不能超过 5MB',
    headerRowSkipped: '检测到表头行，已自动跳过',
    excelLoadSuccess: '成功加载 Excel 文件: {filename}，共 {count} 行数据',
    excelParseFailed: '解析 Excel 文件失败，请检查文件格式',
    excelReadFailed: '读取 Excel 文件失败',
    fileLoadSuccess: '成功加载文件: {filename}',
    fileReadFailed: '读取文件失败'
  },

  // Service messages (console logs and operations)
  service: {
    // Student service
    batchAddingStudents: '批量添加学生',
    batchAddStudentsFailed: '批量添加学生失败',
    changingAttendanceStatus: '更改出勤状态',
    changeAttendanceStatusFailed: '更改出勤状态失败',
    deletingStudent: '删除学生',
    deleteStudentFailed: '删除学生失败',
    submittingStudentEvents: '提交学生事件',
    submitStudentEventsFailed: '提交学生事件失败',
    gettingStudentAnalysis: '获取学生分析数据',
    getStudentAnalysisFailed: '获取学生分析数据失败',

    // Homework service
    getHomeworkSuccess: '获取作业成功',
    getHomeworkFailed: '获取作业失败',
    getHomeworkListSuccess: '获取作业列表成功',
    getHomeworkListFailed: '获取作业列表失败',
    createHomeworkSuccess: '创建作业成功',
    createHomeworkFailed: '创建作业失败',
    updateHomeworkSuccess: '更新作业成功',
    updateHomeworkFailed: '更新作业失败',
    deleteHomeworkSuccess: '删除作业成功',
    deleteHomeworkFailed: '删除作业失败',

    // Class service
    getClassListSuccess: '获取班级列表成功',
    getClassListFailed: '获取班级列表失败',
    getClassDetailSuccess: '获取班级详情成功',
    getClassDetailFailed: '获取班级详情失败',
    getClassInfoSuccess: '获取班级信息成功',
    getClassInfoFailed: '获取班级信息失败',
    createClassSuccess: '创建班级成功',
    createClassFailed: '创建班级失败',
    deleteClassSuccess: '删除班级成功',
    deleteClassFailed: '删除班级失败',
    getClassAnalysisSuccess: '获取班级分析数据成功',
    getClassAnalysisFailed: '获取班级分析数据失败',
    getClassesFailed: '获取班级失败',

    // Theme service
    themeSaved: '主题已保存',
    saveThemeFailed: '保存主题失败',
    loadingCachedTheme: '加载缓存主题',
    usingDefaultTheme: '使用默认主题',
    loadThemeFailed: '加载主题失败',
    themeCacheCleared: '主题缓存已清除',
    clearThemeCacheFailed: '清除主题缓存失败',
    themeApplied: '主题已应用',
    allThemeCacheCleared: '所有主题缓存已清除'
  },

  // Component specific messages
  component: {
    // ClassAdmin
    classCreatedSuccess: '班级创建成功',
    createClassFailed: '创建班级失败',
    classDeletedSuccess: '班级删除成功',
    deleteClassFailed: '删除班级失败',
    getClassListFailed: '获取班级列表失败',
    getClassAnalysisFailed: '获取班级分析数据失败',
    getClassDetailFailed: '获取班级详情失败',

    // StudentAdmin
    getStudentListFailed: '获取学生列表失败',
    getStudentsForClassFailed: '获取班级 {className} 学生失败',
    changeAttendanceStatusFailed: '更改出勤状态失败',
    deleteStudentSuccess: '删除学生 {studentName} 成功',
    deleteStudentFailed: '删除学生失败',
    confirmDeleteStudent: '确定要删除学生 {studentName} 吗？此操作不可恢复。',
    statusChangedTo: '状态已更改为',

    // HomeworkAdmin
    homeworkCreatedSuccess: '作业创建成功',
    createHomeworkFailed: '创建作业失败',
    homeworkUpdatedSuccess: '作业更新成功',
    updateHomeworkFailed: '更新作业失败',
    homeworkDeletedSuccess: '作业删除成功',
    deleteHomeworkFailed: '删除作业失败',
    getHomeworkListFailed: '获取作业列表失败',

    // AddStudentModal
    studentsAddedSuccess: '成功添加 {count} 个学生',
    studentAddedSuccess: '添加学生成功',

    // StudentDetailModal
    historyRecordAddedSuccess: '历史记录添加成功',
    submitEventRecordFailed: '提交事件记录失败',

    // StudentEventSelector
    submitSuccess: '提交成功',
    submitFailed: '提交失败'
  },

  // UI text
  ui: {
    // ClassAdmin
    classManagement: '班级管理',
    manageClassInfo: '管理所有班级信息，查看学生人数和创建时间',
    createClass: '创建班级',
    searchClassName: '搜索班级名称...',
    itemsPerPage: '每页显示',
    foundClassesInfo: '共找到 {total} 个班级，每页显示 {size} 条',
    className: '班级名称',
    id: 'ID',
    studentCount: '学生人数',
    creationTime: '创建时间',
    actions: '操作',
    viewDetails: '查看详情',
    deleteClass: '删除班级',
    createNewClass: '创建新班级',
    enterClassName: '请输入班级名称',
    confirmCreate: '确认创建',
    classDetails: '班级详情 - {className}',
    loadingDetails: '加载详情中...',
    classId: '班级ID：',
    classNameLabel: '班级名称：',
    creationTimeLabel: '创建时间：',
    classStatistics: '班级统计分析',
    totalStudents: '学生总数',
    expectedAttendance: '应到人数',
    todayAttendance: '今日实到',
    todayAttendanceRate: '今日出勤率',
    noHistoricalAttendance: '暂无历史出勤数据',
    classStudents: '班级学生',
    inSchool: '在校',
    absent: '缺勤',
    noStudentsYet: '暂无学生',
    confirmDelete: '确认删除',
    confirmDeleteClass: '确定要删除班级 "{className}" 吗？',
    cannotUndo: '此操作不可撤销，请谨慎操作！',
    deleting: '删除中...',
    confirmDeleteButton: '确认删除',

    // AddStudentModal
    addStudent: '添加学生',
    manual: '手动',
    batch: '批量',
    targetClass: '目标班级',
    selectClass: '请选择班级',
    studentName: '学生姓名',
    enterStudentName: '请输入学生姓名',
    initialStatus: '初始状态',
    leftSchool: '离校',
    batchInputStudentInfo: '批量输入学生信息',
    batchInputPlaceholder: 'CSV格式，每行一个学生，格式：班级ID,姓名,出勤状态\n例如：\n1,张三,1\n1,李四,0\n\n出勤状态：1=在校，0=离校',
    batchInputHelp: 'CSV格式：班级ID,姓名,出勤状态（1=在校，0=离校）',
    selectFile: '选择文件',
    fileFormatHint: '支持上传 .txt、.csv 或 .xlsx/.xls 文件（每行格式：班级ID,姓名,出勤状态）',
    confirmAdd: '确认添加',
    adding: '添加中...',
    selectClassRequired: '请选择目标班级',
    studentInfoRequired: '请输入学生信息',
    studentNameRequired: '学生姓名不能为空',
    studentNameMaxLength: '学生姓名不能超过50个字符',

    // StudentDetailModal
    studentIdLabel: '学号',
    loadingAnalysisData: '加载分析数据中...',
    loadAnalysisDataFailed: '加载分析数据失败',
    retry: '重试',
    basicInfo: '基本信息',
    name: '姓名',
    attendanceStatus: '出勤状态',
    addHistoryRecord: '添加历史记录',
    selectDate: '选择日期',
    clickToSelectDate: '点击选择日期',
    eventType: '事件类型',
    official: '公事',
    personal: '私事',
    sickLeave: '病假',
    temporaryLeave: '临时外出',
    warningInSchoolNoTempLeave: '⚠️ 当前学生状态为在校，不能选择临时外出',
    submitRecord: '提交记录',
    submitting: '提交中...',
    eventStatistics: '事件统计',
    times: '次',
    noEventRecords: '暂无事件记录',
    officialRecords: '公事记录',
    personalRecords: '私事记录',
    sickLeaveRecords: '病假记录',
    temporaryLeaveRecords: '临时外出记录',
    close: '关闭',

    // StudentAdmin
    studentManagement: '学生管理',
    manageStudentInfo: '管理班级学生信息、出勤状态和统计数据',
    confirmSelection: '确认选择',
    selectAll: '全选',
    classes: '个班级',
    searchStudentPlaceholder: '搜索学生姓名或学号...',
    clear: '清除',
    refresh: '刷新',
    refreshing: '刷新中...',
    studentsInSchool: '在校学生',
    studentsLeftSchool: '离校学生',
    studentList: '学生列表',
    selectedClasses: '已选择 {count} 个班级',
    loadingStudentList: '加载学生列表中...',
    pleaseSelectClass: '请先选择班级',
    noMatchingStudents: '未找到匹配的学生',
    noStudentData: '暂无学生数据',
    selectClassFromDropdown: '在上方下拉框中选择要查看的班级',
    tryOtherKeywords: '请尝试其他搜索关键词',
    noStudentsAddedYet: '还没有添加学生哦～',
    addStudentNow: '立即添加学生',
    class: '班级',
    studentId: '学号',
    details: '详情',
    delete: '删除',
    showingRecords: '显示第 {start} - {end} 条，共 {total} 条记录',
    items: '条',
    firstPage: '首页',
    previousPage: '上一页',
    nextPage: '下一页',
    lastPage: '末页',
    jumpTo: '跳转到',
    page: '页',
    confirm: '确定',
    unknownClass: '未知班级({cid})',
    allClasses: '全部班级 ({count}个)'
  },

  // 页脚
  footer: {
    copyright: '版权所有 © {year} EduTrackly. 保留所有权利。',
    version: '版本',
    build: '构建'
  },

  // 额外的 UI 文本
  extraUI: {
    // AttendanceDisplay
    expectedAttend: '应到',
    actualAttend: '实到',
    leaveList: '请假名单',
    temporaryJoinList: '临时参加名单',
    noAttendanceInfo: '暂无出勤信息',
    pleaseSelectClassFirst: '请先选择班级',
    fetchAttendanceInfoFailed: '获取出勤信息失败',
    fetchDataFailed: '获取数据失败',
    peopleUnit: '人',

    // CurrentAdmin
    adminConsole: '管理员控制台',
    realTimeMonitoring: '实时监控与管理',
    totalStudents: '学生总数',
    homeworkTasks: '作业任务',
    refresh: '刷新',
    mainPanel: '主面板',
    classSelection: '班级选择',
    currentClass: '当前班级',
    classIdLabel: '班级ID',
    pleaseSelectClass: '请选择班级',
    systemStatus: '系统状态',
    serviceRunning: '服务运行中',
    databaseConnected: '数据库连接',
    realTimeSync: '实时同步',
    studentManagement: '学生管理',
    currentClassLabel: '当前班级',
    homeworkManagement: '作业管理',

    // ClassSwitch
    loadClassListFailed: '加载班级列表失败',

    // SubmitHomework
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
    },
    getHomeworkSuccess: '获取今日作业成功',

    // AddStudentModal - 详细的错误提示
    lineFormatError: '第{index}行格式错误：应为"班级ID,姓名,出勤状态"，当前有{count}个字段',
    detectedChineseComma: '检测到中文逗号"，"，请使用英文逗号","',
    detectedSpaceSeparator: '检测到空格分隔符，请使用英文逗号","',
    detectedTabSeparator: '检测到制表符Tab分隔符，请使用英文逗号","',
    detectedChineseSemicolon: '检测到中文分号"；"，请使用英文逗号","',
    detectedSemicolon: '检测到分号";"，请使用英文逗号","',
    detectedPipe: '检测到竖线"|"，请使用英文逗号","',
    classIdMustBePositiveInteger: '第{index}行：班级ID"{cid}"必须是正整数',
    studentNameCannotBeEmpty: '第{index}行：学生姓名不能为空',
    studentNameTooLongAtLine: '第{index}行：学生姓名"{name}"不能超过50个字符',
    attendanceStatusMustBe0Or1: '第{index}行：出勤状态"{status}"必须是0或1',
    noValidStudentInfo: '没有有效的学生信息',
    addStudentsFailed: '班级{cid}：{error}',
    partialAddFailed: '部分添加失败：成功{count}个',
    addStudentFailedRetry: '添加学生失败，请稍后重试',
    parseExcelError: '解析 Excel 文件错误',
    readExcelFailed: '读取 Excel 文件失败',
    fileUploadError: '文件上传错误',
    lineContent: '第{index}行原始内容',
    lineParsed: '第{index}行分割结果',
    parseSuccess: '第{index}行解析成功',
    headerLineDetected: '检测到表头行，已自动跳过',
    includesClass: '班级',
    includesName: '姓名',
    includesAttendance: '出勤',

    // Home view
    homeTitle: '首页',

    // 通用错误和成功消息
    operationSuccess: '操作成功',
    operationFailed: '操作失败'
  }
}
