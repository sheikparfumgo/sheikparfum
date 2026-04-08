import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        const {
            perfume_id,
            youtube_url,
            instagram_url,
            thumbnail_url,
            is_featured
        } = body

        // 🔒 validação
        if (!perfume_id) {
            return NextResponse.json(
                { error: "perfume_id obrigatório" },
                { status: 400 }
            )
        }

        if (!youtube_url && !instagram_url) {
            return NextResponse.json(
                { error: "Informe pelo menos um vídeo" },
                { status: 400 }
            )
        }

        // 🔥 se marcar como "hoje no radar"
        if (is_featured) {
            await supabaseAdmin
                .from("perfume_reviews")
                .update({ is_featured: false })
                .eq("is_featured", true)
        }

        const { data, error } = await supabaseAdmin
            .from("perfume_reviews")
            .insert([
                {
                    perfume_id,
                    youtube_url: youtube_url || null,
                    instagram_url: instagram_url || null,
                    thumbnail_url: thumbnail_url || null,
                    is_featured: is_featured || false,
                    is_active: true,
                    published_at: new Date().toISOString()
                }
            ])
            .select()
            .single()

        if (error) {
            console.error(error)
            return NextResponse.json(
                { error: "Erro ao criar review" },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            review: data
        })

    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { error: "Erro interno" },
            { status: 500 }
        )
    }
}