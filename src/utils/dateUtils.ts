export function formatDate(dateStr: string | Date): string {
    let date: Date;

    if (typeof dateStr === "string") {
        if (/^\d{8}$/.test(dateStr)) {
            const year = parseInt(dateStr.slice(0, 4), 10);
            const month = parseInt(dateStr.slice(4, 6), 10) - 1;
            const day = parseInt(dateStr.slice(6, 8), 10);
            date = new Date(year, month, day);
        } else {
            date = new Date(dateStr);
        }
    } else {
        date = dateStr;
    }

    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    return `${date.getFullYear()}년 ${String(date.getMonth()+1).padStart(2,"0")}월 ${String(date.getDate()).padStart(2,"0")}일 (${weekdays[date.getDay()]}요일)`;
}
