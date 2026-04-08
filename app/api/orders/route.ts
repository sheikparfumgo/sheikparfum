import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("authorization")

        // 🔒 1. Garantir que tem token
        if (!authHeader) {
            return NextResponse.json(
                { error: "Não autenticado" },
                { status: 401 }
            )
        }

        // 🔒 2. Criar client COM contexto do usuário
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

        // 🔒 3. Pegar usuário REAL
        const {
            data: { user },
            error: userError
        } = await supabase.auth.getUser()

        if (userError || !user) {
            return NextResponse.json(
                { error: "Usuário inválido" },
                { status: 401 }
            )
        }

        // 📦 4. Body
        const body = await req.json()

        const {
            items,
            user: userFromBody,
            amount,
            shipping,
            payment_method,
            coupon_id,
            discount
        } = body

        // 🔒 validações
        if (!items?.length) {
            return NextResponse.json(
                { error: "Carrinho vazio" },
                { status: 400 }
            )
        }

        if (!userFromBody?.email || !userFromBody?.name) {
            return NextResponse.json(
                { error: "Dados do usuário inválidos" },
                { status: 400 }
            )
        }

        const cleanCpf = userFromBody.cpf?.replace(/\D/g, "") || null

        // ✅ 5. INSERT COM user_id REAL
        const { data: order, error } = await supabase
            .from("orders")
            .insert([
                {
                    user_id: user.id, // 🔥 ESSENCIAL

                    amount: Number(amount),
                    original_amount: Number(amount) + Number(discount || 0),
                    discount: Number(discount || 0),
                    coupon_id: coupon_id || null,

                    customer_name: userFromBody.name,
                    customer_email: userFromBody.email,
                    customer_cpf: cleanCpf,

                    shipping: shipping || {},
                    payment_method: payment_method || "unknown",

                    status: "pending",
                    items_json: items
                }
            ])
            .select()
            .single()

        if (error) {
            console.error(error)

            return NextResponse.json(
                { error: "Erro ao criar pedido", details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({
            id: order.id,
            status: order.status
        })

    } catch (err: any) {
        console.error(err)

        return NextResponse.json(
            { error: "Erro interno", details: err.message },
            { status: 500 }
        )
    }
}