import RadarSection from "./RadarSection"
import RadarCarousel from "./RadarCarousel"
import PerfumeCard from "@/components/perfume/PerfumeCard"

const perfumes = [
    {
        slug: "oud-wood",
        name: "Oud Wood",
        brand: "Tom Ford",
        image: "/perfumes/oudwood.png",
        likes: 12000,
    },
    {
        slug: "layton",
        name: "Layton",
        brand: "Parfums de Marly",
        image: "/perfumes/layton.png",
        likes: 9800,
    },
    {
        slug: "bleu-de-chanel",
        name: "Bleu de Chanel",
        brand: "Chanel",
        image: "/perfumes/bleu.png",
        likes: 15000,
    },
]

export default function RadarFeed() {
    return (
        <div className="space-y-10">

            <RadarSection
                title="🔥 Em alta"
                subtitle="Perfumes populares no radar"
            >
                <RadarCarousel>

                    {perfumes.map((perfume) => (

                        <PerfumeCard
                            key={perfume.slug}
                            name={perfume.name}
                            brand={perfume.brand}
                            image={perfume.image}
                            href={`/perfume/${perfume.slug}`}
                        />

                    ))}

                </RadarCarousel>
            </RadarSection>

            <RadarSection
                title="💎 Nicho recomendado"
                subtitle="Perfumes exclusivos para explorar"
            >
                <RadarCarousel>

                    {perfumes.map((perfume) => (

                        <PerfumeCard
                            key={perfume.slug + "-niche"}
                            name={perfume.name}
                            brand={perfume.brand}
                            image={perfume.image}
                            href={`/perfume/${perfume.slug}`}
                        />

                    ))}

                </RadarCarousel>
            </RadarSection>

        </div>
    )
}