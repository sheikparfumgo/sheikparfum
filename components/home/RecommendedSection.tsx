"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import PerfumeCard from "@/components/perfume/PerfumeCard"
import { supabase } from "@/lib/supabase/client"

export default function RecommendedSection() {

    const { user } = useAuth()
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        async function load() {
            if (!user) return

            const {
                data: { session }
            } = await supabase.auth.getSession()

            const res = await fetch("/api/recommendations/by-user", {
                headers: {
                    Authorization: `Bearer ${session?.access_token}`
                }
            })

            const data = await res.json()
            setData(data)
        }

        load()
    }, [user])

    if (!user || data.length === 0) return null

    return (
        <section className="mt-6">

            <h3 className="text-white font-bold text-lg mb-4">
                Recomendados para você
            </h3>

            <div className="flex gap-4 overflow-x-auto pb-6">
                {data.map((p) => (
                    <div key={p.perfume_id} className="min-w-[220px] max-w-[220px] flex-shrink-0">
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

        </section>
    )
}