"use client";

import { useEffect, useState } from "react";
import { getPerfumes } from "@/services/api";
import PerfumeCard from "@/components/perfume/PerfumeCard";

type Props = {
    brand: string | null;
    order: string | null;
    hideOutOfStock: boolean;
    profile: string | null;
};

function getPerfumeTags(perfume: any) {
    const notes = [
        ...(perfume.top_notes || []),
        ...(perfume.heart_notes || []),
        ...(perfume.base_notes || [])
    ].join(" ").toLowerCase();

    const tags: string[] = [];

    if (notes.includes("baunilha") || notes.includes("caramelo") || notes.includes("doce"))
        tags.push("Doce");

    if (notes.includes("madeira") || notes.includes("oud") || notes.includes("cedro"))
        tags.push("Amadeirado");

    if (notes.includes("ambar") || notes.includes("resina") || notes.includes("incenso"))
        tags.push("Intenso");

    if (notes.includes("citric") || notes.includes("limao") || notes.includes("bergamota"))
        tags.push("Fresco");

    return tags.slice(0, 3);
}

export default function StoreGrid({ brand, order, hideOutOfStock, profile }: Props) {

    const [perfumes, setPerfumes] = useState<any[]>([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);

    async function loadPerfumes(reset = false) {
        setLoading(true);

        const currentOffset = reset ? 0 : offset;

        const data = await getPerfumes(
            30,
            currentOffset,
            brand ?? undefined,
            order ?? undefined
        );

        if (reset) {
            setPerfumes(data);
            setOffset(30);
        } else {
            setPerfumes((prev) => [...prev, ...data]);
            setOffset((prev) => prev + 30);
        }

        setLoading(false);
    }

    useEffect(() => {
        loadPerfumes(true);
    }, [brand, order]);

    // ✅ FILTRO CORRETO (AGORA DENTRO DO COMPONENTE)
    let filteredPerfumes = perfumes;

    if (hideOutOfStock) {
        filteredPerfumes = filteredPerfumes.filter(p => p.has_stock);
    }

    if (profile) {
        filteredPerfumes = filteredPerfumes.filter(p =>
            getPerfumeTags(p).includes(profile)
        );
    }

    if (perfumes.length === 0 && loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 30 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-[260px] rounded-xl bg-zinc-800 animate-pulse"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* GRID */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                {filteredPerfumes.map((perfume) => {

                    let parsedProducts: any[] = [];

                    try {
                        parsedProducts =
                            typeof perfume.products === "string"
                                ? JSON.parse(perfume.products)
                                : perfume.products || [];
                    } catch {
                        parsedProducts = [];
                    }

                    return (
                        <PerfumeCard
                            key={perfume.perfume_id}
                            name={perfume.perfume_name}
                            brand={perfume.brand}
                            image={
                                perfume.image_main ||
                                (Array.isArray(perfume.images) ? perfume.images[0] : null) ||
                                "/placeholder.png"
                            }
                            images={perfume.images || []}
                            href={`/perfume/${perfume.slug}`}
                            products={parsedProducts}
                            hasStock={perfume.has_stock}
                            tags={getPerfumeTags(perfume)}
                        />
                    );
                })}

            </div>

            {/* LOAD MORE */}
            <div className="flex justify-center">
                <button
                    onClick={() => loadPerfumes()}
                    disabled={loading}
                    className="px-5 py-2.5 rounded-lg bg-black text-white"
                >
                    {loading ? "Carregando..." : "Carregar mais"}
                </button>
            </div>

        </div>
    );
}