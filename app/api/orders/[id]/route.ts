import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        // 🔥 NOVO PADRÃO NEXT 16
        const { id } = await context.params

        if (!id) {
            return NextResponse.json(
                { error: "ID do pedido não informado" },
                { status: 400 }
            )
        }

        const { data, error } = await supabaseAdmin
            .from("orders")
            .select("*")
            .eq("id", id)
            .single()

        if (error || !data) {
            return NextResponse.json(
                { error: "Pedido não encontrado" },
                { status: 404 }
            )
        }

        return NextResponse.json(data)

    } catch (err) {
        console.error("Erro API order:", err)

        return NextResponse.json(
            { error: "Erro interno" },
            { status: 500 }
        )
    }
}