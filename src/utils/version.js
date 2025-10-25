/**
 * 应用版本信息工具
 * 这些环境变量在生产环境构建时由 Jenkins 自动注入
 */

export const version = {
    // Git commit hash (短版本)
    version: import.meta.env.VITE_APP_VERSION || 'unknown',

    // 构建时间 (UTC ISO 8601 格式)
    buildTime: import.meta.env.VITE_BUILD_TIME || 'unknown',

    // Jenkins 构建号
    buildNumber: import.meta.env.VITE_BUILD_NUMBER || 'unknown',

    // Git 分支
    gitBranch: import.meta.env.VITE_GIT_BRANCH || 'unknown',

    // 部署基础路径
    basePath: import.meta.env.VITE_BASE_PATH || '/',
};

/**
 * 获取格式化的版本信息字符串
 */
export function getVersionString() {
    return `v${version.version} (Build #${version.buildNumber})`;
}

/**
 * 获取格式化的构建时间
 */
export function getBuildTimeString() {
    if (version.buildTime === 'unknown' || version.buildTime === 'dev') {
        return version.buildTime;
    }
    return new Date(version.buildTime).toLocaleString();
}

/**
 * 在控制台打印版本信息
 */
export function printVersionInfo() {
    console.log('%c=== EduTrackly Version Info ===', 'color: #4CAF50; font-weight: bold; font-size: 14px;');
    console.log(`%cVersion: %c${version.version}`, 'color: #2196F3;', 'color: #FF9800; font-weight: bold;');
    console.log(`%cBuild Number: %c${version.buildNumber}`, 'color: #2196F3;', 'color: #FF9800; font-weight: bold;');
    console.log(`%cBuild Time: %c${getBuildTimeString()}`, 'color: #2196F3;', 'color: #FF9800; font-weight: bold;');
    console.log(`%cGit Branch: %c${version.gitBranch}`, 'color: #2196F3;', 'color: #FF9800; font-weight: bold;');
    console.log(`%cBase Path: %c${version.basePath}`, 'color: #2196F3;', 'color: #FF9800; font-weight: bold;');
    console.log('%c==============================', 'color: #4CAF50; font-weight: bold;');
}

export default version;
