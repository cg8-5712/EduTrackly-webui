/**
 * 日本語言語パック
 */
export default {
  // 共通
  common: {
    confirm: '確認',
    cancel: 'キャンセル',
    save: '保存',
    delete: '削除',
    edit: '編集',
    add: '追加',
    search: '検索',
    submit: '提出',
    reset: 'リセット',
    close: '閉じる',
    back: '戻る',
    next: '次へ',
    prev: '前へ',
    loading: '読み込み中...',
    noData: 'データなし',
    success: '成功',
    error: 'エラー',
    warning: '警告',
    info: '情報',
    logout: 'ログアウト',
    login: 'ログイン',
    username: 'ユーザー名',
    password: 'パスワード',
    pleaseEnter: '入力してください',
    pleaseSelect: '選択してください',
    all: 'すべて',
    today: '今日',
    yesterday: '昨日',
    thisWeek: '今週',
    thisMonth: '今月',
    total: '合計',
    fullscreen: '全画面',
    exitFullscreen: '全画面を終了',
    unknown: '不明',
    loginFailedRetry: 'ログインに失敗しました。もう一度お試しください',
    passwordRequired: 'パスワードを入力してください',
    passwordSafetyWarning: '管理者パスワードを安全に保管してください'
  },

  // ナビゲーション
  nav: {
    home: 'ホーム',
    homework: '宿題',
    submit: '提出',
    admin: '管理',
    student: '生徒',
    class: 'クラス',
    attendance: '出席',
    analysis: '分析',
    system: 'システム',
    currentadmin: '現在の状態',
    classadmin: 'クラス管理',
    studentadmin: '生徒管理',
    homeworkadmin: '宿題管理',
    countdownadmin: 'カウントダウン管理',
    settingadmin: '表示設定'
  },

  // テーマ
  theme: {
    title: 'テーマ設定',
    light: 'ライト',
    dark: 'ダーク',
    oceanBlue: 'オーシャンブルー',
    natureGreen: 'ネイチャーグリーン',
    elegantPurple: 'エレガントパープル',
    lightMode: 'ライトモード',
    darkMode: 'ダークモード',
    switchTo: '切り替え'
  },

  // 言語
  language: {
    title: '言語設定',
    zhCN: '简体中文',
    zhTW: '繁體中文',
    en: 'English',
    ja: '日本語'
  },

  // WeChatブラウザのヒント
  wechatTip: {
    message: 'WeChatブラウザを検出しました。右上の「...」をタップして「ブラウザで開く」を選択すると、より良い体験が得られます'
  },

  // 生徒管理
  student: {
    title: '生徒管理',
    list: '生徒リスト',
    add: '生徒を追加',
    edit: '生徒を編集',
    delete: '生徒を削除',
    detail: '生徒詳細',
    name: '氏名',
    studentId: '学籍番号',
    class: 'クラス',
    gender: '性別',
    age: '年齢',
    phone: '電話',
    email: 'メール',
    address: '住所',
    status: 'ステータス',
    male: '男性',
    female: '女性',
    active: '在籍',
    inactive: '退籍',
    searchPlaceholder: '氏名または学籍番号で検索',
    noStudents: '生徒なし',
    selectStudent: '生徒を選択',
    studentInfo: '生徒情報'
  },

  // クラス管理
  class: {
    title: 'クラス管理',
    list: 'クラスリスト',
    add: 'クラスを追加',
    edit: 'クラスを編集',
    delete: 'クラスを削除',
    detail: 'クラス詳細',
    name: 'クラス名',
    classId: 'クラスID',
    grade: '学年',
    teacher: '担任',
    studentCount: '生徒数',
    selectClass: 'クラスを選択',
    searchPlaceholder: 'クラスを検索',
    noClasses: 'クラスなし',
    classInfo: 'クラス情報',
    switch: 'クラスを切り替え'
  },

  // 宿題管理
  homework: {
    title: '宿題管理',
    list: '宿題リスト',
    add: '宿題を出す',
    edit: '宿題を編集',
    delete: '宿題を削除',
    detail: '宿題詳細',
    submit: '宿題を提出',
    submitHomework: '宿題を提出',
    homeworkContent: '宿題内容',
    dueDate: '提出期限',
    status: 'ステータス',
    submitted: '提出済み',
    notSubmitted: '未提出',
    today: '今日の宿題',
    todayHomework: '今日の宿題',
    noHomework: '宿題なし',
    noHomeworkToday: '今日は宿題が出ていません',
    pleaseEnterContent: '宿題内容を入力してください',
    submitSuccess: '提出成功',
    submitFailed: '提出失敗',
    fetchFailed: '宿題の取得に失敗しました。後でもう一度お試しください',

    // 科目
    subjects: {
      chinese: '国語',
      math: '数学',
      english: '英語',
      physics: '物理',
      chemistry: '化学',
      biology: '生物',
      history: '歴史',
      geography: '地理',
      politics: '政治',
      others: 'その他'
    }
  },

  // 出席管理
  attendance: {
    title: '出席管理',
    record: '出席記録',
    statistics: '出席統計',
    present: '出席',
    absent: '欠席',
    late: '遅刻',
    leave: '休暇',
    personalLeave: '私用休暇',
    sickLeave: '病気休暇',
    officialLeave: '公休',
    excused: '欠席届',
    date: '日付',
    time: '時間',
    status: 'ステータス',
    reason: '理由',
    remark: '備考',
    todayAttendance: '今日の出席',
    attendanceRate: '出席率',
    absentRate: '欠席率',
    submitEvents: 'イベントを提出',
    selectEvent: 'イベントタイプを選択'
  },

  // 分析
  analysis: {
    title: 'データ分析',
    overview: '概要',
    statistics: '統計',
    chart: 'チャート',
    report: 'レポート',
    export: 'エクスポート',
    attendanceAnalysis: '出席分析',
    homeworkAnalysis: '宿題分析',
    performanceAnalysis: '成績分析',
    trendAnalysis: '傾向分析',
    dateRange: '期間',
    selectDateRange: '期間を選択'
  },

  // 管理者
  admin: {
    title: '管理者',
    login: '管理者ログイン',
    logout: 'ログアウト',
    dashboard: 'ダッシュボード',
    settings: '設定',
    studentAdmin: '生徒管理',
    classAdmin: 'クラス管理',
    homeworkAdmin: '宿題管理',
    attendanceAdmin: '出席管理',
    systemSettings: 'システム設定',
    currentAdmin: '現在の管理者',
    adminInfo: '管理者情報',
    lastLoginTime: '最終ログイン時刻',
    lastLoginIp: '最終ログインIP',
    pleaseEnterPassword: 'パスワードを入力してください',
    loginSuccess: 'ログイン成功',
    loginFailed: 'ログイン失敗',
    sessionExpired: 'セッションが期限切れです。再度ログインしてください'
  },

  // システム設定
  system: {
    title: 'システム設定',
    general: '一般設定',
    appearance: '外観設定',
    language: '言語設定',
    theme: 'テーマ設定',
    notification: '通知設定',
    account: 'アカウント設定',
    security: 'セキュリティ設定',
    about: 'について',
    version: 'バージョン',
    copyright: '著作権情報'
  },

  // 通知
  notification: {
    title: '通知',
    success: '操作成功',
    error: '操作失敗',
    warning: '警告',
    info: 'お知らせ',
    addSuccess: '追加成功',
    addFailed: '追加失敗',
    editSuccess: '編集成功',
    editFailed: '編集失敗',
    deleteSuccess: '削除成功',
    deleteFailed: '削除失敗',
    saveSuccess: '保存成功',
    saveFailed: '保存失敗',
    submitSuccess: '提出成功',
    submitFailed: '提出失敗',
    loadSuccess: '読み込み成功',
    loadFailed: '読み込み失敗',
    networkError: 'ネットワークエラー',
    serverError: 'サーバーエラー',
    unauthorized: '未認証',
    forbidden: 'アクセス拒否',
    notFound: '見つかりません',
    confirmDelete: '削除してもよろしいですか？',
    confirmLogout: 'ログアウトしてもよろしいですか？',
    dataRequired: '必須項目を入力してください',
    invalidData: 'データ形式が正しくありません',
    operationCancelled: '操作がキャンセルされました'
  },

  // 日時
  datetime: {
    year: '年',
    month: '月',
    day: '日',
    hour: '時',
    minute: '分',
    second: '秒',
    monday: '月曜日',
    tuesday: '火曜日',
    wednesday: '水曜日',
    thursday: '木曜日',
    friday: '金曜日',
    saturday: '土曜日',
    sunday: '日曜日',
    selectDate: '日付を選択',
    selectTime: '時刻を選択',
    startDate: '開始日',
    endDate: '終了日'
  },

  // ページネーション
  pagination: {
    total: '合計 {total} 件',
    page: '{page} ページ',
    perPage: '{size} 件/ページ',
    goto: 'ジャンプ',
    prev: '前へ',
    next: '次へ',
    first: '最初',
    last: '最後',
    itemsUnit: ' 件',
    peopleUnit: ' 人'
  },

  // エラーメッセージ
  error: {
    default: 'エラーが発生しました',
    network: 'ネットワーク接続失敗',
    timeout: 'リクエストタイムアウト',
    server: 'サーバーエラー',
    notFound: 'リソースが見つかりません',
    forbidden: 'アクセス権限がありません',
    unauthorized: 'ログインしていないか、セッションが期限切れです',
    badRequest: 'リクエストパラメータエラー',
    formValidation: 'フォーム検証失敗',
    fileUpload: 'ファイルアップロード失敗',
    fileSizeExceeded: 'ファイルサイズが制限を超えています',
    fileTypeNotSupported: 'サポートされていないファイルタイプ',

    // Service specific errors
    classIdRequired: 'クラスIDは必須です',
    studentDataEmpty: '生徒データを空にすることはできません',
    studentIdRequired: '生徒IDは必須です',
    dateRequired: '日付は必須です',
    eventDataEmpty: 'イベントデータを空にすることはできません',
    classIdOrNameRequired: 'クラスIDまたはクラス名は必須です',
    classNameRequired: 'クラス名は必須です',
    classIdEmpty: 'クラスIDを空にすることはできません',
    homeworkContentAndDateRequired: 'クラスID、宿題内容、提出期限は必須です',
    invalidThemeId: '無効なテーマID',
    themeConfigNotFound: 'テーマ設定が見つかりません',
    notificationTypeNotSupported: '通知タイプ "{type}" はサポートされていません。デフォルトで "info" を使用します',

    // Validation errors
    studentNameEmpty: '{index}番目の生徒名を空にすることはできません',
    studentNameTooLong: '{index}番目の生徒名は50文字を超えることはできません',
    selectDateAndEventType: '日付とイベントタイプを選択してください',
    inSchoolCannotSelectTempLeave: '在籍中の生徒は一時退出を選択できません',
    atLeastOneSubjectRequired: '少なくとも1つの科目の宿題を入力してください',

    // File upload errors
    fileTypesSupported: '.txt、.csv、.xlsx、.xls ファイルのみアップロード可能です',
    fileSizeLimit: 'ファイルサイズは5MBを超えることはできません',
    headerRowSkipped: 'ヘッダー行が検出され、自動的にスキップされました',
    excelLoadSuccess: 'Excelファイルの読み込みに成功しました: {filename}、{count}行のデータ',
    excelParseFailed: 'Excelファイルの解析に失敗しました。ファイル形式を確認してください',
    excelReadFailed: 'Excelファイルの読み取りに失敗しました',
    fileLoadSuccess: 'ファイルの読み込みに成功しました: {filename}',
    fileReadFailed: 'ファイルの読み取りに失敗しました'
  },

  // Service messages (console logs and operations)
  service: {
    // Student service
    batchAddingStudents: '生徒を一括追加中',
    batchAddStudentsFailed: '生徒の一括追加に失敗しました',
    changingAttendanceStatus: '出席状況を変更中',
    changeAttendanceStatusFailed: '出席状況の変更に失敗しました',
    deletingStudent: '生徒を削除中',
    deleteStudentFailed: '生徒の削除に失敗しました',
    submittingStudentEvents: '生徒イベントを送信中',
    submitStudentEventsFailed: '生徒イベントの送信に失敗しました',
    gettingStudentAnalysis: '生徒分析データを取得中',
    getStudentAnalysisFailed: '生徒分析データの取得に失敗しました',

    // Homework service
    getHomeworkSuccess: '宿題の取得に成功しました',
    getHomeworkFailed: '宿題の取得に失敗しました',
    getHomeworkListSuccess: '宿題リストの取得に成功しました',
    getHomeworkListFailed: '宿題リストの取得に失敗しました',
    createHomeworkSuccess: '宿題の作成に成功しました',
    createHomeworkFailed: '宿題の作成に失敗しました',
    updateHomeworkSuccess: '宿題の更新に成功しました',
    updateHomeworkFailed: '宿題の更新に失敗しました',
    deleteHomeworkSuccess: '宿題の削除に成功しました',
    deleteHomeworkFailed: '宿題の削除に失敗しました',

    // Class service
    getClassListSuccess: 'クラスリストの取得に成功しました',
    getClassListFailed: 'クラスリストの取得に失敗しました',
    getClassDetailSuccess: 'クラス詳細の取得に成功しました',
    getClassDetailFailed: 'クラス詳細の取得に失敗しました',
    getClassInfoSuccess: 'クラス情報の取得に成功しました',
    getClassInfoFailed: 'クラス情報の取得に失敗しました',
    createClassSuccess: 'クラスの作成に成功しました',
    createClassFailed: 'クラスの作成に失敗しました',
    deleteClassSuccess: 'クラスの削除に成功しました',
    deleteClassFailed: 'クラスの削除に失敗しました',
    getClassAnalysisSuccess: 'クラス分析データの取得に成功しました',
    getClassAnalysisFailed: 'クラス分析データの取得に失敗しました',
    getClassesFailed: 'クラスの取得に失敗しました',

    // Theme service
    themeSaved: 'テーマが保存されました',
    saveThemeFailed: 'テーマの保存に失敗しました',
    loadingCachedTheme: 'キャッシュされたテーマを読み込み中',
    usingDefaultTheme: 'デフォルトテーマを使用中',
    loadThemeFailed: 'テーマの読み込みに失敗しました',
    themeCacheCleared: 'テーマキャッシュがクリアされました',
    clearThemeCacheFailed: 'テーマキャッシュのクリアに失敗しました',
    themeApplied: 'テーマが適用されました',
    allThemeCacheCleared: 'すべてのテーマキャッシュがクリアされました'
  },

  // Component specific messages
  component: {
    // ClassAdmin
    classCreatedSuccess: 'クラスの作成に成功しました',
    createClassFailed: 'クラスの作成に失敗しました',
    classDeletedSuccess: 'クラスの削除に成功しました',
    deleteClassFailed: 'クラスの削除に失敗しました',
    getClassListFailed: 'クラスリストの取得に失敗しました',
    getClassAnalysisFailed: 'クラス分析データの取得に失敗しました',
    getClassDetailFailed: 'クラス詳細の取得に失敗しました',

    // StudentAdmin
    getStudentListFailed: '生徒リストの取得に失敗しました',
    getStudentsForClassFailed: 'クラス {className} の生徒の取得に失敗しました',
    changeAttendanceStatusFailed: '出席状況の変更に失敗しました',
    deleteStudentSuccess: '生徒 {studentName} の削除に成功しました',
    deleteStudentFailed: '生徒の削除に失敗しました',
    confirmDeleteStudent: '生徒 {studentName} を削除してもよろしいですか？この操作は元に戻せません。',
    statusChangedTo: 'ステータスが次に変更されました',

    // HomeworkAdmin
    homeworkCreatedSuccess: '宿題の作成に成功しました',
    createHomeworkFailed: '宿題の作成に失敗しました',
    homeworkUpdatedSuccess: '宿題の更新に成功しました',
    updateHomeworkFailed: '宿題の更新に失敗しました',
    homeworkDeletedSuccess: '宿題の削除に成功しました',
    deleteHomeworkFailed: '宿題の削除に失敗しました',
    getHomeworkListFailed: '宿題リストの取得に失敗しました',

    // AddStudentModal
    studentsAddedSuccess: '{count}人の生徒を正常に追加しました',
    studentAddedSuccess: '生徒の追加に成功しました',

    // StudentDetailModal
    historyRecordAddedSuccess: '履歴記録の追加に成功しました',
    submitEventRecordFailed: 'イベント記録の送信に失敗しました',

    // StudentEventSelector
    submitSuccess: '送信に成功しました',
    submitFailed: '送信に失敗しました'
  },

  // UI text
  ui: {
    // ClassAdmin
    classManagement: 'クラス管理',
    manageClassInfo: 'すべてのクラス情報を管理し、生徒数と作成時刻を確認します',
    createClass: 'クラスを作成',
    searchClassName: 'クラス名を検索...',
    itemsPerPage: 'ページあたりの項目数',
    foundClassesInfo: '{total}個のクラスが見つかりました。ページあたり{size}件表示',
    className: 'クラス名',
    id: 'ID',
    studentCount: '生徒数',
    creationTime: '作成時刻',
    actions: '操作',
    viewDetails: '詳細を表示',
    deleteClass: 'クラスを削除',
    createNewClass: '新しいクラスを作成',
    enterClassName: 'クラス名を入力してください',
    confirmCreate: '作成を確認',
    classDetails: 'クラス詳細 - {className}',
    loadingDetails: '詳細を読み込み中...',
    classId: 'クラスID：',
    classNameLabel: 'クラス名：',
    creationTimeLabel: '作成時刻：',
    classStatistics: 'クラス統計分析',
    totalStudents: '生徒総数',
    expectedAttendance: '予定出席者数',
    todayAttendance: '本日の出席',
    todayAttendanceRate: '本日の出席率',
    noHistoricalAttendance: '履歴出席データなし',
    classStudents: 'クラスの生徒',
    inSchool: '在籍中',
    absent: '欠席',
    noStudentsYet: '生徒はまだいません',
    confirmDelete: '削除を確認',
    confirmDeleteClass: 'クラス "{className}" を削除してもよろしいですか？',
    cannotUndo: 'この操作は元に戻せません。慎重に操作してください！',
    deleting: '削除中...',
    confirmDeleteButton: '削除を確認',

    // AddStudentModal
    addStudent: '生徒を追加',
    manual: '手動',
    batch: '一括',
    targetClass: '対象クラス',
    selectClass: 'クラスを選択してください',
    studentName: '生徒名',
    enterStudentName: '生徒名を入力してください',
    initialStatus: '初期ステータス',
    leftSchool: '退学',
    batchInputStudentInfo: '生徒情報を一括入力',
    batchInputPlaceholder: 'CSV形式、1行に1人の生徒、形式：クラスID,氏名,出席状況\n例：\n1,山田太郎,1\n1,田中花子,0\n\n出席状況：1=在籍中、0=退学',
    batchInputHelp: 'CSV形式：クラスID,氏名,出席状況（1=在籍中、0=退学）',
    selectFile: 'ファイルを選択',
    fileFormatHint: '.txt、.csv、.xlsx/.xls ファイルをアップロード可能（各行の形式：クラスID,氏名,出席状況）',
    confirmAdd: '追加を確認',
    adding: '追加中...',
    selectClassRequired: '対象クラスを選択してください',
    studentInfoRequired: '生徒情報を入力してください',
    studentNameRequired: '生徒名を空にすることはできません',
    studentNameMaxLength: '生徒名は50文字を超えることはできません',

    // StudentDetailModal
    studentIdLabel: '学籍番号',
    loadingAnalysisData: '分析データを読み込み中...',
    loadAnalysisDataFailed: '分析データの読み込みに失敗しました',
    retry: '再試行',
    basicInfo: '基本情報',
    name: '氏名',
    attendanceStatus: '出席状況',
    addHistoryRecord: '履歴記録を追加',
    selectDate: '日付を選択',
    clickToSelectDate: 'クリックして日付を選択',
    eventType: 'イベントタイプ',
    official: '公用',
    personal: '私用',
    sickLeave: '病気休暇',
    temporaryLeave: '一時退出',
    warningInSchoolNoTempLeave: '⚠️ 在籍中の生徒は一時退出を選択できません',
    submitRecord: '記録を送信',
    submitting: '送信中...',
    eventStatistics: 'イベント統計',
    times: '回',
    noEventRecords: 'イベント記録なし',
    officialRecords: '公用記録',
    personalRecords: '私用記録',
    sickLeaveRecords: '病気休暇記録',
    temporaryLeaveRecords: '一時退出記録',
    close: '閉じる',

    // StudentAdmin
    studentManagement: '生徒管理',
    manageStudentInfo: 'クラスの生徒情報、出席状況、統計データを管理します',
    confirmSelection: '選択を確認',
    selectAll: 'すべて選択',
    classes: 'クラス',
    searchStudentPlaceholder: '生徒名または学籍番号で検索...',
    clear: 'クリア',
    refresh: '更新',
    refreshing: '更新中...',
    studentsInSchool: '在籍中の生徒',
    studentsLeftSchool: '退学した生徒',
    studentList: '生徒リスト',
    selectedClasses: '{count}個のクラスを選択',
    loadingStudentList: '生徒リストを読み込み中...',
    pleaseSelectClass: '最初にクラスを選択してください',
    noMatchingStudents: '一致する生徒が見つかりません',
    noStudentData: '生徒データなし',
    selectClassFromDropdown: '上のドロップダウンから表示するクラスを選択してください',
    tryOtherKeywords: '他のキーワードをお試しください',
    noStudentsAddedYet: 'まだ生徒が追加されていません',
    addStudentNow: '今すぐ生徒を追加',
    class: 'クラス',
    studentId: '学籍番号',
    details: '詳細',
    delete: '削除',
    showingRecords: '{start} - {end}件を表示中、合計{total}件',
    items: ' 件',
    firstPage: '最初',
    previousPage: '前へ',
    nextPage: '次へ',
    lastPage: '最後',
    jumpTo: 'ジャンプ',
    page: ' ページ',
    confirm: '確認',
    unknownClass: '不明なクラス({cid})',
    allClasses: 'すべてのクラス ({count}個)',

    // CountdownAdmin
    countdownManagement: 'カウントダウン管理',
    manageCountdownInfo: 'すべてのクラスのカウントダウンイベントを管理し、期限と残り日数を確認します',
    createCountdown: 'カウントダウンを作成',
    classFilter: 'クラスフィルター',
    sort: '並び替え',
    dateDesc: '日付降順',
    dateAsc: '日付昇順',
    foundCountdownsInfo: '{total}個のカウントダウンが見つかりました',
    countdownContent: 'カウントダウン内容',
    sloganContent: 'クラススローガン',
    deadline: '期限',
    daysRemaining: '残り日数',
    edit: '編集',
    noCountdowns: 'カウントダウンはありません',
    editCountdown: 'カウントダウンを編集',
    enterCountdownContent: 'カウントダウン内容を入力してください',
    create: '作成',
    pleaseFillAllFields: 'すべての必須項目を入力してください',
    createFailed: '作成に失敗しました',
    updateFailed: '更新に失敗しました',
    deleteFailed: '削除に失敗しました',
    loadFailed: '読み込みに失敗しました',
    expired: '期限切れ',
    daysCount: 'あと{count}日',
    pleaseSelect: '選択してください',

    // SettingAdmin
    displaySettings: '表示設定',
    manageDisplaySettings: '各クラスのコンテンツ表示設定を管理します',
    displayStatus: '表示ステータス',
    countdownDisplayed: 'カウントダウン表示中',
    sloganDisplayed: 'スローガン表示中',
    foundSettingsInfo: '{total}個の設定が見つかりました',
    countdownDisplay: 'カウントダウン表示',
    sloganDisplay: 'スローガン表示',
    noSettings: '設定はありません',
    editSettings: '設定を編集',
    countdownDisplayDesc: 'ホームページにカウントダウンを表示するかどうか',
    sloganDisplayDesc: 'ホームページにスローガンを表示するかどうか',
    cancel: 'キャンセル',
    save: '保存'
  },

  // フッター
  footer: {
    copyright: '© {year} EduTrackly. All rights reserved.',
    version: 'バージョン',
    build: 'ビルド'
  },

  // About ページ
  about: {
    title: 'EduTrackly について',
    backToHome: 'ホームに戻る',
    teamSection: '開発チーム',
    techStackSection: '技術スタック',
    versionSection: 'バージョン情報',
    licenseSection: 'ライセンス情報',

    // 技術スタック分類
    techStack: {
      frontend: 'フロントエンド技術',
      backend: 'バックエンド技術',
      devops: 'DevOps',
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

    // バージョン情報
    version: {
      current: '現在のバージョン',
      buildTime: 'ビルド時刻',
      gitCommit: 'Git コミット',
      environment: '実行環境'
    },

    // ライセンス
    license: {
      title: 'GNU General Public License v3.0',
      description: 'このプロジェクトは GNU 一般公衆ライセンス v3.0 の下で提供されています',
      freedom: '自由',
      freedomDesc: 'ソフトウェアを実行、研究、変更、配布する自由',
      copyleft: 'コピーレフト',
      copyleftDesc: '派生作品は同じライセンスを使用する必要があります',
      disclosure: 'ソースコード開示',
      disclosureDesc: '配布時にソースコードを提供する必要があります',
      viewLicense: '完全なライセンスを表示'
    },

    // プロジェクト統計
    stats: {
      title: 'プロジェクト統計',
      commits: 'コミット数',
      contributors: '貢献者',
      stars: 'Stars',
      forks: 'Forks'
    },

    // 参加する
    joinUs: {
      title: '参加する',
      description: 'コードの貢献、問題報告、提案を歓迎します',
      github: 'GitHub リポジトリ',
      issues: '問題トラッカー',
      pullRequests: 'プルリクエスト'
    }
  },

  // 追加の UI テキスト
  extraUI: {
    // AttendanceDisplay
    expectedAttend: '予定',
    actualAttend: '実際',
    leaveList: '欠席リスト',
    temporaryJoinList: '一時参加リスト',
    noAttendanceInfo: '出席情報なし',
    pleaseSelectClassFirst: '最初にクラスを選択してください',
    fetchAttendanceInfoFailed: '出席情報の取得に失敗しました',
    fetchDataFailed: 'データの取得に失敗しました',
    peopleUnit: '人',

    // CurrentAdmin
    adminConsole: '管理者コンソール',
    realTimeMonitoring: 'リアルタイム監視と管理',
    totalStudents: '生徒総数',
    homeworkTasks: '宿題タスク',
    refresh: '更新',
    mainPanel: 'メインパネル',
    classSelection: 'クラス選択',
    currentClass: '現在のクラス',
    classIdLabel: 'クラスID',
    pleaseSelectClass: 'クラスを選択してください',
    systemStatus: 'システムステータス',
    serviceRunning: 'サービス実行中',
    databaseConnected: 'データベース接続済み',
    realTimeSync: 'リアルタイム同期',
    studentManagement: '生徒管理',
    currentClassLabel: '現在のクラス',
    homeworkManagement: '宿題管理',

    // ClassSwitch
    loadClassListFailed: 'クラスリストの読み込みに失敗しました',

    // SubmitHomework
    subjects: {
      chinese: '国語',
      math: '数学',
      english: '英語',
      physics: '物理',
      chemistry: '化学',
      biology: '生物',
      history: '歴史',
      geography: '地理',
      politics: '政治',
      others: 'その他'
    },
    getHomeworkSuccess: '今日の宿題を取得しました',

    // AddStudentModal - 詳細なエラーメッセージ
    lineFormatError: '{index}行目の形式エラー：「クラスID,氏名,出席状況」であるべきですが、{count}個のフィールドがあります',
    detectedChineseComma: '中国語のコンマ「，」が検出されました。英語のコンマ「,」を使用してください',
    detectedSpaceSeparator: 'スペース区切りが検出されました。英語のコンマ「,」を使用してください',
    detectedTabSeparator: 'タブ区切りが検出されました。英語のコンマ「,」を使用してください',
    detectedChineseSemicolon: '中国語のセミコロン「；」が検出されました。英語のコンマ「,」を使用してください',
    detectedSemicolon: 'セミコロン「;」が検出されました。英語のコンマ「,」を使用してください',
    detectedPipe: 'パイプ「|」が検出されました。英語のコンマ「,」を使用してください',
    classIdMustBePositiveInteger: '{index}行目：クラスID「{cid}」は正の整数である必要があります',
    studentNameCannotBeEmpty: '{index}行目：生徒名を空にすることはできません',
    studentNameTooLongAtLine: '{index}行目：生徒名「{name}」は50文字を超えることはできません',
    attendanceStatusMustBe0Or1: '{index}行目：出席状況「{status}」は0または1である必要があります',
    noValidStudentInfo: '有効な生徒情報がありません',
    addStudentsFailed: 'クラス{cid}：{error}',
    partialAddFailed: '一部の追加に失敗しました：成功{count}件',
    addStudentFailedRetry: '生徒の追加に失敗しました。後でもう一度お試しください',
    parseExcelError: 'Excel ファイルの解析エラー',
    readExcelFailed: 'Excel ファイルの読み取りに失敗しました',
    fileUploadError: 'ファイルアップロードエラー',
    lineContent: '{index}行目の元の内容',
    lineParsed: '{index}行目の解析結果',
    parseSuccess: '{index}行目を正常に解析しました',
    headerLineDetected: 'ヘッダー行が検出され、自動的にスキップされました',
    includesClass: 'クラス',
    includesName: '氏名',
    includesAttendance: '出席',

    // Home view
    homeTitle: 'ホーム',

    // 一般的な成功とエラーメッセージ
    operationSuccess: '操作が成功しました',
    operationFailed: '操作が失敗しました'
  }
}
