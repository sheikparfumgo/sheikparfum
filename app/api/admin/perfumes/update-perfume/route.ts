import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const {
            id,
            name,
            description,
            gender,
            olfactive_family,
            category,
            top_notes,
            heart_notes,
            base_notes,
            image_main,
            images
        } = body;

        if (!id) {
            return NextResponse.json({
                success: false,
                error: "ID obrigatório"
            });
        }

        const { data, error } = await supabaseAdmin
            .from("perfumes")
            .update({
                name,
                name_normalized: name ? name.toLowerCase().trim() : null,
                description,
                gender,
                olfactive_family,
                category,
                top_notes,
                heart_notes,
                base_notes,
                image_main,
                images
            })
            .eq("id", id)
            .select();

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