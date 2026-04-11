import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
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

        const body = await req.json()

        const { olfactive_profile } = body

        if (!olfactive_profile) {
            return NextResponse.json(
                { error: "Perfil inválido" },
                { status: 400 }
            )
        }

        const { error } = await supabase
            .from("profiles")
            .update({
                olfactive_profile,
                updated_at: new Date().toISOString()
            })
            .eq("id", user.id)

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })

    } catch (err: any) {
        return NextResponse.json(
            { error: "Erro interno", details: err.message },
            { status: 500 }
        )
    }
}