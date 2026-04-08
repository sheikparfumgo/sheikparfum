import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function GET(req: Request) {
    const userId = req.headers.get("x-user-id")

    const { data } = await supabaseAdmin
        .from("user_perfumes")
        .select("*")
        .eq("user_id", userId)

    return NextResponse.json(data ?? [])
}

export async function POST(req: Request) {
    const body = await req.json()
    const userId = req.headers.get("x-user-id")

    const { error } = await supabaseAdmin
        .from("user_perfumes")
        .insert([{ ...body, user_id: userId }])

    if (error) {
        return NextResponse.json({ error: "Erro ao salvar" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}