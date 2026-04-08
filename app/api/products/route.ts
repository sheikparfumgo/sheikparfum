import { NextResponse } from "next/server"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)

        const slug = searchParams.get("slug")
        const brand = searchParams.get("brand")
        const family = searchParams.get("family")
        const exclude = searchParams.get("exclude")
        const ids = searchParams.get("ids")
        const limitParam = searchParams.get("limit")
        const offset = searchParams.get("offset") || "0"
        const order = searchParams.get("order") || "perfume_name.asc"
        const onlyInStock = searchParams.get("inStock") === "true"

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

        let apiUrl = `${supabaseUrl}/rest/v1/vw_perfumes_catalog?select=*`

        // 🔍 FILTROS (mantido 100%)
        if (slug) {
            apiUrl += `&slug=eq.${slug}`
        } else if (ids) {
            apiUrl += `&perfume_id=in.(${ids})`
        } else {
            if (brand) apiUrl += `&brand=eq.${brand}`
            if (family) apiUrl += `&olfactive_family=eq.${family}`
            if (exclude) apiUrl += `&slug=neq.${exclude}`
            if (onlyInStock) apiUrl += `&has_stock=eq.true`

            apiUrl += `&order=${order}`

            const limit = limitParam ? Number(limitParam) : 30
            apiUrl += `&limit=${limit}`
            apiUrl += `&offset=${offset}`
        }

        const response = await fetch(apiUrl, {
            headers: {
                apikey: supabaseKey,
                Authorization: `Bearer ${supabaseKey}`
            },
            cache: "no-store"
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error("Erro Supabase:", errorText)
            throw new Error("Erro ao buscar catálogo")
        }

        let data = await response.json()

        // 🧠 FALLBACK (mantido)
        if (family && !slug && data.length < (limitParam ? Number(limitParam) : 4)) {
            const needed = (limitParam ? Number(limitParam) : 4) - data.length

            const fallbackUrl = `${supabaseUrl}/rest/v1/vw_perfumes_catalog?limit=${needed}&order=random`

            const fallbackRes = await fetch(fallbackUrl, {
                headers: {
                    apikey: supabaseKey,
                    Authorization: `Bearer ${supabaseKey}`
                }
            })

            if (fallbackRes.ok) {
                const fallbackData = await fallbackRes.json()
                data = [...data, ...fallbackData]
            }
        }

        // 💎 NORMALIZAÇÃO (AGORA COM ADMIN COMPAT)
        const normalized = data.map((item: any) => {

            const productsList = Array.isArray(item.products) ? item.products : []

            const someInStock = productsList.some(
                (p: any) => p.in_stock === true || p.in_stock === "true"
            )

            return {
                ...item,

                // 🔥 compatibilidade com ADMIN
                id: item.perfume_id,
                name: item.perfume_name,
                image: item.image,
                price: item.price || 0,
                stock: item.stock || 0,

                products: productsList,

                has_stock:
                    item.has_stock ||
                    someInStock ||
                    (item.stock > 0)
            }
        })

        return NextResponse.json(normalized)

    } catch (err: any) {
        console.error("API PRODUCTS ERROR:", err)
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        )
    }
}