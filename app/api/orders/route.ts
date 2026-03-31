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

        console.log("Iniciando criação de pedido para:", body.user.email);

        const cleanCpf = body.user.cpf.replace(/\D/g, "");

        const { data: order, error: orderError } = await supabaseAdmin
            .from("orders")
            .insert([
                {
                    amount: Number(body.amount),
                    customer_name: body.user.name,
                    customer_email: body.user.email,
                    customer_cpf: cleanCpf,
                    shipping: body.shipping || {},
                    payment_method: body.payment_method || "unknown",
                    status: "pending"
                }
            ])
            .select()
            .single()

        if (orderError) {
            console.error("Erro ao criar pedido (Supabase):", orderError);
            return NextResponse.json({ 
                error: "Erro no banco ao criar pedido", 
                details: orderError.message 
            }, { status: 500 });
        }

        const itemsToInsert = body.items.map((item: any) => {
            // O ID no frontend vem como "uuid-50" (ex: 123e4567-e89b-12d3-a456-426614174000-50)
            let rawId = item.product_id || item.id;
            
            if (typeof rawId === "string" && rawId.length > 36) {
                rawId = rawId.split('-').slice(0, 5).join('-'); 
            }

            return {
                order_id: order.id,
                product_id: rawId,
                quantity: item.quantity,
                price: item.price
            };
        });

        const { error: itemsError } = await supabaseAdmin
            .from("order_items")
            .insert(itemsToInsert)

        if (itemsError) {
            console.error("Erro ao inserir itens (Supabase):", itemsError);
            await supabaseAdmin
                .from("orders")
                .delete()
                .eq("id", order.id)

            return NextResponse.json({ 
                error: "Erro no banco ao inserir itens", 
                details: itemsError.message 
            }, { status: 500 });
        }

        return NextResponse.json({
            id: order.id, 
            status: order.status
        })

    } catch (err: any) {
        console.error("ERRO GERAL API ORDERS:", err)
        return NextResponse.json(
            { error: "Erro interno ao processar pedido", details: err.message },
            { status: 500 }
        )
    }
}