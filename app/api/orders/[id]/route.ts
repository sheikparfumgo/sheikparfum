import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const orderId = params.id

        if (!orderId) {
            return NextResponse.json(
                { error: "ID do pedido não informado" },
                { status: 400 }
            )
        }

        const { data, error } = await supabaseAdmin
            .from("orders")
            .select("*")
            .eq("id", orderId)
            .single()

        if (error || !data) {
            console.error("Erro ao buscar pedido:", error)

            return NextResponse.json(
                { error: "Pedido não encontrado" },
                { status: 404 }
            )
        }

        return NextResponse.json(data)

    } catch (err: any) {
        console.error("Erro interno:", err)

        return NextResponse.json(
            { error: "Erro interno ao buscar pedido" },
            { status: 500 }
        )
    }
}