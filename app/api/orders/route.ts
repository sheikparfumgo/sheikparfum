import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"

export async function POST(req: Request) {
    try {
        const body = await req.json()

        if (!body.items?.length) {
            return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 })
        }

        if (!body.user?.email || !body.user?.name) {
            return NextResponse.json({ error: "Dados do usuário inválidos" }, { status: 400 })
        }

        const { data: order, error: orderError } = await supabaseAdmin
            .from("orders")
            .insert([
                {
                    amount: Number(body.amount),
                    customer_name: body.user.name,
                    customer_email: body.user.email,
                    customer_cpf: body.user.cpf,
                    shipping: body.shipping || {},
                    payment_method: body.payment_method || "unknown",
                    status: "pending"
                }
            ])
            .select()
            .single()

        if (orderError) throw orderError

        const itemsToInsert = body.items.map((item: any) => ({
            order_id: order.id,
            product_id: item.product_id || item.id,
            quantity: item.quantity,
            price: item.price
        }))

        const { error: itemsError } = await supabaseAdmin
            .from("order_items")
            .insert(itemsToInsert)

        if (itemsError) {
            await supabaseAdmin
                .from("orders")
                .delete()
                .eq("id", order.id)

            throw itemsError
        }

        return NextResponse.json({
            id: order.id, // 🔥 importante pro frontend
            status: order.status
        })

    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { error: "Erro ao criar pedido" },
            { status: 500 }
        )
    }
}