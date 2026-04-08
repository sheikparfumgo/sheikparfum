"use client"

import { useState } from "react"
import RadarSection from "@/components/radar/RadarSection"
import RadarCarousel from "@/components/radar/RadarCarousel"
import RadarPerfumeCard from "@/components/radar/RadarPerfumeCard"
import ReviewModal from "@/components/radar/ReviewModal"

type Perfume = {
    perfume_id: string
    perfume_name: string
    brand: string
    slug: string
    image_main: string
    youtube_url?: string | null
    instagram_url?: string | null
    top_notes?: string[]
    heart_notes?: string[]
    base_notes?: string[]
}

export default function RadarFeed({ perfumes, title }: { perfumes: Perfume[], title?: string }) {

    const [selected, setSelected] = useState<Perfume | null>(null)

    // 🔥 FILTRO ROBUSTO
    const onlyWithVideos = perfumes.filter((p) => {
        const yt = typeof p.youtube_url === "string" ? p.youtube_url.trim() : ""
        const ig = typeof p.instagram_url === "string" ? p.instagram_url.trim() : ""

        return yt !== "" || ig !== ""
    })

    console.log("TOTAL:", perfumes.length)
    console.log("COM VIDEO:", onlyWithVideos.length)
    console.log("LISTA:", onlyWithVideos)

    return (
        <div className="space-y-10">

            <RadarSection
                title={title || "Em alta"}
                subtitle="Perfumes com review disponível"
            >

                {/* 🔥 DEBUG VISUAL */}
                {onlyWithVideos.length === 0 && (
                    <p className="text-red-500 text-sm">
                        Nenhum perfume com vídeo encontrado
                    </p>
                )}

                <RadarCarousel>

                    {onlyWithVideos.map((perfume) => (

                        <RadarPerfumeCard
                            key={perfume.perfume_id}
                            id={perfume.perfume_id}
                            name={perfume.perfume_name}
                            brand={perfume.brand}
                            image={perfume.image_main}
                            youtube_url={perfume.youtube_url ?? undefined}
                            instagram_url={perfume.instagram_url ?? undefined}
                            onOpen={() => setSelected(perfume)}
                        />

                    ))}

                </RadarCarousel>
            </RadarSection>

            <ReviewModal
                open={!!selected}
                onClose={() => setSelected(null)}
                perfume={selected}
            />

        </div>
    )
}