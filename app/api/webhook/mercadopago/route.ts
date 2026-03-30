import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"

export async function POST(req: Request) {
    try {
        const body = await req.json()

        console.log("WEBHOOK RECEBIDO:", body)

        // ✅ garante que é pagamento
        if (body.type !== "payment") {
            return NextResponse.json({ ok: true })
        }

        const paymentId = body.data?.id

        if (!paymentId) {
            return NextResponse.json({ ok: true })
        }

        // 🔎 busca pagamento no MP
        const res = await fetch(
            `https://api.mercadopago.com/v1/payments/${paymentId}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
                }
            }
        )

        const payment = await res.json()

        console.log("PAYMENT DATA:", payment)

        const status = payment.status

        // 🔥 AJUSTE CRÍTICO AQUI
        const rawReference = payment.external_reference
        const orderId = rawReference?.replace("order_", "")

        if (!orderId) {
            console.error("order_id não encontrado no external_reference")
            return NextResponse.json({ ok: true })
        }

        // 🔥 atualiza pedido
        const { error } = await supabaseAdmin
            .from("orders")
            .update({
                status: status,
                mp_payment_id: payment.id
            })
            .eq("id", orderId)

        if (error) {
            console.error("Erro ao atualizar pedido:", error)
        }

        return NextResponse.json({ ok: true })

    } catch (err) {
        console.error("ERRO WEBHOOK:", err)
        return NextResponse.json({ error: "Erro webhook" }, { status: 500 })
    }
}