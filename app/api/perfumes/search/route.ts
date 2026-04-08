import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function GET(req: Request) {

    const { searchParams } = new URL(req.url)
    const q = searchParams.get("q") || ""

    const { data } = await supabaseAdmin
        .from("vw_perfumes_catalog")
        .select("perfume_name, brand, olfactive_family, image_main")
        .ilike("perfume_name", `%${q}%`)
        .limit(5)

    return NextResponse.json(data ?? [])
}