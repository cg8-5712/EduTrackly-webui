/**
 * 绿色主题配置
 */
export default {
  id: 'green',
  name: '自然绿',
  description: '清新自然的绿色主题',
  colors: {
    // 主色调
    primary: '#10b981',
    secondary: '#059669',

    // 背景色
    background: '#064e3b',
    surface: '#065f46',
    headerFooter: '#064e3b', // 顶栏和底栏专用颜色

    // 文字颜色
    text: {
      primary: '#ecfdf5',
      secondary: '#a7f3d0',
      tertiary: '#6ee7b7',
    },

    // 边框颜色
    border: '#047857',

    // 状态颜色
    error: '#f87171',
    success: '#34d399',
    warning: '#fbbf24',
    info: '#22d3ee',
  },

  // 阴影配置
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.35)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
  },
}
