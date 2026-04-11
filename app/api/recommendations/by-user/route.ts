import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { createClient } from "@supabase/supabase-js"

export async function GET(req: Request) {

    // ⚠️ ideal depois: pegar user do auth
    const authHeader = req.headers.get("authorization")

    if (!authHeader) {
        return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                headers: {
                    Authorization: authHeader
                }
            }
        }
    )

    const {
        data: { user },
        error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
        return NextResponse.json({ error: "Usuário inválido" }, { status: 401 })
    }

    const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("olfactive_profile")
        .eq("id", user.id)
        .single()

    const prefs = profile?.olfactive_profile

    // 🚨 fallback inteligente
    if (!prefs || !prefs.families?.length) {
        const { data: fallback } = await supabaseAdmin
            .from("vw_perfumes_catalog")
            .select("*")
            .limit(10)

        return NextResponse.json(fallback || [])
    }

    const { data } = await supabaseAdmin
        .from("vw_perfumes_catalog")
        .select("*")

    const perfumes = data ?? []

    const scored = perfumes.map((p: any) => {
        let score = 0

        if (prefs.families?.some((f: string) =>
            (p.olfactive_family || "").includes(f)
        )) score += 3

        return { ...p, score }
    })

    return NextResponse.json(
        scored.sort((a, b) => b.score - a.score).slice(0, 10)
    )
}