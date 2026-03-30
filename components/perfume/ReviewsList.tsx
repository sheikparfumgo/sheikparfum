"use client"

import { useEffect, useState } from "react"

export default function ReviewsList({ perfume_id, canReview }: any) {
    const [reviews, setReviews] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`/api/reviews/list?perfume_id=${perfume_id}`)
                const data = await res.json()
                setReviews(data.reviews || [])
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [perfume_id])

    // 🔥 cálculo da média
    const total = reviews.length
    const average =
        total > 0
            ? (reviews.reduce((acc, r) => acc + r.rating, 0) / total)
            : 0

    const rounded = Math.round(average)

    // ⏳ loading
    if (loading) {
        return (
            <div className="mt-10 text-sm text-zinc-500 animate-pulse">
                Carregando avaliações...
            </div>
        )
    }

    return (
        <div className="mt-12 space-y-6">

            {/* 🔥 HEADER PREMIUM */}
            <div className="flex items-center justify-between">

                <h3 className="text-sm font-semibold text-primary uppercase">
                    Avaliações
                </h3>

                {total > 0 && (
                    <span className="text-xs text-zinc-500">
                        {total} avaliações
                    </span>
                )}
            </div>

            {/* ⭐ MÉDIA */}
            {total > 0 ? (
                <div className="
                    flex items-center gap-4
                    bg-gradient-to-r from-zinc-900 to-black
                    border border-zinc-800
                    rounded-xl p-4
                ">

                    {/* NOTA */}
                    <div className="text-3xl font-bold text-white">
                        {average.toFixed(1)}
                    </div>

                    {/* ESTRELAS */}
                    <div className="flex flex-col">

                        <div className="text-[#d4af37] text-lg">
                            {"★".repeat(rounded)}{"☆".repeat(5 - rounded)}
                        </div>

                        <span className="text-xs text-zinc-500">
                            Baseado em {total} avaliações
                        </span>

                    </div>

                </div>
            ) : (
                /* ❄️ EMPTY STATE PREMIUM */
                <div className="
    mt-6
    px-4 py-3
    rounded-lg
    border border-zinc-800
    bg-zinc-900/40
    flex items-center gap-3
">

                    <div className="text-[#d4af37] text-sm">★</div>

                    <div className="flex flex-col leading-tight">
                        <span className="text-sm text-white">
                            Ainda sem avaliações
                        </span>

                        <span className="text-[11px] text-zinc-500">
                            {canReview
                                ? "Compartilhe sua experiência abaixo"
                                : "Disponível após a compra"}
                        </span>
                    </div>

                </div>
            )}

            {/* 🧾 LISTA */}
            {total > 0 && (
                <div className="space-y-4">

                    {reviews.map((r, i) => (
                        <div
                            key={i}
                            className="
                                bg-zinc-900
                                border border-zinc-800
                                rounded-xl p-4
                                hover:border-[#d4af37]/30
                                transition
                            "
                        >

                            <div className="flex items-center justify-between">

                                {/* ⭐ estrelas */}
                                <div className="text-[#d4af37] text-sm">
                                    {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                                </div>

                                <span className="text-xs text-zinc-500">
                                    {new Date(r.created_at).toLocaleDateString()}
                                </span>

                            </div>

                            {r.comment && (
                                <p className="text-sm text-zinc-300 mt-2 leading-relaxed">
                                    {r.comment}
                                </p>
                            )}

                        </div>
                    ))}

                </div>
            )}

        </div>
    )
}