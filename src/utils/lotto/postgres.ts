// @ts-ignore
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://llkfxakahiknkmkrwxwq.supabase.co";
const supabaseKey = "sb_publishable_m2Js6J-o1nngIvZx2u3tWQ_rnR6RHew";
export const supabase = createClient(supabaseUrl, supabaseKey);