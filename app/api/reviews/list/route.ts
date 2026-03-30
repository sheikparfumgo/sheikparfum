import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const perfume_id = searchParams.get("perfume_id")

    const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("perfume_id", perfume_id)
        .order("created_at", { ascending: false })

    if (error) {
        return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ reviews: data })
}