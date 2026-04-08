import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    await supabaseAdmin
        .from("coupons")
        .delete()
        .eq("id", id)

    return NextResponse.json({ success: true })
}