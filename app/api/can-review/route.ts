import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"
import { getUserFromRequest } from "@/lib/supabase/auth"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const perfume_id = searchParams.get("perfume_id")

    const user = await getUserFromRequest(req)

    if (!user) return NextResponse.json({ canReview: false })

    const { data: order } = await supabaseAdmin
        .from("order_items")
        .select("*")
        .eq("user_id", user.id)
        .eq("perfume_id", perfume_id)
        .limit(1)

    const { data: review } = await supabaseAdmin
        .from("reviews")
        .select("*")
        .eq("user_id", user.id)
        .eq("perfume_id", perfume_id)
        .limit(1)

    return NextResponse.json({
        canReview: !!order?.length && !review?.length
    })
}