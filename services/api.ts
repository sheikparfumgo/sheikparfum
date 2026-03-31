const BASE_URL = "/api/products";

// 🔥 LISTAGEM GERAL
export async function getPerfumes(
    limit = 10,
    offset = 0,
    brand?: string,
    order?: string
) {
    const params = new URLSearchParams();

    params.append("limit", String(limit));
    params.append("offset", String(offset));

    if (brand) params.append("brand", brand);
    if (order) params.append("order", order);

    const res = await fetch(`${BASE_URL}?${params.toString()}`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Erro ao buscar perfumes");
    }

    return res.json();
}

// 🔥 PERFUME POR SLUG
export async function getPerfumeBySlug(slug: string) {
    const params = new URLSearchParams();
    params.append("slug", slug);

    const res = await fetch(`${BASE_URL}?${params.toString()}`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Erro ao buscar perfume");
    }

    const data = await res.json();
    return data?.[0] || null;
}

// 🔥 RECOMENDADOS (INTELIGENTE)
export async function getRecommendedPerfumes(perfume: any) {
    const params = new URLSearchParams();

    params.append("family", perfume.olfactive_family || "");
    params.append("exclude", perfume.slug);

    params.append("top", JSON.stringify(perfume.top_notes || []));
    params.append("heart", JSON.stringify(perfume.heart_notes || []));
    params.append("base", JSON.stringify(perfume.base_notes || []));

    params.append("brand", perfume.brand || "");

    params.append("limit", "30");

    const res = await fetch(`${BASE_URL}?${params.toString()}`, {
        cache: "no-store",
    });

    return res.json();
}