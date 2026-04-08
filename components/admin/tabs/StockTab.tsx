"use client";

import { useEffect, useState } from "react";

export default function StockTab({
    perfumes = [],
    selectedPerfume,
    setSelectedPerfume,
    updateStockVariant,
    savingId,
    savedId
}: any) {

    // 🔥 estado local dos inputs
    const [localStock, setLocalStock] = useState<Record<string, number>>({})
    const [productData, setProductData] = useState<any>(null);

    // 🔄 sincroniza quando troca perfume
    useEffect(() => {
        if (!productData) return

        const map: Record<string, number> = {}

        productData.variants.forEach((v: any) => {
            map[v.id] = v.stock
        })

        setLocalStock(map)
    }, [productData])

    useEffect(() => {
        if (!selectedPerfume?.id) return;

        async function loadProducts() {
            const res = await fetch(
                `/api/admin/products/by-perfume?id=${selectedPerfume.id}`
            );

            const json = await res.json();

            setProductData(json.data);
        }

        loadProducts();
    }, [selectedPerfume?.id]);

    return (
        <div className="space-y-4">

            {/* SELECT */}
            <select
                className="input-admin"
                onChange={(e) => {
                    const perfume = perfumes.find(
                        (p: any) => p.id === e.target.value
                    )
                    setSelectedPerfume(perfume)
                }}
            >
                <option value="">Selecione um perfume</option>

                {perfumes?.map((p: any) => (
                    <option key={p.id} value={p.id}>
                        {p.perfume_name}
                    </option>
                ))}
            </select>

            {selectedPerfume && (
                <div className="bg-zinc-800 p-4 rounded-xl space-y-3">

                    <h3 className="font-semibold">
                        {selectedPerfume.perfume_name}
                    </h3>

                    <div className="grid grid-cols-3 gap-3">

                        {productData?.variants?.map((variant: any) => (
                            <div
                                key={variant.id}
                                className="bg-zinc-900 p-3 rounded space-y-2"
                            >

                                <p className="text-xs text-zinc-400">
                                    {variant.size_ml
                                        ? `${variant.size_ml}ml`
                                        : "Sem tamanho"}
                                </p>

                                {/* 🔥 INPUT CORRETO */}
                                <input
                                    type="number"
                                    value={localStock[variant.id] ?? 0}
                                    onChange={(e) =>
                                        setLocalStock(prev => ({
                                            ...prev,
                                            [variant.id]: Number(e.target.value)
                                        }))
                                    }
                                    onBlur={() =>
                                        updateStockVariant(
                                            variant.id,
                                            localStock[variant.id]
                                        )
                                    }
                                    className="w-full bg-zinc-800 p-1 rounded"
                                />

                                {savingId === variant.id && (
                                    <span className="text-yellow-500 text-xs">
                                        Salvando...
                                    </span>
                                )}

                                {savedId === variant.id && (
                                    <span className="text-green-500 text-xs">
                                        Salvo ✔
                                    </span>
                                )}

                                {(localStock[variant.id] ?? 0) < 5 && (
                                    <span className="text-red-500 text-xs">
                                        Baixo estoque
                                    </span>
                                )}

                            </div>
                        ))}

                    </div>

                </div>
            )}

        </div>
    );
}