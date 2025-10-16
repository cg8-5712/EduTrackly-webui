/**
 * 繁體中文語言包
 */
export default {
  // 通用
  common: {
    confirm: '確認',
    cancel: '取消',
    save: '儲存',
    delete: '刪除',
    edit: '編輯',
    add: '新增',
    search: '搜尋',
    submit: '提交',
    reset: '重置',
    close: '關閉',
    back: '返回',
    next: '下一步',
    prev: '上一步',
    loading: '載入中...',
    noData: '暫無資料',
    success: '成功',
    error: '錯誤',
    warning: '警告',
    info: '訊息',
    logout: '登出',
    login: '登入',
    username: '使用者名稱',
    password: '密碼',
    pleaseEnter: '請輸入',
    pleaseSelect: '請選擇',
    all: '全部',
    today: '今天',
    yesterday: '昨天',
    thisWeek: '本週',
    thisMonth: '本月',
    total: '總計'
  },

  // 導航選單
  nav: {
    home: '首頁',
    homework: '作業',
    submit: '提交',
    admin: '管理',
    student: '學生',
    class: '班級',
    attendance: '考勤',
    analysis: '分析',
    system: '系統'
  },

  // 主題
  theme: {
    title: '主題設定',
    light: '淺色',
    dark: '深色',
    oceanBlue: '海洋藍',
    natureGreen: '自然綠',
    elegantPurple: '優雅紫',
    lightMode: '淺色模式',
    darkMode: '暗色模式',
    switchTo: '切換到'
  },

  // 語言
  language: {
    title: '語言設定',
    zhCN: '简体中文',
    zhTW: '繁體中文',
    en: 'English',
    ja: '日本語'
  },

  // 學生管理
  student: {
    title: '學生管理',
    list: '學生列表',
    add: '新增學生',
    edit: '編輯學生',
    delete: '刪除學生',
    detail: '學生詳情',
    name: '姓名',
    studentId: '學號',
    class: '班級',
    gender: '性別',
    age: '年齡',
    phone: '電話',
    email: '信箱',
    address: '地址',
    status: '狀態',
    male: '男',
    female: '女',
    active: '在校',
    inactive: '離校',
    searchPlaceholder: '搜尋學生姓名或學號',
    noStudents: '暫無學生',
    selectStudent: '選擇學生',
    studentInfo: '學生資訊'
  },

  // 班級管理
  class: {
    title: '班級管理',
    list: '班級列表',
    add: '新增班級',
    edit: '編輯班級',
    delete: '刪除班級',
    detail: '班級詳情',
    name: '班級名稱',
    classId: '班級編號',
    grade: '年級',
    teacher: '班導師',
    studentCount: '學生人數',
    selectClass: '選擇班級',
    searchPlaceholder: '搜尋班級',
    noClasses: '暫無班級',
    classInfo: '班級資訊',
    switch: '切換班級'
  },

  // 作業管理
  homework: {
    title: '作業管理',
    list: '作業列表',
    add: '佈置作業',
    edit: '編輯作業',
    delete: '刪除作業',
    detail: '作業詳情',
    submit: '提交作業',
    submitHomework: '提交作業',
    homeworkContent: '作業內容',
    dueDate: '截止日期',
    status: '狀態',
    submitted: '已提交',
    notSubmitted: '未提交',
    today: '今日作業',
    todayHomework: '今日作業',
    noHomework: '暫無作業',
    pleaseEnterContent: '請輸入作業內容',
    submitSuccess: '提交成功',
    submitFailed: '提交失敗',

    // 學科
    subjects: {
      chinese: '語文',
      math: '數學',
      english: '英語',
      physics: '物理',
      chemistry: '化學',
      biology: '生物',
      history: '歷史',
      geography: '地理',
      politics: '政治',
      others: '其他'
    }
  },

  // 考勤管理
  attendance: {
    title: '考勤管理',
    record: '考勤記錄',
    statistics: '考勤統計',
    present: '出勤',
    absent: '缺勤',
    late: '遲到',
    leave: '請假',
    personalLeave: '事假',
    sickLeave: '病假',
    officialLeave: '公假',
    excused: '請假',
    date: '日期',
    time: '時間',
    status: '狀態',
    reason: '原因',
    remark: '備註',
    todayAttendance: '今日考勤',
    attendanceRate: '出勤率',
    absentRate: '缺勤率',
    submitEvents: '提交事件',
    selectEvent: '選擇事件類型'
  },

  // 分析統計
  analysis: {
    title: '資料分析',
    overview: '概覽',
    statistics: '統計',
    chart: '圖表',
    report: '報告',
    export: '匯出',
    attendanceAnalysis: '考勤分析',
    homeworkAnalysis: '作業分析',
    performanceAnalysis: '成績分析',
    trendAnalysis: '趨勢分析',
    dateRange: '日期範圍',
    selectDateRange: '選擇日期範圍'
  },

  // 管理員
  admin: {
    title: '管理員',
    login: '管理員登入',
    logout: '登出',
    dashboard: '控制台',
    settings: '設定',
    studentAdmin: '學生管理',
    classAdmin: '班級管理',
    homeworkAdmin: '作業管理',
    attendanceAdmin: '考勤管理',
    systemSettings: '系統設定',
    currentAdmin: '目前管理員',
    adminInfo: '管理員資訊',
    lastLoginTime: '最後登入時間',
    lastLoginIp: '最後登入IP',
    pleaseEnterPassword: '請輸入密碼',
    loginSuccess: '登入成功',
    loginFailed: '登入失敗',
    sessionExpired: '會話已過期，請重新登入'
  },

  // 系統設定
  system: {
    title: '系統設定',
    general: '常規設定',
    appearance: '外觀設定',
    language: '語言設定',
    theme: '主題設定',
    notification: '通知設定',
    account: '帳戶設定',
    security: '安全設定',
    about: '關於',
    version: '版本',
    copyright: '版權資訊'
  },

  // 通知訊息
  notification: {
    title: '通知',
    success: '操作成功',
    error: '操作失敗',
    warning: '警告',
    info: '提示',
    addSuccess: '新增成功',
    addFailed: '新增失敗',
    editSuccess: '編輯成功',
    editFailed: '編輯失敗',
    deleteSuccess: '刪除成功',
    deleteFailed: '刪除失敗',
    saveSuccess: '儲存成功',
    saveFailed: '儲存失敗',
    submitSuccess: '提交成功',
    submitFailed: '提交失敗',
    loadSuccess: '載入成功',
    loadFailed: '載入失敗',
    networkError: '網路錯誤',
    serverError: '伺服器錯誤',
    unauthorized: '未授權',
    forbidden: '禁止存取',
    notFound: '未找到',
    confirmDelete: '確認刪除嗎？',
    confirmLogout: '確認登出嗎？',
    dataRequired: '請填寫必填項',
    invalidData: '資料格式不正確',
    operationCancelled: '操作已取消'
  },

  // 日期時間
  datetime: {
    year: '年',
    month: '月',
    day: '日',
    hour: '時',
    minute: '分',
    second: '秒',
    monday: '星期一',
    tuesday: '星期二',
    wednesday: '星期三',
    thursday: '星期四',
    friday: '星期五',
    saturday: '星期六',
    sunday: '星期日',
    selectDate: '選擇日期',
    selectTime: '選擇時間',
    startDate: '開始日期',
    endDate: '結束日期'
  },

  // 分頁
  pagination: {
    total: '共 {total} 條',
    page: '第 {page} 頁',
    perPage: '每頁 {size} 條',
    goto: '跳轉',
    prev: '上一頁',
    next: '下一頁',
    first: '首頁',
    last: '末頁'
  },

  // 錯誤訊息
  error: {
    default: '發生錯誤',
    network: '網路連線失敗',
    timeout: '請求逾時',
    server: '伺服器錯誤',
    notFound: '資源未找到',
    forbidden: '沒有權限',
    unauthorized: '未登入或登入已過期',
    badRequest: '請求參數錯誤',
    formValidation: '表單驗證失敗',
    fileUpload: '檔案上傳失敗',
    fileSizeExceeded: '檔案大小超出限制',
    fileTypeNotSupported: '不支援的檔案類型'
  },

  // 頁尾
  footer: {
    copyright: '版權所有 © {year} EduTrackly. 保留所有權利。',
    version: '版本',
    build: '建置'
  }
}
