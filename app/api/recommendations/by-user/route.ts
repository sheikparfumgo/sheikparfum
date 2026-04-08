import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function GET(req: Request) {

    // ⚠️ ideal depois: pegar user do auth
    const userId = req.headers.get("x-user-id")

    const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("olfactive_profile")
        .eq("id", userId)
        .single()

    const prefs = profile?.olfactive_profile || {}

    const { data } = await supabaseAdmin
        .from("vw_perfumes_catalog")
        .select("*")

    const perfumes = data ?? []

    const scored = perfumes.map((p: any) => {
        let score = 0

        if (prefs.families?.some((f: string) =>
            (p.olfactive_family || "").includes(f)
        )) score += 2

        return { ...p, score }
    })

    return NextResponse.json(
        scored.sort((a, b) => b.score - a.score).slice(0, 10)
    )
}