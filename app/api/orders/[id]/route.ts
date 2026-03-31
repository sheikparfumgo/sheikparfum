import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params

        if (!id || typeof id !== "string") {
            return NextResponse.json(
                { error: "ID inválido" },
                { status: 400 }
            )
        }

        const { data, error } = await supabaseAdmin
            .from("orders")
            .select("id, status, amount, items_json, created_at")
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
        console.error("Erro API order:", {
            error: err
        })

        return NextResponse.json(
            { error: "Erro interno" },
            { status: 500 }
        )
    }
}