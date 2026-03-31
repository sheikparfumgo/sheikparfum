import { NextResponse } from "next/server"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const slug = searchParams.get("slug")
        const brand = searchParams.get("brand")
        const family = searchParams.get("family")
        const exclude = searchParams.get("exclude")
        const limitParam = searchParams.get("limit")
        const offset = searchParams.get("offset") || "0"
        const order = searchParams.get("order") || "perfume_name.asc"

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({ error: "Configuração do Supabase ausente" }, { status: 500 })
        }

        // 🔗 1. MONTAR URL DO SUPABASE (REST API)
        let apiUrl = `${supabaseUrl}/rest/v1/vw_perfumes_catalog?select=*`

        // 🔍 Filtros
        if (slug) {
            apiUrl += `&slug=eq.${slug}`
        } else {
            if (brand) apiUrl += `&brand=eq.${brand}`
            if (family) apiUrl += `&olfactive_family=eq.${family}`
            if (exclude) apiUrl += `&slug=neq.${exclude}`

            // Ordenação e Paginação
            apiUrl += `&order=${order}`
            const limit = limitParam ? Number(limitParam) : 30
            apiUrl += `&limit=${limit}`
            apiUrl += `&offset=${offset}`
        }

        // 🚀 FETCH
        const response = await fetch(apiUrl, {
            headers: {
                "apikey": supabaseKey,
                "Authorization": `Bearer ${supabaseKey}`
            },
            cache: "no-store"
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error("Erro Supabase View:", errorText)
            throw new Error("Erro ao buscar dados do catálogo")
        }

        let data = await response.json()

        // 🧠 2. LÓGICA DE RECOMENDAÇÃO (FAMILY FALLBACK)
        // Se pediu família (recomendação) e veio pouco, completamos
        if (family && !slug && data.length < (limitParam ? Number(limitParam) : 4)) {
            const needed = (limitParam ? Number(limitParam) : 4) - data.length
            
            // Busca fallback aleatório (sem filtro de família)
            const fallbackUrl = `${supabaseUrl}/rest/v1/vw_perfumes_catalog?limit=${needed}&order=random`
            const fallbackRes = await fetch(fallbackUrl, {
                headers: {
                    "apikey": supabaseKey,
                    "Authorization": `Bearer ${supabaseKey}`
                }
            })
            
            if (fallbackRes.ok) {
                const fallbackData = await fallbackRes.json()
                data = [...data, ...fallbackData]
            }
        }

        // 💎 3. NORMALIZAÇÃO
        const normalized = data.map((items: any) => ({
            ...items,
            products: Array.isArray(items.products) ? items.products : [],
            has_stock: items.has_stock ?? (items.in_stock === true || items.in_stock === "true" || (items.stock > 0))
        }))

        return NextResponse.json(normalized)

    } catch (err: any) {
        console.error("API PRODUCTS ERROR:", err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
