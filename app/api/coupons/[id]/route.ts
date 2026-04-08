import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {

    await supabaseAdmin
        .from("coupons")
        .delete()
        .eq("id", params.id)

    return NextResponse.json({ success: true })
}