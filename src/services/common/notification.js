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

const startProgressAnimation = () => {
    let startTime = Date.now()
    let pausedTime = 0

    progressInterval = setInterval(() => {
        if (state.isPaused) {
            if (pausedTime === 0) {
                pausedTime = Date.now()
            }
            return
        }

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

const NotificationService = {
    state,
    success: (message) => {
        clearTimers()
        state.message = message
        state.type = 'success'
        state.show = true
        state.progress = 100
        state.isPaused = false
        startProgressAnimation()
    },
    info: (message) => {
        clearTimers()
        state.message = message
        state.type = 'info'
        state.show = true
        state.progress = 100
        state.isPaused = false
        startProgressAnimation()
    },
    error: (message) => {
        clearTimers()
        state.message = message
        state.type = 'error'
        state.show = true
        state.progress = 100
        state.isPaused = false
        startProgressAnimation()
    },
    warn: (message) => {
        clearTimers()
        state.message = message
        state.type = 'warn'
        state.show = true
        state.progress = 100
        state.isPaused = false
        startProgressAnimation()
    },
    close,
    pause,
    resume
}

export default NotificationService
