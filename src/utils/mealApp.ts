// import { API_KEY, TYPE, EDU_OFFICE_CODE, SCHOOL_CODE } from "./config";
// import { getTodayYYYYMMDD } from "./dateUtils";
//
// interface MealData {
//     dishes: string[];
//     cal: string;
//     nutrition: string[];
// }
//
// export async function loadMeal(mealType: string = "2"): Promise<MealData | null> {
//     try {
//         const today = getTodayYYYYMMDD();
//         const url = `https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${API_KEY}&ATPT_OFCDC_SC_CODE=${EDU_OFFICE_CODE}&SD_SCHUL_CODE=${SCHOOL_CODE}&MLSV_YMD=${today}&type=${TYPE}&MMEAL_SC_CODE=${mealType}`;
//
//         const res = await fetch(url);
//         if (!res.ok) {
//             console.error("급식 API 요청 실패:", res.status, res.statusText);
//             return null;
//         }
//
//         const data = await res.json();
//         const row = data?.mealServiceDietInfo?.[1]?.row?.[0];
//         if (!row) return null;
//
//         return {
//             dishes: row.DDISH_NM ? row.DDISH_NM.split("<br/>").map((d: string) => d.trim()) : [],
//             cal: row.CAL_INFO || "정보 없음",
//             nutrition: row.NTR_INFO ? row.NTR_INFO.split("<br/>").map((n: string) => n.trim()) : []
//         };
//     } catch (err) {
//         console.error("급식 불러오기 오류:", err);
//         return null;
//     }
// }
import { getTodayYYYYMMDD } from "./dateUtils";
import { fetchWithTimeout } from "./apiClient";
import { API_KEY, TYPE, EDU_OFFICE_CODE, SCHOOL_CODE } from "./config";

export interface MealData {
    dishes: string[];
    cal: string;
    nutrition: string[];
}

const localCache = new Map<string, MealData | null>();

function buildMealUrl(date: string, mealType: string) {
    return `https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${API_KEY}` +
        `&ATPT_OFCDC_SC_CODE=${EDU_OFFICE_CODE}` +
        `&SD_SCHUL_CODE=${SCHOOL_CODE}` +
        `&MLSV_YMD=${date}&type=${TYPE}&MMEAL_SC_CODE=${mealType}`;
}

export async function loadMeal(mealType = "2"): Promise<MealData | null> {
    const date = getTodayYYYYMMDD();
    const key = `${date}-${mealType}`;
    if (localCache.has(key)) return localCache.get(key)!;

    const url = buildMealUrl(date, mealType);
    try {
        const json = await fetchWithTimeout(url, { timeoutMs: 2200, cacheByDay: true });
        const row = json?.mealServiceDietInfo?.[1]?.row?.[0] ?? null;
        if (!row) {
            localCache.set(key, null);
            return null;
        }

        const dishes = (row.DDISH_NM || "")
            .replace(/\(.*?\)/g, "") // 괄호 제거
            .split("<br/>")
            .map((s: string) => s.trim())
            .filter((s: string) => s.length);

        const meal: MealData = {
            dishes,
            cal: row.CAL_INFO || "정보 없음",
            nutrition: (row.NTR_INFO || "").split("<br/>").map((s: string) => s.trim()).filter(Boolean)
        };

        localCache.set(key, meal);
        return meal;
    } catch (e) {
        console.error("loadMeal error:", e);
        localCache.set(key, null);
        return null;
    }
}

