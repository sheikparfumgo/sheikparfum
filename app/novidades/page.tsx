import RadarFeed from "@/components/radar/RadarFeed"
import RadarCategoryTabs from "@/components/radar/RadarCategoryTabs"
import RadarFeaturedCard from "@/components/radar/RadarFeaturedCard"

export default function RadarPage() {
    return (
        <div className="w-full max-w-[1400px] mx-auto mt-6 md:mt-8 space-y-8">

            <RadarCategoryTabs />

            <RadarFeaturedCard />

            <RadarFeed />

        </div>
    )
}