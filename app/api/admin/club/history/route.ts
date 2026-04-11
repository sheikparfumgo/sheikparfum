import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
    try {

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const { data, error } = await supabase
            .from("club_monthly_perfumes")
            .select(`
                month,
                gender,
                position,
                perfumes:perfume_id (
                    id,
                    name,
                    image_main
                )
            `)
            .order("month", { ascending: false })
            .order("position", { ascending: true })

        if (error) {
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            )
        }

        const grouped: Record<string, any> = {}

        for (const item of data || []) {

            const monthKey = item.month

            if (!grouped[monthKey]) {
                grouped[monthKey] = {
                    male: [],
                    female: []
                }
            }

            const perfume = item.perfumes?.[0] ?? item.perfumes

            const perfumeData = {
                id: perfume?.id,
                name: perfume?.name,
                image: perfume?.image_main ?? "/placeholder.png",
                position: item.position
            }

            if (item.gender === "male") {
                grouped[monthKey].male.push(perfumeData)
            } else {
                grouped[monthKey].female.push(perfumeData)
            }
        }

        return NextResponse.json({
            success: true,
            data: grouped
        })

    } catch (err: any) {
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        )
    }
}