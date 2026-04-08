import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function POST(req: Request) {

    const body = await req.json()

    const userId = body.userId

    if (!userId) {
        return NextResponse.json({ error: "Sem usuário" }, { status: 400 })
    }

    const { error } = await supabaseAdmin
        .from("profiles")
        .update({
            olfactive_profile: body
        })
        .eq("id", userId)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}