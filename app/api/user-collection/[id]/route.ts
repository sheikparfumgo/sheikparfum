import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const body = await req.json()
    const userId = req.headers.get("x-user-id")

    const { error } = await supabaseAdmin
        .from("user_perfumes")
        .update(body)
        .eq("id", id)
        .eq("user_id", userId)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const userId = req.headers.get("x-user-id")

    const { error } = await supabaseAdmin
        .from("user_perfumes")
        .delete()
        .eq("id", id)
        .eq("user_id", userId)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}