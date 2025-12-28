import type { APIRoute } from "astro";
import { supabase } from "../../../utils/lotto/postgres";

export const prerender = false;

export const GET: APIRoute = async () => {
    try {
        const { data: entries, error } = await supabase
            .from("lotto_entries")
            .select("name, student_id, numbers")
            .order("id", { ascending: true });

        if (error) return new Response("데이터를 불러오지 못했습니다.", { status: 500 });
        if (!entries) return new Response(JSON.stringify([]), { headers: { "Content-Type": "application/json" } });

        const processedEntries = entries.map(e => ({
            name: e.name,
            studentId: e.student_id,
            numbers: Array.isArray(e.numbers)
                ? e.numbers.map(Number)
                : e.numbers.split(",").map(Number)
        }));

        return new Response(JSON.stringify(processedEntries), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        console.error(err);
        return new Response("서버 오류", { status: 500 });
    }
};
