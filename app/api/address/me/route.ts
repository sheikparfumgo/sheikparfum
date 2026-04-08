import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(req: Request) {
    try {
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

        // 🔥 busca endereço do usuário
        const { data: address, error } = await supabase
            .from("addresses")
            .select("*")
            .eq("user_id", user.id)
            .limit(1)
            .single()

        if (error) {
            return NextResponse.json({ address: null })
        }

        return NextResponse.json({ address })

    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: "Erro interno" }, { status: 500 })
    }
}