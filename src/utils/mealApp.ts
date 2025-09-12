import { API_KEY, TYPE, pIndex, pSize, EDU_OFFICE_CODE, SCHOOL_CODE, TODAY } from "./config";

interface MealData {
    dishes: string[];
    cal: string;
    nutrition: string[];
}

export async function loadMeal(mealType: string = "2"): Promise<MealData | null> {
    try {
        const url = `https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${API_KEY}&ATPT_OFCDC_SC_CODE=${EDU_OFFICE_CODE}&SD_SCHUL_CODE=${SCHOOL_CODE}&MLSV_YMD=${TODAY}&type=${TYPE}&MMEAL_SC_CODE=${mealType}`;
        const res = await fetch(url);
        const data = await res.json();

        const row = data?.mealServiceDietInfo?.[1]?.row?.[0];
        if (!row) return null;

        return {
            dishes: row.DDISH_NM?.split("<br/>") ?? [],
            cal: row.CAL_INFO ?? "정보 없음",
            nutrition: row.NTR_INFO?.split("<br/>") ?? []
        };
    } catch (err) {
        console.error("급식 불러오기 오류:", err);
        return null;
    }
}
