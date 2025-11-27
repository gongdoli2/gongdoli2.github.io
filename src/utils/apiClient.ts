export interface ApiClientOptions {
    timeoutMs?: number;
    cacheByDay?: boolean;
}

const defaultOpts: ApiClientOptions = { timeoutMs: 2500, cacheByDay: true };
const dayCache: Record<string, { day: string; data: any }> = {};

export async function fetchApi(url: string, opts: ApiClientOptions = {}) {
    const { timeoutMs, cacheByDay } = { ...defaultOpts, ...opts };
    const today = new Date().toISOString().slice(0, 10);

    if (cacheByDay && dayCache[url]?.day === today) {
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
