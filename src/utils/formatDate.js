export default function formatYYYYMMDDToDate(dateInt) {
    // 确保传入的是有效的 8 位整数（YYYYMMDD）
    const dateString = dateInt.toString();
    if (dateString.length !== 8 || isNaN(dateInt)) {
        throw new Error('Invalid date format, expected YYYYMMDD as an integer');
    }

    const year = parseInt(dateString.slice(0, 4));
    const month = parseInt(dateString.slice(4, 6)) - 1;  // 月份从0开始
    const day = parseInt(dateString.slice(6, 8));

    // 创建 Date 对象
    const date = new Date(year, month, day);

    // 获取星期几（中文）
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    const dayOfWeek = weekDays[date.getDay()];

    // 返回中文日期格式：8月30日 星期六
    return `${month + 1}月${day}日 星期${dayOfWeek}`;
}

