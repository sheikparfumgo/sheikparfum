import HeroSpotlight from "@/components/home/HeroSpotlight"
import HeroCarousel from "@/components/home/HeroCarousel"
import RecommendedSection from "@/components/home/RecommendedSection"
import BestSellersSection from "@/components/home/BestSellersSection"

export default function Home() {
  return (
    <div className="min-h-screen">

      <main>

        <HeroSpotlight />
        <HeroCarousel />

        <RecommendedSection />
        <BestSellersSection />

      </main>

    </div>
  )
}