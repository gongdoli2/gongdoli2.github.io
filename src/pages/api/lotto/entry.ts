import type { APIRoute } from "astro";
import { supabase } from "../../../utils/lotto/postgres";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    const { name, studentId, numbers } = await request.json();

    if (!name || !studentId || !Array.isArray(numbers) || numbers.length !== 6) {
        return new Response("잘못된 입력", { status: 400 });
    }

    // 추첨이 완료되었는지 확인
    const { data: stateData } = await supabase
        .from("lotto_state")
        .select("is_drawn")
        .eq("id", 1)
        .single();

    if (stateData?.is_drawn) {
        return new Response("이미 추첨이 완료되었습니다", { status: 403 });
    }

    // 학번 중복 체크
    const { data: existing } = await supabase
        .from("lotto_entries")
        .select("student_id")
        .eq("student_id", studentId)
        .single();

    if (existing) return new Response("이미 참여하셨습니다", { status: 409 });

    await supabase
        .from("lotto_entries")
        .insert([{ name, student_id: studentId, numbers: numbers.join(",") }]);

    return new Response("참여 완료 🎟️");
};
