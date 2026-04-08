import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function POST(req: Request) {
    try {
        const body = await req.json()

        console.log("WEBHOOK RECEBIDO:", body)

        if (body.type !== "payment") {
            return NextResponse.json({ ok: true })
        }

        const paymentId = body.data?.id

        if (!paymentId) {
            return NextResponse.json({ ok: true })
        }

        const res = await fetch(
            `https://api.mercadopago.com/v1/payments/${paymentId}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
                }
            }
        )

        if (!res.ok) {
            console.error("Erro ao buscar pagamento MP")
            return NextResponse.json({ ok: true })
        }

        const payment = await res.json()

        console.log("PAYMENT DATA:", payment)

        const orderId = payment.external_reference

        if (!orderId) {
            console.error("order_id não encontrado")
            return NextResponse.json({ ok: true })
        }

        // 🔒 evita sobrescrever
        const { data: existing } = await supabaseAdmin
            .from("orders")
            .select("status")
            .eq("id", orderId)
            .single()

        if (existing?.status === "paid") {
            return NextResponse.json({ ok: true })
        }

        let status = payment.status

        if (status === "approved") {
            status = "paid"
        } else if (status === "pending" || status === "in_process") {
            status = "pending"
        } else {
            status = "failed"
        }

        const { error } = await supabaseAdmin
            .from("orders")
            .update({
                status,
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