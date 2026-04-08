import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
    try {
        const id = req.nextUrl.pathname.split("/").pop();

        console.log("ID recebido:", id); // 🔥 debug

        if (!id || id === "undefined") {
            return NextResponse.json({
                success: false,
                error: "ID inválido"
            });
        }

        const { data, error } = await supabaseAdmin
            .from("perfumes")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            data
        });

    } catch (err: any) {
        return NextResponse.json({
            success: false,
            error: err.message
        });
    }
}