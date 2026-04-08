import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function GET() {

    const { data } = await supabaseAdmin
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false })

    return NextResponse.json(data ?? [])
}