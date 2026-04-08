import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function POST(req: Request) {
    try {
        const { id, stock } = await req.json()

        if (!id || stock === undefined) {
            return NextResponse.json(
                { error: "Dados inválidos" },
                { status: 400 }
            )
        }

        const { error } = await supabaseAdmin
            .from("products")
            .update({ stock: Number(stock) })
            .eq("id", id)

        if (error) {
            console.error(error)
            return NextResponse.json(
                { error: "Erro ao atualizar estoque" },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })

    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { error: "Erro interno" },
            { status: 500 }
        )
    }
}