import { createServerSupabase } from "@/lib/supabase/server";

export async function checkPerfumeExists(name: string, brandId: string) {
    const supabase = await createServerSupabase();

    const { data } = await supabase
        .from("perfumes")
        .select("id, name")
        .eq("brand_id", brandId)
        .ilike("name", name)
        .maybeSingle();

    return data;
}