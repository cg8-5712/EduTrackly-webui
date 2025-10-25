/**
 * 蓝色主题配置
 */
export default {
  id: 'blue',
  name: '海洋蓝',
  description: '清新海洋风格的蓝色主题',
  colors: {
    // 主色调
    primary: '#0ea5e9',
    secondary: '#06b6d4',

    // 背景色
    background: '#0c4a6e',
    surface: '#075985',
    headerFooter: '#0c4a6e', // 顶栏和底栏专用颜色

    // 文字颜色
    text: {
      primary: '#f0f9ff',
      secondary: '#bae6fd',
      tertiary: '#7dd3fc',
    },

    // 边框颜色
    border: '#0369a1',

    // 状态颜色
    error: '#f87171',
    success: '#34d399',
    warning: '#fbbf24',
    info: '#38bdf8',
  },

  // 阴影配置
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.35)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
  },
}
