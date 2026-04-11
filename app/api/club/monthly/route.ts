import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
    try {

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // 🔹 1. busca registros do club
        const { data: club, error: clubError } = await supabase
            .from("club_monthly_perfumes")
            .select("perfume_id, gender, position")
            .order("position", { ascending: true })

        if (clubError) {
            return NextResponse.json({ success: false, error: clubError.message }, { status: 500 })
        }

        // 🔹 2. busca perfumes direto
        const ids = club.map(c => c.perfume_id)

        const { data: perfumes, error: perfError } = await supabase
            .from("perfumes")
            .select("id, name, image_main, gender")
            .in("id", ids)

        if (perfError) {
            return NextResponse.json({ success: false, error: perfError.message }, { status: 500 })
        }

        // 🔹 3. cria mapa
        const map = Object.fromEntries(
            perfumes.map(p => [p.id, p])
        )

        const male: any[] = []
        const female: any[] = []

        for (const item of club) {

            const perfume = map[item.perfume_id]

            if (!perfume) continue

            const formatted = {
                id: perfume.id,
                name: perfume.name,
                image: perfume.image_main,
                gender: perfume.gender
            }

            if (item.gender === "male") {
                male.push(formatted)
            } else {
                female.push(formatted)
            }
        }

        return NextResponse.json({
            success: true,
            data: { male, female }
        })

    } catch (err: any) {
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        )
    }
}