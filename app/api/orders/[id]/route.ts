import { supabaseAdmin } from "@/lib/supabase/admin"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const body = await req.json()

        const { status } = body

        const allowedStatus = ["pending", "paid", "shipped", "delivered", "canceled"]

        if (!allowedStatus.includes(status)) {
            return NextResponse.json(
                { error: "Status inválido" },
                { status: 400 }
            )
        }

        const { data: order, error } = await supabaseAdmin
            .from("orders")
            .update({ status })
            .eq("id", id)
            .select()
            .single()

        if (error) {
            console.error(error)
            return NextResponse.json(
                { error: "Erro ao atualizar pedido" },
                { status: 500 }
            )
        }

        // 🔥 AQUI É O OURO DO SISTEMA
        if (status === "paid" && order.coupon_id) {
            await supabaseAdmin.rpc("increment_coupon_usage", {
                coupon_id_input: order.coupon_id
            })
        }

        return NextResponse.json({
            success: true,
            order
        })

    } catch (err) {
        console.error(err)

        return NextResponse.json(
            { error: "Erro interno" },
            { status: 500 }
        )
    }
}