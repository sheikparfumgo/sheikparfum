import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
    try {
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

        // 🔒 usuário real
        const {
            data: { user },
            error: userError
        } = await supabase.auth.getUser()

        if (userError || !user) {
            return NextResponse.json({ error: "Usuário inválido" }, { status: 401 })
        }

        const body = await req.json()
        const { perfume_id } = body

        if (!perfume_id) {
            return NextResponse.json({ error: "Perfume obrigatório" }, { status: 400 })
        }

        // 📅 mês padrão
        const month = new Date().toISOString().slice(0, 7) + "-01"

        // 🔒 verificar assinatura ativa
        const { data: subscription } = await supabase
            .from("club_subscriptions")
            .select("*")
            .eq("user_id", user.id)
            .eq("status", "active")
            .single()

        if (!subscription) {
            return NextResponse.json({ error: "Usuário não é do clube" }, { status: 403 })
        }

        // 🔒 verificar se perfume está no mês
        const { data: monthlyPerfume } = await supabase
            .from("club_monthly_perfumes")
            .select("*")
            .eq("month", month)
            .eq("perfume_id", perfume_id)
            .single()

        if (!monthlyPerfume) {
            return NextResponse.json({ error: "Perfume inválido para este mês" }, { status: 400 })
        }

        // 🔒 impedir escolha duplicada
        const { data: existingChoice } = await supabase
            .from("club_choices")
            .select("id")
            .eq("user_id", user.id)
            .eq("month", month)
            .maybeSingle()

        if (existingChoice) {
            return NextResponse.json({ error: "Você já escolheu seu perfume este mês" }, { status: 400 })
        }

        // ✅ salvar escolha
        const { error } = await supabase
            .from("club_choices")
            .insert({
                user_id: user.id,
                perfume_id,
                month
            })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })

    } catch (err: any) {
        return NextResponse.json(
            { error: "Erro interno", details: err.message },
            { status: 500 }
        )
    }
}