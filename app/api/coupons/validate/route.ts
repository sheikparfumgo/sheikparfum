import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        const { code, perfume_id, user_id } = body

        if (!code) {
            return NextResponse.json(
                { error: "Cupom obrigatório" },
                { status: 400 }
            )
        }

        // 🔎 Buscar cupom
        const { data: coupon, error } = await supabaseAdmin
            .from("coupons")
            .select("*")
            .eq("code", code)
            .single()

        if (error || !coupon) {
            return NextResponse.json(
                { valid: false, error: "Cupom inválido" },
                { status: 404 }
            )
        }

        // ⛔ Expiração
        if (new Date(coupon.valid_until) < new Date()) {
            return NextResponse.json(
                { valid: false, error: "Cupom expirado" },
                { status: 400 }
            )
        }

        // ⛔ Limite de uso
        if (
            coupon.usage_limit &&
            coupon.used_count >= coupon.usage_limit
        ) {
            return NextResponse.json(
                { valid: false, error: "Cupom esgotado" },
                { status: 400 }
            )
        }

        // 🎯 REGRA DE PERFUME (COM GLOBAL)
        if (
            coupon.perfume_id &&
            coupon.type !== "global" &&
            coupon.perfume_id !== perfume_id
        ) {
            return NextResponse.json(
                { valid: false, error: "Cupom não válido para este perfume" },
                { status: 400 }
            )
        }

        // 🔒 Clube do Sheik
        if (coupon.type === "club") {

            const { data: profile } = await supabaseAdmin
                .from("profiles")
                .select("is_club_member")
                .eq("id", user_id)
                .single()

            if (!profile?.is_club_member) {
                return NextResponse.json(
                    { valid: false, error: "Cupom exclusivo do clube" },
                    { status: 403 }
                )
            }
        }

        // 🤝 Influencer
        if (coupon.type === "influencer") {
            if (!coupon.influencer_id) {
                return NextResponse.json(
                    { valid: false, error: "Cupom inválido (sem influencer)" },
                    { status: 400 }
                )
            }
        }

        // 🎥 Review (futuro: validar origem)
        // (por enquanto ok)

        // ✅ SUCESSO
        return NextResponse.json({
            valid: true,
            discount: Number(coupon.discount),
            type: coupon.type,
            coupon
        })

    } catch (err) {
        console.error(err)

        return NextResponse.json(
            { error: "Erro interno" },
            { status: 500 }
        )
    }
}