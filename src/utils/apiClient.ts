export interface ApiClientOptions {
    timeoutMs?: number; // 기본 타임아웃
    cacheByDay?: boolean; // URL별 하루 캐시
}

const defaultOpts: ApiClientOptions = { timeoutMs: 2500, cacheByDay: true };

// simple in-memory cache keyed by URL
const dayCache: Record<string, { day: string; data: any }> = {};

export async function fetchWithTimeout(url: string, opts: ApiClientOptions = {}) {
    const { timeoutMs, cacheByDay } = { ...defaultOpts, ...opts };

    // 하루 단위 캐시
    const today = new Date().toISOString().slice(0, 10);
    if (cacheByDay && dayCache[url] && dayCache[url].day === today) {
        return dayCache[url].data;
    }

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (cacheByDay) dayCache[url] = { day: today, data: json };
        return json;
    } finally {
        clearTimeout(id);
    }
}
