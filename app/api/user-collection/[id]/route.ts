import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function PATCH(req: Request, { params }: any) {
    const body = await req.json()
    const userId = req.headers.get("x-user-id")

    const { error } = await supabaseAdmin
        .from("user_perfumes")
        .update(body)
        .eq("id", params.id)
        .eq("user_id", userId)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}

export async function DELETE(req: Request, { params }: any) {
    const userId = req.headers.get("x-user-id")

    const { error } = await supabaseAdmin
        .from("user_perfumes")
        .delete()
        .eq("id", params.id)
        .eq("user_id", userId)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}