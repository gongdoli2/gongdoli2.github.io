import { API_KEY, TYPE, pIndex, pSize, SCHOOL_CODE } from "./config";
import { formatDate } from "./dateUtils";

interface SchoolRow {
    SCHUL_NM: string;
    ENG_SCHUL_NM: string;
    ATPT_OFCDC_SC_NM: string;
    SCHUL_KND_SC_NM: string;
    FOND_SC_NM: string;
    ORG_RDNZC: string;
    ORG_RDNMA: string;
    ORG_RDNDA: string;
    ORG_TELNO: string;
    HMPG_ADRES: string;
    COEDU_SC_NM: string;
    DGHT_SC_NM: string;
    FOND_YMD: string;
}

interface SchoolInfoResponse {
    schoolInfo: Array<any>;
}

export async function fetchSchoolInfo(): Promise<SchoolRow | null> {
    try {
        const apiUrl = `https://open.neis.go.kr/hub/schoolInfo?key=${API_KEY}&Type=${TYPE}&pIndex=${pIndex}&pSize=${pSize}&SD_SCHUL_CODE=${SCHOOL_CODE}`;
        const response = await fetch(apiUrl);
        const data: SchoolInfoResponse = await response.json();
        return data.schoolInfo?.[1]?.row?.[0] ?? null;
    } catch (error) {
        console.error("API 호출 오류:", error);
        return null;
    }
}

const ELEMENT_IDS: { [K in keyof SchoolRow]: string } = {
    SCHUL_NM: 'schoolName',
    ENG_SCHUL_NM: 'schoolEngName',
    ATPT_OFCDC_SC_NM: 'eduOffice',
    SCHUL_KND_SC_NM: 'schoolKind',
    FOND_SC_NM: 'foundationType',
    ORG_RDNZC: 'zipCode',
    ORG_RDNMA: 'schoolAddress',
    ORG_RDNDA: 'adminAddress',
    ORG_TELNO: 'schoolPhone',
    HMPG_ADRES: 'schoolHomepage',
    COEDU_SC_NM: 'coed',
    DGHT_SC_NM: 'dayNight',
    FOND_YMD: 'foundationDate',
};

export async function renderSchoolInfo() {
    const school = await fetchSchoolInfo();
    if (!school) return;

    (Object.keys(ELEMENT_IDS) as Array<keyof SchoolRow>).forEach(key => {
        const el = document.getElementById(ELEMENT_IDS[key]);
        if (!el) return;

        if (key === "FOND_YMD") {
            el.textContent = school[key] ? formatDate(school[key]) : '';
        } else {
            el.textContent = school[key] ?? '';
        }
    });
}
