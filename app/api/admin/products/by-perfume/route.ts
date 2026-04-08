import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
        return NextResponse.json({
            success: false,
            error: "id obrigatório"
        });
    }

    const { data, error } = await supabaseAdmin
        .from("products")
        .select("*")
        .eq("perfume_id", id);

    if (error) {
        return NextResponse.json({
            success: false,
            error: error.message
        });
    }

    // agrupar
    const grouped = {
        id,
        name: data[0]?.perfume_name,
        variants: data
    };

    return NextResponse.json({
        success: true,
        data: grouped
    });
}