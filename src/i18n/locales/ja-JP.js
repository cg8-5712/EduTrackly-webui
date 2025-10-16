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
    total: '合計'
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
    system: 'システム'
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
    pleaseEnterContent: '宿題内容を入力してください',
    submitSuccess: '提出成功',
    submitFailed: '提出失敗',

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
    last: '最後'
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
    fileTypeNotSupported: 'サポートされていないファイルタイプ'
  },

  // フッター
  footer: {
    copyright: '© {year} EduTrackly. All rights reserved.',
    version: 'バージョン',
    build: 'ビルド'
  }
}
