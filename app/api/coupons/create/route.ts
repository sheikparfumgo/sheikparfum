import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        const {
            code,
            discount,
            type,
            perfume_id,
            influencer_id,
            usage_limit,
            valid_until
        } = body

        if (!code || !discount || !type || !valid_until) {
            return NextResponse.json(
                { error: "Campos obrigatórios faltando" },
                { status: 400 }
            )
        }

        const { error } = await supabaseAdmin
            .from("coupons")
            .insert([
                {
                    code,
                    discount: Number(discount),
                    type,
                    perfume_id: perfume_id || null,
                    influencer_id: influencer_id || null,

                    usage_limit: body.unlimited
                        ? null
                        : usage_limit
                            ? Number(usage_limit)
                            : null,

                    valid_until,
                    used_count: 0
                }
            ])

        if (error) {
            console.error("Erro Supabase:", error)
            return NextResponse.json(
                { error: error.message || "Erro ao salvar cupom" },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })

    } catch (err) {
        console.error("Erro interno:", err)

        return NextResponse.json(
            { error: "Erro interno" },
            { status: 500 }
        )
    }
}