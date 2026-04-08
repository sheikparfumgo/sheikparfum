import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {

    const supabase = await createServerSupabase();

    const { data, error } = await supabase
        .from("vw_perfumes_catalog")
        .select("perfume_id, perfume_name, brand")
        .order("perfume_name", { ascending: true })
        .range(0, 5000);

    if (error) {
        return NextResponse.json({
            success: false,
            error: error.message
        });
    }

    return NextResponse.json({
        success: true,
        data: data.map(p => ({
            id: p.perfume_id,
            perfume_name: p.perfume_name,
            brand: p.brand
        }))
    });
}