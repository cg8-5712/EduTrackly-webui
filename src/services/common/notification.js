import { ref, reactive } from 'vue'
import i18n from '@/i18n'

const t = (key, params) => i18n.global.t(key, params)

const state = reactive({
    message: '',
    type: 'info',
    show: false,
    progress: 100,
    isPaused: false
})

let hideTimeout = null
let progressInterval = null
const NOTIFICATION_DURATION = 3000 // 3秒
const PROGRESS_UPDATE_INTERVAL = 50 // 每50ms更新一次进度条

const VALID_TYPES = ['info', 'success', 'error', 'warn']

/**
 * 显示通知
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型 info | success | error | warn
 */
const notify = (message, type = 'info') => {
    if (!VALID_TYPES.includes(type)) {
        console.warn(t('error.notificationTypeNotSupported', { type }))
        type = 'info'
    }

    // 清除已有定时器
    clearTimers()

    // 更新状态
    state.message = message
    state.type = type
    state.show = true
    state.progress = 100
    state.isPaused = false

    // 启动进度条动画
    startProgressAnimation()
}

const startProgressAnimation = () => {
    let startTime = Date.now()
    let pausedTime = 0

    progressInterval = setInterval(() => {
        if (state.isPaused) {
            if (pausedTime === 0) {
                pausedTime = Date.now()
            }
            return // 暂停时不更新进度
        }

        // 如果从暂停状态恢复，调整开始时间
        if (pausedTime > 0) {
            startTime += Date.now() - pausedTime
            pausedTime = 0
        }

        const elapsed = Date.now() - startTime
        const remaining = Math.max(0, NOTIFICATION_DURATION - elapsed)
        state.progress = (remaining / NOTIFICATION_DURATION) * 100

        if (remaining <= 0) {
            close()
        }
    }, PROGRESS_UPDATE_INTERVAL)
}

const pause = () => {
    state.isPaused = true
}

const resume = () => {
    state.isPaused = false
}

const clearTimers = () => {
    if (hideTimeout) {
        clearTimeout(hideTimeout)
        hideTimeout = null
    }
    if (progressInterval) {
        clearInterval(progressInterval)
        progressInterval = null
    }
}

const close = () => {
    clearTimers()
    state.show = false
    state.progress = 100
    state.isPaused = false
}

export default {
    state,
    notify,
    close,
    pause,
    resume
}