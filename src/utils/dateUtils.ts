export function getKoreanDate(date: Date = new Date()): Date {
    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    return new Date(utc + 9 * 60 * 60 * 1000);
}

export function getTodayYYYYMMDD(): string {
    const d = getKoreanDate();
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

export function formatDate(date: string | Date = new Date()): string {
    let d: Date;

    if (typeof date === "string" && /^\d{8}$/.test(date)) {
        const year = parseInt(date.slice(0, 4), 10);
        const month = parseInt(date.slice(4, 6), 10) - 1;
        const day = parseInt(date.slice(6, 8), 10);
        d = new Date(Date.UTC(year, month, day));
    } else {
        d = typeof date === "string" ? new Date(date) : date;
    }

    d = getKoreanDate(d);

    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    return `${d.getFullYear()}년 ${String(d.getMonth() + 1).padStart(2, "0")}월 ${String(d.getDate()).padStart(2, "0")}일 (${weekdays[d.getDay()]}요일)`;
}
