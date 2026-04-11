import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// 🔥 GET (já existe)
export async function GET(req: Request) {
    try {

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const month = new Date().toISOString().split("T")[0]

        const { data, error } = await supabase
            .from("club_monthly_perfumes")
            .select(`
                perfume_id,
                gender,
                position,
                perfumes (
                    id,
                    name,
                    image_main,
                    gender
                )
            `)
            .eq("month", month)
            .order("position", { ascending: true })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            data
        })

    } catch (err: any) {
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        )
    }
}

// 🔥 POST (FALTAVA ISSO)
export async function POST(req: Request) {
    try {

        console.log("🔥 POST RECEBIDO")

        const authHeader = req.headers.get("authorization")

        if (!authHeader) {
            return NextResponse.json(
                { error: "Não autenticado" },
                { status: 401 }
            )
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
            data: { user }
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json(
                { error: "Usuário inválido" },
                { status: 401 }
            )
        }

        let body

        try {
            body = await req.json()
        } catch {
            return NextResponse.json(
                { error: "Body inválido" },
                { status: 400 }
            )
        }

        const { male, female } = body

        if (!male || !female) {
            return NextResponse.json(
                { error: "Dados inválidos" },
                { status: 400 }
            )
        }

        const month = new Date().toISOString().split("T")[0]

        const { error: deleteError } = await supabase
            .from("club_monthly_perfumes")
            .delete()
            .eq("month", month)

        if (deleteError) {
            console.log("DELETE ERROR:", deleteError)
        }

        const inserts = [
            ...male.map((id: string) => ({
                perfume_id: id,
                month,
                gender: "male",
                is_hype: false
            })),
            ...female.map((id: string) => ({
                perfume_id: id,
                month,
                gender: "female",
                is_hype: false
            }))
        ]

        const { error: insertError } = await supabase
            .from("club_monthly_perfumes")
            .insert(inserts)

        if (insertError) {
            console.log("INSERT ERROR:", insertError)

            return NextResponse.json(
                { error: insertError.message },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })

    } catch (err: any) {
        console.log("ERRO GERAL:", err)

        return NextResponse.json(
            { error: "Erro interno", details: err.message },
            { status: 500 }
        )
    }
}