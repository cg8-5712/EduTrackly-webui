# i18n 国际化使用说明

## 概述

项目已实现完整的国际化（i18n）功能，支持简体中文、繁体中文、英文和日文四种语言。语言设置是**全局共享**的，在任何页面切换语言后，所有其他页面（包括Admin管理页面）都会自动使用相同的语言。

## 特性

### 1. 全局语言管理
- **单例模式**：使用 `I18nService` 单例，确保整个应用只有一个语言状态
- **自动同步**：在任何页面切换语言后，所有页面立即同步
- **持久化存储**：语言选择保存在 localStorage 中，刷新页面后保持不变
- **浏览器检测**：首次访问时自动检测浏览器语言

### 2. 支持的语言

| 语言代码 | 语言名称 | 显示名称 |
|---------|---------|---------|
| `zh-CN` | 简体中文 | 中文 |
| `zh-TW` | 繁體中文 | 繁體 |
| `en-US` | English | EN |
| `ja-JP` | 日本語 | 日本語 |

### 3. 已适配的组件

#### 主要页面
- ✅ **Home.vue** - 首页
- ✅ **Homework.vue** - 作业页面
- ✅ **Admin.vue** - 管理员登录和管理后台
- ✅ **ClassSwitch.vue** - 班级切换组件
- ✅ **LanguageToggle.vue** - 语言切换器

#### 待适配组件
- ⏳ AttendanceDisplay - 考勤显示
- ⏳ SubmitHomework - 提交作业
- ⏳ StudentEventSelector - 学生事件选择器
- ⏳ Calendar - 日历组件
- ⏳ Admin子组件（CurrentAdmin, ClassAdmin等）

## 使用方法

### 用户使用

1. **切换语言**：
   - 点击页面右上角的语言按钮（显示当前语言简写）
   - 或者悬停在按钮上，在弹出菜单中选择语言

2. **语言会全局生效**：
   - 在首页切换语言 → Admin页面也会使用相同语言
   - 在Admin页面切换语言 → 返回首页也会使用相同语言
   - 语言设置在所有页面之间共享

3. **自动保存**：
   - 语言选择会自动保存，下次访问时恢复

### 开发者使用

#### 1. 在 Vue 组件中使用（Composition API）

```vue
<template>
  <div>
    <h1>{{ $t('common.title') }}</h1>
    <button>{{ $t('common.submit') }}</button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

// 在计算属性或函数中使用
const message = computed(() => {
  return $t('notification.success')
})
</script>
```

#### 2. 在 Vue 组件中使用（Options API）

```vue
<template>
  <div>
    <h1>{{ $t('common.title') }}</h1>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  setup() {
    const { t } = useI18n()
    return { t }
  },
  methods: {
    showMessage() {
      alert(this.t('notification.success'))
    }
  }
}
</script>
```

#### 3. 在 JavaScript 文件中使用

```javascript
import i18nService from '@/services/common/i18n'

// 获取翻译
const message = i18nService.t('common.loading')

// 切换语言
i18nService.setLanguage('en-US')

// 获取当前语言
const currentLang = i18nService.getCurrentLocale()
```

## 语言包结构

语言包文件位于 `src/i18n/locales/` 目录：

```
src/i18n/locales/
├── zh-CN.js  # 简体中文
├── zh-TW.js  # 繁体中文
├── en-US.js  # 英文
└── ja-JP.js  # 日文
```

### 语言包组织

每个语言包按功能模块组织：

```javascript
export default {
  common: {
    confirm: '确认',
    cancel: '取消',
    // ...
  },
  nav: {
    home: '首页',
    homework: '作业',
    // ...
  },
  homework: {
    title: '作业管理',
    submit: '提交作业',
    // ...
  },
  // ... 更多模块
}
```

### 添加新翻译

在所有语言包中添加相同的键：

```javascript
// zh-CN.js
homework: {
  newKey: '新功能'
}

// en-US.js
homework: {
  newKey: 'New Feature'
}
```

## 技术实现

### 1. 服务架构

```
i18nService (单例)
├── LanguageStorage (localStorage管理)
├── state (响应式语言状态)
└── Vue i18n (国际化引擎)
```

### 2. 数据流

```
用户切换语言
  ↓
LanguageToggle 组件
  ↓
i18nService.setLanguage()
  ↓
更新 state.currentLocale
  ↓
watch 监听器触发
  ↓
├── 保存到 localStorage
├── 更新 Vue i18n locale
└── 更新 HTML lang 属性
  ↓
所有组件自动重新渲染
```

### 3. 核心文件

- **src/services/common/i18n.js** - i18n服务（单例）
- **src/i18n/index.js** - Vue i18n配置
- **src/components/common/LanguageToggle.vue** - 语言切换器
- **src/i18n/locales/** - 语言包文件

## 常见问题

### Q: 为什么切换语言后某些文本没有变化？

**A:** 该组件还没有适配i18n，需要将硬编码的文本替换为 `$t()` 函数调用。

### Q: 如何在Admin页面也使用全局语言？

**A:** Admin页面已经使用全局语言。由于i18nService是单例，所有页面共享同一个语言状态。在任何页面切换语言，Admin页面会自动同步。

### Q: 语言设置会在刷新后丢失吗？

**A:** 不会。语言设置保存在localStorage中，刷新页面后会自动恢复。

### Q: 如何添加新语言？

**A:**
1. 在 `src/i18n/locales/` 创建新语言包文件
2. 在 `src/i18n/index.js` 中导入并注册
3. 在 `src/services/common/i18n.js` 的 `availableLocales` 数组中添加新语言配置

### Q: 如何调试语言切换？

**A:** 打开浏览器控制台，查看 `[i18n Service]` 前缀的日志：
```
[i18n Service] Language saved: en-US
[i18n Service] Language applied: en-US
```

## 配置

### 默认语言

在 `.env` 文件中设置：

```env
# 默认语言: zh-CN | zh-TW | en-US | ja-JP
VITE_DEFAULT_LOCALE=zh-CN
```

### 禁用浏览器语言检测

修改 `src/services/common/i18n.js`：

```javascript
loadLanguageFromStorage() {
  const savedLocale = this.storage.load()
  if (savedLocale && this.isValidLocale(savedLocale)) {
    this.state.currentLocale = savedLocale
  } else {
    // 注释掉浏览器检测，始终使用默认语言
    // const browserLocale = this.detectBrowserLanguage()
    this.state.currentLocale = this.defaultLocale
  }
}
```

## 待完成工作

### 高优先级
- [ ] 适配所有Admin子组件（CurrentAdmin, ClassAdmin, StudentAdmin等）
- [ ] 适配AttendanceDisplay考勤组件
- [ ] 适配SubmitHomework提交作业组件
- [ ] 适配Calendar日历组件

### 中优先级
- [ ] 适配所有通知消息
- [ ] 适配表单验证消息
- [ ] 适配错误提示

### 低优先级
- [ ] 添加更多语言支持（如韩语、法语等）
- [ ] 实现RTL（从右到左）语言支持
- [ ] 语言包按需加载优化

## 测试方法

1. 启动开发服务器：`npm run dev`
2. 打开首页，点击语言切换器
3. 切换到英文，观察文本变化
4. 访问Admin页面，确认语言也是英文
5. 在Admin页面切换到日文
6. 返回首页，确认语言也是日文
7. 刷新页面，确认语言保持为日文

## 参考资源

- [Vue i18n 官方文档](https://vue-i18n.intlify.dev/)
- [项目语言包文件](./src/i18n/locales/)
- [i18n服务实现](./src/services/common/i18n.js)
