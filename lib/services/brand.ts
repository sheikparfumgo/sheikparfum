import { generateSlug } from "@/lib/utils/slug";
import { createServerSupabase } from "@/lib/supabase/server";

export async function resolveBrand(rawName: string) {
    const supabase = await createServerSupabase();

    const name = rawName.trim();
    const slug = generateSlug(name);

    // 🔍 1. Buscar existente (case insensitive)
    const { data: existing } = await supabase
        .from("brands")
        .select("id, name")
        .ilike("name", name)
        .maybeSingle();

    if (existing) {
        return existing.id;
    }

    // 🧱 2. Criar nova brand
    const { data, error } = await supabase
        .from("brands")
        .insert({
            name,
            slug,
        })
        .select("id")
        .single();

    if (error) {
        throw new Error("Erro ao criar brand");
    }

    return data.id;
}