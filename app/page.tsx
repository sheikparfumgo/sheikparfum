import HeroSpotlight from "@/components/home/HeroSpotlight"
import InfoCarousel from "@/components/home/InfoCarousel"
import RecommendedSection from "@/components/home/RecommendedSection"
import BestSellersSection from "@/components/home/BestSellersSection"

export default function Home() {
  return (
    <div className="min-h-screen">

      <main>

        <HeroSpotlight />
        <InfoCarousel />

        <RecommendedSection />
        <BestSellersSection />

      </main>

    </div>
  )
}