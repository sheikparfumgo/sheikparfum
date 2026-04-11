import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params

        const authHeader = req.headers.get("authorization")

        if (!authHeader) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
        }

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

        const {
            data: { user },
            error: userError
        } = await supabase.auth.getUser()

        if (userError || !user) {
            return NextResponse.json({ error: "Usuário inválido" }, { status: 401 })
        }

        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .eq("id", id)
            .eq("user_id", user.id) // 🔥 SEGURANÇA
            .single()

        if (error || !data) {
            return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 })
        }

        return NextResponse.json(data)

    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: "Erro interno" }, { status: 500 })
    }
}