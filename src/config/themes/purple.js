/**
 * 紫色主题配置
 */
export default {
  id: 'purple',
  name: '优雅紫',
  description: '优雅神秘的紫色主题',
  colors: {
    // 主色调
    primary: '#a855f7',
    secondary: '#8b5cf6',

    // 背景色
    background: '#581c87',
    surface: '#6b21a8',
    headerFooter: '#581c87', // 顶栏和底栏专用颜色

    // 文字颜色
    text: {
      primary: '#faf5ff',
      secondary: '#e9d5ff',
      tertiary: '#d8b4fe',
    },

    // 边框颜色
    border: '#7e22ce',

    // 状态颜色
    error: '#f87171',
    success: '#34d399',
    warning: '#fbbf24',
    info: '#c084fc',
  },

  // 阴影配置
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.35)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
  },
}
