import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { getUserFromRequest } from "@/lib/supabase/auth"

export async function POST(req: Request) {
    try {
        const { perfume_id, rating, comment } = await req.json()

        const user = await getUserFromRequest(req)

        if (!user) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
        }

        const user_id = user.id

        // validar compra
        const { data: order } = await supabaseAdmin
            .from("order_items")
            .select("*")
            .eq("user_id", user_id)
            .eq("perfume_id", perfume_id)
            .limit(1)

        if (!order || order.length === 0) {
            return NextResponse.json({ error: "Compre antes de avaliar" }, { status: 403 })
        }

        // evitar duplicado
        const { data: existing } = await supabaseAdmin
            .from("reviews")
            .select("*")
            .eq("user_id", user_id)
            .eq("perfume_id", perfume_id)
            .limit(1)

        if (existing?.length) {
            return NextResponse.json({ error: "Você já avaliou" }, { status: 400 })
        }

        // salvar review
        await supabaseAdmin.from("reviews").insert({
            user_id,
            perfume_id,
            rating,
            comment
        })

        // gerar cupom
        const code = "SHEIK" + Math.random().toString(36).substring(2, 8).toUpperCase()

        const validUntil = new Date()
        validUntil.setDate(validUntil.getDate() + 7)

        await supabaseAdmin.from("coupons").insert({
            code,
            user_id,
            discount: 30,
            valid_until: validUntil,
            valid_for: "100ml"
        })

        return NextResponse.json({ success: true, coupon: code })

    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: "Erro interno" }, { status: 500 })
    }
}