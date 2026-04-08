"use client"

import { useEffect, useState } from "react"
import PerfumeCard from "@/components/perfume/PerfumeCard"

export default function BestSellersSection() {

    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        fetch("/api/products/top-products-full")
            .then(res => res.json())
            .then(setData)
    }, [])

    return (
        <section className="mt-6">

            <h3 className="text-white font-bold text-lg mb-4">
                Mais vendidos
            </h3>

            <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">

                {data.map((p) => (
                    <div
                        key={p.perfume_id}
                        className="
        min-w-[220px]
        max-w-[220px]
        snap-start
        flex-shrink-0
      "
                    >
                        <PerfumeCard
                            id={p.perfume_id}
                            name={p.perfume_name}
                            brand={p.brand}
                            image={p.image_main}
                            tags={p.olfactive_family?.split(",")}
                            products={p.products}
                            showFavorite
                            href={`/perfume/${p.slug}`}
                            youtube_url={p.youtube_url}
                            instagram_url={p.instagram_url}
                        />
                    </div>
                ))}
            </div>

        </section >
    )
}