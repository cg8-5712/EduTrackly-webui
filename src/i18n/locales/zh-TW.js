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
    total: '總計',
    fullscreen: '全螢幕',
    exitFullscreen: '退出全螢幕',
    unknown: '未知',
    loginFailedRetry: '登入失敗，請重試',
    passwordRequired: '請輸入密碼',
    passwordSafetyWarning: '請妥善保管您的管理員密碼'
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
    system: '系統',
    currentadmin: '目前狀態',
    classadmin: '班級管理',
    studentadmin: '學生管理',
    homeworkadmin: '作業管理',
    countdownadmin: '倒數計時管理',
    settingadmin: '顯示設定',
    adminmanagement: '管理員管理'
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

  // 微信瀏覽器提示
  wechatTip: {
    message: '檢測到微信瀏覽器，建議點擊右上角「...」選擇「在瀏覽器中開啟」以獲得更好體驗'
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
    noHomeworkToday: '今天沒有佈置作業哦～',
    pleaseEnterContent: '請輸入作業內容',
    submitSuccess: '提交成功',
    submitFailed: '提交失敗',
    fetchFailed: '獲取作業失敗，請稍後重試',

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
    sessionExpired: '會話已過期，請重新登入',
    // 管理員管理
    management: '管理員管理',
    managementDesc: '管理系統管理員帳戶和權限',
    role: '角色',
    superadmin: '超級管理員',
    admin: '管理員',
    createAdmin: '創建管理員',
    editAdmin: '編輯管理員',
    deleteAdmin: '刪除管理員',
    viewDetails: '查看詳情',
    manageClasses: '管理班級',
    adminId: '管理員 ID',
    password: '密碼',
    passwordPlaceholder: '至少 8 位字元',
    createTime: '創建時間',
    lastLogin: '最後登入',
    lastLoginIp2: '最後登入 IP',
    deleteConfirm: '確定要刪除管理員 {aid} 嗎？此操作無法撤銷。',
    cannotDeleteSelf: '不能刪除自己的帳戶',
    cannotDemoteSelf: '不能降級自己的角色',
    assignedClasses: '已分配班級',
    noClassAssigned: '尚未分配班級',
    assignClass: '分配班級',
    removeClass: '移除班級',
    noAdmins: '沒有找到管理員',
    createFirst: '創建您的第一個管理員',
    noPassword: '留空以保持目前密碼',
    filterByRole: '按角色篩選',
    allRoles: '所有角色',
    searchPlaceholder: '搜尋管理員 ID...'
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
    last: '末頁',
    itemsUnit: '條',
    peopleUnit: '人'
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
    fileTypeNotSupported: '不支援的檔案類型',

    // Service specific errors
    classIdRequired: '班級ID必填',
    studentDataEmpty: '學生資料不能為空',
    studentIdRequired: '學生ID必填',
    dateRequired: '日期必填',
    eventDataEmpty: '事件資料不能為空',
    classIdOrNameRequired: '班級ID或班級名稱不能同時為空',
    classNameRequired: '班級名稱不能為空',
    classIdEmpty: '班級ID不能為空',
    homeworkContentAndDateRequired: '班級ID、作業內容和截止日期不能為空',
    invalidThemeId: '無效的主題 ID',
    themeConfigNotFound: '未找到主題配置',
    notificationTypeNotSupported: 'Notification type "{type}" 不支援，預設使用 "info"',

    // Validation errors
    studentNameEmpty: '第{index}個學生姓名不能為空',
    studentNameTooLong: '第{index}個學生姓名不能超過50個字元',
    selectDateAndEventType: '請選擇日期和事件類型',
    inSchoolCannotSelectTempLeave: '在校學生不能選擇臨時外出',
    atLeastOneSubjectRequired: '請至少填寫一個科目的作業',

    // File upload errors
    fileTypesSupported: '僅支援上傳 .txt、.csv、.xlsx 或 .xls 檔案',
    fileSizeLimit: '檔案大小不能超過 5MB',
    headerRowSkipped: '檢測到表頭行，已自動跳過',
    excelLoadSuccess: '成功載入 Excel 檔案: {filename}，共 {count} 行資料',
    excelParseFailed: '解析 Excel 檔案失敗，請檢查檔案格式',
    excelReadFailed: '讀取 Excel 檔案失敗',
    fileLoadSuccess: '成功載入檔案: {filename}',
    fileReadFailed: '讀取檔案失敗',

    // 管理員管理錯誤
    adminIdRequired: '管理員 ID 必填',
    passwordTooShort: '密碼至少需要 8 位字元',
    adminIdAndClassIdRequired: '管理員 ID 和班級 ID 都必填',
    classIdsArrayRequired: '班級 ID 必須是陣列'
  },

  // Service messages (console logs and operations)
  service: {
    // Student service
    batchAddingStudents: '批次新增學生',
    batchAddStudentsFailed: '批次新增學生失敗',
    changingAttendanceStatus: '更改出勤狀態',
    changeAttendanceStatusFailed: '更改出勤狀態失敗',
    deletingStudent: '刪除學生',
    deleteStudentFailed: '刪除學生失敗',
    submittingStudentEvents: '提交學生事件',
    submitStudentEventsFailed: '提交學生事件失敗',
    gettingStudentAnalysis: '獲取學生分析資料',
    getStudentAnalysisFailed: '獲取學生分析資料失敗',

    // Homework service
    getHomeworkSuccess: '獲取作業成功',
    getHomeworkFailed: '獲取作業失敗',
    getHomeworkListSuccess: '獲取作業列表成功',
    getHomeworkListFailed: '獲取作業列表失敗',
    createHomeworkSuccess: '建立作業成功',
    createHomeworkFailed: '建立作業失敗',
    updateHomeworkSuccess: '更新作業成功',
    updateHomeworkFailed: '更新作業失敗',
    deleteHomeworkSuccess: '刪除作業成功',
    deleteHomeworkFailed: '刪除作業失敗',

    // Class service
    getClassListSuccess: '獲取班級列表成功',
    getClassListFailed: '獲取班級列表失敗',
    getClassDetailSuccess: '獲取班級詳情成功',
    getClassDetailFailed: '獲取班級詳情失敗',
    getClassInfoSuccess: '獲取班級資訊成功',
    getClassInfoFailed: '獲取班級資訊失敗',
    createClassSuccess: '建立班級成功',
    createClassFailed: '建立班級失敗',
    deleteClassSuccess: '刪除班級成功',
    deleteClassFailed: '刪除班級失敗',
    getClassAnalysisSuccess: '獲取班級分析資料成功',
    getClassAnalysisFailed: '獲取班級分析資料失敗',
    getClassesFailed: '獲取班級失敗',

    // 管理員管理服務
    getCurrentAdminSuccess: '獲取目前管理員資訊成功',
    getCurrentAdminFailed: '獲取目前管理員資訊失敗',
    createAdminSuccess: '創建管理員成功',
    createAdminFailed: '創建管理員失敗',
    getAdminSuccess: '獲取管理員成功',
    getAdminFailed: '獲取管理員失敗',
    getAdminListSuccess: '獲取管理員列表成功',
    getAdminListFailed: '獲取管理員列表失敗',
    updateAdminSuccess: '更新管理員成功',
    updateAdminFailed: '更新管理員失敗',
    deleteAdminSuccess: '刪除管理員成功',
    deleteAdminFailed: '刪除管理員失敗',
    assignClassSuccess: '分配班級成功',
    assignClassFailed: '分配班級失敗',
    removeClassSuccess: '移除班級成功',
    removeClassFailed: '移除班級失敗',
    getAdminClassesSuccess: '獲取管理員班級成功',
    getAdminClassesFailed: '獲取管理員班級失敗',
    replaceClassesSuccess: '替換班級成功',
    replaceClassesFailed: '替換班級失敗',
    batchAssignFailed: '批量分配班級失敗',

    // Theme service
    themeSaved: '主題已儲存',
    saveThemeFailed: '儲存主題失敗',
    loadingCachedTheme: '載入快取主題',
    usingDefaultTheme: '使用預設主題',
    loadThemeFailed: '載入主題失敗',
    themeCacheCleared: '主題快取已清除',
    clearThemeCacheFailed: '清除主題快取失敗',
    themeApplied: '主題已套用',
    allThemeCacheCleared: '所有主題快取已清除'
  },

  // Component specific messages
  component: {
    // ClassAdmin
    classCreatedSuccess: '班級建立成功',
    createClassFailed: '建立班級失敗',
    classDeletedSuccess: '班級刪除成功',
    deleteClassFailed: '刪除班級失敗',
    getClassListFailed: '獲取班級列表失敗',
    getClassAnalysisFailed: '獲取班級分析資料失敗',
    getClassDetailFailed: '獲取班級詳情失敗',

    // StudentAdmin
    getStudentListFailed: '獲取學生列表失敗',
    getStudentsForClassFailed: '獲取班級 {className} 學生失敗',
    changeAttendanceStatusFailed: '更改出勤狀態失敗',
    deleteStudentSuccess: '刪除學生 {studentName} 成功',
    deleteStudentFailed: '刪除學生失敗',
    confirmDeleteStudent: '確定要刪除學生 {studentName} 嗎？此操作不可恢復。',
    statusChangedTo: '狀態已更改為',

    // Export
    exportSuccess: '匯出成功',
    exportFailed: '匯出失敗',

    // HomeworkAdmin
    homeworkCreatedSuccess: '作業建立成功',
    createHomeworkFailed: '建立作業失敗',
    homeworkUpdatedSuccess: '作業更新成功',
    updateHomeworkFailed: '更新作業失敗',
    homeworkDeletedSuccess: '作業刪除成功',
    deleteHomeworkFailed: '刪除作業失敗',
    getHomeworkListFailed: '獲取作業列表失敗',

    // AddStudentModal
    studentsAddedSuccess: '成功新增 {count} 個學生',
    studentAddedSuccess: '新增學生成功',

    // StudentDetailModal
    historyRecordAddedSuccess: '歷史記錄新增成功',
    submitEventRecordFailed: '提交事件記錄失敗',

    // StudentEventSelector
    submitSuccess: '提交成功',
    submitFailed: '提交失敗'
  },

  // UI text
  ui: {
    // ClassAdmin
    classManagement: '班級管理',
    manageClassInfo: '管理所有班級資訊，查看學生人數和建立時間',
    createClass: '建立班級',
    searchClassName: '搜尋班級名稱...',
    itemsPerPage: '每頁顯示',
    foundClassesInfo: '共找到 {total} 個班級，每頁顯示 {size} 條',
    className: '班級名稱',
    id: 'ID',
    studentCount: '學生人數',
    creationTime: '建立時間',
    actions: '操作',
    viewDetails: '查看詳情',
    deleteClass: '刪除班級',
    createNewClass: '建立新班級',
    enterClassName: '請輸入班級名稱',
    confirmCreate: '確認建立',
    classDetails: '班級詳情 - {className}',
    loadingDetails: '載入詳情中...',
    classId: '班級ID：',
    classNameLabel: '班級名稱：',
    creationTimeLabel: '建立時間：',
    classStatistics: '班級統計分析',
    totalStudents: '學生總數',
    expectedAttendance: '應到人數',
    todayAttendance: '今日實到',
    todayAttendanceRate: '今日出勤率',
    noHistoricalAttendance: '暫無歷史出勤資料',
    classStudents: '班級學生',
    inSchool: '在校',
    absent: '缺勤',
    noStudentsYet: '暫無學生',
    confirmDelete: '確認刪除',
    confirmDeleteClass: '確定要刪除班級 "{className}" 嗎？',
    cannotUndo: '此操作不可撤銷，請謹慎操作！',
    deleting: '刪除中...',
    confirmDeleteButton: '確認刪除',

    // AddStudentModal
    addStudent: '新增學生',
    manual: '手動',
    batch: '批次',
    targetClass: '目標班級',
    selectClass: '請選擇班級',
    studentName: '學生姓名',
    enterStudentName: '請輸入學生姓名',
    initialStatus: '初始狀態',
    leftSchool: '離校',
    batchInputStudentInfo: '批次輸入學生資訊',
    batchInputPlaceholder: 'CSV格式，每行一個學生，格式：班級ID,姓名,出勤狀態\n例如：\n1,張三,1\n1,李四,0\n\n出勤狀態：1=在校，0=離校',
    batchInputHelp: 'CSV格式：班級ID,姓名,出勤狀態（1=在校，0=離校）',
    selectFile: '選擇檔案',
    fileFormatHint: '支援上傳 .txt、.csv 或 .xlsx/.xls 檔案（每行格式：班級ID,姓名,出勤狀態）',
    confirmAdd: '確認新增',
    adding: '新增中...',
    selectClassRequired: '請選擇目標班級',
    studentInfoRequired: '請輸入學生資訊',
    studentNameRequired: '學生姓名不能為空',
    studentNameMaxLength: '學生姓名不能超過50個字元',

    // StudentDetailModal
    studentIdLabel: '學號',
    loadingAnalysisData: '載入分析資料中...',
    loadAnalysisDataFailed: '載入分析資料失敗',
    retry: '重試',
    basicInfo: '基本資訊',
    name: '姓名',
    attendanceStatus: '出勤狀態',
    addHistoryRecord: '新增歷史記錄',
    selectDate: '選擇日期',
    clickToSelectDate: '點擊選擇日期',
    eventType: '事件類型',
    official: '公事',
    personal: '私事',
    sickLeave: '病假',
    temporaryLeave: '臨時外出',
    warningInSchoolNoTempLeave: '⚠️ 目前學生狀態為在校，不能選擇臨時外出',
    submitRecord: '提交記錄',
    submitting: '提交中...',
    eventStatistics: '事件統計',
    times: '次',
    noEventRecords: '暫無事件記錄',
    officialRecords: '公事記錄',
    personalRecords: '私事記錄',
    sickLeaveRecords: '病假記錄',
    temporaryLeaveRecords: '臨時外出記錄',
    close: '關閉',

    // StudentAdmin
    studentManagement: '學生管理',
    manageStudentInfo: '管理班級學生資訊、出勤狀態和統計資料',
    confirmSelection: '確認選擇',
    selectAll: '全選',
    classes: '個班級',
    searchStudentPlaceholder: '搜尋學生姓名或學號...',
    clear: '清除',
    refresh: '重新整理',
    refreshing: '重新整理中...',
    studentsInSchool: '在校學生',
    studentsLeftSchool: '離校學生',
    studentList: '學生列表',
    selectedClasses: '已選擇 {count} 個班級',
    loadingStudentList: '載入學生列表中...',
    pleaseSelectClass: '請先選擇班級',
    noMatchingStudents: '未找到符合的學生',
    noStudentData: '暫無學生資料',
    selectClassFromDropdown: '在上方下拉框中選擇要查看的班級',
    tryOtherKeywords: '請嘗試其他搜尋關鍵詞',
    noStudentsAddedYet: '還沒有新增學生哦～',
    addStudentNow: '立即新增學生',
    class: '班級',
    studentId: '學號',
    details: '詳情',
    delete: '刪除',
    showingRecords: '顯示第 {start} - {end} 條，共 {total} 條記錄',
    items: '條',
    firstPage: '首頁',
    previousPage: '上一頁',
    nextPage: '下一頁',
    lastPage: '末頁',
    jumpTo: '跳轉到',
    page: '頁',
    confirm: '確定',
    unknownClass: '未知班級({cid})',
    allClasses: '全部班級 ({count}個)',

    // Export
    classData: '班級資料',
    studentData: '學生資料',
    selectStudents: '選擇學生',
    selectedCount: '已選擇 {count} 人',
    startDate: '開始日期',
    endDate: '結束日期',
    quickSelect: '快捷選擇',
    lastWeek: '最近一週',
    lastMonth: '最近一月',
    lastQuarter: '最近一季',
    exporting: '匯出中...',

    // CountdownAdmin
    countdownManagement: '倒數計時管理',
    manageCountdownInfo: '管理所有班級倒數計時事件，查看截止日期和剩餘天數',
    createCountdown: '建立倒數計時',
    classFilter: '班級篩選',
    sort: '排序',
    dateDesc: '日期降序',
    dateAsc: '日期升序',
    foundCountdownsInfo: '共找到 {total} 個倒數計時',
    countdownContent: '倒數計時內容',
    sloganContent: '班級標語',
    deadline: '截止日期',
    daysRemaining: '剩餘天數',
    edit: '編輯',
    noCountdowns: '暫無倒數計時',
    editCountdown: '編輯倒數計時',
    enterCountdownContent: '請輸入倒數計時內容',
    create: '建立',
    pleaseFillAllFields: '請填寫所有必填項',
    createFailed: '建立失敗',
    updateFailed: '更新失敗',
    deleteFailed: '刪除失敗',
    loadFailed: '載入失敗',
    expired: '已過期',
    daysCount: '還有 {count} 天',
    pleaseSelect: '請選擇',

    // SettingAdmin
    displaySettings: '顯示設定',
    manageDisplaySettings: '管理各班級的內容展示設定',
    displayStatus: '顯示狀態',
    countdownDisplayed: '倒數計時已顯示',
    sloganDisplayed: '標語已顯示',
    foundSettingsInfo: '共找到 {total} 個設定',
    countdownDisplay: '倒數計時顯示',
    sloganDisplay: '標語顯示',
    noSettings: '暫無設定',
    editSettings: '編輯設定',
    countdownDisplayDesc: '是否在首頁顯示倒數計時',
    sloganDisplayDesc: '是否在首頁顯示標語',
    cancel: '取消',
    save: '儲存'
  },

  // 頁尾
  footer: {
    copyright: '版權所有 © {year} EduTrackly. 保留所有權利。',
    version: '版本',
    build: '建置'
  },

  // 關於頁面
  about: {
    title: '關於 EduTrackly',
    backToHome: '返回首頁',
    teamSection: '開發團隊',
    techStackSection: '技術棧',
    versionSection: '版本資訊',
    licenseSection: '授權資訊',

    // 技術棧分類
    techStack: {
      frontend: '前端技術',
      backend: '後端技術',
      devops: '開發維運',
      vue: 'Vue.js 3',
      vueRouter: 'Vue Router',
      i18n: 'Vue I18n',
      tailwind: 'Tailwind CSS',
      vite: 'Vite',
      axios: 'Axios',
      echarts: 'ECharts',
      springBoot: 'Spring Boot',
      myBatis: 'MyBatis-Plus',
      mysql: 'MySQL',
      redis: 'Redis',
      docker: 'Docker',
      nginx: 'Nginx',
      jenkins: 'Jenkins',
      git: 'Git'
    },

    // 版本資訊
    version: {
      current: '目前版本',
      buildTime: '建置時間',
      gitCommit: 'Git 提交',
      environment: '執行環境'
    },

    // 授權
    license: {
      title: 'GNU General Public License v3.0',
      description: '本專案採用 GNU 通用公共授權條款 v3.0 授權',
      freedom: '自由使用',
      freedomDesc: '可以自由執行、研究、修改和散布軟體',
      copyleft: 'Copyleft',
      copyleftDesc: '衍生作品必須使用相同的授權條款',
      disclosure: '原始碼公開',
      disclosureDesc: '散布時必須提供原始碼',
      viewLicense: '查看完整授權條款'
    },

    // 專案統計
    stats: {
      title: '專案統計',
      commits: '提交次數',
      contributors: '貢獻者',
      stars: 'Stars',
      forks: 'Forks'
    },

    // 加入我們
    joinUs: {
      title: '加入我們',
      description: '歡迎貢獻程式碼、回報問題或提出建議',
      github: 'GitHub 儲存庫',
      issues: '問題回報',
      pullRequests: '拉取請求'
    }
  },

  // 額外的 UI 文字
  extraUI: {
    // AttendanceDisplay
    expectedAttend: '應到',
    actualAttend: '實到',
    leaveList: '請假名單',
    temporaryJoinList: '臨時參加名單',
    noAttendanceInfo: '暫無出勤資訊',
    pleaseSelectClassFirst: '請先選擇班級',
    fetchAttendanceInfoFailed: '獲取出勤資訊失敗',
    fetchDataFailed: '獲取資料失敗',
    peopleUnit: '人',

    // CurrentAdmin
    adminConsole: '管理員控制台',
    realTimeMonitoring: '即時監控與管理',
    totalStudents: '學生總數',
    homeworkTasks: '作業任務',
    refresh: '重新整理',
    mainPanel: '主面板',
    classSelection: '班級選擇',
    currentClass: '目前班級',
    classIdLabel: '班級ID',
    pleaseSelectClass: '請選擇班級',
    systemStatus: '系統狀態',
    serviceRunning: '服務執行中',
    databaseConnected: '資料庫連線',
    realTimeSync: '即時同步',
    studentManagement: '學生管理',
    currentClassLabel: '目前班級',
    homeworkManagement: '作業管理',

    // ClassSwitch
    loadClassListFailed: '載入班級列表失敗',

    // SubmitHomework
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
    },
    getHomeworkSuccess: '獲取今日作業成功',

    // AddStudentModal - 詳細的錯誤提示
    lineFormatError: '第{index}行格式錯誤：應為「班級ID,姓名,出勤狀態」，當前有{count}個欄位',
    detectedChineseComma: '檢測到中文逗號「，」，請使用英文逗號「,」',
    detectedSpaceSeparator: '檢測到空格分隔符，請使用英文逗號「,」',
    detectedTabSeparator: '檢測到Tab分隔符，請使用英文逗號「,」',
    detectedChineseSemicolon: '檢測到中文分號「；」，請使用英文逗號「,」',
    detectedSemicolon: '檢測到分號「;」，請使用英文逗號「,」',
    detectedPipe: '檢測到豎線「|」，請使用英文逗號「,」',
    classIdMustBePositiveInteger: '第{index}行：班級ID「{cid}」必須是正整數',
    studentNameCannotBeEmpty: '第{index}行：學生姓名不能為空',
    studentNameTooLongAtLine: '第{index}行：學生姓名「{name}」不能超過50個字元',
    attendanceStatusMustBe0Or1: '第{index}行：出勤狀態「{status}」必須是0或1',
    noValidStudentInfo: '沒有有效的學生資訊',
    addStudentsFailed: '班級{cid}：{error}',
    partialAddFailed: '部分新增失敗：成功{count}個',
    addStudentFailedRetry: '新增學生失敗，請稍後重試',
    parseExcelError: '解析 Excel 檔案錯誤',
    readExcelFailed: '讀取 Excel 檔案失敗',
    fileUploadError: '檔案上傳錯誤',
    lineContent: '第{index}行原始內容',
    lineParsed: '第{index}行分割結果',
    parseSuccess: '第{index}行解析成功',
    headerLineDetected: '檢測到表頭行，已自動跳過',
    includesClass: '班級',
    includesName: '姓名',
    includesAttendance: '出勤',

    // Home view
    homeTitle: '首頁',

    // 通用錯誤和成功訊息
    operationSuccess: '操作成功',
    operationFailed: '操作失敗'
  }
}
