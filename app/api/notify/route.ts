import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ service role
)

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const { email, perfume_id, perfume_name } = body

        if (!email) {
            return NextResponse.json({ error: "Email obrigatório" }, { status: 400 })
        }

        const { error } = await supabase
            .from("notify_requests")
            .insert([
                {
                    email,
                    perfume_id,
                    perfume_name
                }
            ])

        if (error) {
            return NextResponse.json({ error }, { status: 500 })
        }

        return NextResponse.json({ success: true })

    } catch (err) {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 })
    }
}