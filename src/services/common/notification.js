import { ref, reactive } from 'vue'

const state = reactive({
    message: '',
    type: 'info',
    show: false
})

let hideTimeout = null

const VALID_TYPES = ['info', 'success', 'error', 'warn']

/**
 * 显示通知
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型 info | success | error | warn
 */
const notify = (message, type = 'info') => {
    if (!VALID_TYPES.includes(type)) {
        console.warn(`Notification type "${type}" 不支持，默认使用 "info"`)
        type = 'info'
    }

    // 清除已有定时器
    if (hideTimeout) {
        clearTimeout(hideTimeout)
        hideTimeout = null
    }

    // 更新状态
    state.message = message
    state.type = type
    state.show = true

    // 自动隐藏
    hideTimeout = setTimeout(() => {
        state.show = false
        hideTimeout = null
    }, 3000)
}

const close = () => {
    if (hideTimeout !== null) {
        clearTimeout(hideTimeout)
        hideTimeout = null
    }

    state.show = false
}

export default {
    state,
    notify,
    close
}