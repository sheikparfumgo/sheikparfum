import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const isPix = body.payment_method_id === "pix"

        if (!body.amount || !body.email || !body.order_id) {
            return NextResponse.json(
                { error: "Dados inválidos" },
                { status: 400 }
            )
        }

        const payload: any = {
            transaction_amount: Number(body.amount),
            description: "Compra Sheik Parfum",
            payment_method_id: body.payment_method_id,

            payer: {
                email: body.email,
                first_name: body.first_name || "Cliente",
                last_name: body.last_name || "Sheik",
                identification: {
                    type: "CPF",
                    number: body.cpf || "19119119100"
                }
            },

            // 🔥 ESSENCIAL
            external_reference: body.order_id
        }

        if (!isPix) {
            if (!body.token) {
                return NextResponse.json(
                    { error: "Token do cartão obrigatório" },
                    { status: 400 }
                )
            }

            payload.token = body.token
            payload.installments = body.installments || 1
            payload.issuer_id = body.issuer_id || undefined
        }

        const res = await fetch("https://api.mercadopago.com/v1/payments", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
                "Content-Type": "application/json",
                "X-Idempotency-Key": crypto.randomUUID()
            },
            body: JSON.stringify(payload)
        })

        const data = await res.json()

        if (!res.ok) {
            console.error("MP ERROR:", data)

            return NextResponse.json(
                {
                    error: data.message || "Erro no pagamento",
                    detalhe: data
                },
                { status: res.status }
            )
        }

        // 🔥 PIX
        if (isPix) {
            return NextResponse.json({
                id: data.id,
                status: data.status,
                qr_code:
                    data.point_of_interaction?.transaction_data?.qr_code,
                qr_code_base64:
                    data.point_of_interaction?.transaction_data?.qr_code_base64
            })
        }

        // 💳 CARTÃO
        return NextResponse.json({
            id: data.id,
            status: data.status,
            status_detail: data.status_detail
        })

    } catch (err: any) {
        console.error("ERRO:", err)

        return NextResponse.json(
            { error: "Erro interno no servidor" },
            { status: 500 }
        )
    }
}