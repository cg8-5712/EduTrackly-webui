/**
 * 浅色主题配置
 */
export default {
  id: 'light',
  name: '浅色',
  description: '明亮清爽的浅色主题',
  colors: {
    // 主色调
    primary: '#3b82f6',
    secondary: '#8b5cf6',

    // 背景色
    background: '#f9fafb',
    surface: '#ffffff',
    headerFooter: '#ffffff', // 顶栏和底栏专用颜色

    // 文字颜色
    text: {
      primary: '#111827',
      secondary: '#6b7280',
      tertiary: '#9ca3af',
    },

    // 边框颜色
    border: '#e5e7eb',

    // 状态颜色
    error: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b',
    info: '#3b82f6',
  },

  // 阴影配置
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
}
