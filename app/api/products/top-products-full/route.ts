// /api/products/top-products-full/route.ts

import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function GET() {

    const { data } = await supabaseAdmin
        .from("orders")
        .select("items_json")

    const orders = data ?? []

    const map: Record<string, number> = {}

    orders.forEach((order: any) => {

        let items: any[] = []

        try {
            if (typeof order.items_json === "string") {
                items = JSON.parse(order.items_json)
            } else if (Array.isArray(order.items_json)) {
                items = order.items_json
            }
        } catch {
            items = []
        }

        items.forEach((item: any) => {
            const key = item.name
            if (!map[key]) map[key] = 0
            map[key] += item.quantity
        })
    })

    const ranking = Object.entries(map)
        .map(([name, total]) => ({ name, total }))
        .sort((a: any, b: any) => b.total - a.total)
        .slice(0, 10)

    const names = ranking.map(r => r.name)

    const { data: perfumes } = await supabaseAdmin
        .from("vw_perfumes_catalog")
        .select("*")

    const filtered = perfumes
        ?.filter((p: any) =>
            names.includes(p.perfume_name) && p.has_stock
        )
        .map((p: any) => {
            const found = ranking.find(r => r.name === p.perfume_name)
            return {
                ...p,
                total_sold: found?.total || 0
            }
        })
        .sort((a: any, b: any) => b.total_sold - a.total_sold)

    return NextResponse.json(filtered || [])
}