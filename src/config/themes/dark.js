/**
 * 深色主题配置
 */
export default {
  id: 'dark',
  name: '深色',
  description: '护眼舒适的深色主题',
  colors: {
    // 主色调
    primary: '#60a5fa',
    secondary: '#a78bfa',

    // 背景色
    background: '#111827',
    surface: '#1f2937',
    headerFooter: '#212936', // 顶栏和底栏专用颜色

    // 文字颜色
    text: {
      primary: '#f9fafb',
      secondary: '#d1d5db',
      tertiary: '#9ca3af',
    },

    // 边框颜色
    border: '#374151',

    // 状态颜色
    error: '#f87171',
    success: '#34d399',
    warning: '#fbbf24',
    info: '#60a5fa',
  },

  // 阴影配置
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.25)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
  },
}
