import { API_KEY, TYPE, pIndex, pSize, EDU_OFFICE_CODE, SCHOOL_CODE } from "./config";
import { getKoreanDate } from "./dateUtils";

export interface TimeTableData {
    periods: string[];
    date: string;
    dayName: string;
}

function getCurrentSemester(): string {
    const month = getKoreanDate().getMonth() + 1;
    return month >= 3 && month <= 8 ? "1" : "2";
}

function getDateForWeekday(targetDay: "mon"|"tue"|"wed"|"thu"|"fri"): Date {
    const today = getKoreanDate();
    const dayMap: Record<string, number> = { mon: 1, tue: 2, wed: 3, thu: 4, fri: 5 };
    const targetWeekDay = dayMap[targetDay];

    const currentWeekDay = today.getDay();
    let offset = targetWeekDay - currentWeekDay;

    if (offset < -4) offset += 7;
    const dateObj = new Date(today);
    dateObj.setDate(today.getDate() + offset);
    return dateObj;
}

export async function loadTimeTable(
    grade: string = "1",
    classNm: string = "6",
    targetDay: "mon"|"tue"|"wed"|"thu"|"fri" = "mon"
): Promise<TimeTableData | null> {
    try {
        const today = getKoreanDate();
        if (today.getDay() === 0 || today.getDay() === 6) return null;

        const sem = getCurrentSemester();
        const weekDays = ["일","월","화","수","목","금","토"];

        const dateObj = getDateForWeekday(targetDay);
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2,"0");
        const dd = String(dateObj.getDate()).padStart(2,"0");
        const dateStr = `${yyyy}${mm}${dd}`;
        const dayName = weekDays[dateObj.getDay()];

        const url = `https://open.neis.go.kr/hub/hisTimetable` +
            `?KEY=${API_KEY}&Type=${TYPE}&pIndex=${pIndex}&pSize=${pSize}` +
            `&ATPT_OFCDC_SC_CODE=${EDU_OFFICE_CODE}` +
            `&SD_SCHUL_CODE=${SCHOOL_CODE}` +
            `&ALL_TI_YMD=${dateStr}&GRADE=${grade}&CLASS_NM=${classNm}&SEM=${sem}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("시간표 API 요청 실패");

        const json = await res.json();
        const rows = json?.hisTimetable?.[1]?.row ?? [];
        if (!rows.length) return null;

        const periodMap: Record<number,string> = {};
        for (const row of rows) {
            const perio = parseInt(row.PERIO,10);
            if (perio) periodMap[perio] = row.ITRT_CNTNT?.trim() || "";
        }

        const periods = Array.from({length:7}, (_,i) => `${i+1} 교시 - ${periodMap[i+1] ?? ""}`);

        return { periods, date: dateStr, dayName };

    } catch(err) {
        console.error("시간표 불러오기 실패:", err);
        return null;
    }
}
