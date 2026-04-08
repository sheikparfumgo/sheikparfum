import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)

    const hasParams = [...searchParams.keys()].length > 0

    // 🔹 modo antigo (compatibilidade total)
    if (!hasParams) {
        const { data, error } = await supabaseAdmin
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false })

        if (error) {
            return NextResponse.json(
                { error: "Erro ao buscar pedidos" },
                { status: 500 }
            )
        }

        return NextResponse.json(data)
    }

    // 🔹 modo novo (com filtros e paginação)
    const page = Number(searchParams.get("page") || 1)
    const limit = Number(searchParams.get("limit") || 10)

    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    let query = supabaseAdmin
        .from("orders")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })

    // filtro status
    if (status && status !== "all") {
        query = query.eq("status", status)
    }

    // filtro período
    if (startDate && endDate) {
        query = query
            .gte("created_at", startDate)
            .lte("created_at", endDate)
    }

    // busca inteligente
    if (search) {
        query = query.or(`
      id.ilike.%${search}%,
      address_json->>city.ilike.%${search}%,
      items_json::text.ilike.%${search}%
    `)
    }

    // paginação
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query.range(from, to)

    if (error) {
        return NextResponse.json(
            { error: "Erro ao buscar pedidos" },
            { status: 500 }
        )
    }

    return NextResponse.json({
        data,
        pagination: {
            page,
            limit,
            total: count,
            totalPages: Math.ceil((count || 0) / limit),
        },
    })
}