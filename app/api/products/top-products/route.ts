import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function GET() {

    const { data } = await supabaseAdmin
        .from("orders")
        .select("items_json")

    const orders = data ?? []

    const map: any = {}

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

            if (!map[key]) {
                map[key] = 0
            }

            map[key] += item.quantity
        })
    })

    const ranking = Object.entries(map)
        .map(([name, total]) => ({ name, total }))
        .sort((a: any, b: any) => b.total - a.total)
        .slice(0, 5)

    return NextResponse.json(ranking)
}