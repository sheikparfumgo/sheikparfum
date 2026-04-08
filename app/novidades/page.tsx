import RadarFeed from "@/components/radar/RadarFeed"
import RadarToday from "@/components/radar/RadarToday"
import { createServerSupabase } from "@/lib/supabase/server"

type Perfume = {
    perfume_id: string
    perfume_name: string
    brand: string
    slug: string
    image_main: string
    youtube_url?: string | null
    instagram_url?: string | null
    thumbnail_url?: string | null
    review_published_at?: string | null
    top_notes?: string[]
    heart_notes?: string[]
    base_notes?: string[]
}

export default async function RadarPage() {

    const supabase = await createServerSupabase()

    const { data, error } = await supabase
        .from("vw_perfumes_catalog")
        .select(`
            perfume_id,
            perfume_name,
            brand,
            slug,
            image_main,
            youtube_url,
            instagram_url,
            thumbnail_url,
            review_published_at,
            top_notes,
            heart_notes,
            base_notes
        `)
        .limit(50)

    if (error) {
        console.error("Erro ao buscar perfumes:", error)
    }

    const perfumes: Perfume[] = data ?? []

    // 🔥 FILTRA SÓ QUEM TEM VÍDEO
    const withVideos = perfumes.filter((p) => {
        const yt = p.youtube_url?.trim()
        const ig = p.instagram_url?.trim()
        return yt || ig
    })

    // 🔥 NOVOS REVIEWS (TEM THUMB)
    const newReviews = withVideos.filter(p => p.thumbnail_url)

    // 🔥 ANTIGOS
    const oldReviews = withVideos.filter(p => !p.thumbnail_url)

    // 🎯 HOJE NO RADAR (MAIS RECENTE)
    const today = [...withVideos]
        .sort((a, b) => {
            const dateA = new Date(a.review_published_at || 0).getTime()
            const dateB = new Date(b.review_published_at || 0).getTime()
            return dateB - dateA
        })[0]

    return (
        <div className="w-full max-w-[1200px] mx-auto mt-6 space-y-6">

            <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Radar de Perfumes
                </h1>

                <p className="text-sm text-zinc-400">
                    Descubra fragrâncias através das minhas reviews
                </p>
            </div>

            <RadarToday perfume={today} />

            {/* 🔥 NOVOS REVIEWS */}
            <RadarFeed
                perfumes={newReviews}
                title="Novos reviews"
            />

            {/* 🔥 ANTIGOS */}
            <RadarFeed
                perfumes={oldReviews}
                title="Outros reviews"
            />

        </div>
    )
}