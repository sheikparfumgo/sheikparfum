import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(req: Request) {
    const authHeader = req.headers.get("authorization")

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: { headers: { Authorization: authHeader || "" } }
        }
    )

    const {
        data: { user }
    } = await supabase.auth.getUser()

    const { data } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user?.id)
        .order("is_default", { ascending: false })

    return NextResponse.json({ addresses: data || [] })
}