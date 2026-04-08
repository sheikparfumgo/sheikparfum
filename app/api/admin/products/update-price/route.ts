import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
    try {
        const { id, price } = await req.json();

        const { error } = await supabaseAdmin
            .from("products")
            .update({ price: Number(price) })
            .eq("id", id);

        if (error) throw error;

        return NextResponse.json({ success: true });

    } catch (err: any) {
        return NextResponse.json({
            success: false,
            error: err.message
        });
    }
}